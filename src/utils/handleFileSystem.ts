import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

export class FileSystem {
  public static createFolder(folderName: string) {
    if (!existsSync(folderName)) {
      mkdirSync(folderName, { recursive: true });
    }
  }

  public static saveContent(path: string, content: string) {;
    this.createFolder(dirname(path));
    
    writeFileSync(path, content);
  }
}
