import Document, { Html, Head, type DocumentProps, Main, NextScript } from 'next/document'
import i18nextConfig from '@stratego/../next-i18next.config'

class StrategoDocument extends Document<DocumentProps> {
  render() {
    const currentLocale = this.props.__NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale
    return (
      <Html lang={currentLocale}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="msapplication-TileColor" content="#212529" />
          <meta name="theme-color" content="#212529"/>
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#212529" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default StrategoDocument
