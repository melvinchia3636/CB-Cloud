export interface FileDataType {
  type: Type;
  path: string;
  icon: string;
  name: string;
  tag: string[];
  last_mod: string;
  created: string;
  size: number;
}

export enum Type {
  File = 'file',
  Folder = 'folder',
}
