export function isValidRelativePath(path: string) {
  return path.startsWith('/') && !path.startsWith('//');
}
