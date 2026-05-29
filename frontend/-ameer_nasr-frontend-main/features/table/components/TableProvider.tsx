"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";

/* ---------- Types ---------- */
type TableState = {
  data: string[]; // store selected IDs
};

type TableAction =
  | { type: "ADD_DATA"; payload: string }
  | { type: "REMOVE_DATA"; payload: string }
  | { type: "ADD_ALL"; payload: string[] }
  | { type: "CLEAR_ALL" };

type TableContextType = {
  state: TableState;
  dispatch: Dispatch<TableAction>;
  /** Check if specific id is selected */
  isSelected: (id: string) => boolean;
  /** Returns the entire list of selected IDs */
  selectedIds: string[];
};

/* ---------- Default State ---------- */
const initialState: TableState = {
  data: [],
};

/* ---------- Reducer ---------- */
function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case "ADD_DATA":
      if (state.data.includes(action.payload)) return state;
      return { ...state, data: [...state.data, action.payload] };

    case "REMOVE_DATA":
      return {
        ...state,
        data: state.data.filter((id) => id !== action.payload),
      };

    case "ADD_ALL":
      return {
        ...state,
        data: Array.from(new Set([...state.data, ...action.payload])),
      };

    case "CLEAR_ALL":
      return { ...state, data: [] };

    default:
      return state;
  }
}

/* ---------- Context ---------- */
const TableContext = createContext<TableContextType | undefined>(undefined);

/* ---------- Provider ---------- */
export function TableProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tableReducer, initialState);

  const isSelected = (id: string) => state.data.includes(id);

  return (
    <TableContext.Provider
      value={{
        state,
        dispatch,
        isSelected,
        selectedIds: state.data,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

/* ---------- Hook ---------- */
export function useTable() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
}
