// Import and re-export the simplified TemplateContext
import { createTemplateContextFromConfig, type TemplateContext } from './templateContext';
export { createTemplateContextFromConfig, type TemplateContext };
/**
 * Template rendering options
 */
export interface TemplateOptions {
    /** Path to the template file */
    templatePath: string;
    /** Output file path (optional for string rendering) */
    outputPath?: string;
    /** Template context data */
    context: TemplateContext;
    /** Whether to create output directory if it doesn't exist */
    createDir?: boolean;
}

/**
 * Result of template rendering
 */
export interface RenderResult {
    /** The rendered content */
    content: string;
    /** The template path that was rendered */
    templatePath: string;
    /** The output path (if file was written) */
    outputPath?: string;
    /** Whether the output was written to a file */
    written: boolean;
}

/**
 * Template discovery result
 */
export interface TemplateInfo {
    /** Name of the template */
    name: string;
    /** Full path to the template file */
    path: string;
    /** Directory containing the template */
    directory: string;
    /** File extension of the template */
    extension: string;
}

/**
 * Configuration for template loading
 */
export interface TemplateLoaderConfig {
    /** Base directories to search for templates */
    templateDirs: string[];
    /** File extensions to consider as templates */
    extensions: string[];
    /** Whether to include built-in templates */
    includeBuiltins: boolean;
}
