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

import { DOMWindow, JSDOM, VirtualConsole } from 'jsdom';

export class EmulateDom {
  private virtualConsole = new VirtualConsole();
  private window: DOMWindow;
  private assetsSelector = ['link[rel=stylesheet]', 'script[src]', 'script[data-rocket-src]'];
  private assetsElements: Array<HTMLScriptElement | HTMLLinkElement> = [];

  constructor(private htmlTemplate: string) {
    this.window = new JSDOM(this.htmlTemplate, {
      virtualConsole: this.virtualConsole,
      resources: 'usable',
      runScripts: 'outside-only',
    }).window;

    this.getEmulatedAssets();
  }

  private getEmulatedAssets() {
    this.assetsSelector.forEach(assetSelector => {
      this.assetsElements.push(
        ...Array.from(
          this.window.document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>(assetSelector)
        )
      )
    })
  }

  public getAssetsUrl() {
    const filesToDownload: string[] = [];

    this.assetsElements.forEach(asset => {
      if (this.isLinkElement(asset)) {
        if (asset.href.search('(https://fonts.*|cdn)') !== -1) return;

        filesToDownload.push(this.removeVersionParams(asset.href));
        asset.href = this.removeTemplateDomain(asset.href);
      }
      
      if (this.isScriptElement(asset)) {
        if (asset.src.search('(gtm|gstatic|connect|analytics|gtag)') !== -1) return;

        let src: string;

        if (asset.dataset.rocketSrc !== undefined) {
          src = asset.dataset.rocketSrc as string
        } else {
          src = asset.src;
        }

        filesToDownload.push(this.removeVersionParams(src));
        asset.src = this.removeTemplateDomain(src);
      }
    })

    return filesToDownload;
  }

  private isLinkElement(element: Element): element is HTMLLinkElement {
    return element.tagName.toLowerCase() === 'link';
  }

  private isScriptElement(element: Element): element is HTMLScriptElement {
    return element.tagName.toLowerCase() === 'script';
  }

  public getUpdatedHtml() {
    return this.window.document.documentElement.outerHTML;
  }

  private removeVersionParams(link: string) {
    return link.replace(/\?.{1,}$/, '');
  }

  private removeTemplateDomain(link: string) {
    return link.replace(/https:\/\/[^\/]+|\?.{1,}$/, '');
  }
}
