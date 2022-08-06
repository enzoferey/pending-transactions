export function matchIsDocumentVisible(
  document: Document | undefined
): boolean {
  if (document === undefined) {
    // always assume it's visible
    return true;
  }

  return document.visibilityState !== "hidden";
}
