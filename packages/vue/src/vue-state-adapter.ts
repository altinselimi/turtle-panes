import { createState, createActions } from "@turtle-panes/core";
import type { ContextType } from '@turtle-panes/core'
import { reactive } from "vue";
import type { Reactive } from "vue";

export const createContext = (): Reactive<ContextType> => {
  const state = reactive(createState());
  const actions = createActions(state);
  return { state, ...actions };
};
