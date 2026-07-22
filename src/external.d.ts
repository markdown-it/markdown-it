declare module 'punycode.js' {
  interface Punycode {
    toASCII(input: string): string
    toUnicode(input: string): string
  }

  const punycode: Punycode
  export default punycode
}
