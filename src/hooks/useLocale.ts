import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'

export const useLocale = (initMode = false) => {
  const router = useRouter()
  const { locale } = router
  const { i18n } = useTranslation()

  useEffect(() => {
    if (initMode) i18n.changeLanguage(locale);
  }, [locale, i18n, initMode])

  return {
    currentLocale: locale ?? i18n.language,
    changeLocale: i18n.changeLanguage,
  }
}
