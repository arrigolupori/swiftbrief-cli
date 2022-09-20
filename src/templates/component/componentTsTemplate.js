module.exports = `import { Box, BoxProps, forwardRef } from '@chakra-ui/react'

export interface TemplateNameProps extends BoxProps {
	name?: string
}

export const TemplateName = forwardRef<TemplateNameProps, 'div'>(
	(props, ref): any => {
		console.log('TemplateName')
		return (
			<Box data-testid={props.name} ref={ref} {...props}>
				{props.children}
			</Box>
		)
	}
)`
