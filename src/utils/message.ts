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

export enum StatusMessagesType {
  STARTING_PROCESS = 'starting_process',
  DOWNLOADING_TEMPLATE = 'downloading_template',
  CREATING_INDEX_HTML = 'creating_index.html',
  DOWNLOAD_COMPLETED = 'download_completed',
  DOWNLOADING_ASSETS = 'downloadgin_assets',
  OPENING_PROJECT_FOLDER = 'opening_project_folder'
}

export class Message {
  public static show(type: StatusMessagesType) {
    switch(type) {
      case StatusMessagesType.STARTING_PROCESS:
        console.log('Validando nome do projeto e url do template');
      break;

      case StatusMessagesType.DOWNLOADING_TEMPLATE:
        console.log('Baixando template...');
      break;

      case StatusMessagesType.CREATING_INDEX_HTML:
        console.log('Criando arquivo index.html');
      break;

      case StatusMessagesType.DOWNLOAD_COMPLETED:
        console.log('Download concluído. Todos os arquivos foram salvos na pasta do projeto');
      break;

      case StatusMessagesType.OPENING_PROJECT_FOLDER:
        console.log('Abrindo a pasta do projeto');
      break;

      case StatusMessagesType.DOWNLOADING_ASSETS:
        console.log('Baixando assets');
      break;
    }
  }
}
