export const showConsoleWarnings = (): void => {
  const messages: Array<[string, string]> = [
    [
      [
        '%cHOLD UP! This tool is supposed to be used by advanced users',
        'Any action executed here could expose your data and/or generate unexpected application behavior.',
      ].join('\n'),
      'background: blue; color: white; font-size: x-large; font-weight: bold;',
    ],
    [
      [
        '%cIf you want to make a report or provide us a feedback, just send an email to dev@stratego.cl',
        'or file an issue on https://github.com/stratego-chile/site',
      ].join(' '),
      'color: whitesmoke; font-size: large; font-weight: light;',
    ],
  ]

  messages.forEach((message) => console.info(...message))
}
