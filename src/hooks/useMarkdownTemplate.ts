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
import RemarkUnwrapImages from 'remark-unwrap-images'

interface LoadingState extends Boolean {}
interface IsFound extends Boolean {}

type MarkdownTemplateFetch = [ReactNode, LoadingState, IsFound]

type MarkdownTemplateConfig = {
  templatePath?: string | URL
  components?: MDXRemoteProps['components']
}

export const useMarkdownTemplate = (
  config?: MarkdownTemplateConfig,
  deps: DependencyList = []
): MarkdownTemplateFetch => {
  const templatePath = useMemo(
    () => config?.templatePath || 'about:blank',
    [config?.templatePath]
  )

  const {
    content: template,
    resourceFound: templateFound,
    fetchState,
  } = useRemoteContent(
    {
      path: templatePath,
    },
    [...deps]
  )

  const [compiledContent, setContent] = useState<ReactNode>(null)

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
            components: config?.components,
            lazy: true,
          })
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compiledTemplate])

  return [compiledContent, !fetchState && !isLoading, templateFound]
}
