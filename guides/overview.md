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

* **`src/index.ts`** – Optional library entry point if exposing an API

#### `src/cli/`

* **`index.ts`** – Defines CLI structure using Commander

#### `src/config/`

* **`config.schema.ts`** – Zod schema to validate the config
* **`loadConfig.ts`** – Dynamically loads and validates the config file

#### `src/core/`

* **`parser.ts`** – Optional input parser for JSON, TypeScript, or other sources
* **`transformer.ts`** – Optional transformation of parsed input to template context
* **`generator.ts`** – Renders templates and writes output files
* **`types.ts`** – Shared types for config, context, generation, etc.

#### `src/template-loader/`

* **`TemplateLoader.ts`** – Utility to render Eta templates
* **`helpers.ts`** – Template helper functions (e.g., case conversion)

#### `src/templates/`

* **`default/model.eta`** – Sample default Eta template to demonstrate usage

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

## ✅ Optional Enhancements

* [ ] GitHub Actions: `lint.yml`, `test.yml`
* [ ] README badges
* [ ] `codegen init` command to scaffold user config/templates
* [ ] `codegen doctor` to validate template paths, helpers
* [ ] Add plugin loader support
* [ ] Publish as a GitHub template repo

---

## 📝 License

MIT
