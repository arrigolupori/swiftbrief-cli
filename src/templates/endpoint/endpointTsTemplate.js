module.exports = `import nc from 'next-connect'
import { onError } from 'server/middleware'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = nc<NextApiRequest, NextApiResponse>({ onError })
handler.post(readTemplateName)
handler.post(createTemplateName)

export default handler
`
