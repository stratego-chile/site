declare type ResponseBody<
  T extends Primitive = unknown,
  Status = 'OK' | 'ERROR'
> = {
  status: Status
  message?: string
  trace?: any
  result?: Status extends 'OK' ? T : never
}
