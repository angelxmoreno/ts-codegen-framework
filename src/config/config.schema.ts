import { z } from 'zod';

// Zod schema for Redis ConnectionOptions
export const ConnectionOptionsSchema = z
    .object({
        host: z.string().optional(),
        port: z.number().optional(),
        password: z.string().optional(),
        db: z.number().optional(),
        username: z.string().optional(),
        family: z.number().optional(),
        keepAlive: z.number().optional(),
        maxRetriesPerRequest: z.number().optional(),
        retryDelayOnFailover: z.number().optional(),
        enableOfflineQueue: z.boolean().optional(),
        lazyConnect: z.boolean().optional(),
    })
    .partial();

// Zod schema for QueueOptions (Omit<QueueOptions, 'connection'>)
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
        // connection omitted - will be provided by framework
    })
    .partial(); // Allow partial properties and additional ones

// Zod schema for WorkerOptions (Omit<WorkerOptions, 'connection'>)
const WorkerOptionsSchema = z
    .object({
        concurrency: z.number().optional(),
        limiter: z
            .object({
                max: z.number(),
                duration: z.number(),
            })
            .optional(),
        skipDelayedJobs: z.boolean().optional(),
        skipStalledJobs: z.boolean().optional(),
        maxStalledCount: z.number().optional(),
        stalledInterval: z.number().optional(),
        autorun: z.boolean().optional(),
        runRetryDelay: z.number().optional(),
        drainDelay: z.number().optional(),
        // connection omitted - will be provided by framework
    })
    .partial(); // Allow partial properties and additional ones

// Zod schemas
export const JobConfigSchema = z.object({
    name: z.string(),
    payload: z.object({
        schema: z.any(), // The actual Zod schema object
        name: z.string(), // The schema name as string for template generation
    }),
    processorPath: z.string(),
});

export const QueueConfigSchema = z.object({
    name: z.string(),
    workerOptions: WorkerOptionsSchema.optional(),
    queueOptions: QueueOptionsSchema.optional(),
    jobs: z.array(JobConfigSchema),
});

export const ConfigSchema = z.object({
    queues: z.array(QueueConfigSchema),
    templatePath: z.string().optional(),
    outputPath: z.string().optional(),
    connectionFactory: z.custom<() => ConnectionOptions>((val) => {
        if (typeof val !== 'function') return false;
        try {
            const result = val();
            return ConnectionOptionsSchema.safeParse(result).success;
        } catch {
            return false;
        }
    }),
});

// Inferred types
export type JobConfig = z.infer<typeof JobConfigSchema>;
export type QueueConfig = z.infer<typeof QueueConfigSchema>;
export type Config = z.infer<typeof ConfigSchema>;
export type ConnectionOptions = z.infer<typeof ConnectionOptionsSchema>;
