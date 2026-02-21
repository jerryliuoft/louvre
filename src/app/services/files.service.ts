import { Injectable, signal, computed } from '@angular/core';
import { FileWithType } from '../models/file.model';
import { Router } from '@angular/router';
import { FileSystemService } from './file-system.service';
import { FaceRecognitionService } from './face-recognition.service';
import { get, set } from 'idb-keyval';


export interface RecentDirectory {
  name: string;
  handle: FileSystemDirectoryHandle;
}

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  // put all types as lowercase
  public SUPPORTED_FILETYPES = signal({
    jpg: true,
    png: true,
    apng: true,
    avif: true,
    gif: true,
    jpeg: true,
    svg: true,
    webp: true,
    webm: true,
    mp4: true,
    mkv: true,
    ogg: true,
    mov: true,
  });

  public currentPath = signal<string>('undefined');
  public subPathFilter = signal<string>('');
  private files_raw = signal<FileWithType[]>([]);
  public files_original = signal<FileWithType[]>([]);
  public targetFaceDescriptor = signal<Float32Array | null>(null);

  public isScanningFaces = signal(false);
  public scanProgress = signal<{current: number, total: number} | null>(null);


  public imagesOrdered = computed(() => {
    const filter = this.subPathFilter();
    let raw_files = this.files_raw();
    
    // Apply face filter if set
    const targetFace = this.targetFaceDescriptor();
    if (targetFace) {
      raw_files = raw_files.filter(f => {
         const descriptorsToSearch = f.faces ? f.faces.map((face: any) => face.descriptor) : f.faceDescriptors;
         if (!descriptorsToSearch) return false;
         return this.faceRecognitionService.hasMatch(targetFace, descriptorsToSearch);
      });
    }

    if (!filter || filter === '/' || filter === this.currentPath()) {
      return raw_files;
    }
    // Only return images that live exactly inside the filtered subfolder
    // Only return images that live exactly inside the filtered subfolder
    // OR any of its nested folders.
    return raw_files.filter(f => f.path.startsWith(filter + '/'));
  });

  public uniqueFaces = computed(() => {
    // Generate a unique list of face descriptors for the side panel gallery
    // O(n*m) simple clustering, where n is faces and m is unique faces
    const unique: { descriptor: Float32Array, file: FileWithType, box?: any }[] = [];
    const files = this.files_original(); // We extract faces from all files in the root dir
    
    for (const file of files) {
      if (file.faces && file.faces.length > 0) {
         for (const face of file.faces) {
            // Check if this descriptor matches any we already found
            const matchIndex = unique.findIndex(u => this.faceRecognitionService.compareFaces(face.descriptor, u.descriptor) < 0.6);
            if (matchIndex === -1) {
               // New unique face found
               unique.push({ descriptor: face.descriptor, file, box: face.box });
            }
         }
      } else if (file.faceDescriptors && file.faceDescriptors.length > 0) {
         // Fallback for older cached files without bounding boxes
         for (const desc of file.faceDescriptors) {
            const matchIndex = unique.findIndex(u => this.faceRecognitionService.compareFaces(desc, u.descriptor) < 0.6);
            if (matchIndex === -1) {
               unique.push({ descriptor: desc, file });
            }
         }
      }
    }
    return unique;
  });

  public directoryOrdered = signal<[string, FileWithType[]][]>([]);
  public displayedDirectories = computed(() => {
    const filter = this.subPathFilter();
    const dirs = this.directoryOrdered();
    if (!filter || filter === '/' || filter === this.currentPath()) {
      return dirs;
    }
    // Only return directories that strictly match the selected subfolder
    // or are children of it. Since the chips build up absolute relative 
    // paths from the root, we check if the path starts with the filter.
    return dirs.filter(([path, _]) => path === filter || path.startsWith(filter + '/'));
  });
  public currentFolderName = computed(() => {
    const filter = this.subPathFilter();
    if (!filter) return '';
    const parts = filter.split('/');
    return parts[parts.length - 1];
  });
  public isLoading = signal(false);
  public moveProgress = signal<{current: number, total: number} | null>(null);
  public recentDirectories = signal<RecentDirectory[]>([]);
  public moveDestinations = signal<RecentDirectory[]>([]);

  constructor(
    private router: Router,
    private fileSystemService: FileSystemService,
    private faceRecognitionService: FaceRecognitionService
  ) {
    this.loadRecentDirectories();
    this.loadMoveDestinations();
  }


  private async loadRecentDirectories() {
    try {
      const recent = await get<RecentDirectory[]>('recent_directories');
      if (recent) {
        this.recentDirectories.set(recent);
      }
    } catch (e) {
      console.warn('Failed to load recent directories', e);
    }
  }

  private async saveRecentDirectory(handle: FileSystemDirectoryHandle) {
    const current = this.recentDirectories();
    const filtered = current.filter((d: RecentDirectory) => d.name !== handle.name);
    const updated = [{ name: handle.name, handle }, ...filtered].slice(0, 10);
    this.recentDirectories.set(updated);
    try {
      await set('recent_directories', updated);
    } catch (e) {
      console.warn('Failed to save recent directories', e);
    }
  }

  private async loadMoveDestinations() {
    try {
      const recent = await get<RecentDirectory[]>('move_destinations');
      if (recent) {
        this.moveDestinations.set(recent);
      }
    } catch (e) {
      console.warn('Failed to load move destinations', e);
    }
  }

  private async saveMoveDestination(handle: FileSystemDirectoryHandle) {
    const current = this.moveDestinations();
    const filtered = current.filter((d: RecentDirectory) => d.name !== handle.name);
    const updated = [{ name: handle.name, handle }, ...filtered].slice(0, 10);
    this.moveDestinations.set(updated);
    try {
      await set('move_destinations', updated);
    } catch (e) {
      console.warn('Failed to save move destinations', e);
    }
  }

  async pickMoveDestination() {
    try {
      const handle = await this.fileSystemService.openDirectory();
      if(handle) {
          await this.saveMoveDestination(handle);
          await this.moveCurrentFolder(handle);
      }
    } catch (e) {
      console.error('Error picking move destination directory', e);
    }
  }

  async moveCurrentFolder(destRootHandle: FileSystemDirectoryHandle) {
    const currentSubPath = this.subPathFilter();
    if (!currentSubPath || currentSubPath === '' || currentSubPath === '/' || currentSubPath === this.currentPath()) {
      console.error('Cannot move the root directory.');
      return;
    }

    this.isLoading.set(true);
    try {
        const options: FileSystemHandlePermissionDescriptor = { mode: 'readwrite' };
        if ((await destRootHandle.queryPermission(options)) !== 'granted') {
            if ((await destRootHandle.requestPermission(options)) !== 'granted') {
                console.warn('Permission denied for move destination directory');
                return;
            }
        }
        
        let rootHandle: FileSystemDirectoryHandle | null = null;
        for (const recent of this.recentDirectories()) {
           if (recent.name === this.currentPath()) {
              rootHandle = recent.handle;
              break;
           }
        }

        if (!rootHandle) {
             console.error('Could not find root directory handle for move operation');
             return;
        }
        
        const parts = currentSubPath.split('/');
        const sourceDirName = parts.pop()!;
        const parentPath = parts.join('/');
        
        let sourceParentHandle = rootHandle;
        if (parentPath) {
             sourceParentHandle = await this.fileSystemService.getDirectoryHandleByPath(rootHandle, parentPath);
        }

        this.moveProgress.set({current: 0, total: 0});
        await this.fileSystemService.moveDirectory(sourceParentHandle, sourceDirName, destRootHandle, (copied, total) => {
            this.moveProgress.set({current: copied, total});
        });
        await this.saveMoveDestination(destRootHandle);
        
        const remainingFiles = this.files_raw().filter((f: FileWithType) => !f.path.startsWith(currentSubPath + '/'));
        this.updateFileList(remainingFiles);
        this.files_original.set([...remainingFiles]);
        
        const cacheKey = `dir_cache_${rootHandle.name}`;
        await set(cacheKey, remainingFiles);

        const newPathSegment = parentPath ? parentPath : this.currentPath();
        this.router.navigateByUrl('/folder/' + encodeURIComponent(newPathSegment));

    } catch (e) {
      console.error('Error moving directory', e);
    } finally {
      this.moveProgress.set(null);
      this.isLoading.set(false);
    }
  }

  async pickNewDirectory() {
    this.isLoading.set(true);
    try {
      const handle = await this.fileSystemService.openDirectory();
      this.currentPath.set(handle.name);
      this.subPathFilter.set(''); // Reset filter on new root selection
      await this.saveRecentDirectory(handle);
      await this.loadDirectory(handle);
      this.router.navigateByUrl('/folder/' + encodeURIComponent(handle.name));
    } catch (e) {
      console.error('Error picking directory', e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadRecentDirectory(handle: FileSystemDirectoryHandle) {
    this.isLoading.set(true);
    try {
      // Check permission
      const options: FileSystemHandlePermissionDescriptor = { mode: 'readwrite' };
      if ((await handle.queryPermission(options)) !== 'granted') {
        if ((await handle.requestPermission(options)) !== 'granted') {
          console.warn('Permission denied for recent directory');
          return;
        }
      }

      this.currentPath.set(handle.name);
      this.subPathFilter.set(''); // Reset filter
      await this.saveRecentDirectory(handle); // bump to top
      await this.loadDirectory(handle);
      this.router.navigateByUrl('/folder/' + encodeURIComponent(handle.name));

    } catch (e) {
      console.error('Error loading recent directory', e);
    } finally {
      this.isLoading.set(false);
    }
  }

  setNewDirectory(path: string) {
    if (path === this.currentPath() || path === 'undefined') {
       this.subPathFilter.set(''); // Root level
    } else {
       // Since the router passes the full relative path, we can just set it
       this.subPathFilter.set(path);
    }
  }

  goToFolder(file: FileWithType) {
    const lastSlash = file.path.lastIndexOf('/');
    const folderPath = lastSlash > -1 ? file.path.substring(0, lastSlash) : this.currentPath();
    this.router.navigateByUrl('/folder/' + encodeURIComponent(folderPath));
  }

  private async loadDirectory(dirHandle: FileSystemDirectoryHandle) {
    const cacheKey = `dir_cache_${dirHandle.name}`;
    
    // 1. Try Cache First
    try {
      const cached = await get<FileWithType[]>(cacheKey);
      if (cached && cached.length > 0) {
        this.files_original.set([...cached]);
        this.updateFileList(cached);
        // Kick off background sync for new files AND missing face embeddings
        this.backgroundSync(dirHandle, cacheKey, cached).catch(e => console.error('Background sync failed', e));
        return;
      }
    } catch (e) {
      console.warn('Failed to read from cache', e);
    }

    // 2. Full Load if no cache (first time)
    await this.scanDirectoryAndCache(dirHandle, cacheKey);
  }


  private async scanDirectoryAndCache(dirHandle: FileSystemDirectoryHandle, cacheKey: string) {
    const files: FileWithType[] = [];
    
    for await (const entry of this.fileSystemService.readDirectory(dirHandle)) {
      const parts = entry.handle.name.split('.');
      if (parts.length > 1 && parts.at(-1)!.toLocaleLowerCase() in this.SUPPORTED_FILETYPES()) {
        files.push({
          name: entry.handle.name,
          path: entry.path,
          handle: entry.handle,
          parentHandle: entry.parentHandle
        });
      }
    }

    this.files_original.set([...files]);
    this.updateFileList(files);
    
    try {
      await set(cacheKey, files);
    } catch (e) {
      console.warn('Failed to cache directory', e);
    }
  }

  private async backgroundSync(dirHandle: FileSystemDirectoryHandle, cacheKey: string, cachedFiles: FileWithType[] = []) {
    const files: FileWithType[] = [];
    const cachedFileMap = new Map(cachedFiles.map(f => [f.path, f]));

    for await (const entry of this.fileSystemService.readDirectory(dirHandle)) {
      const parts = entry.handle.name.split('.');
      if (parts.length > 1 && parts.at(-1)!.toLocaleLowerCase() in this.SUPPORTED_FILETYPES()) {
        const cachedMatch = cachedFileMap.get(entry.path);
        files.push({
          name: entry.handle.name,
          path: entry.path,
          handle: entry.handle,
          parentHandle: entry.parentHandle,
          faces: cachedMatch?.faces,
          faceDescriptors: cachedMatch?.faces ? undefined : cachedMatch?.faceDescriptors
        });
      }
    }

    // Replace the files
    this.files_original.set([...files]);
    this.updateFileList(files);
    
    try {
      await set(cacheKey, files);
    } catch (e) {
      console.warn('Failed to update cache', e);
    }
  }

  async startFaceScan() {
    if (this.isScanningFaces()) return;
    
    // Find the handle for the current path
    let rootHandle: FileSystemDirectoryHandle | null = null;
    for (const recent of this.recentDirectories()) {
       if (recent.name === this.currentPath()) {
          rootHandle = recent.handle;
          break;
       }
    }

    if (!rootHandle) {
         console.warn('Could not find root directory handle for scanning faces');
         return;
    }
    
    const cacheKey = `dir_cache_${rootHandle.name}`;
    this.isScanningFaces.set(true);
    try {
        await this.backgroundFaceSync(rootHandle, cacheKey);
    } catch (e) {
        console.error('Manual face scan failed', e);
    } finally {
        this.isScanningFaces.set(false);
        this.scanProgress.set(null);
    }
  }

  private async backgroundFaceSync(dirHandle: FileSystemDirectoryHandle, cacheKey: string) {
    if (!this.faceRecognitionService.isReady()) {
      await this.faceRecognitionService.initialize();
    }

    const currentFiles = [...this.files_raw()];
    let hasUpdates = false;

    // Filter to those missing `faces` instead of `faceDescriptors`
    const imagesToProcess = currentFiles.filter(f => f.name.match(/\.(jpg|jpeg|png|webp|avif)$/i) && !f.faces && f.handle);
    this.scanProgress.set({current: 0, total: imagesToProcess.length});
    let processedCount = 0;

    // We process sequentially or in small batches to avoid blocking the main thread too heavily
    for (let i = 0; i < currentFiles.length; i++) {
       const file = currentFiles[i];
       
       // Only process images (skip video for now since extracting individual frames is much heavier)
       const isImage = file.name.match(/\.(jpg|jpeg|png|webp|avif)$/i);
       
       // Always rescan if it only has `faceDescriptors` to get the bounding boxes
       if (isImage && (!file.faces) && file.handle) {
          try {
             const fileData = await file.handle.getFile();
             const faces = await this.faceRecognitionService.extractFacesFromFile(fileData);
             
             currentFiles[i] = {
                ...file,
                faces: faces, // Store the comprehensive face descriptor info
                faceDescriptors: undefined // Wipe the old legacy one
             };
             hasUpdates = true;
          } catch (e) {
             console.warn(`Failed to process faces for ${file.name}`, e);
             // Mark as empty array so we don't try again next time
             currentFiles[i] = { ...file, faces: [], faceDescriptors: undefined };
             hasUpdates = true;
          } finally {
             processedCount++;
             this.scanProgress.set({current: processedCount, total: imagesToProcess.length});
          }
       }
    }

    if (hasUpdates) {
       this.files_original.set([...currentFiles]);
       this.updateFileList(currentFiles);
       try {
           // Wait until IDB saves
           await set(cacheKey, currentFiles);
       } catch (e) {
           console.warn('Failed to cache face embeddings', e);
       }
    }
  }

  private updateFileList(files: FileWithType[]) {
    this.files_raw.set(files);

    //Populate the precomputed maps

    const imageByPath = new Map<string, FileWithType[]>();
    files.forEach((img) => {
      // Extract directory path from relative path
      // entry.path is like "folder/file.jpg" or "file.jpg"
      const lastSlash = img.path.lastIndexOf('/');
      const parentDir = lastSlash > -1 ? img.path.substring(0, lastSlash) : '/';
      
      const existing_images = imageByPath.get(parentDir) ?? [];
      imageByPath.set(parentDir, [...existing_images, img]);
    });
    this.directoryOrdered.set(Array.from(imageByPath.entries()));
  }

  randomize() {
    this.isLoading.set(true);
    // Timeout to yield UI thread
    setTimeout(() => {
        this.randomizeImages();
        this.randomizeDirecotires();
        this.isLoading.set(false);
    }, 0);
  }

  randomizeImages() {
    const newOrder = Array.from(this.files_raw());
    this.shuffle(newOrder);
    // Setting files_raw affects the source of truth for all computed views
    this.files_raw.set(newOrder);
  }

  async deleteFile(file: FileWithType) {
    if (!file.parentHandle || !file.name) {
      console.error('Cannot delete file without parent handle and name');
      return;
    }
    try {
        await file.parentHandle.removeEntry(file.name);
        // Update state
        const remaining = this.files_raw().filter((f: FileWithType) => f !== file);
        this.updateFileList(remaining);
        this.files_original.update((original: FileWithType[]) => original.filter((f: FileWithType) => f !== file));
    } catch (e) {
        console.error('Failed to delete file', e);
    }
  }

  randomizeDirecotires() {
    const newOrder = Array.from(this.directoryOrdered());
    this.shuffle(newOrder);
    this.directoryOrdered.set(newOrder);
  }

  // from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  // Fisher-Yates SHuffle

  private shuffle(array: any[]) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }
}
