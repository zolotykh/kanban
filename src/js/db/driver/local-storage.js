export default function localStorageDriver(storageKey) {
  return {
    read() {
      const dump = localStorage.getItem(storageKey);

      return dump ? JSON.parse(dump) : null;
    },
    write(data) {
      const dump = JSON.stringify(data);

      localStorage.setItem(storageKey, dump);
    },
  }
};
