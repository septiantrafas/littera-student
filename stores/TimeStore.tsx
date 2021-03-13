import {
  makeAutoObservable,
  observable,
  computed,
  action,
  autorun,
} from "mobx";
import { enableStaticRendering } from "mobx-react";
import { RootStore } from "@/stores/RootStore";
import { io } from "socket.io-client";
import dayjs from "dayjs";

const isServer = typeof window === "undefined";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

export type TimeHydration = {
  time: string;
};

export class TimeStore {
  root: RootStore;
  TIME: string | undefined;
  START_TIME: string | undefined;
  END_TIME: string | undefined;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  hydrate(data: TimeHydration) {
    this.TIME = data.time != null ? data.time : "";
  }

  updateTime(value: string) {
    this.TIME = value;
  }

  updateStartTime(value: string) {
    this.START_TIME = value;
  }

  updateEndTime(value: string) {
    this.END_TIME = value;
  }
}
