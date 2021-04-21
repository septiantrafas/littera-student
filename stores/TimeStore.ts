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
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const isServer = typeof window === "undefined";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

export type TimeHydration = {
  time?: string;
  start_time?: string;
  end_time?: string;
  timeout_path?: {
    package: string;
    section: string;
  };
};

export class TimeStore {
  root: RootStore;
  TIME: string | undefined;
  START_TIME: string | undefined;
  END_TIME: string | undefined;
  TIMEOUT_PATH: {
    package: string;
    section: string;
  } | null;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  hydrate(data: TimeHydration) {
    const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
    const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === "development";

    if (isDevelopment) {
      if (!this.TIME || data.time != null) {
        this.TIME = dayjs().toISOString();
      }
      this.START_TIME = dayjs().subtract(1, "minute").toISOString();
      this.END_TIME = dayjs().add(2, "minute").toISOString();
      this.TIMEOUT_PATH = data.timeout_path != null ? data.timeout_path : null;
    }

    if (isProduction) {
      // do not hydrate if TIME exists
      if (!this.TIME || data.time != null) {
        this.TIME = data.time != null ? data.time : "";
      }
      this.START_TIME = data.start_time != null ? data.start_time : "";
      this.END_TIME = data.end_time != null ? data.end_time : "";
      this.TIMEOUT_PATH = data.timeout_path != null ? data.timeout_path : null;
    }
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

  calculateTimeLeft(time: string) {
    const now = dayjs(time);
    const end_time = dayjs(this.END_TIME);

    if (now.isBefore(end_time)) {
      const time_difference = dayjs(
        end_time.toDate().getTime() - now.toDate().getTime()
      ).utcOffset(0);

      return time_difference;
    } else {
      return dayjs(0);
    }
  }
}
