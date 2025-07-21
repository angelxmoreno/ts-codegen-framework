import type { Job } from 'bullmq';
import type { RepoIdentifier } from '../schemas.ts';

export const initRepoFetchingProcessor = (job: Job<RepoIdentifier>) => {
    console.log('initRepoFetchingProcessor', job.data);
};
