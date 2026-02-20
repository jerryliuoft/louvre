import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileSystemService {
  constructor() {}

  async openDirectory(): Promise<FileSystemDirectoryHandle> {
    const handle = await window.showDirectoryPicker({
      mode: 'readwrite',
    });
    return handle;
  }

  async *readDirectory(
    dirHandle: FileSystemDirectoryHandle,
    path = ''
  ): AsyncGenerator<{ path: string; handle: FileSystemFileHandle; parentHandle: FileSystemDirectoryHandle }> {
    for await (const entry of dirHandle.values()) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;
      if (entry.kind === 'file') {
        yield { path: entryPath, handle: entry, parentHandle: dirHandle };
      } else if (entry.kind === 'directory') {
        yield* this.readDirectory(entry, entryPath);
      }
    }
  }

  async deleteFile(fileHandle: FileSystemFileHandle): Promise<void> {
    // Deleting via handle is not directly supported on the file handle itself in standard spec yet without the parent.
    // We usually need the parent directory handle to remove an entry.
    // So we might need to store the parent handle or pass it.
    // For now, let's assume we can't easily delete without parent.
    // Actually, modern spec might say something else, but safe bet is parentHandle.removeEntry(name).
    throw new Error('Delete not implemented without parent handle');
  }
    
  async deleteFileInParent(parentHandle: FileSystemDirectoryHandle, name: string) {
     await parentHandle.removeEntry(name);
  }

  async getDirectoryHandleByPath(rootHandle: FileSystemDirectoryHandle, path: string): Promise<FileSystemDirectoryHandle> {
    const parts = path.split('/').filter(p => p.length > 0);
    let currentHandle = rootHandle;
    for (const part of parts) {
      currentHandle = await currentHandle.getDirectoryHandle(part);
    }
    return currentHandle;
  }

  async getDirectoryFileCount(sourceHandle: FileSystemDirectoryHandle): Promise<number> {
    let count = 0;
    for await (const entry of sourceHandle.values()) {
      if (entry.kind === 'file') {
        count++;
      } else if (entry.kind === 'directory') {
        const childSourceHandle = await sourceHandle.getDirectoryHandle(entry.name);
        count += await this.getDirectoryFileCount(childSourceHandle);
      }
    }
    return count;
  }

  async copyDirectory(sourceHandle: FileSystemDirectoryHandle, destHandle: FileSystemDirectoryHandle, onProgress?: (copied: number) => void, state?: {copied: number}): Promise<void> {
    if (!state) state = {copied: 0};
    for await (const entry of sourceHandle.values()) {
      if (entry.kind === 'file') {
        const fileHandle = await sourceHandle.getFileHandle(entry.name);
        const file = await fileHandle.getFile();
        const destFileHandle = await destHandle.getFileHandle(entry.name, { create: true });
        const writable = await destFileHandle.createWritable();
        await writable.write(file);
        await writable.close();
        
        state.copied++;
        if (onProgress) onProgress(state.copied);
      } else if (entry.kind === 'directory') {
        const childSourceHandle = await sourceHandle.getDirectoryHandle(entry.name);
        const childDestHandle = await destHandle.getDirectoryHandle(entry.name, { create: true });
        await this.copyDirectory(childSourceHandle, childDestHandle, onProgress, state);
      }
    }
  }

  async moveDirectory(sourceParentHandle: FileSystemDirectoryHandle, sourceDirName: string, destRootHandle: FileSystemDirectoryHandle, onProgress?: (copied: number, total: number) => void): Promise<void> {
    // 1. Get the source directory handle
    const sourceHandle = await sourceParentHandle.getDirectoryHandle(sourceDirName);
    
    // 2. Create the destination directory handle (same name as source)
    const destHandle = await destRootHandle.getDirectoryHandle(sourceDirName, { create: true });
    
    // 3. Recursively copy contents
    let total = 0;
    if (onProgress) {
        total = await this.getDirectoryFileCount(sourceHandle);
        onProgress(0, total);
    }

    await this.copyDirectory(sourceHandle, destHandle, (copied) => {
        if (onProgress) onProgress(copied, total);
    });
    
    // 4. Delete the source directory
    await sourceParentHandle.removeEntry(sourceDirName, { recursive: true });
  }
}
