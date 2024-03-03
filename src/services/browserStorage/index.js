const getStoreFrom = (storage) => ({
  set: (name, value) =>
    storage.setItem(name, JSON.stringify(value)),
  get: (name) => {
    const value = storage.getItem(name);
    try {
      return value && JSON.parse(value);
    } catch (e) {
      return value;
    }
  },
  remove: (name) => storage.removeItem(name),
  clear: () => storage.clear(),
});

export const sessionStore = getStoreFrom(sessionStorage);
export const localStore = getStoreFrom(localStorage);
