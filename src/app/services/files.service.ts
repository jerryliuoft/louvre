import { effect, Injectable, signal, computed } from '@angular/core';
import { FileWithType } from '../../types/index';

// put all types as lowercase
const SUPPORTED_FILETYPES = {
  jpg: true,
  png: true,
};

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private files_raw = signal([]);
  private images = computed(() => {
    const imageFiles = this.files_raw().filter((val: FileWithType) => {
      const parts = val.name.split('.');
      if (parts.length > 1) {
        return parts.at(-1)!.toLocaleLowerCase() in SUPPORTED_FILETYPES;
      }
      return false;
    });

    // construct the file urls
    return imageFiles.map((src: FileWithType) => {
      return src.path + '\\' + src.name;
    });
  });

  // this contains the image in an array that should be displayed
  public imagesOrdered = computed(() => {
    if (this.imagesShuffled().length) {
      return this.imagesShuffled();
    } else {
      return this.images();
    }
  });

  private imagesShuffled = signal<string[]>([]);

  async setNewDirectory() {
    const fileList = await window.electronAPI.openFile();
    this.files_raw.set(Array.from(fileList));
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
