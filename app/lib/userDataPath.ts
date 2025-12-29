// Configurable sharding constants
export const USERS_PER_FILE = 500;
export const FILES_PER_DIR = 20;

/**
 * Calculate the file path for a given user ID
 * 
 * Examples:
 * - ID 1-500 → 00/00.json
 * - ID 501-1000 → 00/01.json
 * - ID 10001-10500 → 01/00.json
 */
export function getUserDataPath(id: number): string {
  const fileIndex = Math.floor((id - 1) / USERS_PER_FILE);
  const dirIndex = Math.floor(fileIndex / FILES_PER_DIR);
  const fileInDir = fileIndex % FILES_PER_DIR;

  const dirName = dirIndex.toString().padStart(2, "0");
  const fileName = fileInDir.toString().padStart(2, "0");

  return `/data/users/${dirName}/${fileName}.json`;
}

/**
 * Calculate which index in the array a user would be at within their file
 */
export function getUserIndexInFile(id: number): number {
  return (id - 1) % USERS_PER_FILE;
}

