import { promises } from 'original-fs';
interface FileWithType {
  name: string;
  parentPath: string;
  path: string;
}

export { FileWithType };

declare global {
  interface Window {
    electronAPI: { openFile: any; showFile: any };
  }
}
