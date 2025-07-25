# V2 Vision: Installable CodegenFramework

> **Note**: This is a future vision document for v2. The current v1 implementation uses a template-based approach where users fork/copy the repository.

## Overview

The v2 vision transforms this from a template-based framework into an installable npm package with a pluggable `CodegenFramework` class. Users would install the package and define their own schemas, templates, and context transformers.

## Current vs Future Architecture

### V1 (Current): Template Approach
```bash
# User forks/copies the entire repository
git clone template-repo my-codegen-project
# Modifies framework internals directly
# Publishes their own customized framework
```

### V2 (Future): Installable Framework
```bash
# User installs as dependency
npm install ts-codegen-framework
# Defines config and extensions in their project
# Framework provides base functionality
```

## Core API Design

### CodegenFramework Class

```typescript
import { CodegenFramework } from 'ts-codegen-framework';
import { z } from 'zod';

// User defines their domain schema
const APISchema = z.object({
  endpoints: z.array(z.object({
    path: z.string(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
    params: z.record(z.string()).optional(),
    response: z.object({
      type: z.string(),
      properties: z.record(z.any())
    })
  })),
  baseUrl: z.string(),
  version: z.string()
});

// Initialize framework with user configuration
const framework = new CodegenFramework({
  // Schema definition
  schema: APISchema,
  
  // Template configuration
  templatePaths: ['./templates', './custom-templates'],
  templateExtension: '.eta',
  
  // Context transformation
  contextTransformer: (config) => ({
    ...config,
    endpoints: config.endpoints.map(endpoint => ({
      ...endpoint,
      methodName: `${endpoint.method.toLowerCase()}${endpoint.path.replace(/[\/\-]/g, '')}`,
      returnType: endpoint.response.type
    })),
    generatedAt: new Date().toISOString()
  }),
  
  // Output configuration
  outputPath: './generated',
  outputStrategy: 'clean', // 'clean' | 'merge' | 'preserve'
  
  // Plugin system
  plugins: [
    new TypeScriptPlugin(),
    new ValidatorPlugin(),
    new DocumentationPlugin()
  ]
});

// Generate code
await framework.generate('./api-config.ts');
```

## Plugin System Architecture

### Core Interfaces

```typescript
interface CodegenPlugin {
  name: string;
  hooks: {
    beforeGeneration?: (context: any) => any;
    afterGeneration?: (files: GeneratedFile[]) => GeneratedFile[];
    beforeFileWrite?: (file: GeneratedFile) => GeneratedFile;
  };
}

interface ContextTransformer<TSchema = any, TContext = any> {
  (config: TSchema): TContext;
}

interface TemplateResolver {
  resolveTemplate(templateName: string, templatePaths: string[]): string;
  loadTemplate(templatePath: string): string;
}

interface SchemaValidator<TSchema = any> {
  validate(input: unknown): TSchema;
  getSchema(): any; // Zod schema or similar
}
```

### Built-in Plugins

```typescript
// TypeScript generation plugin
const typescriptPlugin = new TypeScriptPlugin({
  generateInterfaces: true,
  generateEnums: true,
  outputFile: 'types.ts'
});

// Validation plugin
const validationPlugin = new ValidationPlugin({
  library: 'zod', // 'zod' | 'joi' | 'yup'
  outputFile: 'validators.ts'
});

// Documentation plugin
const docsPlugin = new DocumentationPlugin({
  format: 'markdown', // 'markdown' | 'html' | 'json'
  outputFile: 'README.md'
});
```

## Usage Examples

### REST API Client Generator

```typescript
const APIClientFramework = new CodegenFramework({
  schema: z.object({
    openApiSpec: z.string().url(),
    clientName: z.string(),
    outputFormat: z.enum(['axios', 'fetch', 'node-fetch'])
  }),
  
  contextTransformer: async (config) => {
    const spec = await loadOpenAPISpec(config.openApiSpec);
    return {
      clientName: config.clientName,
      endpoints: parseEndpoints(spec),
      models: extractModels(spec),
      baseUrl: spec.servers[0].url
    };
  },
  
  templatePaths: ['./templates/api-client'],
  outputPath: `./src/clients/${config.clientName}`
});
```

### Database Model Generator

```typescript
const DatabaseFramework = new CodegenFramework({
  schema: z.object({
    tables: z.array(z.object({
      name: z.string(),
      columns: z.array(z.object({
        name: z.string(),
        type: z.string(),
        nullable: z.boolean().default(false),
        primaryKey: z.boolean().default(false)
      })),
      relationships: z.array(z.object({
        type: z.enum(['hasMany', 'belongsTo', 'manyToMany']),
        target: z.string()
      })).default([])
    }))
  }),
  
  contextTransformer: (config) => ({
    models: config.tables.map(table => ({
      className: pascalCase(table.name),
      tableName: table.name,
      properties: table.columns.map(col => ({
        name: camelCase(col.name),
        type: mapDbTypeToTS(col.type),
        optional: col.nullable
      })),
      relations: table.relationships
    }))
  }),
  
  plugins: [
    new TypeORMPlugin(),
    new PrismaPlugin(),
    new ValidationPlugin()
  ]
});
```

### Component Library Generator

