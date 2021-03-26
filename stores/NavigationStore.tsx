import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react";
import { RootStore } from "@/stores/RootStore";

const isServer = typeof window === "undefined";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

export type Paths = {
  params: {
    package: string;
    section: string;
    question: {
      id: string;
      number: number;
    };
  };
};

type AnsweredIndex = {
  question_id: string;
  option_id: number;
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
  ANSWERED_INDEX: AnsweredIndex[] = [];
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
    return this.VISITED_INDEX.includes(index);
  }

  addToVisitedIndex(index: number) {
    if (!this.isVisited(index)) {
      this.VISITED_INDEX.push(index);
    }
  }

  isAnswered(question_id: string) {
    if (this.ANSWERED_INDEX) {
      const location = this.ANSWERED_INDEX.findIndex(
        (arr) => arr.question_id === question_id
      );
      return location >= 0;
    } else {
      return false;
    }
  }

  setAnsweredIndex(index: AnsweredIndex) {
    console.log(JSON.stringify(this.ANSWERED_INDEX));
    if (!this.isAnswered(index.question_id)) {
      this.ANSWERED_INDEX.push(index);
    } else {
      const location = this.ANSWERED_INDEX.findIndex(
        (arr) => arr.question_id === index.question_id
      );
      this.ANSWERED_INDEX[location].option_id = index.option_id;
    }
  }

  getSelectedOption(question_id: string): number {
    if (!this.isAnswered(question_id)) {
      return 0;
    } else {
      const location = this.ANSWERED_INDEX.findIndex(
        (arr) => arr.question_id === question_id
      );
      return this.ANSWERED_INDEX[location].option_id;
    }
  }
}
