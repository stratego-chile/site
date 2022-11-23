declare module '*.md' {
  const value: string
  export default value
}

declare module '!!raw-loader!*' {
  const content: string
  export default content
}

declare module '*.pug' {
  import { type LocalsObject } from 'pug'
  const template: (locals: LocalsObject) => string
  export default template
}
