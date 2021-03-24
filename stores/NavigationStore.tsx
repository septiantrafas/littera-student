import {
  makeAutoObservable,
  onBecomeObserved,
  onBecomeUnobserved,
  runInAction,
} from "mobx";
import { enableStaticRendering } from "mobx-react";
import { RootStore } from "@/stores/RootStore";
import { supabase } from "utils/initSupabase";

const isServer = typeof window === "undefined";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

type Paths = {
  params: {
    package: string;
    section: string;
    question: {
      id: string;
      number: number;
    };
  };
};

export type PathsHydration = {
  paths: [];
};

export class NavigationStore {
  root: RootStore;
  PATHS: Paths[];
  NEXT_PATH: [];

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  hydrate(data: PathsHydration) {
    this.PATHS = data.paths != null ? data.paths : [];
  }

  get paths() {
    return this.PATHS;
  }

  set paths(value: Paths[]) {
    this.PATHS = value;
  }
}
