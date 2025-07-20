# ts-codegen-framework Tasks

## 🎯 Project Setup & Foundation

### Phase 1: Basic Project Structure
- [X] Initialize package.json with TypeScript, tsx/Bun, Commander, Eta, Zod dependencies
- [X] Set up tsconfig.json with path aliases and modern TypeScript config
- [X] Configure .biome.json for linting and formatting
- [X] Create .gitignore with Node.js, TypeScript, and IDE exclusions
- [X] Set up basic directory structure (`src/`, `tests/`, `bin/`)

### Phase 2: Core Infrastructure
- [ ] Create `src/core/types.ts` with base interfaces and types
- [X] Implement `src/config/config.schema.ts` with Zod validation schemas
- [X] Build `src/config/loadConfig.ts` for dynamic config loading and validation
- [X] Create `bin/codegen` executable script with proper shebang and tsx execution

---

## 🧱 Core Implementation

### Phase 3: Template System
- [X] Implement `src/template-loader/TemplateLoader.ts` class
    - [X] Initialize Eta engine with custom configuration
    - [X] Load templates from file system or user-defined paths
    - [ ] Handle template caching
    - [X] Handle template error handling
- [X] Create `src/template-loader/templateContext.ts` with TemplateContext generation
    - [X] TemplateContext interface for queue/job processing
    - [X] Pre-computed naming functions (producer, processor, worker)
    - [X] createTemplateContextFromConfig function
- [ ] Add sample template `src/templates/default/model.eta`

### Phase 4: Generation Pipeline
- [ ] Build `src/core/generator.ts` main generation engine
    - [ ] Integrate TemplateLoader for rendering
    - [ ] File system operations (read/write/create directories)
    - [X] Template context preparation using createTemplateContextFromConfig
    - [ ] Error handling and validation
- [ ] Implement `src/core/parser.ts` (optional but recommended)
    - [ ] JSON input parsing
    - [ ] TypeScript AST parsing (if needed)
    - [ ] Generic input validation
- [ ] Create `src/core/transformer.ts` (optional)
    - [ ] Transform parsed input to template-ready context
    - [ ] Data normalization and enrichment

### Phase 5: CLI Interface
- [ ] Implement `src/cli/index.ts` with Commander.js
    - [ ] Define main command structure
    - [ ] Add `generate` command with options
    - [ ] Implement config file path option (`-c, --config`)
    - [ ] Add template path option (`-t, --templates`)
    - [ ] Include output directory option (`-o, --output`)
    - [ ] Add verbose/debug flags
- [ ] Create `src/index.ts` as library entry point (optional API export)

---

## 🧪 Testing & Quality

### Phase 6: Test Suite
- [ ] Set up Vitest or Bun test configuration
- [ ] Write unit tests for `tests/core/`
    - [ ] Test config loading and validation
    - [ ] Test generator functionality
    - [ ] Test parser and transformer (if implemented)
- [ ] Write unit tests for `tests/template-loader/`
    - [ ] Test template loading and rendering
    - [ ] Test TemplateContext generation and naming functions
    - [ ] Test error scenarios
- [ ] Create integration tests
    - [ ] End-to-end CLI testing
    - [ ] Template rendering with real data

### Phase 7: Example & Documentation
- [ ] Create comprehensive `codegen.config.ts` example
    - [ ] Show all configuration options
    - [ ] Include multiple template examples
    - [ ] Demonstrate input/output mappings
- [ ] Add more sample templates in `src/templates/`
    - [ ] Component template example
    - [ ] API endpoint template
    - [ ] Type definition template
- [ ] Write detailed README with usage examples

---

## 🛠️ Tooling & Scripts

### Phase 8: Development Experience
- [ ] Create `init.sh` bootstrap script
    - [ ] Rename project references
    - [ ] Update package.json name and description
    - [ ] Initialize git repository
    - [ ] Clean up template-specific files
- [ ] Add package.json scripts
    - [ ] `dev`: Development mode with file watching
    - [ ] `build`: Type checking and validation
    - [ ] `test`: Run test suite
    - [ ] `lint`: Biome linting
    - [ ] `format`: Biome formatting
- [ ] Make `bin/codegen` executable and test cross-platform compatibility

---

## ✨ Enhanced Features

### Phase 9: Advanced CLI Commands
- [ ] Implement `codegen init` command
    - [ ] Scaffold user config file
    - [ ] Create template directory structure
    - [ ] Generate example templates
- [ ] Add `codegen doctor` diagnostic command
    - [ ] Validate config file syntax
    - [ ] Check template file existence
    - [ ] Verify TemplateContext generation works correctly
    - [ ] Test template compilation
- [ ] Create `codegen list` command to show available templates

### Phase 10: Plugin System (Future Enhancement)
- [ ] Design plugin loader architecture
- [ ] Create plugin interface/contract
- [ ] Implement plugin discovery and loading
- [ ] Add plugin lifecycle hooks
- [ ] Document plugin development guide

---

## 🚀 Distribution & CI/CD

### Phase 11: GitHub Integration
- [ ] Set up GitHub Actions workflows
    - [ ] `.github/workflows/test.yml` - Run tests on PR/push
    - [ ] `.github/workflows/lint.yml` - Code quality checks
- [ ] Configure as GitHub template repository
- [ ] Add repository topics and description
- [ ] Create comprehensive release process

### Phase 12: Documentation & Polish
- [ ] Add README badges (build status, license, version)
- [ ] Create CONTRIBUTING.md guidelines
- [ ] Add LICENSE file (MIT)
- [ ] Write CHANGELOG.md template
- [ ] Create issue and PR templates

---

## 📋 Validation Checklist

### Final Phase: Quality Assurance
- [ ] **Functionality Testing**
    - [ ] CLI commands work correctly
    - [ ] Template rendering produces expected output
    - [ ] Config validation catches errors appropriately
    - [ ] Error messages are helpful and clear
- [ ] **Developer Experience**
    - [ ] Installation process is smooth
    - [ ] Documentation is comprehensive and accurate
    - [ ] Examples work out of the box
    - [ ] TypeScript types are exported properly
- [ ] **Performance & Reliability**
    - [ ] Large template sets render efficiently
    - [ ] Memory usage is reasonable
    - [ ] Error handling is robust
    - [ ] Cross-platform compatibility verified

---

## 💡 Implementation Tips

1. **Start Small**: Begin with a minimal working version, then iterate
2. **Test Early**: Write tests alongside implementation for better design
3. **Use TypeScript Strictly**: Leverage strong typing for better DX
4. **Document as You Go**: Keep examples and docs updated with code changes
5. **Focus on UX**: Prioritize clear error messages and intuitive CLI design

---

## 🎯 Success Criteria

- [ ] Framework can be installed and run without build step
- [ ] Users can define custom configs and templates
- [ ] CLI provides helpful feedback and error messages
- [ ] Templates render correctly with provided context
- [ ] Project can be easily forked and customized
- [ ] Comprehensive test coverage (>80%)
- [ ] Complete documentation with working examples