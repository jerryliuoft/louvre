import { FaceDescriptor } from '../services/face-recognition.service';

export interface FileWithType {
  name: string;
  path: string;
  handle?: FileSystemFileHandle;
  parentHandle?: FileSystemDirectoryHandle;
  faces?: FaceDescriptor[]; // Complete descriptor objects including bounding boxes
}
