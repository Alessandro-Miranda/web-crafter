export function getArguments() {
  const args = process.argv.filter((argument) => argument.startsWith('--'));
  return args;
}

export function findArgumentByName(argumentsToSearch: string[], argumentName: string) {
  const argumentNameFormated = `${argumentName}=`;

  return argumentsToSearch
    .filter((argument) => argument.search(argumentName) !== -1)[0]
    .replace(argumentNameFormated, '');
}
