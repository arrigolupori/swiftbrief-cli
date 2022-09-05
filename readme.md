*(Fork of [Generate React CLI](https://github.com/arminbro/generate-react-cli/))*
# Swiftbrief CLI

![Swiftbrief logo](https://swiftbrief-cms.nyc3.digitaloceanspaces.com/941f6eb99c5298036be645af1111c3ab.png?updated_at=2022-08-19T16:50:47.645Z)

> **Warning:** Even though the package is public, the way it is structured is *only* meant to work within Swiftbrief's v1.3 codebase. If you landed on this page and you're not part of Swiftbrief, this package isn't going to help you. It's a simple fork of [Generate React CLI](https://github.com/arminbro/generate-react-cli/) that adds a few rules and constraints.

Install the CLI as a developer dependency:

```
  yarn add -D @swiftbriefapp/cli
```

## The `generate` CLI

`yarn generate` is the basis of the Swiftbrief CLI:

```
  yarn generate <command> <name> <option>
```

With it, you can use various commands to generate files.

### Commands

There are 3 main commands for the Swiftbrief CLI:

<table>
  <tr align="left">
    <th>Command</th>
    <th>Description</th>
  </tr>
  <tr>
    <td width="20%"><b>component|cm</b></td>
    <td width="60%">
      Generate a React component under `/src/ui/components`.  
    </td>
  </tr>

  <tr>
    <td width="20%"><b>controller|cn</b></td>
    <td width="60%">
      Generate a Next controller under `/src/server/controllers`.
    </td>
  </tr>

  <tr>
    <td width="20%"><b>endpoint|en</b></td>
    <td width="60%">
      Generate an API endpoint under `/src/pages/api`.
    </td>
  </tr>

</table>

### Options

Some of the options available are:

<table>
  <tr align="left">
    <th>Option</th>
    <th>Description</th>
    <th>Value type</th>
    <th>Default value</th>
  </tr>
  <tr>
    <td width="20%"><b>--path</b></td>
    <td width="60%">
      Name of the sub-path where you want the component to be generated in (e.g. `modals`). This will be added at the end of the base directories shown in the commands table (e.g. `/src/ui/components/modals`). If the directory does not exist, it will be created automatically.
    </td>
    <td width="20%">String</td>
    <td width="20%"><code>component.default.path<code></td>
  </tr>
</table>

The commands and options above are subject to change, communicated internally.

### File structure

Swiftbrief has a set file structure.

There is no need for any configuration files.

All file templates are set directly in the package itself.

This is where you should expect files to appear:

```
|-- /src
    |-- /ui
        |-- /components
            |-- /Box
                |-- index.tsx
                |-- Box.cy.tsx
    |-- /server
        |-- /controllers
            |-- /brief
                |-- index.ts
                |-- brief.jest.ts
    |-- /pages
        |-- /api
            |-- /brief
                |-- index.ts
                |-- [id].ts
```

This structure must not be changed to preserve code reusability.

## File templates

You can find all file templates under `src/templates`.

Currently, the Swiftbrief CLI features 3 generators:

1. Components
2. Controllers
3. Endpoints

Each template features a unique folder structure.

**Important:**

Templates shouldn't be updated often.

If they are updated, changes should be communicated internally and reflected on this README.

### The `component` template

Components are the main unit of Swiftbrief's UI.

They are built using React, and are tested with [Cypress Component Testing](https://docs.cypress.io/guides/component-testing/writing-your-first-component-test).

You can generate a new component folder like this:

`yarn generate cm MyTable --path "tables"`

This will generate a `MyTable` folder with 2 files:

1. index.tsx
2. MyTable.cy.tsx

The component itself lives in the `index.tsx` file, which is named "index" as a self-reference.

Here's what each file will look like once generated:

#### The `index.tsx` file

Swiftbrief uses [Chakra UI](https://chakra-ui.com/) as its frontend UI library.

Because of this, our template React files include a few related imports:

```
import { Box, BoxProps, forwardRef } from '@chakra-ui/react'
export interface MyTableProps extends BoxProps {
	name: string
}
export const MyTable = forwardRef<MyTableProps, 'div'>(
	(props, ref): any => {
		console.log('MyTable')
		return (
			<Box data-testid='MyTable' ref={ref}>
				{props.name}
			</Box>
		)
	}
)
```

You will notice a few things:

- A `MyTableProps` interface is defined extending a `BoxProps` type from Chakra UI
- A `forwardRef` function wraps the component, taking `MyTableProps` as its type and passing `props` and `ref` as arguments
- The `data-testid='MyTable'` and `ref={ref}` attributes are set up at the highest level `<Box>` component
- Props are passed to the component using a global `props` object rather than directly

All of these peculiarities are by design.

**»** The interface gives us an easy way to extend the component's props based on Chakra UI's types.

There are many types of Chakra UI props, not just `BoxProps`.

You can see a full list of components [here](https://chakra-ui.com/docs/components).

**»** The `forwardRef` makes the specified Chakra props available to the new custom component.

For example:

<MyTable name='MyTable' marginTop='2em' />

See how `marginTop` isn't specified anywhere in our interface.

But it's part of [Chakra UI's BoxProps type](https://chakra-ui.com/docs/components/box), allowing our custom components flexibility over styling and state.

**»** The `data-testid='MyTable'` allows us to reference our component in tests.

This is useful if there aren't any easy ways to get a component using default assertions (rare).

**»** The `ref={ref)` tells the `forwardRef` function on which component to spread the props that we passed as a type (`<MyTableProps, "div">`).

This matters as because we can pass `ref` to a lower-level component rather than the highest one if we want to enforce some higher-level styling or state, disallowing the use of any additional props at the highest level for that specific custom component.

**»** The `props` object cleans the code up rather than duplicating our interface.

Although typing `props` every time can be tedious, we find it a better alternative to typing interface definitions and props twice.

#### The `MyTable.cy.tsx` file

Cypress uses Mocha under the hood, not Jest.

However, it uses its own [assertion library](https://docs.cypress.io/guides/references/assertions#Chai) on top of Mocha.

It also doesn't require any imports to function correctly (as long as the file is named *.cy.*):

```
import { MyTable } from '.'

describe('MyTable', () =>
	it('mounts', () => cy.mount(<MyTable name='MyTable' />)))
```

This is the simplest test possible.

It checks that the component is mounting correctly.

### The `controller` template

...

### The `endpoint` template

...

## License

Generate React CLI is open source software [licensed as MIT](https://github.com/arminbro/generate-react-cli/blob/master/LICENSE).
