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
			usesCssModule: false,
			cssPreprocessor: 'scss',
			testLibrary: 'None',
			component: {
				default: {
					path: 'cli',
					withStyle: false,
					withTest: true,
					withStory: false,
					withLazy: false
				}
			}
		},
		program
	)

	program.version(pkg.version)
	program.parse(args)
}
