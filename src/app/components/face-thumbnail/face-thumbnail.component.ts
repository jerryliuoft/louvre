import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-face-thumbnail',
  standalone: true,
  template: `
    <canvas #canvasElement width="80" height="80" style="border-radius: 4px; display: block; width: 100%; height: 100%; pointer-events: none;"></canvas>
  `,
  styles: []
})
export class FaceThumbnailComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) fileHandle!: FileSystemFileHandle;
  @Input({ required: true }) box!: { x: number, y: number, width: number, height: number };
  
  @ViewChild('canvasElement') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private objectUrl: string | null = null;
  private isDestroyed = false;

  ngAfterViewInit() {
    this.drawThumbnail();
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }

  private async drawThumbnail() {
     if (!this.fileHandle || !this.box) return;

     try {
       const file = await this.fileHandle.getFile();
       this.objectUrl = URL.createObjectURL(file);
       
       const img = new Image();
       img.onload = () => {
         if (this.isDestroyed) return;
         
         const canvas = this.canvasRef.nativeElement;
         const ctx = canvas.getContext('2d');
         if (!ctx) return;

         // Extract the box and calculate a generous margin (e.g. 30% padding)
         // Face descriptors usually fit very tightly around the face.
         let { x, y, width, height } = this.box;
         
         const paddingX = width * 0.3;
         const paddingY = height * 0.3;

         x = Math.max(0, x - paddingX);
         y = Math.max(0, y - paddingY);
         width = Math.min(img.width - x, width + paddingX * 2);
         height = Math.min(img.height - y, height + paddingY * 2);

         // We want a square output to fit the 80x80 canvas beautifully
         const size = Math.max(width, height);
         
         // Center it if it became a rectangle due to bounds
         const adjustX = x + width/2 - size/2;
         const adjustY = y + height/2 - size/2;

         const finalX = Math.max(0, adjustX);
         const finalY = Math.max(0, adjustY);
         const finalSize = Math.min(size, img.width - finalX, img.height - finalY);

         // Draw the exact slice from the source image onto the canvas
         ctx.drawImage(
           img, 
           finalX, finalY, finalSize, finalSize, // Source coords
           0, 0, canvas.width, canvas.height     // Dest coords
         );
       };
       img.src = this.objectUrl;
     } catch (e) {
       console.error('Failed to draw face thumbnail', e);
     }
  }
}
