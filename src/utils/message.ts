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

export enum StatusMessages {
  CREATING_FOLDER = '[Criando pasta]:',
  FOLDER_CREATED = '[Pasta criada]:',
  DOWNLOADING_FILE = '[Baixando o arquivo]:',
  DOWNLOAD_FINISHED = '[Download concluído]:',
  START = '[Iniciando aplicação]:',
  GETTING_ASSETS_URLS = '[Obtendo URL dos assets]:',
  UPDATING_TEMPLATE = '[Atualizando template]:',
  SAVING_FILE = '[Salvando arquivo]:',
  FILE_SAVED = '[Arquivo salvo]:',
}

export enum ErrorMessages {
  CREATING_FOLDER = '[Erro ao criar pasta]:',
  DOWNLOADING_FILE = '[Erro ao baixar arquivo]:',
  INVALID_ARGUMENTS = '[Argumentos passados inválidos]:',
  OPENING_FOLDER = '[Erro ao tentar abrir pasta]:',
}

export type MessageOptionsError = {
  messageType: 'error';
  message: string; // ou outro tipo
};

export type MessageOptionsStatus = {
  messageType: 'status';
  message: StatusMessages | string;
};

export class Message {
  public static show(messageType: 'status' | 'error', message: string) {
    switch (messageType) {
      case 'status':
        console.log(message);
        break;

      case 'error':
        console.error(message);
    }
  }
}
