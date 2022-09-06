const chalk = require('chalk')
const replace = require('replace')
const { camelCase, upperFirst } = require('lodash')
const { existsSync, outputFileSync } = require('fs-extra')

const componentTsTemplate = require('../templates/component/componentTsTemplate')
const componentTestTemplate = require('../templates/component/componentTestTemplate')

function getComponentByType(args, cliConfigFile) {
	return cliConfigFile.component.default
}

function getCorrespondingComponentFileTypes(component) {
	return Object.keys(component).filter((key) => key.split('with').length > 1)
}

function componentTemplateGenerator({ cmd, componentName }) {
	let template = componentTsTemplate
	let filename = 'index.tsx'

	return {
		componentPath: `src/ui/components/${cmd.path}/${componentName}/${filename}`,
		filename,
		template
	}
}

function componentTestTemplateGenerator({ cliConfigFile, cmd, componentName }) {
	let filename = `${componentName}.cy.tsx`
	let template = componentTestTemplate

	return {
		componentPath: `src/ui/components/${cmd.path}/${componentName}/${filename}`,
		filename,
		template
	}
}

const buildInComponentFileTypes = {
	COMPONENT: 'component',
	TEST: 'withTest'
}

const componentTemplateGeneratorMap = {
	[buildInComponentFileTypes.COMPONENT]: componentTemplateGenerator,
	[buildInComponentFileTypes.TEST]: componentTestTemplateGenerator
}

function generateComponent(componentName, cmd, cliConfigFile) {
	const componentFileTypes = [
		'component',
		...getCorrespondingComponentFileTypes(cmd)
	]

	componentFileTypes.forEach((componentFileType) => {
		if (
			(cmd[componentFileType] &&
				cmd[componentFileType].toString() === 'true') ||
			componentFileType === buildInComponentFileTypes.COMPONENT
		) {
			const generateTemplate = componentTemplateGeneratorMap[componentFileType]

			const { componentPath, filename, template } = generateTemplate({
				cmd,
				componentName,
				cliConfigFile,
				componentFileType
			})

			if (existsSync(componentPath)) {
				console.error(
					chalk.red(
						`${filename} already exists in this path "${componentPath}".`
					)
				)
			} else {
				try {
					outputFileSync(`${componentPath}`, template)

					replace({
						regex: 'TemplateName',
						replacement: upperFirst(camelCase(componentName)),
						paths: [componentPath],
						recursive: false,
						silent: true
					})

					console.log(
						chalk.green(
							`${filename} was successfully created at ${componentPath}`
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
	generateComponent,
	getComponentByType,
	getCorrespondingComponentFileTypes
}
