import { useRootStore } from "./RootStoreProvider";
import { TimeStore } from "@/stores/TimeStore";
import { useEffect } from "react";

declare global {
  interface Window {
    TimeStore?: TimeStore;
    Cypress?: any;
  }
}

/**
 * Utility for running tests in Cypress.
 * Used to augment window object with mobx store to make it accessible in tests
 * @param {Store} store
 */
export const CypressStoreProvider = () => {
  const { timeStore } = useRootStore();

  useEffect(() => {
    if (typeof window !== "undefined" && window.Cypress) {
      // if (typeof window !== "undefined") {
      window.TimeStore = timeStore;
      console.log(window.TimeStore);
    }
    return () => {
      if (window.TimeStore) {
        delete window.TimeStore;
      }
    };
  }, [timeStore]);

  return null;
};
