import { Injectable, signal } from '@angular/core';
import * as faceapi from '@vladmandic/face-api';

export interface FaceDescriptor {
  descriptor: Float32Array;
  box: { x: number, y: number, width: number, height: number };
}

@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionService {
  public isReady = signal<boolean>(false);
  public isInitializing = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  constructor() { }

  async initialize() {
    if (this.isReady() || this.isInitializing()) return;
    
    this.isInitializing.set(true);
    this.errorState.set(null);

    try {
      // The models are stored in our assets folder
      const MODEL_URL = '/assets/models/face_api';

      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);

      this.isReady.set(true);
      console.log('Face API models loaded successfully');
    } catch (e) {
      console.error('Failed to load Face API models', e);
      this.errorState.set(e instanceof Error ? e.message : 'Unknown error loading face models');
    } finally {
      this.isInitializing.set(false);
    }
  }

  /**
   * Extracts face descriptors from an image.
   * @param imageElement The HTMLImageElement, HTMLVideoElement, or HTMLCanvasElement
   * @returns An array of face descriptors (128D vectors) and their bounding boxes
   */
  async extractFaces(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<FaceDescriptor[]> {
    if (!this.isReady()) {
      await this.initialize();
    }

    try {
      // Detect all faces, find landmarks, and compute the 128D descriptors
      const detections = await faceapi.detectAllFaces(imageElement)
        .withFaceLandmarks()
        .withFaceDescriptors();

      return detections.map(d => ({
        descriptor: d.descriptor,
        box: {
          x: d.detection.box.x,
          y: d.detection.box.y,
          width: d.detection.box.width,
          height: d.detection.box.height
        }
      }));
    } catch (e) {
      console.error('Error extracting faces:', e);
      return [];
    }
  }

  /**
   * Given an image blob/file, create a temporary image element and extract faces.
   */
  async extractFacesFromFile(file: File): Promise<FaceDescriptor[]> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const faces = await this.extractFaces(img);
          URL.revokeObjectURL(img.src);
          resolve(faces);
        } catch (e) {
          URL.revokeObjectURL(img.src);
          reject(e);
        }
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image for face extraction.'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Compares two face descriptors and returns the Euclidean distance.
   * Lower distance means they are more likely to be the same person.
   * Typically, a distance < 0.6 is considered a match.
   */
  compareFaces(descriptor1: Float32Array, descriptor2: Float32Array): number {
    return faceapi.euclideanDistance(descriptor1, descriptor2);
  }

  /**
   * Checks if a descriptor matches any descriptor in a target list,
   * using a given threshold (default 0.6).
   */
  hasMatch(targetDescriptor: Float32Array, descriptorsToSearch: Float32Array[], threshold: number = 0.6): boolean {
    for (const desc of descriptorsToSearch) {
      const distance = this.compareFaces(targetDescriptor, desc);
      if (distance < threshold) {
        return true;
      }
    }
    return false;
  }
}
