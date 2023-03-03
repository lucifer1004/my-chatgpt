import produce from "immer";
import React, { createContext, useReducer } from "react";

interface MyChatGPTState {
  inited: boolean;
  indices: string[];
}

export interface MyChatGPTAction {
  type: string;
  chatId?: string;
}

interface MyChatGPTReducer {
  state: MyChatGPTState;
  dispatch: React.Dispatch<MyChatGPTAction>;
}

const initialState = (): MyChatGPTState => ({
  inited: false,
  indices: [],
});

const MyChatGPTContext = createContext<MyChatGPTReducer>({
  state: undefined as unknown as MyChatGPTState,
  dispatch: undefined as unknown as React.Dispatch<MyChatGPTAction>,
});

const reducer = (state: MyChatGPTState, action: MyChatGPTAction) => {
  switch (action.type) {
    case "init":
      if (!state.inited) {
        const indices = localStorage.getItem("my-chatgpt-indices");
        if (indices) {
          return produce(state, (draft) => {
            draft.inited = true;
            draft.indices = JSON.parse(indices);
          });
        } else {
          localStorage.setItem("my-chatgpt-indices", "[]");
          return produce(state, (draft) => {
            draft.inited = true;
            draft.indices = [];
          });
        }
      } else {
        return state;
      }

    case "create":
      if (localStorage.getItem(action.chatId) === null) {
        localStorage.setItem(action.chatId, "[]");
        localStorage.setItem(
          "my-chatgpt-indices",
          JSON.stringify([...state.indices, action.chatId])
        );
      }

      return produce(state, (draft) => {
        if (draft.indices.findIndex((x) => x === action.chatId) === -1) {
          draft.indices.push(action.chatId);
        }
      });

    default:
      return state;
  }
};

interface MyChatGPTProviderProps {
  children?: React.ReactNode;
}

const MyChatGPTProvider = ({ children }: MyChatGPTProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState());
  const value = { state, dispatch };

  return (
    <>
      <MyChatGPTContext.Provider value={value}>
        {children}
      </MyChatGPTContext.Provider>
    </>
  );
};

const MyChatGPTConsumer = MyChatGPTContext.Consumer;

export { MyChatGPTConsumer, MyChatGPTContext, MyChatGPTProvider };
