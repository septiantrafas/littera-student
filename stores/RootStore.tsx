import { TimeHydration, TimeStore } from "./TimeStore";

export type RootStoreHydration = {
  stopwatchStore?: TimeHydration;
};
export class RootStore {
  timeStore: TimeStore;

  constructor() {
    this.timeStore = new TimeStore(this);
  }

  hydrate(data: RootStoreHydration) {
    if (data.stopwatchStore) {
      this.timeStore.hydrate(data.stopwatchStore);
    }
  }
}
