import { TimeHydration, TimeStore } from "./TimeStore";
import { NavigationStore, PathsHydration } from "./NavigationStore";

export type RootStoreHydration = {
  timeStore?: TimeHydration;
  navigationStore?: PathsHydration;
};
export class RootStore {
  timeStore: TimeStore;
  navigationStore: NavigationStore;

  constructor() {
    this.timeStore = new TimeStore(this);
    this.navigationStore = new NavigationStore(this);
  }

  hydrate(data: RootStoreHydration) {
    if (data.navigationStore) {
      this.navigationStore.hydrate(data.navigationStore);
    }
    if (data.timeStore) {
      this.timeStore.hydrate(data.timeStore);
    }
  }
}
