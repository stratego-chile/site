declare namespace Stratego {
  export namespace Common {
    export type ResponseBody<
      T extends Primitive | object = unknown,
      Status = 'OK' | 'ERROR',
      Result = Status extends 'OK' ? T : never
    > = {
      status: Status
      message?: string
      trace?: any
      result?: Result
    }

    export type Locale = 'es-CL' | 'en-US' | 'pt-BR'
  }

  export namespace Services {
    export type SecuritySection = 'audit' | 'consulting'
  }

  export namespace Documentation {
    export type PostType = 'default' | 'kb' | 'guide'

    export type Post<T = PostType> = {
      refId: string
      type: T
      availableLocales: Array<AvailableLocales>
      title: Record<AvailableLocales, string | undefined>
      tags: Array<string>
    }

    export type PostRef = {
      id: string
      title: string
      locale: Stratego.Common.Locale
    }
  }

  export namespace Utils {
    export namespace PasswordGenerator {
      type Enumerate<
        N extends number,
        Acc extends number[] = []
      > = Acc['length'] extends N
        ? Acc[number]
        : Enumerate<N, [...Acc, Acc['length']]>

      type IntRange<F extends number, T extends number> = Exclude<
        Enumerate<T>,
        Enumerate<F>
      >

      export type LettersGroup =
        | 'regular'
        | 'special'
        | 'numbers'
        | 'symbols'
        | 'whiteSpaces'

      export type LetterCase = 'lower' | 'upper'

      export type LettersGroupSpec = {
        name: LettersGroup
        letters: string
        range: string
      }

      export type GeneratorOptions = {
        length: IntRange<8, 65>
        times: IntRange<1, 21>
        include: Array<LettersGroup>
        case: Array<LetterCase>
        symbolsWeight?: number
      }
    }
  }
}
