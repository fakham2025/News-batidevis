/**
 * Vérifie qu'une chaîne est une image PNG valide au format data URL
 */
export function isValidSignatureData(dataUrl: string): boolean {
  if (!dataUrl || typeof dataUrl !== 'string') return false;
  return dataUrl.startsWith('data:image/png;base64,') && dataUrl.length > 30;
}
