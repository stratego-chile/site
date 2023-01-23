import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote'
import {
  createElement,
  type DependencyList,
  Fragment,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRemoteContent } from '@stratego/hooks/useRemoteContent'
import { useAsyncMemo } from '@stratego/hooks/useAsyncMemo'
import { useTranslation } from 'next-i18next'
import RemarkUnwrapImages from 'remark-unwrap-images'

interface LoadingState extends Boolean {}
interface IsFound extends Boolean {}

type Content = ReactNode | null

export const useMarkdownTemplate = (
  config?: {
    templatePath?: string | URL
    layoutParsers?: MDXRemoteProps['components']
  },
  deps: DependencyList = []
): [Content, LoadingState, IsFound] => {
  const templatePath = useMemo(
    () => config?.templatePath || 'about:blank',
    [config?.templatePath]
  )

  const { i18n } = useTranslation()

  const { content: template, resourceFound: templateFound } = useRemoteContent(
    {
      path: templatePath,
    },
    [...deps, i18n]
  )

  const [compiledContent, setContent] = useState<Content>(null)

  const { data: content } = useAsyncMemo(async () => {
    if (template instanceof ReadableStream && !template.locked) {
      const { value } = await template.getReader().read()
      return await new Blob([value ?? new Uint8Array()]).text()
    }
    return String()
  }, [template])

  const { data: compiledTemplate, isLoading } = useAsyncMemo(async () => {
    return (
      templateFound &&
      content &&
      (await serialize(content, {
        mdxOptions: {
          remarkPlugins: [RemarkUnwrapImages],
          // based on workaround: https://github.com/hashicorp/next-mdx-remote/issues/307
          development: process.env.NODE_ENV !== 'production',
        },
      }))
    )
  }, [templateFound, content])

  useEffect(() => {
    if (compiledTemplate) {
      setContent(
        createElement(
          Fragment,
          {},
          createElement(MDXRemote, {
            ...compiledTemplate,
            components: { ...config?.layoutParsers },
          })
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compiledTemplate])

  return [compiledContent, !isLoading, templateFound]
}
