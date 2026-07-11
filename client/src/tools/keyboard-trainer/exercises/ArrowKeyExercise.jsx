import { useState, useRef } from 'react';

const menuItems = ['Profile', 'Settings', 'Dashboard', 'Logout'];

const ArrowKeyExercise = ({ isCompleted, handleFocus, handleKeyDown }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const menuButtonRef = useRef(null);
  const itemRefs = useRef([]);

  const handleMenuKeyDown = (e) => {
    if (isCompleted) return;

    // Handle opening menu with Enter or Space
    if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setIsOpen(true);

      if (handleKeyDown) handleKeyDown(e); // Notify parent: "Enter pressed on trigger"
      return;
    }

    if (!isOpen) return;

    // Arrow keys to navigate internal items
    if (e.key === 'ArrowDown') {
      e.preventDefault(); // Stop Webpage from scrolling down
      const nextIndex = focusedIndex < menuItems.length - 1 ? focusedIndex + 1 : 0;
      setFocusedIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();

      if (handleKeyDown) handleKeyDown(e); // Notify parent: "ArrowDown pressed"
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault(); // Stop webpage from scrolling up
      const nextIndex = focusedIndex > 0 ? focusedIndex - 1 : menuItems.length - 1;
      setFocusedIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();
    }

    // Handle selecting an item with an Enter or Spacebar
    if ((e.key === 'Enter' || e.key === ' ') && focusedIndex !== -1) {
      e.preventDefault();
      const selectedItem = menuItems[focusedIndex];

      // Let the parent engine process the keydown event before closing menu
      if (handleKeyDown) handleKeyDown(e);

      if (selectedItem === 'Settings') {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    // Close menu on Escape
    if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
      menuButtonRef.current?.focus();
    }
  };
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[22rem]">
      {' '}
      <div className="relative inline-block text-left">
        <button
          id="menu-trigger"
          ref={menuButtonRef}
          onFocus={handleFocus}
          onKeyDown={handleMenuKeyDown}
          onClick={() => !isCompleted && setIsOpen(!isOpen)}
          disabled={isCompleted}
          className="px-5 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold tracking-wide shadow-sm hover:bg-slate-700 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 focus:outline-none disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          {isCompleted ? 'Challenge Completed! ✓' : 'Options Menu'}
        </button>

        {isOpen && (
          <div
            className="absolute left-0 right-0 sm:right-auto mt-2 w-auto sm:w-48 max-w-full bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 focus:outline-none"
            onKeyDown={handleMenuKeyDown}
          >
            {menuItems.map((item, idx) => (
              <button
                key={item}
                id={`menu-item-${idx}`}
                ref={(el) => (itemRefs.current[idx] = el)}
                tabIndex={-1} // Keeps standard Tab highway out of the dropdown
                onClick={() => {
                  if (item === 'Settings' && handleKeyDown) {
                    // Create a dummy Enter event to satisfy the step engine if they click it
                    handleKeyDown({ key: 'Enter', target: itemRefs.current[idx] });
                  }
                  setIsOpen(false);
                  setFocusedIndex(-1);
                }}
                className="w-full text-left px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:bg-indigo-50 focus:text-indigo-600 outline-none transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ArrowKeyExercise;
