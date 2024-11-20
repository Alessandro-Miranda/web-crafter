export enum AllowedArgs {
  SITE_NAME = '--site-name',
  TEMPLATE_URL = '--template-url',
}

export class ArgumentHandle {
  private static processArguments = process.argv.filter((argument) => {
    const allowedArgsAsRegex = Object.values(AllowedArgs).join('|');
    return argument.search(allowedArgsAsRegex) !== -1;
  });

  public static findArgumentByName(argumentName: AllowedArgs) {
    return this.processArguments
      .find((argument) => argument.startsWith(argumentName))
      ?.replace(argumentName + '=', '');
  }
}
