/**
 *
 * @param {string} storageKey database name
 * @returns {*}
 */
export default function localStorageDriver(storageKey) {
  return {
    /**
     *
     * @returns {null|object}
     */
    read() {
      const dump = localStorage.getItem(storageKey);

      return dump ? JSON.parse(dump) : null;
    },

    /**
     *
     * @param {object} data
     */
    write(data) {
      const dump = JSON.stringify(data);

      localStorage.setItem(storageKey, dump);
    },
  }
};
