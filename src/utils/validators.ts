/**
 * validators
 *
 * Utility validation helpers used across forms in the application.
 */

/** Basic email validation pattern */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checks whether a string contains non-whitespace characters.
 */
export const isNonEmpty = (value: string): boolean => value.trim().length > 0;
