module.exports = `import nc from 'next-connect'
import { onError } from 'server/middleware'
import { readTemplateName, createTemplateName } from 'server/controllers'
import { withValidation } from 'next-validations'
import { methodNotAllowed } from 'server/utils'
import { helloSchema } from 'types/schema'

const validate = withValidation({
	schema: templateNameSchema,
	type: 'Yup',
	mode: 'body'
})

const handler = nc({ onError })

handler.get(readTemplateName)
handler.post(validate(), createTemplateName)
handler.all(methodNotAllowed)

export default handler
`
