const program = require('commander')

const pkg = require('../package.json')
const { initGenerateComponentCommand } = require('./commands/generateComponent')

module.exports = async function cli(args) {
	// Initialize generate component command

	initGenerateComponentCommand(
		args,
		// Config file is hardcoded for now
		{
			usesTypeScript: true,
			cssPreprocessor: 'scss',
			component: {
				default: {
					path: 'cli',
					withStyle: false,
					withTest: true
				}
			}
		},
		program
	)

	program.version(pkg.version)
	program.parse(args)
}
