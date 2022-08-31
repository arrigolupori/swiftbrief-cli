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

  <tr>
    <td width="20%"><b>--dry-run</b></td>
    <td width="60%">
      Show what will be generated without writing to disk
    </td>
    <td width="20%">Boolean</td>
    <td width="20%"><code>false<code></td>
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

## License

Generate React CLI is open source software [licensed as MIT](https://github.com/arminbro/generate-react-cli/blob/master/LICENSE).