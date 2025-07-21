import type { z } from 'zod';
import type { RepoIdentifierSchema, RepoPageSchema } from '../schemas.ts';
import type { ProducerMap } from './common.ts';
import { queueMap } from './queues.ts';

const records: Partial<ProducerMap> = {};

records.initRepoFetching = async (payload: z.infer<typeof RepoIdentifierSchema>) => {
    await queueMap.repoSyncQueue.add('initRepoFetching', payload);
};

records.fetchRepoMilestones = async (payload: z.infer<typeof RepoIdentifierSchema>) => {
    await queueMap.repoSyncQueue.add('fetchRepoMilestones', payload);
};

records.fetchRepoIssuesPaginated = async (payload: z.infer<typeof RepoPageSchema>) => {
    await queueMap.paginatedFetchingQueue.add('fetchRepoIssuesPaginated', payload);
};

export const producerMap = records as ProducerMap;
