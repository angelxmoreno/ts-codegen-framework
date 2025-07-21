import { dirname, relative, resolve } from 'node:path';
import type { ConfigWithPath } from '@config/loadConfig.ts';
import type { Config, QueueConfig } from '../config/config.schema';

/**
 * Simplified template context derived from Config
 */
export interface TemplateContext extends Config {
    queues: QueueConfig[];
    meta: {
        timestamp: string;
        generatedBy: string;
    };
}

const resolveProcessorPath = (config: ConfigWithPath, processorPath: string): string => {
    // Get the directory containing the config file
    const configDir = dirname(config.configPath);

    // Resolve the processor path to absolute path (relative to config)
    const absoluteProcessorPath = resolve(configDir, processorPath);

    // Get the output directory (where generated files will be)
    const outputDir = config.outputPath || process.cwd();

    // Calculate relative path from output directory to processor file
    return relative(outputDir, absoluteProcessorPath);
};

/**
 * Convert Config to standardized TemplateContext
 */
export function createTemplateContextFromConfig(config: ConfigWithPath): TemplateContext {
    const templateQueues: QueueConfig[] = config.queues.map((queue) => ({
        ...queue,
        jobs: queue.jobs.map((job) => ({
            ...job,
            processorPath: resolveProcessorPath(config, job.processorPath),
        })),
    }));

    return {
        ...config,
        queues: templateQueues,
        meta: {
            timestamp: new Date().toISOString(),
            generatedBy: 'ts-codegen-framework',
        },
    };
}
