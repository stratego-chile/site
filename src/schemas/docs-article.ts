import type { Locale } from '@stratego/lib/locales'
import type { Document } from 'mongodb'
import { z } from 'zod'

export enum DocsArticleType {
  Default = 'default',
  KnowledgeBase = 'kb',
  Guide = 'guide',
}

export const DocsArticleSchema = z.object({
  refId: z.string(),
  type: z.nativeEnum(DocsArticleType),
  availableLocales: z.array(z.string()),
  tags: z.array(z.string()),
  title: z.record(z.string().optional()),
})

export type DocsArticle = z.infer<typeof DocsArticleSchema> & {
  availableLocales: Array<Locale>
}

export type DocsArticleDocument = Document & DocsArticle

export const DocsArticleRefSchema = z.object({
  id: z.string(),
  title: z.string(),
  locale: z.string(),
})

export type DocsArticleRef = z.infer<typeof DocsArticleRefSchema> & {
  locale: Locale
}
