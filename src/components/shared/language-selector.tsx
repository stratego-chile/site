import { useLocale } from '@stratego/hooks/useLocale'
import { getLanguage, getNativeName } from 'language-flag-colors'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { type FC, Fragment, useCallback } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import availableLocales from '@stratego/locale.middleware'
import classNames from 'classnames'

type LanguageSelectorProps = {
  theme?: 'light' | 'dark' | string
}

const LanguageSelector: FC<LanguageSelectorProps> = ({ theme = 'light' }) => {
  const { i18n } = useTranslation()

  const router = useRouter()

  const { pathname, query, asPath } = router

  const { currentLocale, changeLocale } = useLocale()

  const handleLanguageSelection = useCallback(
    (event: React.MouseEvent<HTMLElement>, lang: string) => {
      if (event.isTrusted) {
        if (lang !== currentLocale && i18n)
          changeLocale(lang).then(() => {
            router.push({ pathname, query }, asPath, { locale: lang })
          })
      }
    },
    [currentLocale, changeLocale, router, pathname, query, asPath, i18n]
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
    <DropdownButton
      variant={theme}
      className={classNames('rounded')}
      title={getLanguageReferenceContent()}
      align="end"
      size="sm"
    >
      {availableLocales().map((lang, key) => (
        <Dropdown.Item
          key={key}
          href="#"
          className="d-flex justify-content-start gap-3"
          onClick={(event) => handleLanguageSelection(event, lang)}
        >
          {getLanguageReferenceContent({ lang, mode: 'selector' })}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
}

export default LanguageSelector
