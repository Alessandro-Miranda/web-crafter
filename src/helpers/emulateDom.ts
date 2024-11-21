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
  private cssElements: NodeListOf<HTMLLinkElement>;
  private scriptsElements: NodeListOf<HTMLScriptElement>;
  private rocketLazyScripts: NodeListOf<HTMLScriptElement>;
  private filesToDownload: string[] = [];

  constructor(private htmlTemplate: string) {
    this.window = new JSDOM(this.htmlTemplate, {
      virtualConsole: this.virtualConsole,
      resources: 'usable',
      runScripts: 'outside-only',
    }).window;

    this.cssElements = this.getEmulatedStylesheets();
    this.scriptsElements = this.getEmulatedScripts();
    this.rocketLazyScripts = this.getEmulatedRocketLazyScripts();
  }

  private getEmulatedStylesheets() {
    return this.window.document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]');
  }

  private getEmulatedScripts() {
    return this.window.document.querySelectorAll<HTMLScriptElement>('script[src]');
  }

  private getEmulatedRocketLazyScripts() {
    return this.window.document.querySelectorAll<HTMLScriptElement>('script[data-rocket-src]');
  }

  public getAssetsUrl() {
    this.getCssUrl();
    this.getScriptUrl();
    this.getRocketLazyScripts();

    return this.filesToDownload;
  }

  public getUpdatedHtml() {
    this.cssElements.forEach(link => console.log(link.href));
    return this.window.document.documentElement.outerHTML;
  }

  private getRocketLazyScripts() {
    this.rocketLazyScripts.forEach((script) => {
      script.src = this.removeVersionParams(script.dataset.rocketSrc as string);
      this.filesToDownload.push(script.src);
      script.src = this.removeTemplateDomain(script.src);
    });
  }

  private getScriptUrl() {
    this.scriptsElements.forEach((script) => {
      if (script.src.search('(gtm|gstatic|connect|analytics|gtag)')) return;
      this.filesToDownload.push(this.removeVersionParams(script.src));
      script.src = this.removeTemplateDomain(script.src);
    });
  }

  private getCssUrl() {
    this.cssElements.forEach((link) => {
      if (link.href.search('(https://fonts.*|cdn)') !== -1) return;
      this.filesToDownload.push(this.removeVersionParams(link.href));
      link.href = this.removeTemplateDomain(link.href);
    });
  }

  private removeVersionParams(link: string) {
    return link.replace(/\?.{1,}$/, '');
  }

  private removeTemplateDomain(link: string) {
    return link.replace(/https:\/\/[^\/]+|\?.{1,}$/, '');
  }
}
