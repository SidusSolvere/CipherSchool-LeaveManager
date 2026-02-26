import { useTheme } from "./ThemeContext.jsx";
import { FiSun, FiMoon, FiPlus, FiMinus } from "react-icons/fi";

export default function ThemeControls() {
  const { state, dispatch } = useTheme();

  const sizes = ["sm", "md", "lg"];
  const currentIndex = sizes.indexOf(state.fontSize);

  const increaseFont = () => {
    if (currentIndex < sizes.length - 1) {
      dispatch({
        type: "SET_FONT_SIZE",
        payload: sizes[currentIndex + 1],
      });
    }
  };

  const decreaseFont = () => {
    if (currentIndex > 0) {
      dispatch({
        type: "SET_FONT_SIZE",
        payload: sizes[currentIndex - 1],
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-xl border border-subtle bg-elevated px-3 py-2 shadow-lg">
      <button
        onClick={decreaseFont}
        className="p-2 rounded-lg hover:bg-muted"
      >
        <FiMinus />
      </button>

      <button
        onClick={increaseFont}
        className="p-2 rounded-lg hover:bg-muted"
      >
        <FiPlus />
      </button>

      <div className="h-6 w-px bg-border-subtle mx-1" />

      <button
        onClick={() => dispatch({ type: "TOGGLE_THEME" })}
        className="p-2 rounded-lg hover:bg-muted"
      >
        {state.theme === "dark" ? <FiSun /> : <FiMoon />}
      </button>
    </div>
  );
}