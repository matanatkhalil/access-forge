import { useState, useRef, useEffect } from 'react';

const ModalFocusTrapExercise = ({ handleKeyDown, isCompleted, handleFocus, onModalToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const firstElementRef = useRef(null);
  const lastElementRef = useRef(null);
  const triggerButtonRef = useRef(null);

  const modalRef = useRef(null); // Ref to track the inner modal box

  // Auto-focus the first element when the modal opens

  useEffect(() => {
    if (isOpen) {
      firstElementRef.current?.focus();
    }
  }, [isOpen]);

  // Global Focus Trap
  // If the modal is open and focus lands anywhere outside of it, instantly snap it back
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalFocus = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        e.preventDefault();
        firstElementRef.current?.focus();
      }
    };

    document.addEventListener('focusin', handleGlobalFocus);
    return () => {
      document.removeEventListener('focusin', handleGlobalFocus);
    };
  }, [isOpen]);

  // Handle opening via Keyboard (Enter or Space)
  const handleTriggerKeyDown = (e) => {
    if (isCompleted) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Stops page scrolling
      setIsOpen(true);

      if (handleKeyDown) handleKeyDown(e); // Notify engine: Trigger activated
    }
  };

  useEffect(() => {
    if (onModalToggle) {
      onModalToggle(isOpen);
    }
  }, [isOpen, onModalToggle]);

  // Handle internal modal keyboard interactions
  const handleModalKeyDown = (e) => {
    if (isCompleted) return;

    // Press Escape to close and finish the game
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerButtonRef.current?.focus();

      if (handleKeyDown) {
        // Force the target ID to match what the step configuration expects
        // This allows the challenge to complete from both buttons seamlessly
        handleKeyDown({
          key: 'Escape',
          target: { id: 'cancel-btn' },
        });
      }
      return;
    }

    if (e.key === 'Tab') {
      if (handleKeyDown) handleKeyDown(e);

      if (e.shiftKey) {
        // Shift + Tab (moving backwards)

        if (document.activeElement === firstElementRef.current) {
          e.preventDefault();
          lastElementRef.current?.focus();
        }
      } else {
        // Plain Tab (moving forwards)
        if (document.activeElement === lastElementRef.current) {
          e.preventDefault();
          firstElementRef.current?.focus();
        }
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 min-h-[350px] w-full border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <button
        id="modal-trigger"
        ref={triggerButtonRef}
        disabled={isCompleted}
        onFocus={handleFocus}
        onKeyDown={handleTriggerKeyDown}
        onClick={() => {
          if (!isCompleted) {
            setIsOpen(true);
            if (handleKeyDown) {
              handleKeyDown({ key: 'Enter', target: triggerButtonRef.current });
            }
          }
        }}
        className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-sm shadow-sm transition-all disabled:bg-slate-300 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-600"
      >
        {isCompleted ? 'Challenge Completed! ✓' : 'Open Delete Account Window'}
      </button>

      {isOpen && (
        <div
          onKeyDown={handleModalKeyDown}
          className="absolute inset-0 bg-slate-900/20 rounded-xl flex items-center justify-center p-4 z-40"
        >
          <div
            ref={modalRef}
            className="bg-white border border-slate-200 p-8 rounded-xl max-w-sm w-full shadow-xl text-center space-y-6 !select-text !pointer-events-auto"
          >
            <h3 className="text-lg font-extrabold text-slate-900">Are you absolutely sure?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {
                "You've trapped your focus! The background is completely locked to prevent accidental clicks, so hitting Tab loops your cursor strictly between these two buttons."
              }
            </p>

            <div className="flex gap-3 justify-center">
              <button
                id="confirm-btn"
                ref={firstElementRef}
                onClick={() => {
                  setIsOpen(false);
                  triggerButtonRef.current?.focus();
                }}
                className="px-4 py-2 bg-rose-600 text-white rounded-md text-xs font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                Confirm Delete
              </button>
              <button
                id="cancel-btn"
                ref={lastElementRef}
                onClick={() => {
                  setIsOpen(false);
                  triggerButtonRef.current?.focus();
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md text-xs font-bold focus:ring-2 focus:ring-slate-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ModalFocusTrapExercise;
