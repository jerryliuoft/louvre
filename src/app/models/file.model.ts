export interface FileWithType {
  name: string;
  path: string;
  handle?: FileSystemFileHandle;
  parentHandle?: FileSystemDirectoryHandle;
}
