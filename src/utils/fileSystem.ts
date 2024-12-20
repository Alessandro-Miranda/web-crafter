/*! *************************************************************************
  Webcrafter - A simple offline browser utility, allowing you to download a website to a local directory, getting css and javascript files and building original directories structure based on template.
  Copyright (C) 2024  Alessandro Lima de Miranda

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
************************************************************************** */

import { exec } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

export class FileSystem {
  public static createFolder(folderName: string) {
    if (!existsSync(folderName)) {
      mkdirSync(folderName, { recursive: true });
    }
  }

  public static saveContent(path: string, content: string) {
    this.createFolder(dirname(path));

    writeFileSync(path, content);
  }

  public static openFolderInExplorerAndExit(folderPath: string) {
    exec(`start "" explorer "${folderPath}"`, (error) => {
      if (error) {
        console.error('Erro ao abrir pasta do projeto: ', error);
        process.exit(1);
      }

      process.exit(0);
    });
  }
}
