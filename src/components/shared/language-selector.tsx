import { useLocale } from '@stratego/hooks/use-locale'
import { localesList as availableLocales } from '@stratego/locales'
import classNames from 'classnames'
import { getLanguage, getNativeName } from 'language-flag-colors'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useId } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

type LanguageSelectorProps = {
  theme?: 'light' | 'dark' | string
  className?: string
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  theme = 'light',
  className,
}) => {
  const { i18n } = useTranslation()

  const router = useRouter()

  const selectorId = useId()

  const { currentLocale, changeLocale } = useLocale()

  const handleLanguageSelection = useCallback(
    (event: React.MouseEvent<HTMLElement>, lang: string) => {
      if (event.isTrusted) {
        if (lang !== currentLocale && i18n)
          changeLocale(lang).then(() => {
            router.replace(
              { pathname: router.pathname, query: router.query },
              router.asPath,
              {
                locale: lang,
                scroll: false,
              }
            )
          })
      }
    },
    [currentLocale, changeLocale, router, i18n]
  )

  const getLanguageReferenceContent = (options?: {
    lang: string
    mode?: 'label' | 'selector'
  }) =>
    (($lang) => (
      <Fragment>
        <span>{$lang.flag.emoji}</span>
        {options?.mode === 'selector' && (
          <span>
            {getNativeName(new Intl.Locale($lang.ids.locale).language)}
            {' - '}
            {$lang.country}
          </span>
        )}
      </Fragment>
    ))(getLanguage(options?.lang ?? currentLocale)!)

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        id={selectorId}
        variant={theme}
        size="sm"
        className={classNames('rounded', className)}
      >
        {getLanguageReferenceContent()}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {availableLocales.map((lang, key) => (
          <Dropdown.Item
            key={key}
            className="d-flex justify-content-start gap-3"
            onClick={(event) => handleLanguageSelection(event, lang)}
          >
            {getLanguageReferenceContent({ lang, mode: 'selector' })}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

LanguageSelector.displayName = 'LanguageSelector'

export default LanguageSelector
