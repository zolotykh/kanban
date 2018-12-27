import mockState from './data/mock';
import emptyState from './data/empy';

import localStorageDriver from './driver/local-storage';

import { STORAGE_KEY, USE_MOCK_DATA_FALLBACK } from '../config';

/**
 * Methods for read & write data
 *
 * @type {{read, write}}
 */
const dbDriver = localStorageDriver(STORAGE_KEY);

export { read, write };

/**
 *
 * @param data
 * @returns {object}
 */
function dataChecker(data) {
  return data ? data : USE_MOCK_DATA_FALLBACK ? mockState : emptyState;
}

/**
 *
 * @returns {object}
 */
function read() {
  return dataChecker(dbDriver.read());
}

/**
 *
 * @param {object} data
 */
function write(data) {
  dbDriver.write(data);
}
