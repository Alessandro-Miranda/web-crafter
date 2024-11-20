# WebCrafter

**WebCrafter** é uma automatização desenvolvida em **Node.js** projetada para criar cópias de websites, sendo ideal para a reutilização de templates ou análse offline. O script salva o html e arquivos estáticos do site a ser copiado, além de realizar a atualização da URL dentro do arquivo html baixado inicialmente.

---

## Recursos

- Utiliza **File System** para criação de pastas e arquivos.
- Realiza **requisições HTTP** para a url especificada pelo usuário.
- Baixa o conteúdo HTML de uma página.
- Baixa CSS, JavaScript e Imagens presentes no HTML salvo.
- Salva arquivos estáticos mantendo a estrutura de arquivos e arquitetura do site alvo.
- Manipula o arquivo o HTML para referenciar os arquivos salvos localmente.
- Abre a pasta onde os arquivos foram salvos após finalizar o download.

---

## Requisitos

- **Node.js** >= 22.11.0

---

## Instalação e Uso

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

## Licença

Este projeto está licenciado sob a [GNU GENERAL PUBLIC LICENSE](https://choosealicense.com/licenses/gpl-3.0/#)

## Observações

_**Webcrafter** foi desenvolvido para fins legítimos e estudos de automação. Certifique-se de respeitar direitos autorais e termos de uso ao utilizar esta ferramenta._