import { capitalizeText } from '@stratego/helpers/text.helper'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { type NextRouter } from 'next/router'
import { type FC } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

type ArticleLinksProps = {
  articles: Array<{
    id: string
    title: string
  }>
  router: NextRouter
}

const ArticleLinks: FC<ArticleLinksProps> = ({ articles = [], router }) => {
  const { t } = useTranslation()

  return (
    <ListGroup as="ol" numbered>
      {articles.map(({ id, title }, key) => (
        <Link key={key} href={`/docs/${id}`} passHref legacyBehavior>
          <ListGroup.Item
            action
            as="li"
            className="pe-pointer text-start"
            disabled={!router.isReady}
          >
            {capitalizeText(t(title), 'simple')}
          </ListGroup.Item>
        </Link>
      ))}
    </ListGroup>
  )
}

export default ArticleLinks
