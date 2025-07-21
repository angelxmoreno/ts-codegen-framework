import type { Config } from '@config/config.schema.ts';
import { RepoIdentifierSchema, RepoPageSchema } from './schemas';

const config: Config = {
    queues: [
        {
            name: 'repoSyncQueue',
            workerOptions: {
                concurrency: 3,
                autorun: false,
            },
            queueOptions: {
                defaultJobOptions: {
                    removeOnComplete: 10,
                    removeOnFail: 5,
                    attempts: 3,
                },
            },
            jobs: [
                {
                    name: 'initRepoFetching',
                    payload: { schema: RepoIdentifierSchema, name: 'RepoIdentifierSchema' },
                    processorPath: './processors/initRepoFetchingProcessor.ts',
                },
                {
                    name: 'fetchRepoMilestones',
                    payload: { schema: RepoIdentifierSchema, name: 'RepoIdentifierSchema' },
                    processorPath: './processors/fetchRepoMilestonesProcessor.ts',
                },
            ],
        },
        {
            name: 'paginatedFetchingQueue',
            workerOptions: {
                concurrency: 2,
                autorun: false,
            },
            queueOptions: {
                defaultJobOptions: {
                    removeOnComplete: 20,
                    removeOnFail: 3,
                    attempts: 5,
                    delay: 2000,
                },
            },
            jobs: [
                {
                    name: 'fetchRepoIssuesPaginated',
                    payload: { schema: RepoPageSchema, name: 'RepoPageSchema' },
                    processorPath: './processors/fetchRepoIssuesPaginatedProcessor.ts',
                },
            ],
        },
    ],
    outputPath: './.bullgenq',
    connectionFactory: () => ({
        host: '192.168.1.132',
    }),
};

export default config;
