declare type ResponseBody<
  T extends Primitive = unknown,
  Status = 'OK' | 'ERROR',
  Result = Status extends 'OK' ? T : never
> = {
  status: Status
  message?: string
  trace?: any
  result?: Result
}

declare type AvailableLocales = 'es-CL' | 'en-US' | 'pt-BR'

declare type DocumentationPostType = 'default' | 'kb' | 'guide'

declare type DocumentationPost<T = DocumentationPostType> = {
  refId: string
  type: T
  availableLocales: Array<AvailableLocales>
  title: Record<AvailableLocales, string | undefined>
  tags: Array<string>
}

declare type DocumentationPostRef = {
  id: string
  title: string
  locale: AvailableLocales
}
