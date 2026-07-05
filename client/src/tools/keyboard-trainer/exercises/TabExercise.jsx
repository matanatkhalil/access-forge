const TabExercise = ({
  nameValue,
  isChecked,
  isCompleted,
  handleInputChange,
  handleFocus,
  handleKeyDown,
  setIsChecked,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="name-input" className="block text-sm font-semibold text-slate-700 mb-2">
          Name:
        </label>
        <input
          id="name-input"
          type="text"
          value={nameValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="w-full p-3 rounded-lg bg-white border border-slate-300 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
          placeholder="Type your name..."
          disabled={isCompleted}
        />
      </div>

      <div className="flex items-center space-x-3">
        <input
          id="terms-checkbox"
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="w-5 h-5 rounded text-indigo-600 bg-white border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:outline-none accent-indigo-600 transition"
          disabled={isCompleted}
        />
        <label htmlFor="terms-checkbox" className="text-sm font-medium text-slate-700 select-none">
          I agree to the terms
        </label>
      </div>

      <button
        id="submit-button"
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onClick={() => isCompleted && alert('Form Evaluated!')}
        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition"
      >
        Submit
      </button>
    </div>
  );
};

export default TabExercise;
