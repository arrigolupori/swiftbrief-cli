const {
	generateController,
	getControllerByType,
	getCorrespondingControllerFileTypes
} = require('../utils/generateControllerUtils')

function initGenerateControllerCommand(args, cliConfigFile, program) {
	const selectedControllerType = getControllerByType(args, cliConfigFile)

	const controllerCommand = program
		.command('controller [names...]')
		.alias('cn')

		.option(
			'-p, --path <path>',
			'The path where the component will get generated in.',
			`${selectedControllerType.path}`
		)

	const dynamicOptions = getCorrespondingControllerFileTypes(
		selectedControllerType
	)

	dynamicOptions.forEach((dynamicOption) => {
		controllerCommand.option(
			`--${dynamicOption} <${dynamicOption}>`,
			`With corresponding ${dynamicOption.split('with')[1]} file.`,
			selectedControllerType[dynamicOption]
		)
	})

	controllerCommand.action((controllerNames, cmd) =>
		controllerNames.forEach((controllerName) =>
			generateController(controllerName, cmd, cliConfigFile)
		)
	)
}

module.exports = {
	initGenerateControllerCommand
}
