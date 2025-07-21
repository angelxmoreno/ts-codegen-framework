import * as path from 'node:path';
import type { Config } from '@config/config.schema.ts';

export const defaultConfig: Config = {
    queues: [],
    templatePath: path.resolve('./templates/default'),
    outputPath: path.resolve('./output'),
    connectionFactory: () => ({}),
};
