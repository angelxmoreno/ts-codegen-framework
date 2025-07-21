#!/usr/bin/env node

import { Command } from 'commander';
// Use require for JSON imports since we're running through tsx
import packageJson from '../../package.json';
import { generateCode } from '../core/generator';
import logger from '../utils/createLogger';

const version = packageJson.version;

const program = new Command();

program
    .name('codegen')
    .description('TypeScript code generation framework for BullMQ queue/worker systems')
    .version(version);

program
    .command('generate')
    .description('Generate code from configuration')
    .option('-c, --config <path>', 'Path to config file', './codegen.config.ts')
    .option('-o, --output <path>', 'Output directory (overrides config outputPath)')
    .option('-t, --templates <paths...>', 'Template directories (comma-separated)')
    .option('-v, --verbose', 'Enable verbose logging')
    .action(async (options) => {
        try {
            // Set log level if verbose
            if (options.verbose) {
                logger.level = 'debug';
            }

            logger.info('Starting code generation...');

            await generateCode({
                configPath: options.config,
                outputPath: options.output,
                templateDirs: options.templates,
                verbose: options.verbose,
            });

            logger.info('Code generation completed successfully!');
        } catch (error) {
            logger.error(
                'Code generation failed:',
                error instanceof Error
                    ? {
                          message: error.message,
                          stack: error.stack,
                          name: error.name,
                      }
                    : error
            );
            process.exit(1);
        }
    });

program
    .command('init')
    .description('Initialize a new codegen project with sample config')
    .option('-p, --path <path>', 'Project directory', '.')
    .action(async (_options) => {
        logger.info('Creating sample configuration...');
        // TODO: Implement init command
        logger.warn('Init command not yet implemented');
    });

program
    .command('doctor')
    .description('Validate configuration and templates')
    .option('-c, --config <path>', 'Path to config file', './codegen.config.ts')
    .action(async (_options) => {
        logger.info('Running diagnostics...');
        // TODO: Implement doctor command
        logger.warn('Doctor command not yet implemented');
    });

program.parse();
