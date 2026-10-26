export function validateHelpWantedLink(value: unknown): true | string {
  if (typeof value === 'string') {
    try {
      const url = new URL(value)
      if (url.protocol === 'https:' || url.protocol === 'http:') return true
    } catch {
      // Return the same validation message for malformed and unsupported URLs.
    }
  }
  return 'Enter a valid link starting with https:// or http://.'
}
