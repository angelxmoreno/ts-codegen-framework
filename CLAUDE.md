# ts-codegen-framework Development Guidelines

## Project Overview
This is a TypeScript framework for zero-build CLI codegen with templates and config. It's built with TypeScript, `tsx` or Bun, and `eta` for flexibility, developer UX, and speed.

## Tech Stack
- CLI engine: Commander
- Template engine: Eta
- Runtime runner: tsx or Bun
- Config validation: Zod
- Package manager: Bun or pnpm
- Lint/format/test: Biome + Vitest or Bun test
- Path aliases: TypeScript `paths` config

## Development Commands
- Run CLI: `bun run bin/codegen` or `pnpm run bin/codegen`
- Lint: `bun run lint` (check biome.json for exact command)
- Test: `bun test` or test command in package.json
- Dev: Development mode with file watching
- Format: `bun run format` (Biome formatting)

## Directory Structure
```
ts-codegen-framework/
├── bin/codegen                   # CLI entry point
├── src/
│   ├── cli/                     # Commander CLI logic
│   ├── config/                  # Zod config schema + loader
│   ├── core/                    # Codegen pipeline (parse → transform → generate)
│   ├── template-loader/         # Eta template rendering & helpers
│   ├── templates/               # Built-in default templates
│   └── index.ts                 # Optional API entry
├── tests/                       # Unit tests
├── codegen.config.ts            # Sample user config file
└── init.sh                      # Bootstrapper script
```

## Development Phases & Implementation Order

### Phase 1: Basic Project Structure
- Initialize package.json with TypeScript, tsx/Bun, Commander, Eta, Zod dependencies
- Set up tsconfig.json with path aliases and modern TypeScript config
- Configure .biome.json for linting and formatting
- Create .gitignore with Node.js, TypeScript, and IDE exclusions
- Set up basic directory structure (`src/`, `tests/`, `bin/`)

### Phase 2: Core Infrastructure
- Create `src/core/types.ts` with base interfaces and types
- Implement `src/config/config.schema.ts` with Zod validation schemas
- Build `src/config/loadConfig.ts` for dynamic config loading and validation
- Create `bin/codegen` executable script with proper shebang and tsx execution

### Phase 3: Template System
- Implement `src/template-loader/TemplateLoader.ts` class
- Create `src/template-loader/helpers.ts` with utility functions (case conversion, string manipulation)
- Add sample template `src/templates/default/model.eta`

### Phase 4: Generation Pipeline
- Build `src/core/generator.ts` main generation engine
- Implement `src/core/parser.ts` (optional but recommended)
- Create `src/core/transformer.ts` (optional)

### Phase 5: CLI Interface
- Implement `src/cli/index.ts` with Commander.js
- Create `src/index.ts` as library entry point (optional API export)

## Code Guidelines
- No build step required - runs directly via `tsx` or `bun`
- Use Zod for config validation
- Follow TypeScript best practices with proper typing
- Avoid "any" type - use proper typing or "unknown"
- Use Number.isNaN instead of isNaN for type safety
- Template files use .eta extension for Eta templating engine
- Start small and iterate - begin with minimal working version
- Write tests alongside implementation for better design
- Use TypeScript strictly - leverage strong typing for better DX
- Focus on UX - prioritize clear error messages and intuitive CLI design

## CLI Commands to Implement
- `generate` command with options (config, templates, output directory, verbose/debug)
- `codegen init` command to scaffold user config and templates
- `codegen doctor` diagnostic command to validate config and templates
- `codegen list` command to show available templates

## Testing Strategy
- Unit tests for core codegen pipeline in `tests/core/`
- Unit tests for template loading and rendering in `tests/template-loader/`
- Integration tests for end-to-end CLI testing
- Template rendering with real data
- Test coverage target: >80%

## Project Goals
- Zero-build CLI tool development
- User-defined config (.ts) validated with Zod
- Support for user-provided templates
- Modern, lightweight template engine (Eta)
- Dev-friendly CLI via Commander
- GitHub-first distribution (not published to npm)

## Success Criteria
- Framework can be installed and run without build step
- Users can define custom configs and templates
- CLI provides helpful feedback and error messages
- Templates render correctly with provided context
- Project can be easily forked and customized
- Comprehensive test coverage (>80%)
- Complete documentation with working examples

## Distribution
- GitHub-hosted framework (not published to npm)
- Use `init.sh` to bootstrap new tools from this template
- Configure as GitHub template repository
- Set up GitHub Actions for testing and linting