export class WebCrafter {
  public static async downloadFrom(url: string): Promise<string> {
    return fetch(url).then((resp) => resp.text());
  }
}
