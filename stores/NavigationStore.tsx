import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react";
import { RootStore } from "@/stores/RootStore";

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
  paths?: [];
  next_path?: Paths;
  previous_path?: Paths;
  visited_index?: [];
};

export class NavigationStore {
  root: RootStore;
  PATHS: Paths[];
  VISITED_INDEX: number[] = [];
  NEXT_PATH: Paths;
  PREVIOUS_PATH: Paths;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  hydrate(data: PathsHydration) {
    this.PATHS = data.paths != null ? data.paths : [];
    this.NEXT_PATH = data.next_path != null ? data.next_path : null;
    this.PREVIOUS_PATH = data.previous_path != null ? data.previous_path : null;
  }

  get paths() {
    return this.PATHS;
  }

  set paths(value: Paths[]) {
    this.PATHS = value;
  }

  get next_path() {
    return this.NEXT_PATH;
  }

  set next_path(value) {
    this.NEXT_PATH = value;
  }

  get previous_path() {
    return this.PREVIOUS_PATH;
  }

  set previous_path(value) {
    this.PREVIOUS_PATH = value;
  }

  isVisited(index: number) {
    if (this.VISITED_INDEX) {
      return this.VISITED_INDEX.includes(index);
    } else {
      return false;
    }
  }

  addToVisitedIndex(index: number) {
    if (!this.isVisited(index)) {
      this.VISITED_INDEX.push(index);
    }
  }
}
