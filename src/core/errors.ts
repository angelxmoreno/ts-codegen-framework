import type { z } from 'zod';

/**
 * Base error class for all codegen framework errors
 */
export abstract class CodegenError extends Error {
    abstract readonly code: string;

    protected constructor(
        message: string,
        public override readonly cause?: Error
    ) {
        super(message);
        this.name = this.constructor.name;

        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Error thrown when configuration validation fails
 */
export class ConfigValidationError extends CodegenError {
    readonly code = 'CONFIG_VALIDATION_ERROR';
    readonly issues: z.ZodError['issues'];

    constructor(zodError: z.ZodError, configPath?: string) {
        const issueMessages = zodError.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);

        const message = configPath
            ? `Configuration validation failed for ${configPath}:\n${issueMessages.join('\n')}`
            : `Configuration validation failed:\n${issueMessages.join('\n')}`;

        super(message, zodError);
        this.issues = zodError.issues;
    }

    /**
     * Get validation errors grouped by field path
     */
    getErrorsByPath(): Record<string, string[]> {
        return this.issues.reduce(
            (acc, issue) => {
                const path = issue.path.join('.');
                if (!acc[path]) {
                    acc[path] = [];
                }
                acc[path].push(issue.message);
                return acc;
            },
            {} as Record<string, string[]>
        );
    }
}

/**
 * Error thrown when configuration file cannot be loaded
 */
export class ConfigLoadError extends CodegenError {
    readonly code = 'CONFIG_LOAD_ERROR';

    constructor(configPath: string, cause?: Error) {
        super(`Failed to load configuration from ${configPath}`, cause);
    }
}

/**
 * Error thrown when configuration file is not found
 */
export class ConfigNotFoundError extends CodegenError {
    readonly code = 'CONFIG_NOT_FOUND_ERROR';

    constructor(configPath: string) {
        super(`Configuration file not found: ${configPath}`);
    }
}

/**
 * Error thrown when template loading fails
 */
export class TemplateLoadError extends CodegenError {
    readonly code = 'TEMPLATE_LOAD_ERROR';

    constructor(templatePath: string, cause?: Error) {
        super(`Failed to load template from ${templatePath}`, cause);
    }
}

/**
 * Error thrown when template rendering fails
 */
export class TemplateRenderError extends CodegenError {
    readonly code = 'TEMPLATE_RENDER_ERROR';

    constructor(templatePath: string, cause?: Error) {
        super(`Failed to render template ${templatePath}`, cause);
    }
}

/**
 * Error thrown when file generation fails
 */
export class GenerationError extends CodegenError {
    readonly code = 'GENERATION_ERROR';

    constructor(outputPath: string, cause?: Error) {
        super(`Failed to generate file at ${outputPath}`, cause);
    }
}

/**
 * Error thrown when parsing input fails
 */
export class ParseError extends CodegenError {
    readonly code = 'PARSE_ERROR';

    constructor(inputPath: string, cause?: Error) {
        super(`Failed to parse input from ${inputPath}`, cause);
    }
}

/**
 * Type guard to check if error is a codegen framework error
 */
export function isCodegenError(error: unknown): error is CodegenError {
    return error instanceof CodegenError;
}

/**
 * Type guard to check if error is a config validation error
 */
export function isConfigValidationError(error: unknown): error is ConfigValidationError {
    return error instanceof ConfigValidationError;
}
