import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react";
import { RootStore } from "@/stores/RootStore";
import { persistStore } from "utils/persistStore";
import { clearPersist } from "mobx-persist-store";

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

export type AnswerTableMap = {
  [key: string]: string;
};

type AnsweredIndex = {
  question_id: string;
  option_id: number;
};

export type PathsHydration = {
  paths?: [];
  previous_path?: Paths;
  current_path?: Paths;
  next_path?: Paths;
  visited_index?: [];
  current_instruction?: string;
};

export class NavigationStore {
  root: RootStore;
  SCHEDULE_ID?: number;
  PATHS: Paths[];
  VISITED_INDEX: string[] = [];
  ANSWER_MAP?: AnswerTableMap = {};
  ANSWERED_INDEX?: AnsweredIndex[] = [];
  PREVIOUS_PATH: Paths;
  CURRENT_PATH: Paths;
  NEXT_PATH: Paths;
  CURRENT_INSTRUCTION: string;
  FIRST_ENTRY: boolean;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
    persistStore(
      this,
      [
        "ANSWERED_INDEX",
        "CURRENT_PATH",
        "SCHEDULE_ID",
        "VISITED_INDEX",
        "FIRST_ENTRY",
        "ANSWER_MAP",
      ],
      "NavigationStore"
    );
  }

  clearStore = async () => {
    try {
      this.ANSWERED_INDEX = [];
      this.VISITED_INDEX = [];
      await clearPersist(this);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  hydrate(data: PathsHydration) {
    this.PATHS = data.paths != null ? data.paths : [];
    this.PREVIOUS_PATH = data.previous_path != null ? data.previous_path : null;
    this.CURRENT_PATH = data.current_path != null ? data.current_path : null;
    this.NEXT_PATH = data.next_path != null ? data.next_path : null;
    this.CURRENT_INSTRUCTION =
      data.current_instruction != null ? data.current_instruction : null;
  }

  get current_instruction() {
    return this.CURRENT_INSTRUCTION;
  }

  set current_instruction(value) {
    this.CURRENT_INSTRUCTION = value;
  }

  get paths() {
    return this.PATHS;
  }

  set paths(value: Paths[]) {
    this.PATHS = value;
  }

  get current_path() {
    return this.CURRENT_PATH;
  }

  set current_path(value) {
    this.CURRENT_PATH = value;
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

  get schedule_id() {
    return this.SCHEDULE_ID;
  }

  set schedule_id(value) {
    this.SCHEDULE_ID = value;
  }

  get answer_map(): AnswerTableMap {
    return this.ANSWER_MAP;
  }

  set answer_map(object: AnswerTableMap) {
    this.ANSWER_MAP = object;
  }

  isVisited(index: string) {
    return this.VISITED_INDEX.includes(index);
  }

  addToVisitedIndex(index: string) {
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

  getCurrentInstruction(): string {
    return this.CURRENT_INSTRUCTION;
  }

  setCurrentInstruction(instruction: string) {
    this.CURRENT_INSTRUCTION = instruction;
  }

  setFirstEntryState(state: boolean) {
    this.FIRST_ENTRY = state;
  }
}
