const chalk = require('chalk')
const replace = require('replace')
const { camelCase, upperFirst } = require('lodash')
const { existsSync, outputFileSync } = require('fs-extra')

const endpointTsTemplate = require('../templates/endpoint/endpointTsTemplate')

function getEndpointByType(args, cliConfigFile) {
	return cliConfigFile.endpoint.default
}

function getCorrespondingEndpointFileTypes(endpoint) {
	return Object.keys(endpoint).filter((key) => key.split('with').length > 1)
}

function endpointTemplateGenerator({ cmd, endpointName }) {
	let template = endpointTsTemplate
	let filename = `${endpointName}.ts`

	return {
		endpointPath: `src/pages/api/${cmd.path}/${filename}`,
		filename,
		template
	}
}

const buildInEndpointFileTypes = {
	ENDPOINT: 'endpoint'
}

const endpointTemplateGeneratorMap = {
	[buildInEndpointFileTypes.ENDPOINT]: endpointTemplateGenerator
}

function generateEndpoint(endpointName, cmd, cliConfigFile) {
	const endpointFileTypes = [
		'endpoint',
		...getCorrespondingEndpointFileTypes(cmd)
	]

	endpointFileTypes.forEach((endpointFileType) => {
		if (
			(cmd[endpointFileType] && cmd[endpointFileType].toString() === 'true') ||
			endpointFileType === buildInEndpointFileTypes.ENDPOINT
		) {
			const generateTemplate = endpointTemplateGeneratorMap[endpointFileType]

			const { endpointPath, filename, template } = generateTemplate({
				cmd,
				endpointName,
				cliConfigFile,
				endpointFileType
			})

			if (existsSync(endpointPath)) {
				console.error(
					chalk.red(
						`${filename} already exists in this path "${endpointPath}".`
					)
				)
			} else {
				try {
					outputFileSync(`${endpointPath}`, template)

					replace({
						regex: 'TemplateName',
						replacement: upperFirst(camelCase(endpointName)),
						paths: [endpointPath],
						recursive: false,
						silent: true
					})

					replace({
						regex: 'templateName',
						replacement: camelCase(endpointName),
						paths: [endpointPath],
						recursive: false,
						silent: true
					})

					console.log(
						chalk.green(
							`${filename} was successfully created at ${endpointPath}`
						)
					)
				} catch (error) {
					console.error(chalk.red(`${filename} failed and was not created.`))
					console.error(error)
				}
			}
		}
	})
}

module.exports = {
	generateEndpoint,
	getEndpointByType,
	getCorrespondingEndpointFileTypes
}
