module.exports = `import nc from 'next-connect'
import { onError } from 'server/middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import { readTemplateName, createTemplateName } from 'server/controllers'

const handler = nc<NextApiRequest, NextApiResponse>({ onError })
handler.get(readTemplateName)
handler.post(createTemplateName)

export default handler
`
