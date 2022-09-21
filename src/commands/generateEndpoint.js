const {
	generateEndpoint,
	getEndpointByType,
	getCorrespondingEndpointFileTypes
} = require('../utils/generateEndpointUtils')

function initGenerateEndpointCommand(args, cliConfigFile, program) {
	const selectedEndpointType = getEndpointByType(args, cliConfigFile)

	const endpointCommand = program
		.command('endpoint [names...]')
		.alias('en')

		.option(
			'-p, --path <path>',
			'The path where the component will get generated in.',
			`${selectedEndpointType.path}`
		)

	const dynamicOptions = getCorrespondingEndpointFileTypes(selectedEndpointType)

	dynamicOptions.forEach((dynamicOption) => {
		endpointCommand.option(
			`--${dynamicOption} <${dynamicOption}>`,
			`With corresponding ${dynamicOption.split('with')[1]} file.`,
			selectedEndpointType[dynamicOption]
		)
	})

	endpointCommand.action((endpointNames, cmd) =>
		endpointNames.forEach((endpointName) =>
			generateEndpoint(endpointName, cmd, cliConfigFile)
		)
	)
}

module.exports = {
	initGenerateEndpointCommand
}
