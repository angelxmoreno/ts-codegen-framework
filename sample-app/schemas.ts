import { z } from 'zod';

export const RepoIdentifierSchema = z.object({
    owner: z.string(),
    repo: z.string(),
});

export const RepoPageSchema = RepoIdentifierSchema.extend({
    page: z.number(),
});

// Inferred Types
export type RepoIdentifier = z.infer<typeof RepoIdentifierSchema>;
export type RepoPage = z.infer<typeof RepoPageSchema>;
