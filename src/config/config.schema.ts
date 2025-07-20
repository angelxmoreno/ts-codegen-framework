import { z } from 'zod';

// Zod schema for QueueOptions (simplified version - extend as needed)
const QueueOptionsSchema = z
    .object({
        defaultJobOptions: z
            .object({
                removeOnComplete: z.number().optional(),
                removeOnFail: z.number().optional(),
                delay: z.number().optional(),
                attempts: z.number().optional(),
                backoff: z
                    .union([
                        z.string(),
                        z.object({
                            type: z.string(),
                            delay: z.number().optional(),
                        }),
                    ])
                    .optional(),
            })
            .optional(),
        connection: z
            .object({
                host: z.string().optional(),
                port: z.number().optional(),
                password: z.string().optional(),
                db: z.number().optional(),
            })
            .optional(),
    })
    .partial(); // Allow partial properties and additional ones

// Zod schemas
export const JobConfigSchema = z.object({
    name: z.string(),
    payload: z.any(), // Will be a ZodObject but z.instanceof doesn't work well with generic types
    processorPath: z.string(),
});

export const QueueConfigSchema = z.object({
    name: z.string(),
    options: QueueOptionsSchema,
    jobs: z.array(JobConfigSchema),
});

export const ConfigSchema = z.object({
    queues: z.array(QueueConfigSchema),
    templatePath: z.string().optional(),
    outputPath: z.string().optional(),
});

// Inferred types
export type JobConfig = z.infer<typeof JobConfigSchema>;
export type QueueConfig = z.infer<typeof QueueConfigSchema>;
export type Config = z.infer<typeof ConfigSchema>;
