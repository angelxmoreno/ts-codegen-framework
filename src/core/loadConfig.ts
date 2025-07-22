import { pathToFileURL } from 'node:url';
import { type Config, ConfigSchema } from '@config/config.schema';
import { defaultConfig } from '@config/defaultConfig';
import { ConfigLoadError, ConfigValidationError, PathValidationError } from '@core/errors';
import logger from '@utils/createLogger';
import { safeResolve } from '@utils/pathValidation';
import { z } from 'zod';

export interface ConfigWithPath extends Config {
    configPath: string;
}

/**
 * Validates a config object against the schema
 */
export const validateConfig = (maybeConfig: unknown, configPath?: string): Config => {
    try {
        return ConfigSchema.parse(maybeConfig);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new ConfigValidationError(error, configPath);
        }
        throw error;
    }
};

/**
 * Loads and validates configuration from a TypeScript file
 * @param configPath - Path to the config file (defaults to './codegen.config.ts')
 * @returns Promise resolving to validated config
 */
export const loadConfig = async (configPath = './codegen.config.ts'): Promise<ConfigWithPath> => {
    // Safely resolve the absolute path and validate it's within project directory
    let absolutePath: string;
    try {
        absolutePath = safeResolve(configPath);
        logger.debug({ configPath, resolvedPath: absolutePath }, 'Config path validated and resolved');
    } catch (error) {
        if (error instanceof PathValidationError) {
            logger.error({ configPath, error: error.message }, 'Config path validation failed');
            throw new ConfigLoadError(configPath, error);
        }
        throw error;
    }

    try {
        // Convert to file URL for dynamic import
        const fileUrl = pathToFileURL(absolutePath).href;

        logger.debug({ configPath: absolutePath }, 'Loading configuration file');

        // Dynamically import the config file
        const configModule = await import(fileUrl);

        // Get the default export or named export 'config'
        const config = configModule.default || configModule.config;

        if (!config) {
            logger.warn({ configPath }, 'No config found in file, using defaults');
            return { ...defaultConfig, configPath: absolutePath };
        }

        // Validate and return the config
        const validatedConfig = validateConfig(config, configPath);
        logger.info({ configPath }, 'Configuration loaded successfully');

        return { ...validatedConfig, configPath: absolutePath };
    } catch (error: unknown) {
        // Handle validation errors
        if (error instanceof ConfigValidationError) {
            logger.error(
                {
                    configPath,
                    validationErrors: error.getErrorsByPath(),
                },
                'Configuration validation failed'
            );
            throw error;
        }

        if (error instanceof Error) {
            // Handle module resolution errors
            if (
                error.message.includes('Cannot resolve module') ||
                error.message.includes('ENOENT') ||
                (error as unknown as { code?: string }).code === 'ERR_MODULE_NOT_FOUND'
            ) {
                logger.warn({ configPath }, 'Config file not found, using defaults');
                return { ...defaultConfig, configPath: absolutePath };
            }

            // Wrap other errors in ConfigLoadError
            logger.error({ configPath, error: error.message }, 'Failed to load configuration');
            throw new ConfigLoadError(configPath, error);
        }

        // Handle unknown errors
        logger.error({ configPath, error }, 'Unknown error loading configuration');
        throw new ConfigLoadError(configPath);
    }
};
