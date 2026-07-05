// eslint-disable-next-line no-unused-vars
const ArrowKeyExercise = ({ isCompleted, handleFocus, handleKeyDown }) => {
  return (
    <div className="p-4 text-center bg-white rounded-lg border border-dashed border-slate-300">
      <button
        id="menu-trigger"
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className="px-4 py-2 bg-slate-200 rounded"
      >
        Options Menu (Placeholder)
      </button>
    </div>
  );
};
export default ArrowKeyExercise;
