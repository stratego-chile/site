declare type ResponseBody<T extends Primitive = unknown> = {
  error?: {
    value: boolean
    message: string
    timestamp?: number
  }
} & T extends NonNullable<T>
  ? {
      result: T
    }
  : {
      result?: never
    }
