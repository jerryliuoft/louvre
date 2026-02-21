import { Injectable, signal } from '@angular/core';
import { Human, Config } from '@vladmandic/human';

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

  private human: Human | null = null;

  constructor() { }

  async initialize() {
    if (this.isReady() || this.isInitializing()) return;
    
    this.isInitializing.set(true);
    this.errorState.set(null);

    try {
      // The models are stored in our assets folder
      const MODEL_URL = '/assets/models/human';
      
      const config: Partial<Config> = {
        modelBasePath: MODEL_URL,
        filter: { enabled: false }, // we don't need visual filters
        face: {
          enabled: true,
          detector: { return: true, rotation: true },
          mesh: { enabled: false },
          attention: { enabled: false },
          iris: { enabled: false },
          description: { enabled: true },
          emotion: { enabled: false },
          antispoof: { enabled: false },
          liveness: { enabled: false },
        },
        body: { enabled: false },
        hand: { enabled: false },
        object: { enabled: false },
        segmentation: { enabled: false }
      };

      this.human = new Human(config);
      await this.human.load();

      this.isReady.set(true);
      console.log('Human models loaded successfully');
    } catch (e) {
      console.error('Failed to load Human models', e);
      this.errorState.set(e instanceof Error ? e.message : 'Unknown error loading face models');
    } finally {
      this.isInitializing.set(false);
    }
  }

  /**
   * Extracts face descriptors from an image.
   * @param imageElement The HTMLImageElement, HTMLVideoElement, or HTMLCanvasElement
   * @returns An array of face descriptors and their bounding boxes
   */
  async extractFaces(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<FaceDescriptor[]> {
    if (!this.isReady()) {
      await this.initialize();
    }

    try {
      const result = await this.human!.detect(imageElement);

      return result.face
        .filter(f => f.embedding && f.boxScore && f.boxScore > 0.6)
        .map(f => ({
          descriptor: new Float32Array(f.embedding!),
          box: {
            x: f.box[0],
            y: f.box[1],
            width: f.box[2],
            height: f.box[3]
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
   * Compares two face descriptors and returns the similarity score (0 to 1).
   * Higher score means they are more likely to be the same person.
   */
  computeSimilarity(descriptor1: Float32Array, descriptor2: Float32Array): number {
    if (!this.human) return 0;
    return this.human.match.similarity(Array.from(descriptor1), Array.from(descriptor2));
  }

  /**
   * Checks if a descriptor matches any descriptor in a target list,
   * using a given similarity threshold (default 0.55).
   */
  hasMatch(targetDescriptor: Float32Array, descriptorsToSearch: Float32Array[], threshold: number = 0.55): boolean {
    for (const desc of descriptorsToSearch) {
      const similarity = this.computeSimilarity(targetDescriptor, desc);
      if (similarity > threshold) {
        return true;
      }
    }
    return false;
  }
}
