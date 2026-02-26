import { createContext, useContext, useEffect, useReducer } from "react";

const ThemeContext = createContext(null);

const initialState = {
  theme: "light",
  fontSize: "md",
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME":
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };

    case "SET_FONT_SIZE":
      return {
        ...state,
        fontSize: action.payload,
      };

    default:
      return state;
  }
}

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      state.theme === "dark"
    );
  }, [state.theme]);

  useEffect(() => {
    const sizes = {
      sm: "14px",
      md: "16px",
      lg: "18px",
    };

    document.documentElement.style.setProperty(
      "--app-font-size",
      sizes[state.fontSize]
    );
  }, [state.fontSize]);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}