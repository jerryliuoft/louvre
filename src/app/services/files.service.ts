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
  mp4: true,
  mkv: true,
};

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private files_raw = signal<FileWithType[]>([]);
  public directoryMap = signal<Map<string, string[]>>(new Map());
  private images = signal<string[]>([]);
  private imagesShuffled = signal<string[]>([]);

  constructor(private router: Router) {}
  // this contains the image in an array that should be displayed
  public imagesOrdered = computed(() => {
    if (this.imagesShuffled().length) {
      return this.imagesShuffled();
    } else {
      return this.images();
    }
  });

  resetAll() {
    this.files_raw.set([]);
    this.directoryMap.set(new Map<string, string[]>());
    this.images.set([]);
    this.imagesShuffled.set([]);
  }

  async pickNewDirectory() {
    const path = await window.electronAPI.searchDialog();
    this.router.navigateByUrl('/folder/' + path);
  }

  async setNewDirectory(path: string) {
    const fileList = await window.electronAPI.searchFolder(path);
    this.updateFileList(fileList);
  }

  private updateFileList(fileList: any) {
    this.resetAll();
    console.log('updating files');
    console.log(fileList);

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
    this.images.set(imageUrls);

    const imageByPath = new Map<string, string[]>();
    imageFiles.forEach((img) => {
      const existing_images = imageByPath.get(img.path) ?? [];
      imageByPath.set(img.path, [...existing_images, img.name]);
    });
    this.directoryMap.set(imageByPath);
  }

  async randomizeImages() {
    const newOrder = Array.from(this.images());
    this.shuffle(newOrder);
    this.imagesShuffled.set(newOrder);
  }

  // from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  // Fisher-Yates SHuffle

  private shuffle(array: string[]) {
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
