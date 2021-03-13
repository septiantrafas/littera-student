import { makeAutoObservable, observable, computed, action } from "mobx";
import { enableStaticRendering } from "mobx-react";
import { RootStore } from "@/stores/RootStore";

const isServer = typeof window === "undefined";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

export type TimeHydration = {
  time: string;
};

export class TimeStore {
  root: RootStore;
  time: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  hydrate(data: TimeHydration) {
    this.time = data.time != null ? data.time : "";
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
