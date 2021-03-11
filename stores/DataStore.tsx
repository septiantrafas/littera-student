import { makeObservable, observable, computed, action } from "mobx";
import { enableStaticRendering } from "mobx-react";
import dayjs from "dayjs";

const isServer = typeof window === "undefined";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

type SerializedStore = {
  time: string;
  content: string;
};

export class DataStore {
  time: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;

  constructor() {
    makeObservable(this, {
      time: observable,
      startTime: observable,
      endTime: observable,
      changeTime: action.bound,
      changeStartTime: action.bound,
      changeEndTime: action.bound,
    });
  }

  hydrate(serializedStore: SerializedStore) {
    this.time = serializedStore.time != null ? serializedStore.time : "";
  }

  changeTime(newTime: string) {
    this.time = newTime;
  }

  changeStartTime(newTime: string) {
    this.startTime = newTime;
  }

  changeEndTime(newTime: string) {
    this.endTime = newTime;
  }
}

export async function fetchInitialStoreState() {
  // You can do anything to fetch initial store state
  return {};
}
