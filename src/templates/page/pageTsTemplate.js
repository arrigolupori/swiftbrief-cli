module.exports = `import type { NextPage } from 'next'
import { Meta } from 'ui/components'
import { templateNameMeta } from 'data/meta'
import { Fragment } from 'react'
import { Heading, Text } from '@chakra-ui/react'

const TemplateName: NextPage = () => {
	return (
		<Fragment>
			<Meta {...templateNameMeta} />
			<Heading>Hello world</Heading>
			<Text>This is a new page</Text>
		</Fragment>
	)
}

export default TemplateName

`
