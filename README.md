# ts-codegen-framework

A TypeScript framework for zero-build CLI codegen with templates and config. Built with TypeScript, `tsx`, and `eta` for flexibility, developer UX, and speed.

**What is this?** This is a framework for creating custom code generation tools. You clone/fork this repository to build your own specialized codegen CLI tools.

## 🎯 Three Ways to Use This Repository

### 1. 📦 Contributing to the Framework (This Repository)

If you want to improve the framework itself:

```bash
git clone https://github.com/angelxmoreno/ts-codegen-framework.git
cd ts-codegen-framework
bun install
./bin/codegen generate -c sample-app/codegen.config.ts -v
```

**Framework publishes to:** GitHub Packages (`@angelxmoreno/ts-codegen-framework`)

### 2. 🛠️ Creating Your Custom Codegen Tool

Use this framework as a starting point for your own codegen tool:

#### Option A: GitHub Template + Interactive Setup (⭐ Recommended)
1. Click "Use this template" → "Create a new repository"
2. Clone your new repository
3. **Run the setup script**: `./init.sh`
   - Automatically updates package.json with your info
   - Sets up publishing (npm/GitHub Packages/skip)
   - Cleans up framework-specific files
   - Optionally initializes fresh git repo
   - Installs dependencies and runs tests

```bash
git clone https://github.com/your-username/your-new-tool.git
cd your-new-tool
./init.sh  # 🎯 Interactive setup - sets up everything!
```

#### Option B: Manual Clone + Interactive Setup
```bash
git clone https://github.com/angelxmoreno/ts-codegen-framework.git my-custom-codegen
cd my-custom-codegen
./init.sh  # 🎯 Interactive setup - handles git init too!
```

#### Option C: Manual Setup (Advanced)
```bash
git clone https://github.com/angelxmoreno/ts-codegen-framework.git my-custom-codegen
cd my-custom-codegen
# Manually update package.json, setup publishing, etc.
rm -rf .git && git init
bun install
```

### 3. 🚀 Publishing Your Custom Tool

After creating your custom codegen tool, you can optionally publish it:

> **💡 Tip:** If you used `./init.sh`, publishing is already configured based on your choice!

#### To npm (Most Common)
- **If you used init.sh**: Just add `NPM_TOKEN` secret and create a release
- **Manual setup**: 
  1. Copy `.npmrc.template` to `.npmrc` (choose npm option)
  2. Copy `.github/workflows/publish-to-npm.yml.template` to `.github/workflows/publish-to-npm.yml`
  3. Update `package.json` with your tool's details
  4. Add `NPM_TOKEN` secret to your repository
  5. Create a release to auto-publish

#### To GitHub Packages  
- **If you used init.sh**: Publishing is already configured, just create a release
- **Manual setup**:
  1. Update `package.json` name to `@your-username/your-tool-name`
  2. Configure `.npmrc` for GitHub Packages
  3. Create a release to auto-publish

## 🎯 Interactive Setup Script (`init.sh`)

The `init.sh` script provides a guided setup experience for creating your custom codegen tool:

### ✨ What it does:
- **📝 Collects your info**: Tool name, author, email, GitHub username, description
- **📦 Updates package.json**: Automatically replaces framework placeholders with your details
- **🚀 Configures publishing**: Choose between npm, GitHub Packages, or skip
- **🧹 Cleans up**: Removes framework-specific files and templates
- **📋 Git setup**: Optionally initializes fresh repository with proper commit
- **🔧 Dependencies**: Installs packages and runs tests to verify setup

### 🚦 Usage:
```bash
./init.sh
```

The script is interactive and will guide you through each step. It's cross-platform compatible (macOS/Linux) and includes error handling and validation.

## CLI Commands

- `generate` - Generate code from configuration
  - `-c, --config <path>` - Path to config file (default: `./codegen.config.ts`)
  - `-o, --output <path>` - Output directory (overrides config outputPath)
  - `-t, --templates <paths...>` - Template directories (comma-separated)
  - `-v, --verbose` - Enable verbose logging

## 🔧 Customizing Your Codegen Tool

When creating your custom codegen tool, you'll typically modify:

### 1. Configuration Schema (`src/config/config.schema.ts`)
Define what configuration your tool accepts:
```typescript
export const ConfigSchema = z.object({
  // Define your custom configuration structure
  models: z.array(z.object({
    name: z.string(),
    fields: z.record(z.string())
  })),
  outputPath: z.string()
});
```

### 2. Template Context (`src/config/templateContext.ts`)
Transform your config into template variables:
```typescript
export const createTemplateContext = (config: Config) => ({
  models: config.models.map(model => ({
    ...model,
    className: pascalCase(model.name)
  })),
  timestamp: new Date().toISOString()
});
```

### 3. Templates (`src/config/templates/`)
Create your `.eta` template files:
```eta
// model.ts.eta
export interface <%= it.className %> {
<% it.fields.forEach(field => { %>
  <%= field.name %>: <%= field.type %>;
<% }) %>
}
```

### 4. Default Configuration (`src/config/defaultConfig.ts`)
Set sensible defaults for your tool.

### 5. Package Metadata
Update `package.json` with your tool's name, description, and repository info.

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

## 📁 Project Structure

```
ts-codegen-framework/
├── bin/codegen                              # CLI entry point
├── src/
│   ├── cli/                                # Commander CLI logic
│   ├── config/                             # Configuration system
│   │   ├── config.schema.ts               # Zod validation schema
│   │   ├── defaultConfig.ts               # Default configuration
│   │   ├── templateContext.ts             # Context transformation
│   │   └── templates/                     # Built-in templates
│   ├── core/                              # Generation pipeline
│   │   ├── generator.ts                   # Main generation engine
│   │   ├── loadConfig.ts                  # Configuration loading
│   │   └── errors.ts                      # Error definitions
│   ├── template-loader/                   # Template system
│   │   ├── TemplateLoader.ts              # Template loading/rendering
│   │   └── types.ts                       # Template interfaces
│   └── utils/                             # Utility functions
├── .github/workflows/                      # CI/CD workflows
│   ├── ci.yml                             # Testing and validation
│   ├── publish.yml                        # Framework publishing
│   └── publish-to-npm.yml.template        # User publishing template
├── sample-app/                            # Example usage
├── tests/                                 # Unit tests
├── .npmrc.template                        # npm configuration template
└── guides/                                # Documentation
```

## 🔄 Making Your Tool a Template

If you want others to use your custom tool as a template:

1. Go to your GitHub repository settings
2. Check "Template repository" under General settings
3. Others can click "Use this template" to create new projects

## 🤝 Contributing to the Framework

We welcome contributions to improve the framework itself!

### Development Setup
```bash
git clone https://github.com/angelxmoreno/ts-codegen-framework.git
cd ts-codegen-framework
bun install
```

### Development Commands
- **Test CLI**: `./bin/codegen generate -c sample-app/codegen.config.ts -v`
- **Run tests**: `bun test`
- **Lint**: `bun run lint`
- **Type check**: `bun run check-types`

### Contribution Process
1. Fork this repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes and add tests
4. Run all checks: `bun run lint && bun run check-types && bun test`
5. Commit using conventional commits: `git commit -m "feat: add your feature"`
6. Push and create a Pull Request

### Publishing Framework Updates
Framework updates are automatically published to GitHub Packages when releases are created.

## 🚀 Future Vision (V2)

See `guides/v2-installable-framework.md` for our vision of making this an installable npm package with a pluggable `CodegenFramework` class.

## 📄 License

MIT License - see the LICENSE file for details.