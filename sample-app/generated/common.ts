import type { Queue, Worker } from 'bullmq';
import type { z } from 'zod';
import type { RepoIdentifierSchema, RepoPageSchema } from '../schemas.ts';

export type QueueName = 'repoSyncQueue' | 'paginatedFetchingQueue';
export type ProducerFunc<T> = (payload: T) => Promise<void>;
export type QueueMap = Record<QueueName, Queue>;
export type WorkerMap = {
    initRepoFetchingWorker: Worker;
    fetchRepoMilestonesWorker: Worker;
    fetchRepoIssuesPaginatedWorker: Worker;
};
export type ProducerMap = {
    initRepoFetching: ProducerFunc<z.infer<typeof RepoIdentifierSchema>>;
    fetchRepoMilestones: ProducerFunc<z.infer<typeof RepoIdentifierSchema>>;
    fetchRepoIssuesPaginated: ProducerFunc<z.infer<typeof RepoPageSchema>>;
};

export const connectionFactory = () => ({ host: '192.168.1.132' });
