export {};
declare global {
  interface Window {
    versions: any; // this will be your variable name
    files: { fileList: any };
  }
}
