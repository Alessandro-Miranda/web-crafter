import { JSDOM, VirtualConsole } from 'jsdom';
import { normalize } from 'path';
import { ArgumentsTypes } from './@types/arguments';
import { findArgumentByName, getArguments } from './utils/arguments';
import { FileSystem } from './utils/handleFileSystem';
import { WebCrafter } from './webcrafter';

async function initWebCrafter() {
  const args = getArguments();
  console.log('Obtendo o nome do projeto e url do template');
  const projectName = findArgumentByName(args, ArgumentsTypes.SITE_NAME);
  const folderPath = normalize(`${process.cwd()}/${projectName}`);

  try {
    console.log('Criando pasta para o projeto');
    FileSystem.createFolder(folderPath);
  } catch (err) {
    console.error('Erro ao criar a pasta para o projeto: ', err);
    return;
  }

  const templateURL = findArgumentByName(args, ArgumentsTypes.TEMPLATE_URL);
  console.log('Fazendo o download do template')
  const templateHTML = await WebCrafter.downloadFrom(templateURL);

  const virtualConsole = new VirtualConsole();
  const { window } = new JSDOM(templateHTML, { virtualConsole, resources: 'usable', runScripts: 'outside-only' });

  const cssLinks = window.document.querySelectorAll('link[rel=stylesheet]') as NodeListOf<HTMLLinkElement>;
  const scripts = window.document.querySelectorAll('script[src]') as NodeListOf<HTMLScriptElement>;
  scripts.forEach(script => console.log(script.src));
  const rocketLazyLoadadedScripts = window.document.querySelectorAll('script[data-rocket-src]') as NodeListOf<HTMLScriptElement>;

  const filesToDownload: string[] = [];

  console.log('Atualizando urls de arquivos css e js no template');

  cssLinks.forEach(link => {
    link.href = link.href.replace(/\?.{1,}$/, '');
    filesToDownload.push(link.href);
    link.href = link.href.replace(templateURL.replace(/\/$/, ''), '');
  });

  scripts.forEach(script => {
    script.src = script.src.replace(/\?.{1,}$/, '');
    filesToDownload.push(script.src);
    script.src = script.src.replace(templateURL.replace(/\/$/, ''), '');
  });

  rocketLazyLoadadedScripts.forEach(script => {
    script.src = (script.dataset.rocketSrc as string).replace(/\?.{1,}$/, '');
    filesToDownload.push(script.src);
    script.src = script.src.replace(templateURL.replace(/\/$/, ''), '');
  });

  try {
    console.log('Salvando template')
    FileSystem.saveContent(
      normalize(folderPath + '/' + 'index.html'),
      window.document.documentElement.outerHTML
    );
    console.log('Template salvo com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar HTML: ', err);
    return;
  }

  console.log('baixando arquivos css e javascript');

  for await (const asset of downloadAssets(filesToDownload)) {
    console.log('arquivo baixado: ', asset.fileName);
    console.log('salvando o arquivo ', asset.fileName);
    const assetLocalName = asset.fileName.replace(templateURL.replace(/\/$/, ''), '')
    FileSystem.saveContent(normalize(folderPath + '/' + assetLocalName), asset.file)
    console.log('Arquivo ', asset.fileName, ' salvo');
  }

  console.log('Download de arquivos finalizado. O arquivo index.html, arquivos CSS e javascript forma salvos na pasta do projeto.');
  console.log('Os arquivos encontam-se disponíveis na pasta: ', folderPath);
}

async function* downloadAssets(links: string[]) {
  for (const link of links) {
    const file = await WebCrafter.downloadFrom(link);
    yield { file, fileName: link };
  }
}

initWebCrafter();
