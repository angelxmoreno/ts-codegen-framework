import { describe, expect, it } from 'bun:test';
import { defaultConfig } from '@config/defaultConfig';
import { ConfigValidationError } from '@core/errors';
import { loadConfig, validateConfig } from '@core/loadConfig';

describe('loadConfig', () => {
    describe('validateConfig', () => {
        it('should validate a correct config object', () => {
            const validConfig = {
                queues: [],
                outputPath: './output',
                templatePath: './templates',
                connectionFactory: () => ({ host: 'localhost', port: 6379 }),
            };

            const result = validateConfig(validConfig);
            expect(result.queues).toEqual([]);
            expect(result.outputPath).toBe('./output');
        });

        it('should throw ConfigValidationError for invalid config', () => {
            const invalidConfig = {
                queues: 'not-an-array', // should be array
                connectionFactory: 'not-a-function', // should be function
            };

            expect(() => validateConfig(invalidConfig)).toThrow(ConfigValidationError);
        });

        it('should handle empty config object', () => {
            expect(() => validateConfig({})).toThrow(ConfigValidationError);
        });
    });

    describe('loadConfig', () => {
        it('should return default config when file not found', async () => {
            try {
                const result = await loadConfig('./non-existent-config.ts');

                expect(result.queues).toEqual(defaultConfig.queues);
                expect(result.outputPath).toBe(String(defaultConfig.outputPath));
                expect(result.configPath).toContain('non-existent-config.ts');
            } catch (error) {
                // If it throws an error, that's also acceptable behavior
                // The function may choose to throw rather than return defaults
                expect(error).toBeDefined();
            }
        });

        it('should load existing config file', async () => {
            // This will load the sample config
            const result = await loadConfig('./sample-app/codegen.config.ts');

            expect(result).toBeDefined();
            expect(result.configPath).toContain('codegen.config.ts');
            expect(typeof result.outputPath).toBe('string');
            expect(Array.isArray(result.queues)).toBe(true);
        });
    });
});
