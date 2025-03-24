import { createContext,useRef, useContext, useState, useMemo, FC, ReactNode } from "react";
import { createState, createProxyState, createActions } from "@turtle-panes/core";
import { ContextType } from "@turtle-panes/core/types";

const StateContext = createContext<ContextType | undefined>(undefined);

export const StateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [triggerRerender, setTriggerRerender] = useState(0);
  const state = useRef<any>(null);
  if(!state.current) {
    const initialState = createState();
    state.current = createProxyState(initialState, () => setTriggerRerender(prevCount => prevCount + 1));
  }
  const actions = useRef<any>(null);
  if(!actions.current) {
    actions.current = createActions(state.current);
  }

  const contextValue = useMemo(() => {
    return { state: state.current, ...actions.current };
  }, [triggerRerender]);

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use the state context
export const useStateContext = (): ContextType => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
