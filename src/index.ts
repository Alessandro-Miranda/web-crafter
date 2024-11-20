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

import { exec } from "child_process";
import { normalize } from "path";
import { EmulateDom } from "./helpers/emulateDom";
import { AllowedArgs, ArgumentHandle } from "./utils/arguments";
import { FileSystem } from "./utils/handleFileSystem";
import { ErrorMessages, Message, StatusMessages } from "./utils/message";

class Webcrafter {
  private SITE_NAME: string | undefined;
  private TEMPLATE_URL: string | undefined;
  private projectFolderPath = '';

  constructor(Arguments: typeof ArgumentHandle) {
    Message.show('status', StatusMessages.START);
    this.SITE_NAME = Arguments.findArgumentByName(AllowedArgs.SITE_NAME);
    this.TEMPLATE_URL = Arguments.findArgumentByName(AllowedArgs.TEMPLATE_URL);
  }

  public async init() {
    if (!this.SITE_NAME || !this.TEMPLATE_URL) {
      Message.show(
        'error',
        ErrorMessages.INVALID_ARGUMENTS +
          'É necessário passar o nome do site e link do template para continuar'
      );
      return;
    }

    this.projectFolderPath = normalize(`${process.cwd()}/${this.SITE_NAME}`);

    if (!this.createProjectFolder().isCreated) return;

    try {
      Message.show('status', StatusMessages.DOWNLOADING_FILE + ' Fazendo download do template html');
      const htmlTemplate = await this.downloadFrom(this.TEMPLATE_URL);
      Message.show('status', StatusMessages.DOWNLOAD_FINISHED + ' Download do template concluído');

      const dom = new EmulateDom(htmlTemplate);
      
      Message.show('status', StatusMessages.GETTING_ASSETS_URLS + ' Obtendo URL dos arquivos css e javascript');

      const assetsUrls = dom.getAssetsUrl();

      Message.show('status', StatusMessages.DOWNLOADING_FILE + ' baixando arquivos Css e Javascript e atualizando URL\'s no index.html');

      Message.show('status', StatusMessages.SAVING_FILE + ' Salvando template html');

      FileSystem.saveContent(normalize(this.projectFolderPath + '/index.html'), dom.getUpdatedHtml());

      for await (const asset of this.downloadAssetsFrom(assetsUrls)) {
        Message.show('status', StatusMessages.DOWNLOAD_FINISHED + ' ' + asset.fileName);
        Message.show('status', StatusMessages.SAVING_FILE + ' ' + asset.fileName);
        const assetLocalName = asset.fileName.replace(/https:\/\/[^\/]+/, '');
        FileSystem.saveContent(normalize(this.projectFolderPath + '/' + assetLocalName), asset.file);
        Message.show('status', StatusMessages.FILE_SAVED + ' ' + asset.fileName);
      }


      Message.show('status', StatusMessages.DOWNLOAD_FINISHED + ' Download de arquivos concluídos. Todos os arquivos foram salvos na pasta: ' + this.projectFolderPath);
      Message.show('status', 'Abrindo a pasta do projeto');

      exec(`start "" explorer "${this.projectFolderPath}"`, (error) => {
        if (error) {
          Message.show('error', ErrorMessages.OPENING_FOLDER + error);
          process.exit(1);
        }

        process.exit(0);
      });
    } catch(err) {
      Message.show('error', ErrorMessages.DOWNLOADING_FILE + ' Erro ao baixar o template html ' + err);
    }
  }


  private createProjectFolder() {
    const status = { isCreated: false };

    try {
      Message.show('status', StatusMessages.CREATING_FOLDER + ' Criando a pasta ' + this.SITE_NAME);
      FileSystem.createFolder(this.projectFolderPath);
      Message.show('status', StatusMessages.FOLDER_CREATED);
      status.isCreated = true;
    } catch (error) {
      Message.show('error', ErrorMessages.CREATING_FOLDER + this.SITE_NAME + ' ' + error);
    }

    return status;
  }

  private async *downloadAssetsFrom(links: string[]) {
    for (const link of links) {
      const file = await this.downloadFrom(link);
      yield { file, fileName: link };
    }
  }


  private async downloadFrom(url: string): Promise<string> {
    return fetch(url).then((resp) => resp.text());
  }
}

const crafter = new Webcrafter(ArgumentHandle);
crafter.init();