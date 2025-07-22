import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createTemplateContextFromConfig, type TemplateContext } from '@config/templateContext';
import { type ConfigWithPath, loadConfig } from '@core/loadConfig';
import { createTemplateLoader } from '../template-loader/TemplateLoader';
import logger from '../utils/createLogger';
import { TemplateRenderError, TemplateWriteError } from './errors';

export interface GenerateOptions {
    configPath?: string;
    outputPath?: string;
    templateDirs?: string[];
    verbose?: boolean;
}

/**
 * Main code generation engine
 */
export class CodeGenerator {
    protected config: ConfigWithPath | null = null;
    protected templateLoader: ReturnType<typeof createTemplateLoader> | null = null;
    protected options: GenerateOptions = {};

    constructor(options: GenerateOptions = {}) {
        this.options = options;
    }

    /**
     * Generate all files from config
     */
    async generate(): Promise<void> {
        try {
            // Load and validate config
            await this.loadConfiguration();
            if (!this.config) throw new Error('Config not loaded');

            // Initialize template loader
            this.initializeTemplateLoader();
            if (!this.templateLoader) throw new Error('Template loader not initialized');

            // Create template context with resolved paths
            const context = createTemplateContextFromConfig(this.config);

            // Ensure output directory exists
            const outputDir = this.config.outputPath || process.cwd();
            await mkdir(outputDir, { recursive: true });

            // Discover and generate all templates
            await this.generateAllTemplates(context, outputDir);

            logger.info({ outputDir }, 'Code generation completed successfully');
        } catch (error) {
            logger.error(
                {
                    error:
                        error instanceof Error
                            ? {
                                  message: error.message,
                                  stack: error.stack,
                                  name: error.name,
                              }
                            : error,
                },
                'Code generation failed'
            );
            throw error;
        }
    }

    /**
     * Load and validate configuration
     */
    protected async loadConfiguration(): Promise<void> {
        const configPath = this.options.configPath || './codegen.config.ts';

        logger.debug({ configPath }, 'Loading configuration');
        this.config = await loadConfig(configPath);

        // Override outputPath if provided in options
        if (this.options.outputPath) {
            this.config.outputPath = this.options.outputPath;
        }
    }

    /**
     * Initialize template loader
     */
    protected initializeTemplateLoader(): void {
        // Only override templateDirs if explicitly provided by user
        const overrides = this.options.templateDirs ? { templateDirs: this.options.templateDirs } : {};

        this.templateLoader = createTemplateLoader(overrides);
    }

    /**
     * Generate files for all discovered templates
     */
    protected async generateAllTemplates(context: TemplateContext, outputDir: string): Promise<void> {
        if (!this.templateLoader) throw new Error('Template loader not initialized');

        const templates = await this.templateLoader.discoverTemplates();

        for (const template of templates) {
            const outputFileName = this.getOutputFileName(template.name, template.extension);
            await this.generateFile(template.name, outputFileName, context, outputDir);
        }
    }

    /**
     * Convert template name to output file name
     *
     * The TemplateLoader already strips the template extension (.eta) from the name,
     * so templateName already contains the desired output filename.
     *
     * Examples:
     * - File: "common.ts.eta" -> templateName: "common.ts" -> output: "common.ts"
     * - File: "extra.json.eta" -> templateName: "extra.json" -> output: "extra.json"
     * - File: "config.yml.eta" -> templateName: "config.yml" -> output: "config.yml"
     */
    protected getOutputFileName(templateName: string, _templateExtension: string): string {
        return templateName;
    }

    /**
     * Generate a single file from template
     */
    protected async generateFile(
        templateName: string,
        outputFileName: string,
        context: TemplateContext,
        outputDir: string
    ): Promise<void> {
        if (!this.templateLoader) throw new Error('Template loader not initialized');

        try {
            const outputPath = join(outputDir, outputFileName);

            logger.debug({ templateName, outputPath }, 'Generating file');

            const result = await this.templateLoader.renderByName(
                templateName.replace('.eta', ''), // Remove extension for lookup
                context,
                outputPath
            );

            logger.info(
                {
                    templateName,
                    outputPath,
                    contentLength: result.content.length,
                },
                'File generated successfully'
            );
        } catch (error) {
            logger.error({ templateName, error }, 'Failed to generate file');

            if (error instanceof TemplateRenderError) {
                throw error;
            }

            throw new TemplateWriteError(join(outputDir, outputFileName), error as Error);
        }
    }
}

/**
 * Convenience function for generating code
 */
export async function generateCode(options: GenerateOptions = {}): Promise<void> {
    const generator = new CodeGenerator(options);
    await generator.generate();
}
