import { StorageAdapter, persistence } from "mobx-persist-store";

export const persistStore = (target, properties, persistName) => {
  const isServer = typeof window === "undefined";
  const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === "development";

  if (isServer) {
    return target;
  }

  return persistence({
    name: persistName,
    properties,
    adapter: new StorageAdapter({
      read: async (name) => {
        const data = window.localStorage.getItem(name);

        if (isDevelopment) {
          console.log(
            "[Mobx] persistStore [Read] target:",
            target._storageName,
            "name:",
            name,
            "data:",
            data
          );
        }

        // await new Promise((resolve) => setTimeout(resolve, 300)); // For hydrate simulation
        return data ? JSON.parse(data) : undefined;
      },
      write: async (name, content) => {
        if (isDevelopment) {
          console.log(
            "[Mobx] persistStore [Write] target:",
            target._storageName,
            "name:",
            name,
            "content:",
            content
          );
        }

        window.localStorage.setItem(name, JSON.stringify(content));
      },
    }),
    reactionOptions: {
      delay: 200,
    },
  })(target);
};