```typescript
const ComponentFramework = new CodegenFramework({
  schema: z.object({
    components: z.array(z.object({
      name: z.string(),
      props: z.record(z.object({
        type: z.string(),
        required: z.boolean().default(false),
        default: z.any().optional()
      })),
      variants: z.array(z.string()).default([])
    })),
    framework: z.enum(['react', 'vue', 'svelte'])
  }),
  
  contextTransformer: (config) => ({
    components: config.components.map(comp => ({
      name: comp.name,
      fileName: kebabCase(comp.name),
      propsInterface: `${comp.name}Props`,
      hasVariants: comp.variants.length > 0,
      variantUnion: comp.variants.map(v => `'${v}'`).join(' | ')
    })),
    isReact: config.framework === 'react',
    isVue: config.framework === 'vue'
  }),
  
  templatePaths: [`./templates/${config.framework}`]
});
```

## Migration Path from V1 to V2

### Phase 1: Backward Compatibility Layer
```typescript
// V1 users can still use template approach
const framework = CodegenFramework.fromTemplate({
  templatePath: './existing-v1-project',
  configPath: './codegen.config.ts'
});
```

### Phase 2: Schema Migration
```typescript
// Helper to convert V1 configs to V2 format
const migratedFramework = CodegenFramework.migrate({
  from: './v1-project',
  schema: MyV2Schema,
  contextTransformer: (v1Config) => transformToV2(v1Config)
});
```

### Phase 3: Full V2 Adoption
Users gradually move to pure V2 approach with installable package.

## Technical Implementation Challenges

### 1. Type Safety with Generics

```typescript
class CodegenFramework<TSchema = any, TContext = any> {
  constructor(config: FrameworkConfig<TSchema, TContext>) {}
  
  async generate(configPath: string): Promise<void> {
    const userConfig: TSchema = await this.loadAndValidateConfig(configPath);
    const context: TContext = this.contextTransformer(userConfig);
    // ...
  }
}

// Usage maintains type safety
const framework = new CodegenFramework<APIConfig, APIContext>({
  schema: APISchema,
  contextTransformer: (config: APIConfig): APIContext => ({ ... })
});
```

### 2. Template Resolution

```typescript
interface TemplateResolver {
  // Resolve templates from multiple sources
  resolve(templateName: string): {
    path: string;
    content: string;
    metadata: TemplateMetadata;
  };
}

class MultiSourceTemplateResolver implements TemplateResolver {
  constructor(
    private sources: Array<'builtin' | 'npm-package' | 'local-file' | 'url'>
  ) {}
  
  resolve(templateName: string) {
    // Check sources in priority order
    for (const source of this.sources) {
      const template = this.tryResolve(templateName, source);
      if (template) return template;
    }
    throw new TemplateNotFoundError(templateName);
  }
}
```

### 3. Plugin Architecture

```typescript
class PluginManager {
  private plugins: CodegenPlugin[] = [];
  
  async executeHook<T>(hookName: keyof CodegenPlugin['hooks'], data: T): Promise<T> {
    let result = data;
    for (const plugin of this.plugins) {
      const hook = plugin.hooks[hookName];
      if (hook) {
        result = await hook(result);
      }
    }
    return result;
  }
}
```

## Implementation Phases

### Phase 1: Core Framework Class (2-3 weeks)
- [ ] Create `CodegenFramework` class with basic functionality
- [ ] Implement schema validation system
- [ ] Build context transformation pipeline
- [ ] Create plugin interface and manager

### Phase 2: Template System Refactor (2-3 weeks)
- [ ] Abstract template loading from current implementation
- [ ] Create multi-source template resolver
- [ ] Implement template caching and hot-reload
- [ ] Add template metadata and validation

### Phase 3: Plugin System (3-4 weeks)
- [ ] Design and implement hook system
- [ ] Create built-in plugins (TypeScript, validation, docs)
- [ ] Build plugin discovery and loading mechanism
- [ ] Add plugin configuration and dependency management

### Phase 4: CLI Integration (1-2 weeks)
- [ ] Extend Commander.js to work with CodegenFramework
- [ ] Add dynamic command registration from plugins
- [ ] Implement config file discovery and validation
- [ ] Create migration tools from V1

### Phase 5: Documentation & Examples (2-3 weeks)
- [ ] Complete API documentation
- [ ] Create example projects for common use cases
- [ ] Build interactive tutorial/playground
- [ ] Write migration guide from V1

### Phase 6: Testing & Polish (2-3 weeks)
- [ ] Comprehensive test suite
- [ ] Performance optimization
- [ ] Error handling and debugging tools
- [ ] Beta testing with real projects

## Benefits of V2 Architecture

### For Framework Users
- **Easier Setup**: Just `npm install` instead of forking
- **Updates**: Get framework improvements without merge conflicts
- **Type Safety**: Full TypeScript support with user schemas
- **Plugin Ecosystem**: Reuse community plugins
- **Multiple Projects**: One framework, many codegen projects

### For Framework Authors
- **Focused Development**: Core framework vs specific implementations
- **Community Contributions**: Plugin ecosystem
- **Easier Maintenance**: Breaking changes only affect major versions
- **Better Testing**: Isolated, testable components

### For Plugin Developers
- **Standard Interface**: Well-defined plugin API
- **Composability**: Plugins work together
- **Distribution**: npm package distribution
- **Documentation**: Clear plugin development guide

## Success Metrics

- **Adoption**: Migration from 80%+ of V1 template users
- **Ecosystem**: 20+ community plugins within 6 months
- **Performance**: Template generation 2x faster than V1
- **Developer Experience**: Setup time reduced from hours to minutes
- **Type Safety**: 100% type coverage in generated code

## Future Extensions (V3+)

- **Visual Editor**: GUI for schema and template editing
- **Cloud Templates**: Shared template marketplace
- **Real-time Generation**: Watch mode with instant regeneration
- **Multi-language**: Support for non-TypeScript targets
- **Enterprise Features**: Team collaboration, audit trails