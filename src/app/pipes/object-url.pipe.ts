import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ObjectUrlService } from '../services/object-url.service';

@Pipe({
  name: 'objectUrl',
  standalone: true,
  pure: false
})
export class ObjectUrlPipe implements PipeTransform, OnDestroy {
  private currentHandle?: FileSystemFileHandle;
  private currentUrl: string | null = null;
  private disposed = false;

  constructor(
    private objectUrlService: ObjectUrlService,
    private cdr: ChangeDetectorRef
  ) {}

  transform(handle: FileSystemFileHandle | undefined): string | null {
    if (!handle) {
      this.cleanup();
      return null;
    }

    if (this.currentHandle === handle) {
      return this.currentUrl;
    }

    this.cleanup();
    this.currentHandle = handle;

    this.objectUrlService.getUrl(handle).then(url => {
      if (this.currentHandle === handle && !this.disposed) {
        this.currentUrl = url;
        this.cdr.markForCheck();
      }
    });

    return null;
  }

  ngOnDestroy() {
    this.disposed = true;
    this.cleanup();
  }

  private cleanup() {
    if (this.currentHandle) {
      this.objectUrlService.releaseUrl(this.currentHandle);
      this.currentHandle = undefined;
    }
    this.currentUrl = null;
  }
}
