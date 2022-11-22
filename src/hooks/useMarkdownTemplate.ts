import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote'
import { createElement, DependencyList, Fragment, ReactNode, useEffect, useMemo, useState } from 'react'
import { useRemoteContent } from '@stratego/hooks/useRemoteContent'
import { useAsyncMemo } from '@stratego/hooks/useAsyncMemo'
import { useTranslation } from 'next-i18next'

interface LoadingState extends Boolean {}

type Content = ReactNode | null

export const useMarkdownTemplate = (
  config?: {
    templatePath?: string | URL,
    layoutParsers?: MDXRemoteProps['components']
  },
  deps: DependencyList = []
): [Content, LoadingState] => {
  const templatePath = useMemo(() => config?.templatePath || 'about:blank', [config?.templatePath])

  const { i18n } = useTranslation()

  const [template] = useRemoteContent({
    path: templatePath,
  }, [...deps, i18n])

  const [compiledContent, setContent] = useState<Content>(null)

  const { data: content } = useAsyncMemo(async () => {
    if (template instanceof ReadableStream && !template.locked) {
      const { value } = await template.getReader().read()
      return await new Blob([value ?? new Uint8Array()]).text()
    }
    return String()
  }, [template])

  const { data: compiledTemplate, isLoading } = useAsyncMemo(async () => {
    return content && await serialize(content)
  }, [content])

  useEffect(() => {
    if (compiledTemplate) {
      setContent(createElement(Fragment, {}, createElement(MDXRemote, {
        ...compiledTemplate,
        components: { ...config?.layoutParsers }
      })))
    }
  }, [compiledTemplate])

  return [
    compiledContent,
    !isLoading,
  ]
}
