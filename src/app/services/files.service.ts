import { effect, Injectable, signal, computed } from '@angular/core';
import { FileWithType } from '../../types/index';
import { Router } from '@angular/router';

// put all types as lowercase
const SUPPORTED_FILETYPES = {
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
};

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private files_raw = signal<FileWithType[]>([]);
  public imagesOrdered = signal<string[]>([]);
  public directoryOrdered = signal<[string, string[]][]>([]);

  constructor(private router: Router) {}

  async pickNewDirectory() {
    const path = await window.electronAPI.searchDialog();
    this.router.navigateByUrl('/folder/' + encodeURIComponent(path));
  }

  async setNewDirectory(path: string) {
    const fileList = await window.electronAPI.searchFolder(path);
    this.updateFileList(fileList);
  }

  private updateFileList(fileList: any) {
    const files: FileWithType[] = Array.from(fileList);
    this.files_raw.set(files);

    // Filter for supported types
    const imageFiles = this.files_raw().filter((val: FileWithType) => {
      const parts = val.name.split('.');
      if (parts.length > 1) {
        return parts.at(-1)!.toLocaleLowerCase() in SUPPORTED_FILETYPES;
      }
      return false;
    });

    //Populate the precomputed maps
    const imageUrls = imageFiles.map((src: FileWithType) => {
      return src.path + '\\' + src.name;
    });
    this.imagesOrdered.set(imageUrls);

    const imageByPath = new Map<string, string[]>();
    imageFiles.forEach((img) => {
      const existing_images = imageByPath.get(img.path) ?? [];
      imageByPath.set(img.path, [...existing_images, img.name]);
    });
    this.directoryOrdered.set(Array.from(imageByPath.entries()));
  }

  randomize() {
    this.randomizeImages();
    this.randomizeDirecotires();
  }

  randomizeImages() {
    const newOrder = Array.from(this.imagesOrdered());
    this.shuffle(newOrder);
    this.imagesOrdered.set(newOrder);
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
