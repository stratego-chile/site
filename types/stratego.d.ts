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
