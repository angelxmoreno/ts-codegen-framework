import { relative, resolve } from 'node:path';
import { cwd } from 'node:process';
import { PathValidationError } from '@core/errors';

/**
 * Validates that a resolved path is within the project directory to prevent
 * loading unauthorized files outside the project scope.
 *
 * @param resolvedPath - The absolute path to validate
 * @param projectRoot - The project root directory (defaults to current working directory)
 * @throws {PathValidationError} If the path is outside the project directory
 */
export const validatePathWithinProject = (resolvedPath: string, projectRoot: string = cwd()): void => {
    // Ensure both paths are absolute and normalized
    const absoluteProjectRoot = resolve(projectRoot);
    const absoluteTargetPath = resolve(resolvedPath);

    // Calculate relative path from project root to target
    const relativePath = relative(absoluteProjectRoot, absoluteTargetPath);

    // Check if the relative path starts with '../' or is exactly '..'
    // This indicates the target is outside the project directory
    if (relativePath.startsWith('..') || relativePath.startsWith('/')) {
        throw new PathValidationError(
            resolvedPath,
            `Path "${absoluteTargetPath}" is outside the project directory "${absoluteProjectRoot}"`
        );
    }

    // Additional check for absolute paths that don't resolve within project
    if (!absoluteTargetPath.startsWith(absoluteProjectRoot)) {
        throw new PathValidationError(
            resolvedPath,
            `Path "${absoluteTargetPath}" is not within the project directory "${absoluteProjectRoot}"`
        );
    }
};

/**
 * Safely resolves a path and validates it's within the project directory
 *
 * @param inputPath - The path to resolve and validate
 * @param projectRoot - The project root directory (defaults to current working directory)
 * @returns The resolved absolute path
 * @throws {PathValidationError} If the resolved path is outside the project directory
 */
export const safeResolve = (inputPath: string, projectRoot: string = cwd()): string => {
    const resolvedPath = resolve(inputPath);
    validatePathWithinProject(resolvedPath, projectRoot);
    return resolvedPath;
};
