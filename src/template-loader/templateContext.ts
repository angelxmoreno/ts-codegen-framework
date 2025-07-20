import { camelize } from 'inflection';
import type { Config, JobConfig } from '../config/config.schema';

/**
 * Job data with standardized naming
 */
export interface TemplateJob {
    name: string;
    payload: unknown;
    processorPath: string;

    producerName: string;
    processorName: string;
    workerName: string;
}

/**
 * Queue data with standardized naming
 */
export interface TemplateQueue {
    name: string;
    options: Record<string, unknown>;
    jobs: TemplateJob[];
}

/**
 * Simplified template context derived from Config
 */
export interface TemplateContext {
    queues: TemplateQueue[];
    paths: {
        templatePath?: string;
        outputPath?: string;
    };
    meta: {
        timestamp: string;
        generatedBy: string;
    };
}

const createProducerName = ({ name }: JobConfig): string => `addTo${camelize(name, false)}`;
const createProcessorName = ({ name }: JobConfig): string => `${camelize(name, true)}Processor`;
const createWorkerName = ({ name }: JobConfig): string => `${camelize(name, true)}Worker`;

/**
 * Convert Config to standardized TemplateContext
 */
export function createTemplateContextFromConfig(config: Config): TemplateContext {
    const templateQueues: TemplateQueue[] = config.queues.map((queue) => ({
        name: queue.name,
        options: queue.options || {},
        jobs: queue.jobs.map((job) => ({
            name: job.name,
            payload: job.payload,
            processorPath: job.processorPath,
            producerName: createProducerName(job),
            processorName: createProcessorName(job),
            workerName: createWorkerName(job),
        })),
    }));

    return {
        queues: templateQueues,
        paths: {
            templatePath: config.templatePath,
            outputPath: config.outputPath,
        },
        meta: {
            timestamp: new Date().toISOString(),
            generatedBy: 'ts-codegen-framework',
        },
    };
}
