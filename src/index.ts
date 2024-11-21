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

import { normalize } from "path";
import { EmulateDom } from "./helpers/emulateDom";
import { AllowedArgs, ArgumentHandle } from "./utils/arguments";
import { FileSystem } from "./utils/fileSystem";
import { Message, StatusMessagesType } from "./utils/message";

class Webcrafter {
  private siteName: string | undefined;
  private templateUrl: string | undefined;
  private projectFolderPath: string;
  private emulatedDom: EmulateDom | undefined = undefined;

  constructor(Arguments: typeof ArgumentHandle) {
    Message.show(StatusMessagesType.STARTING_PROCESS);
    this.siteName = Arguments.findArgumentByName(AllowedArgs.SITE_NAME);
    this.templateUrl = Arguments.findArgumentByName(AllowedArgs.TEMPLATE_URL);
    this.projectFolderPath = normalize(`${process.cwd()}/${this.siteName}`);
  }

  public async init() {
    this.validateArguments();

    try {
      FileSystem.createFolder(this.projectFolderPath);
      await this.setHtmlTemplate();
      Message.show(StatusMessagesType.CREATING_INDEX_HTML);
      await this.saveContent();
      Message.show(StatusMessagesType.DOWNLOAD_COMPLETED);
      Message.show(StatusMessagesType.OPENING_PROJECT_FOLDER);

      FileSystem.openFolderInExplorerAndExit(this.projectFolderPath);
    } catch (err) {
      console.error(err);
    }
  }

  private validateArguments() {
    if (!this.siteName || !this.templateUrl) {
      console.error('Argumentos inválidos: nome do projeto e url do template obrigatórios');
      process.exit(-1);
    }
  }

  private async setHtmlTemplate() {
    Message.show(StatusMessagesType.DOWNLOADING_TEMPLATE);
    const htmlTemplate = await this.downloadFile(this.templateUrl as string);
    this.emulatedDom = new EmulateDom(htmlTemplate);
  }

  private async saveContent() {
    Message.show(StatusMessagesType.DOWNLOADING_ASSETS);

    const assetsUrl = this.emulatedDom!.getAssetsUrl();

    FileSystem.saveContent(
      normalize(this.projectFolderPath + '/index.html'),
      this.emulatedDom!.getUpdatedHtml()
    );

    for await (const asset of this.downloadAssets(assetsUrl)) {
      const assetLocalDirectory = asset.link.replace(/https:\/\/[^\/]+/, '');
      FileSystem.saveContent(normalize(this.projectFolderPath + '/' + assetLocalDirectory), asset.file);
    }
  }

  private async *downloadAssets(assetsLinks: string[]) {
    for (const link of assetsLinks) {
      const file = await this.downloadFile(link);
      yield { file, link };
    }
  }

  private async downloadFile(url: string): Promise<string> {
    return fetch(url).then((resp) => resp.text());
  }
}

const crafter = new Webcrafter(ArgumentHandle);
crafter.init();