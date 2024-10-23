"use client";

import { produce } from "immer";
import type { ReactNode, Dispatch } from "react";
import { createContext, useReducer } from "react";
import {
  DEFAULT_TEMPERATURE,
  MAXIMUM_TEMPERATURE,
  MINIMUM_TEMPERATURE,
} from "../constants";

interface MyChatGPTState {
  inited: boolean;
  temperature: number;
  indices: string[];
}

export interface MyChatGPTAction {
  type: string;
  chatId?: string;
  temperature?: number;
  indices?: string[];
}

interface MyChatGPTReducer {
  state: MyChatGPTState;
  dispatch: React.Dispatch<MyChatGPTAction>;
}

const initialState = (): MyChatGPTState => ({
  inited: false,
  temperature: DEFAULT_TEMPERATURE,
  indices: [],
});

const MyChatGPTContext = createContext<MyChatGPTReducer>({
  state: undefined as unknown as MyChatGPTState,
  dispatch: undefined as unknown as Dispatch<MyChatGPTAction>,
});

const reducer = (state: MyChatGPTState, action: MyChatGPTAction) => {
  switch (action.type) {
    case "init": {
      if (!state.inited) {
        const indices = localStorage.getItem("my-chatgpt-indices");
        if (indices) {
          return produce(state, (draft) => {
            draft.inited = true;
            draft.indices = JSON.parse(indices);
          });
        }
        localStorage.setItem("my-chatgpt-indices", "[]");
        return produce(state, (draft) => {
          draft.inited = true;
          draft.indices = [];
        });
      }
      return state;
    }

    case "create": {
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
    }

    case "delete": {
      localStorage.removeItem(action.chatId);
      const remainingIndices = state.indices.filter(
        (index) => index !== action.chatId
      );
      localStorage.setItem(
        "my-chatgpt-indices",
        JSON.stringify(remainingIndices)
      );
      return produce(state, (draft) => {
        draft.indices = remainingIndices;
      });
    }

    case "import":
      return produce(state, (draft) => {
        draft.indices = action.indices || [];
      });

    case "clear":
      return produce(state, (draft) => {
        draft.indices = [];
      });

    case "set-temperature":
      return produce(state, (draft) => {
        draft.temperature = Math.max(
          MINIMUM_TEMPERATURE,
          Math.min(
            MAXIMUM_TEMPERATURE,
            action.temperature || DEFAULT_TEMPERATURE
          )
        );
      });

    default:
      return state;
  }
};

interface MyChatGPTProviderProps {
  children?: ReactNode;
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
