import mockState from './data/mock';
import emptyState from './data/empy';

import localStorageDriver from './driver/local-storage';

import { STORAGE_KEY, USE_MOCK_DATA_FALLBACK } from '../config';

const dbDriver = localStorageDriver(STORAGE_KEY);

export { read, write };

function dataChecker(data) {
  return data ? data : USE_MOCK_DATA_FALLBACK ? mockState : emptyState;
}

function read() {
  return dataChecker(dbDriver.read());
}

function write(data) {
  dbDriver.write(data);
}
