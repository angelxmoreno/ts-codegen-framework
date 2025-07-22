# ts-codegen-framework

**TypeScript framework for zero-build CLI codegen with templates and config.**

This project is a GitHub-hosted framework for building CLI tools that generate code using customizable templates. It's built with TypeScript, `tsx` or Bun, and `eta` for flexibility, developer UX, and speed.

---

## 🎯 Goals

* No build step required (runs directly via `tsx` or `bun`)
* User-defined config (`.ts`) validated with Zod
* Support for user-provided templates
* Modern, lightweight template engine (Eta)
* Dev-friendly CLI via Commander
* GitHub-first distribution (not published to npm)
* Optional `init.sh` to rename & bootstrap new tools

---

## 🧱 Tech Stack

| Purpose              | Tool                       |
| -------------------- | -------------------------- |
| CLI engine           | Commander                  |
| Template engine      | Eta                        |
| Runtime runner       | tsx or Bun                 |
| Config validation    | Zod                        |
| Package manager      | Bun or pnpm                |
| Lint/format/test     | Biome + Vitest or Bun test |
| Optional init script | Shell (`init.sh`)          |
| Path aliases         | TypeScript `paths` config  |

---

## 📁 Files & Purpose

### Top-level

* **`bin/codegen`** – CLI entry point; uses `tsx` to execute the CLI source
* **`codegen.config.ts`** – Example config file for a codegen project
* **`init.sh`** – Shell script to rename & bootstrap this template into a new CLI repo
* **`.biome.json`** – Biome configuration (linting/formatting)
* **`.gitignore`**, `README.md`, `package.json`, `tsconfig.json` – Project metadata and tooling config

### `src/`

* **`src/index.ts`** – *(Removed)* Library entry not needed for CLI-focused tool

#### `src/cli/`

* **`index.ts`** – Defines CLI structure using Commander

#### `src/config/`

* **`config.schema.ts`** – Zod schema to validate the config
* **`defaultConfig.ts`** – Default configuration values
* **`templateContext.ts`** – TemplateContext generation for queue/job processing
* **`templates/`** – Built-in template files
  * **`common.ts.eta`** – Common types and utilities
  * **`producers.ts.eta`** – Job producer functions  
  * **`queues.ts.eta`** – Queue definitions
  * **`workers.ts.eta`** – Worker implementations

#### `src/core/`

* **`loadConfig.ts`** – Dynamically loads and validates config files
* **`generator.ts`** – Main generation engine that renders templates and writes output files
* **`errors.ts`** – Custom error classes for better error handling

#### `src/template-loader/`

* **`TemplateLoader.ts`** – Eta template rendering utility with discovery and caching
* **`types.ts`** – Template-related type definitions and exports

#### `src/utils/`

* **`createLogger.ts`** – Logging utility for consistent output across the framework

### `tests/`

* **`core/`** – Unit tests for codegen pipeline
* **`template-loader/`** – Unit tests for template loading and rendering

---

## 🚀 Usage

### Bootstrap New CLI Tool (Bun preferred)

```bash
bunx degit yourname/ts-codegen-framework my-cli
cd my-cli
bun install
chmod +x init.sh
./init.sh my-cli
```

### Run

```bash
bun run bin/codegen
# or
pnpm run bin/codegen
# or
chmod +x bin/codegen
./bin/codegen
```

---

## 🏗️ Architecture Decisions

### Template Path Management
- **Single Source of Truth**: Template paths defined only in `TemplateLoader.createTemplateLoader()`
- **No Duplication**: Generator delegates template discovery to TemplateLoader
- **User Override Support**: CLI can override template directories via `-t` flag

### Simplified Generation Pipeline
- **Direct Flow**: Config → Template Context → Template Rendering
- **No Parser/Transformer**: Skipped complex abstraction layers for simplicity
- **Eta Templates**: Lightweight template engine with minimal overhead

### File Organization
- **Built-in Templates**: Moved to `src/config/templates/` for logical grouping
- **Configuration Co-location**: Config schema, defaults, and context creation in `src/config/`
- **Modular Structure**: Clear separation between CLI, core logic, and template handling

---

## ✅ Optional Enhancements

* [ ] GitHub Actions: `lint.yml`, `test.yml`
* [ ] README badges
* [ ] `codegen init` command to scaffold user config/templates
* [ ] `codegen doctor` to validate template paths, TemplateContext generation
* [ ] Add plugin loader support
* [ ] Publish as a GitHub template repo

---

## 📝 License

MIT
