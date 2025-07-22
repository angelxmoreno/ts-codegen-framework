import type { Job } from 'bullmq';
import type { RepoPage } from '../schemas.ts';

export const fetchRepoIssuesPaginatedProcessor = (job: Job<RepoPage>) => {
    console.log('fetchRepoIssuesPaginatedProcessor', job.data);
};
