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

---

## 📁 Directory Structure

```
ts-codegen-framework/
├── bin/
│   └── codegen                  # CLI entry (#!/usr/bin/env tsx or bun)
├── src/
│   ├── cli/                    # Commander CLI logic
│   │   └── index.ts
│   ├── config/                 # Zod config schema + loader
│   │   ├── config.schema.ts
│   │   └── loadConfig.ts
│   ├── core/                   # Codegen pipeline (parse → transform → generate)
│   │   ├── parser.ts
│   │   ├── transformer.ts
│   │   ├── generator.ts
│   │   └── types.ts
│   ├── template-loader/        # Eta template rendering & helpers
│   │   ├── TemplateLoader.ts
│   │   └── helpers.ts
│   ├── templates/              # Built-in default templates
│   │   └── default/
│   │       └── model.eta
│   └── index.ts                # Optional API entry
├── tests/
│   ├── core/
│   └── template-loader/
├── codegen.config.ts           # Sample user config file
├── init.sh                     # Bootstrapper script
├── .gitignore
├── .biome.json
├── tsconfig.json
├── package.json
├── README.md
```

---

## 🔧 Required Files to Implement

### 1. `bin/codegen`

```ts
#!/usr/bin/env bun
// Or use tsx: #!/usr/bin/env tsx
import '../src/cli/index.ts';
```

### 2. `src/cli/index.ts`

```ts
import { Command } from 'commander';
import { loadConfig } from '../config/loadConfig';
import { generate } from '../core/generator';

const program = new Command();
program
  .name('codegen')
  .description('Generate files from templates')
  .action(async () => {
    const config = await loadConfig();
    await generate(config);
  });

program.parse();
```

### 3. `src/config/loadConfig.ts`

```ts
import { z } from 'zod';
import { configSchema } from './config.schema';

export async function loadConfig() {
  const userConfig = await import(process.cwd() + '/codegen.config.ts');
  return configSchema.parse(userConfig.default || userConfig);
}
```

### 4. `src/template-loader/TemplateLoader.ts`

```ts
import { renderFile } from 'eta';
import { join } from 'path';

export async function renderTemplate(templatePath: string, data: any): Promise<string> {
  return renderFile(templatePath, data, { views: [process.cwd()] }) as Promise<string>;
}
```

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

### Run (Bun)

```bash
bun run bin/codegen
```

### Or Run with pnpm/tsx

```bash
pnpm install
pnpm exec tsx bin/codegen
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
