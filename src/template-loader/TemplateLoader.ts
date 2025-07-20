import { existsSync, readdirSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Eta } from 'eta';
import { TemplateLoadError, TemplateNotFoundError, TemplateRenderError, TemplateWriteError } from '../core/errors';
import logger from '../utils/createLogger';
import type { RenderResult, TemplateContext, TemplateInfo, TemplateLoaderConfig, TemplateOptions } from './types';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * TemplateLoader handles loading and rendering templates using Eta
 */
export class TemplateLoader {
    protected eta: Eta;
    protected config: TemplateLoaderConfig;

    constructor(config: TemplateLoaderConfig) {
        this.config = config;

        // Initialize Eta with configuration
        this.eta = new Eta({
            views: config.templateDirs[0], // Eta expects a single string
            cache: true,
            debug: process.env.NODE_ENV === 'development',
            autoEscape: false, // We want raw output for code generation
        });

        logger.debug({ templateDirs: config.templateDirs }, 'TemplateLoader initialized');
    }

    /**
     * Discover all available templates in configured directories (non-recursive)
     */
    async discoverTemplates(): Promise<TemplateInfo[]> {
        const templates: TemplateInfo[] = [];

        for (const templateDir of this.config.templateDirs) {
            if (!existsSync(templateDir)) {
                logger.warn({ templateDir }, 'Template directory does not exist');
                continue;
            }

            try {
                const discovered = this.discoverTemplatesInDir(templateDir);
                templates.push(...discovered);
            } catch (error) {
                logger.error({ templateDir, error }, 'Failed to discover templates in directory');
            }
        }

        logger.info({ count: templates.length }, 'Discovered templates');
        return templates;
    }

    /**
     * Discover templates in a specific directory (non-recursive)
     */
    protected discoverTemplatesInDir(dir: string): TemplateInfo[] {
        const templates: TemplateInfo[] = [];

        try {
            const entries = readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                if (entry.isFile()) {
                    const ext = extname(entry.name);
                    if (this.config.extensions.includes(ext)) {
                        templates.push({
                            name: basename(entry.name, ext),
                            path: join(dir, entry.name),
                            directory: dir,
                            extension: ext,
                        });
                    }
                }
            }
        } catch (error) {
            throw new TemplateLoadError(dir, error as Error);
        }

        return templates;
    }

    /**
     * Load template content from file
     */
    async loadTemplate(templatePath: string): Promise<string> {
        try {
            const resolvedPath = resolve(templatePath);
            const content = await readFile(resolvedPath, 'utf-8');

            logger.debug({ templatePath: resolvedPath }, 'Template loaded successfully');
            return content;
        } catch (error) {
            logger.error({ templatePath, error }, 'Failed to load template');
            throw new TemplateLoadError(templatePath, error as Error);
        }
    }

    /**
     * Render template with given context
     */
    async render(options: TemplateOptions): Promise<RenderResult> {
        const { templatePath, outputPath, context, createDir = true } = options;

        try {
            // Load template content
            const templateContent = await this.loadTemplate(templatePath);

            // Render template with context
            const renderedContent = await this.eta.renderStringAsync(templateContent, context);

            logger.debug(
                {
                    templatePath,
                    outputPath,
                    contentLength: renderedContent.length,
                },
                'Template rendered successfully'
            );

            // Write to file if output path is specified
            let written = false;
            if (outputPath) {
                await this.writeOutput(renderedContent, outputPath, createDir);
                written = true;
            }

            return {
                content: renderedContent,
                templatePath,
                outputPath,
                written,
            };
        } catch (error) {
            logger.error({ templatePath, error }, 'Template rendering failed');
            throw new TemplateRenderError(templatePath, error as Error);
        }
    }

    /**
     * Render template by name (searches in template directories)
     */
    async renderByName(templateName: string, context: TemplateContext, outputPath?: string): Promise<RenderResult> {
        const templates = await this.discoverTemplates();
        const template = templates.find((t) => t.name === templateName);

        if (!template) {
            throw new TemplateNotFoundError(templateName, this.config.templateDirs);
        }

        return this.render({
            templatePath: template.path,
            context,
            outputPath,
        });
    }

    /**
     * Write rendered content to output file
     */
    protected async writeOutput(content: string, outputPath: string, createDir: boolean): Promise<void> {
        try {
            if (createDir) {
                const outputDir = dirname(outputPath);
                await mkdir(outputDir, { recursive: true });
            }

            await writeFile(outputPath, content, 'utf-8');
            logger.info({ outputPath }, 'File written successfully');
        } catch (error) {
            throw new TemplateWriteError(outputPath, error as Error);
        }
    }
}

/**
 * Create a TemplateLoader with default configuration
 */
export function createTemplateLoader(overrides: Partial<TemplateLoaderConfig> = {}): TemplateLoader {
    const defaultConfig: TemplateLoaderConfig = {
        templateDirs: [join(process.cwd(), 'templates'), join(__dirname, '../templates')],
        extensions: ['.eta'],
        includeBuiltins: true,
    };

    const config = { ...defaultConfig, ...overrides };
    return new TemplateLoader(config);
}
