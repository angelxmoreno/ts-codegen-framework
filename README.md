# ts-codegen-framework

A TypeScript framework for zero-build CLI codegen with templates and config. Built with TypeScript, `tsx`, and `eta` for flexibility, developer UX, and speed.

## Installation

```bash
bun install
```

## Usage

Generate code from configuration:

```bash
./bin/codegen generate -c codegen.config.ts -v
```

Or run directly with bun:

```bash
bun run src/cli/index.ts generate -c codegen.config.ts -v
```

## CLI Commands

- `generate` - Generate code from configuration
  - `-c, --config <path>` - Path to config file (default: `./codegen.config.ts`)
  - `-o, --output <path>` - Output directory (overrides config outputPath)
  - `-t, --templates <paths...>` - Template directories (comma-separated)
  - `-v, --verbose` - Enable verbose logging

## Getting Started

1. Use degist and run init
2. Modify `src/config/config.schema.ts` and define your config
3. Update the default config `src/config/defaultConfig.ts`
4. Create your templates in `src/config/templates/` or user `templates/` directory
5. Run `./bin/codegen generate` to generate your code

## Adding New Templates

To add new templates to the framework, you'll need to update the following files:

### Template Files
- **`src/config/templates/`** - Add your new `.eta` template files here
  - Example: `new-feature.ts.eta` for generating TypeScript files
  - Template naming: `{outputFileName}.eta` (e.g., `api.ts.eta` → `api.ts`)

### Configuration Schema
- **`src/config/config.schema.ts`** - Update the Zod schema to include new configuration options
  - Add new fields that your templates will use
  - Define validation rules for template-specific config

### Template Context
- **`src/config/templateContext.ts`** - Update context creation logic
  - Add new data transformations for your templates
  - Include new computed values that templates need

### Default Configuration
- **`src/config/defaultConfig.ts`** - Add sensible defaults for new config options
  - Provide default values for new template configurations
  - Ensure the framework works out-of-the-box

The template system automatically discovers `.eta` files in configured directories, so no additional registration is required for new templates.