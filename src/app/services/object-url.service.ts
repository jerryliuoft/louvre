import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectUrlService {
  private cache = new Map<FileSystemFileHandle, { url: string, refCount: number, promise?: Promise<string> }>();

  async getUrl(handle: FileSystemFileHandle): Promise<string> {
    let existing = this.cache.get(handle);
    
    if (existing) {
      existing.refCount++;
      if (existing.promise) {
        return existing.promise;
      }
      return existing.url;
    }

    // Need to generate
    const promise = handle.getFile().then(file => {
      const url = URL.createObjectURL(file);
      const cacheRef = this.cache.get(handle);
      if (cacheRef) {
        cacheRef.url = url;
        cacheRef.promise = undefined; // clear promise once resolved
      }
      return url;
    });

    this.cache.set(handle, { url: '', refCount: 1, promise });
    return promise;
  }

  releaseUrl(handle: FileSystemFileHandle) {
    const existing = this.cache.get(handle);
    if (existing) {
      existing.refCount--;
      if (existing.refCount <= 0) {
        if (existing.url) {
          URL.revokeObjectURL(existing.url);
        }
        this.cache.delete(handle);
      }
    }
  }
}
