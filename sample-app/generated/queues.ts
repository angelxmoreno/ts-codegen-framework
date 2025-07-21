import { Queue } from 'bullmq';
import { connectionFactory, type QueueMap, type QueueName } from './common.ts';

const records: Partial<QueueMap> = {};

records.repoSyncQueue = new Queue('repoSyncQueue', {
    connection: connectionFactory(),
    defaultJobOptions: { removeOnComplete: 10, removeOnFail: 5, attempts: 3 },
});

records.paginatedFetchingQueue = new Queue('paginatedFetchingQueue', {
    connection: connectionFactory(),
    defaultJobOptions: { removeOnComplete: 20, removeOnFail: 3, attempts: 5, delay: 2000 },
});

export const queueMap = records as Record<QueueName, Queue>;
