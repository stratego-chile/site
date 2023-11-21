import { createSchema, type Infer } from '@powership/schema'
import type { Locale } from '@stratego/lib/locales'
import type { Document } from 'mongodb'
import type { Merge } from 'type-fest'

export enum DocsArticleType {
  Default = 'default',
  KnowledgeBase = 'kb',
  Guide = 'guide',
}

export const DocsArticleSchema = createSchema({
  refId: 'ID',
  type: {
    enum: Object.values(DocsArticleType),
  },
  availableLocales: '[string]',
  tags: '[string]',
  title: 'record',
})

export type DocsArticle = Merge<
  Infer<typeof DocsArticleSchema>,
  {
    title: Record<string, string | undefined>
  }
>

export type DocsArticleDocument = Document & DocsArticle

export const DocsArticleRefSchema = createSchema({
  id: 'ID',
  title: 'string',
  locale: 'string',
})

export type DocsArticleRef = Merge<
  Infer<typeof DocsArticleRefSchema>,
  {
    locale: Locale
  }
>
