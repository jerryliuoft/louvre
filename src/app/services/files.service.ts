import { Injectable, signal, computed } from '@angular/core';
import { FileWithType } from '../models/file.model';
import { Router } from '@angular/router';
import { FileSystemService } from './file-system.service';
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
  public imagesOrdered = computed(() => {
    const filter = this.subPathFilter();
    const raw_files = this.files_raw();
    if (!filter || filter === '/' || filter === this.currentPath()) {
      return raw_files;
    }
    // Only return images that live exactly inside the filtered subfolder
    // OR any of its nested folders.
    return raw_files.filter(f => f.path.startsWith(filter + '/'));
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
  public isLoading = signal(false);
  public recentDirectories = signal<RecentDirectory[]>([]);

  constructor(
    private router: Router,
    private fileSystemService: FileSystemService
  ) {
    this.loadRecentDirectories();
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
        // Kick off background sync
        this.backgroundSync(dirHandle, cacheKey).catch(e => console.error('Background sync failed', e));
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

  private async backgroundSync(dirHandle: FileSystemDirectoryHandle, cacheKey: string) {
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

    // Replace the files
    this.files_original.set([...files]);
    this.updateFileList(files);
    
    try {
      await set(cacheKey, files);
    } catch (e) {
      console.warn('Failed to update cache', e);
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
