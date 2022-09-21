const chalk = require('chalk')
const replace = require('replace')
const { camelCase, upperFirst } = require('lodash')
const { existsSync, outputFileSync } = require('fs-extra')

const controllerTsTemplate = require('../templates/controller/controllerTsTemplate')

function getControllerByType(args, cliConfigFile) {
	return cliConfigFile.controller.default
}

function getCorrespondingControllerFileTypes(controller) {
	return Object.keys(controller).filter((key) => key.split('with').length > 1)
}

function controllerTemplateGenerator({ cmd, controllerName }) {
	let template = controllerTsTemplate
	let filename = `${controllerName}Controller.ts`

	return {
		controllerPath: `src/server/controllers/${
			cmd.path !== '' ? `${cmd.path}/${filename}` : filename
		}`,
		filename,
		template
	}
}

const buildInControllerFileTypes = {
	CONTROLLER: 'controller'
}

const controllerTemplateGeneratorMap = {
	[buildInControllerFileTypes.CONTROLLER]: controllerTemplateGenerator
}

function generateController(controllerName, cmd, cliConfigFile) {
	const controllerFileTypes = [
		'controller',
		...getCorrespondingControllerFileTypes(cmd)
	]

	controllerFileTypes.forEach((controllerFileType) => {
		if (
			(cmd[controllerFileType] &&
				cmd[controllerFileType].toString() === 'true') ||
			controllerFileType === buildInControllerFileTypes.CONTROLLER
		) {
			const generateTemplate =
				controllerTemplateGeneratorMap[controllerFileType]

			const { controllerPath, filename, template } = generateTemplate({
				cmd,
				controllerName,
				cliConfigFile,
				controllerFileType
			})

			if (existsSync(controllerPath)) {
				console.error(
					chalk.red(
						`${filename} already exists in this path "${controllerPath}".`
					)
				)
			} else {
				try {
					outputFileSync(`${controllerPath}`, template)

					replace({
						regex: 'TemplateName',
						replacement: upperFirst(camelCase(controllerName)),
						paths: [controllerPath],
						recursive: false,
						silent: true
					})

					replace({
						regex: 'templateName',
						replacement: camelCase(controllerName),
						paths: [controllerPath],
						recursive: false,
						silent: true
					})

					console.log(
						chalk.green(
							`${filename} was successfully created at ${controllerPath}`
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
	generateController,
	getControllerByType,
	getCorrespondingControllerFileTypes
}
