# WebCrafter

_**Status**: Em desenvolvimento_ :construction:

**WebCrafter** é um utilitário simples que permite você baixar um website para um diretório local, obtendo arquivos css e javascript e mantendo a estrutura de pastas presentes na url dos arquivos no template.

_**Obs:** Atualmente o projeto apenas faz a cópia de Landing Pages. Versões futuras estão sendo trabalhadas para cópia de páginas internas._

Esta automatização construída em **node**, realiza requisições **http** para a url passada como argumento para realizar o download do arquivo html de entrada o site. Após o download do arquivo, criação de pasta em diretório local e criação do arquivo index.html, o script inicia utiliza o JSDOM para manipular e obter a URL das tags de estilo e scripts presentes na página, realizando a troca das url's para o diretório local do onde o projeto será salvo e realizando o download destes assets para as respectivas pastas, mantendo a sua estrutura original de caminho. 

---

## Features

- [x] Download de arquivos (index.html, .css e .js);
- [x] Manipulação de URL's de assets;
- [x] Cópia de Landing Page (Site de página única)

---

## Requisitos

- **Node.js** >= 22.11.0

---

## Instalação e Uso Básico

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/webcrafter.git
cd webcrafter
```

2. Instale as dependências
```bash
npm install
# ou 
yarn
```

3. Realize o build do projeto
```bash
npm run build
# ou
yarn build
```

Feito isso, a automação já estará linkada e disponível para uso, para executar o script basta abrir o terminal e executar o comando:
```bash
webcrafter --site-name=<nome_do_projeto> --template-url=<link_do_site_que_deseja_clonar>
```

O conteúdo será salvo na pasta com o nome passado no argumento `--site-name` dentro da pasta raíz onde seu terminal bash estiver rodando.

## Tecnologias

- [Node.js](https://nodejs.org/en)
- [JSDOM](https://www.npmjs.com/package/jsdom)
- [TypeScript](https://www.typescriptlang.org/)

## Licença

Este projeto está licenciado sob a [GNU GENERAL PUBLIC LICENSE](https://choosealicense.com/licenses/gpl-3.0/#)

## Observações

_**Webcrafter** foi desenvolvido para fins legítimos e estudos de automação. Certifique-se de respeitar direitos autorais e termos de uso ao utilizar esta ferramenta._