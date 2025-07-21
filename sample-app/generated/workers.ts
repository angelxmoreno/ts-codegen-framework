import { Worker } from 'bullmq';
import { connectionFactory, type WorkerMap } from './common.ts';

const records: Partial<WorkerMap> = {};

// One worker per job - BullMQ supports file paths directly
records.initRepoFetchingWorker = new Worker('repoSyncQueue', '../processors/initRepoFetchingProcessor.ts', {
    autorun: false,
    concurrency: 3,
    connection: connectionFactory(),
});

records.fetchRepoMilestonesWorker = new Worker('repoSyncQueue', '../processors/fetchRepoMilestonesProcessor.ts', {
    autorun: false,
    concurrency: 3,
    connection: connectionFactory(),
});

records.fetchRepoIssuesPaginatedWorker = new Worker(
    'paginatedFetchingQueue',
    '../processors/fetchRepoIssuesPaginatedProcessor.ts',
    {
        autorun: false,
        concurrency: 2,
        connection: connectionFactory(),
    }
);

export const workerMap = records as WorkerMap;
