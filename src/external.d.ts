declare module 'uc.micro' {
  export const Any: RegExp
  export const Cc: RegExp
  export const Cf: RegExp
  export const P: RegExp
  export const S: RegExp
  export const Z: RegExp
}

declare module 'punycode.js' {
  interface Punycode {
    toASCII(input: string): string
    toUnicode(input: string): string
  }

  const punycode: Punycode
  export default punycode
}
