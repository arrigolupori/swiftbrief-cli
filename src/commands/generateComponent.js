const {
	generateComponent,
	getComponentByType,
	getCorrespondingComponentFileTypes
} = require('../utils/generateComponentUtils')

function initGenerateComponentCommand(args, cliConfigFile, program) {
	const selectedComponentType = getComponentByType(args, cliConfigFile)

	const componentCommand = program
		.command('component [names...]')
		.alias('cm')

		.option(
			'-p, --path <path>',
			'The path where the component will get generated in.',
			`${selectedComponentType.path}`
		)

	const dynamicOptions = getCorrespondingComponentFileTypes(
		selectedComponentType
	)

	dynamicOptions.forEach((dynamicOption) => {
		componentCommand.option(
			`--${dynamicOption} <${dynamicOption}>`,
			`With corresponding ${dynamicOption.split('with')[1]} file.`,
			selectedComponentType[dynamicOption]
		)
	})

	componentCommand.action((componentNames, cmd) =>
		componentNames.forEach((componentName) =>
			generateComponent(componentName, cmd, cliConfigFile)
		)
	)
}

module.exports = {
	initGenerateComponentCommand
}
