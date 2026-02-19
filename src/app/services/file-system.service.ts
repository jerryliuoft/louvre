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
}
