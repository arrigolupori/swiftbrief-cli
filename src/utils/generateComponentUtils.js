const chalk = require('chalk')
const replace = require('replace')
const { camelCase, kebabCase, snakeCase, upperFirst } = require('lodash')
const { existsSync, outputFileSync } = require('fs-extra')

const componentJsTemplate = require('../templates/component/componentJsTemplate')
const componentTsTemplate = require('../templates/component/componentTsTemplate')
const componentCssTemplate = require('../templates/component/componentCssTemplate')
const componentTestDefaultTemplate = require('../templates/component/componentTestDefaultTemplate')

function getComponentByType(args, cliConfigFile) {
	return cliConfigFile.component.default
}

function getCorrespondingComponentFileTypes(component) {
	return Object.keys(component).filter((key) => key.split('with').length > 1)
}

function componentTemplateGenerator({ cmd, componentName, cliConfigFile }) {
	const { usesTypeScript } = cliConfigFile
	let template = null
	let filename = null

	template = usesTypeScript ? componentTsTemplate : componentJsTemplate
	filename = usesTypeScript ? `${componentName}.tsx` : `${componentName}.js`

	return {
		componentPath: `src/ui/components/${cmd.path}/${componentName}/${filename}`,
		filename,
		template
	}
}

function componentStyleTemplateGenerator({
	cliConfigFile,
	cmd,
	componentName
}) {
	const { customTemplates } = cliConfigFile.component[cmd.type]
	let template = null
	let filename = null

	// Check for a custom style template.

	if (customTemplates && customTemplates.style) {
		// --- Load and use the custom style template

		const { template: customTemplate, filename: customTemplateFilename } =
			getCustomTemplate(componentName, customTemplates.style)

		template = customTemplate
		filename = customTemplateFilename
	} else {
		const { cssPreprocessor, usesCssModule } = cliConfigFile
		const module = usesCssModule ? '.module' : ''
		const cssFilename = `${componentName}${module}.${cssPreprocessor}`

		// --- Else use GRC built-in style template

		template = componentCssTemplate
		filename = cssFilename
	}

	return {
		componentPath: `${cmd.path}/${componentName}/${filename}`,
		filename,
		template
	}
}

function componentTestTemplateGenerator({ cliConfigFile, cmd, componentName }) {
	const { usesTypeScript } = cliConfigFile
	let template = null
	let filename = null

	filename = usesTypeScript
		? `${componentName}.cy.tsx`
		: `${componentName}.cy.js`

	template = componentTestDefaultTemplate

	return {
		componentPath: `src/ui/components/${cmd.path}/${componentName}/${filename}`,
		filename,
		template
	}
}

function customFileTemplateGenerator({
	componentName,
	cmd,
	cliConfigFile,
	componentFileType
}) {
	const { customTemplates } = cliConfigFile.component[cmd.type]
	const fileType = camelCase(componentFileType.split('with')[1])
	let filename = null
	let template = null

	// Check for a valid custom template for the corresponding custom component file.

	if (!customTemplates || !customTemplates[fileType]) {
		console.error(
			chalk.red(
				`
ERROR: Custom component files require a valid custom template. 
Please make sure you're pointing to the right custom template path in your generate-react-cli.json config file.
        `
			)
		)

		return process.exit(1)
	}

	// --- Load and use the custom component template.

	const { template: customTemplate, filename: customTemplateFilename } =
		getCustomTemplate(componentName, customTemplates[fileType])

	template = customTemplate
	filename = customTemplateFilename

	return {
		componentPath: `${cmd.path}/${componentName}/${filename}`,
		filename,
		template
	}
}

// --- Built in component file types

const buildInComponentFileTypes = {
	COMPONENT: 'component',
	STYLE: 'withStyle',
	TEST: 'withTest',
}

// --- Generate component template map

const componentTemplateGeneratorMap = {
	[buildInComponentFileTypes.COMPONENT]: componentTemplateGenerator,
	[buildInComponentFileTypes.STYLE]: componentStyleTemplateGenerator,
	[buildInComponentFileTypes.TEST]: componentTestTemplateGenerator
}

function generateComponent(componentName, cmd, cliConfigFile) {
	const componentFileTypes = [
		'component',
		...getCorrespondingComponentFileTypes(cmd)
	]

	componentFileTypes.forEach((componentFileType) => {
		// --- Generate templates only if the component options (withStyle, withTest, etc..) are true,
		// or if the template type is "component"

		if (
			(cmd[componentFileType] &&
				cmd[componentFileType].toString() === 'true') ||
			componentFileType === buildInComponentFileTypes.COMPONENT
		) {
			const generateTemplate =
				componentTemplateGeneratorMap[componentFileType] ||
				customFileTemplateGenerator

			const { componentPath, filename, template } = generateTemplate({
				cmd,
				componentName,
				cliConfigFile,
				componentFileType
			})

			// --- Make sure the component does not already exist in the path directory.

			if (existsSync(componentPath)) {
				console.error(
					chalk.red(
						`${filename} already exists in this path "${componentPath}".`
					)
				)
			} else {
				try {
					outputFileSync(`${componentPath}`, template)

					// Will replace the templatename in whichever format the user typed the component name in the command.
					replace({
						regex: 'templatename',
						replacement: componentName,
						paths: [componentPath],
						recursive: false,
						silent: true
					})

					// Will replace the TemplateName in PascalCase
					replace({
						regex: 'TemplateName',
						replacement: upperFirst(camelCase(componentName)),
						paths: [componentPath],
						recursive: false,
						silent: true
					})

					// Will replace the templateName in camelCase
					replace({
						regex: 'templateName',
						replacement: camelCase(componentName),
						paths: [componentPath],
						recursive: false,
						silent: true
					})

					// Will replace the template-name in kebab-case
					replace({
						regex: 'template-name',
						replacement: kebabCase(componentName),
						paths: [componentPath],
						recursive: false,
						silent: true
					})

					// Will replace the template_name in snake_case
					replace({
						regex: 'template_name',
						replacement: snakeCase(componentName),
						paths: [componentPath],
						recursive: false,
						silent: true
					})

					// Will replace the TEMPLATE_NAME in uppercase SNAKE_CASE
					replace({
						regex: 'TEMPLATE_NAME',
						replacement: snakeCase(componentName).toUpperCase(),
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
