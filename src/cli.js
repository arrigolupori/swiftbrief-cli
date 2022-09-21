const program = require('commander')
const pkg = require('../package.json')

const { initGenerateComponentCommand } = require('./commands/generateComponent')
const { initGenerateEndpointCommand } = require('./commands/generateEndpoint')

module.exports = async function cli(args) {
	initGenerateComponentCommand(
		args,
		{
			usesTypeScript: true,
			cssPreprocessor: 'scss',
			component: {
				default: {
					path: 'cli',
					withTest: true
				}
			}
		},
		program
	)

	initGenerateEndpointCommand(
		args,
		{
			usesTypeScript: true,
			endpoint: {
				default: {
					path: 'public'
				}
			}
		},
		program
	)

	program.version(pkg.version)
	program.parse(args)
}
