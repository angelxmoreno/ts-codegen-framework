import type { Job } from 'bullmq';
import type { RepoIdentifier } from '../schemas';

export const fetchRepoMilestonesProcessor = (job: Job<RepoIdentifier>) => {
    console.log('fetchRepoMilestonesProcessor', job.data);
};
