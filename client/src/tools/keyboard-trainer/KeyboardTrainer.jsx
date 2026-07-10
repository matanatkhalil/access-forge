import { useState, useRef } from 'react';
import TabExercise from './exercises/TabExercise';
import ArrowKeyExercise from './exercises/ArrowKeyExercise';
import SkipLinkExercise from './exercises/SkipLinkExercise';
import ModalFocusTrapExercise from './exercises/ModalFocusTrapExercise';

const EXERCISES = [
  {
    id: 'tab-navigation',
    title: 'Challenge 1: Tab Navigation Flow',
    description:
      'Learn to move through interactive elements sequentially using Tab and activate inputs.',
    steps: [
      {
        type: 'focus',
        targetId: 'name-input',
        instruction: 'Press Tab to move your focus into the Name input field.',
      },
      {
        type: 'input',
        targetId: 'name-input',
        validate: (val) => val.trim().length > 0,
        instruction: 'Excellent. Now type your name into the text box.',
      },
      {
        type: 'focus',
        targetId: 'terms-checkbox',
        instruction: 'Press Tab to advance onto the "Agree to Terms" checkbox.',
      },
      {
        type: 'keydown',
        key: ' ',
        targetId: 'terms-checkbox',
        instruction: 'Press Spacebar to check the agreement box.',
      },
      {
        type: 'focus',
        targetId: 'submit-button',
        instruction: 'Press Tab to move your focus to the Submit button.',
      },
      {
        type: 'keydown',
        key: 'Enter',
        targetId: 'submit-button',
        instruction: 'Press Enter to submit the form and finish the challenge!',
      },
    ],
  },
  {
    id: 'arrow-keys',
    title: 'Challenge 2: Arrow Key Menus',
    description: 'Master navigation through custom components like menus, dropdowns, and lists.',
    steps: [
      {
        type: 'focus',
        targetId: 'menu-trigger',
        instruction: 'Tab onto the "Options Menu" button.',
      },
      {
        type: 'keydown',
        key: ['Enter', ' '],
        targetId: 'menu-trigger',
        instruction: 'Press Enter or Space to open the Options Menu.',
      },
      {
        type: 'keydown',
        key: 'ArrowDown',
        targetId: 'menu-trigger',
        instruction: 'Press the Down Arrow key to navigate into the menu items.',
      },
      {
        type: 'keydown',
        key: 'ArrowDown',
        targetId: 'menu-item-0',
        instruction: 'Press the Down Arrow key again to highlight "Settings".',
      },
      {
        type: 'keydown',
        key: ['Enter', ' '],
        targetId: 'menu-item-1',
        instruction:
          'Press Enter or Spacebar on "Settings" to select it and complete the challenge.',
      },
    ],
  },
  {
    id: 'skip-links',
    title: 'Challenge 3: Bypass Blocks (Skip Links)',
    description:
      'Learn to skip repetitive navigation headers and jump straight to the main page content.',
    steps: [
      {
        type: 'focus',
        targetId: 'skip-link-btn',
        instruction: 'Press Tab to reveal the hidden "Skip to Main Content" button!',
      },
      {
        type: 'keydown',
        key: 'Enter',
        targetId: 'skip-link-btn',
        instruction: 'Press Enter to activate the link and warp focus to the main content area.',
      },
      {
        type: 'focus',
        targetId: 'main-content-btn',
        instruction:
          'Focus is now safely inside the main container. Press Tab to highlight the primary action button!',
      },
      {
        type: 'keydown',
        key: 'Enter',
        targetId: 'main-content-btn',
        instruction: 'Perfect! Press Enter to execute the main action and complete the challenge.',
      },
    ],
  },
  {
    id: 'focus-trap',
    title: 'Challenge 4: Modal Focus Management',
    description:
      "Learn how to keep your keyboard navigation inside a popup window so you don't get lost in the background.",
    steps: [
      {
        key: 'Tab',
        targetId: 'modal-trigger',
        instruction: "Press Tab to navigate to the 'Open Delete Account Window' button.",
        type: 'focus',
      },
      {
        key: ['Enter', ' '],
        targetId: 'modal-trigger',
        instruction: 'Press Enter or Space to open the Delete Account window.',
        type: 'keydown',
      },
      {
        key: 'Tab',
        targetId: 'confirm-btn',
        instruction:
          'Press Tab to navigate inside the modal. Notice how the focus is contained inside the popup.',
        type: 'keydown',
      },
      {
        key: 'Escape',
        targetId: 'cancel-btn',
        instruction: 'Press Escape to close the modal and complete the challenge.',
        type: 'keydown',
      },
    ],
  },
];

const KeyboardTrainer = () => {
  const [activeExerciseId, setActiveExerciseId] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isError, setIsError] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exerciseContainerRef = useRef(null);

  const currentExercise = EXERCISES.find((ex) => ex.id === activeExerciseId);
  const currentStep = currentExercise?.steps[currentStepIdx];
  const isCompleted = currentExercise && currentStepIdx >= currentExercise.steps.length;

  // Find the array index of the current active exercise
  const currentExerciseIdx = EXERCISES.findIndex((ex) => ex.id === activeExerciseId);

  // Grab the next exercise object in line (if it exists)
  const nextExercise = EXERCISES[currentExerciseIdx + 1];

  const resetTrainer = () => {
    setCurrentStepIdx(0);
    setFeedback('');
    setIsError(false);
    setNameValue('');
    setIsChecked(false);

    // Warp focus back to the container wrapper so the next Tab press hits Step 1
    setTimeout(() => {
      exerciseContainerRef.current?.focus();
    }, 10);
  };

  const handleFocus = (e) => {
    if (isCompleted || !currentStep || currentStep.type !== 'focus') return;

    if (e.target.id === currentStep.targetId) {
      setIsError(false);
      setFeedback('Focus reached! Follow the next instruction please.');
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      setIsError(true);
      setFeedback('Wrong element focused! Keep tabbing to find the correct target.');
    }
  };

  const handleKeyDown = (e) => {
    if (isCompleted || !currentStep || currentStep.type !== 'keydown') return;

    const isKeyValid = Array.isArray(currentStep.key)
      ? currentStep.key.includes(e.key)
      : e.key === currentStep.key;

    if (isKeyValid && e.target.id === currentStep.targetId) {
      if (e.key === ' ') {
        e.preventDefault(); // Prevents page scrolling on spacebar press

        if (e.target.id === 'terms-checkbox') {
          setIsChecked(true);
        }
      }
      setIsError(false);
      setFeedback('Perfect activation!');
      setCurrentStepIdx((prev) => prev + 1);
    } else if (e.target.id === currentStep.targetId && !isKeyValid) {
      setIsError(true);
      const expected = Array.isArray(currentStep.key)
        ? currentStep.key.map((k) => (k === ' ' ? 'Spacebar' : k)).join(' or ')
        : currentStep.key === ' '
          ? 'Spacebar'
          : currentStep.key;

      const pressed = e.key === ' ' ? 'Spacebar' : e.key;

      setFeedback(`Wrong key! You pressed "${pressed}", but this step requires "${expected}".`);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNameValue(value);

    if (!currentStep || currentStep.type !== 'input') return;
    if (currentStep.validate(value)) {
      setFeedback('Input verified! Keep going.');
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  // Dashboard Selector View
  if (!activeExerciseId) {
    return (
      <div className="w-full min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Keyboard Navigation Workspace
          </h1>
          <p className="text-lg text-slate-600 mb-10">
            Select an interactive environment below to practice assistive navigation patterns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXERCISES.map((ex) => (
              <div
                key={ex.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{ex.title}</h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{ex.description}</p>
                </div>
                <button
                  onClick={() => {
                    setActiveExerciseId(ex.id);
                    resetTrainer();
                  }}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition text-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                  Start Environment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Active Challenge View
  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto p-8 bg-white text-slate-800 rounded-xl shadow-sm border border-slate-200">
        <div className={isModalOpen ? 'pointer-events-none select-none' : ''}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setActiveExerciseId(null)}
              disabled={isModalOpen}
              className={`text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 inline-block focus:underline ${isModalOpen ? 'pointer-events-none opacity-50' : ''}`}
            >
              ← Back to Selection
            </button>

            <button
              onClick={() => setIsSheetOpen(true)}
              disabled={isModalOpen}
              className={`text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition ${isModalOpen ? 'pointer-events-none opacity-50' : ''}`}
            >
              View Shortcuts
            </button>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
            {currentExercise.title}
          </h1>
          <p className="text-sm font-medium text-slate-500 mb-6">
            {isCompleted
              ? 'Challenge Complete'
              : `Step ${currentStepIdx + 1} of ${currentExercise.steps.length}`}
          </p>

          <div className="bg-indigo-50 p-5 rounded-lg mb-8 border-l-4 border-indigo-600 min-h-[72px] flex items-center">
            <p className="text-base text-slate-800 font-medium leading-relaxed">
              {isCompleted
                ? '🎉 Excellent work! You successfully completed this entire flow using keyboard operations.'
                : currentStep?.instruction}
            </p>
          </div>
        </div>

        {/* Exercise Environment Panel */}
        <div
          ref={exerciseContainerRef}
          tabIndex={-1}
          className="bg-slate-50 p-8 rounded-xl border border-slate-200 space-y-6"
        >
          {activeExerciseId === 'tab-navigation' && (
            <TabExercise
              nameValue={nameValue}
              isChecked={isChecked}
              isCompleted={isCompleted}
              handleInputChange={handleInputChange}
              handleFocus={handleFocus}
              handleKeyDown={handleKeyDown}
              setIsChecked={setIsChecked}
            />
          )}

          {activeExerciseId === 'arrow-keys' && (
            <ArrowKeyExercise
              isCompleted={isCompleted}
              handleFocus={handleFocus}
              handleKeyDown={handleKeyDown}
            />
          )}

          {activeExerciseId === 'skip-links' && (
            <SkipLinkExercise
              isCompleted={isCompleted}
              handleFocus={handleFocus}
              handleKeyDown={handleKeyDown}
            />
          )}

          {activeExerciseId === 'focus-trap' && (
            <ModalFocusTrapExercise
              handleKeyDown={handleKeyDown}
              handleFocus={handleFocus}
              isCompleted={isCompleted}
              onModalToggle={setIsModalOpen}
            />
          )}
        </div>

        {isCompleted && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end space-x-4">
            <button
              onClick={resetTrainer}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Retry Challenge
            </button>

            {nextExercise ? (
              /* If there is another game next in line */
              <button
                onClick={() => {
                  setActiveExerciseId(nextExercise.id);
                  resetTrainer();
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
              >
                Next Challenge →
              </button>
            ) : (
              /* If they just completed the 4th and final game */
              <button
                onClick={() => {
                  setActiveExerciseId(null);
                  resetTrainer();
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                Finish & Return to Dashboard
              </button>
            )}
          </div>
        )}

        {feedback && !isCompleted && (
          <div
            className={`mt-6 p-3 rounded-lg text-center transition-colors ${
              isError
                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                : 'bg-slate-100 text-indigo-700'
            } ${isModalOpen ? 'pointer-events-none select-none' : ''}`}
          >
            <p className="text-sm font-semibold">{feedback}</p>
          </div>
        )}
      </div>
      {/* Persistent Sidebar (Shortcut Sheet) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isSheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setIsSheetOpen(false)}
        />

        {/* Side Panel */}
        <div
          className={`absolute top-0 right-0 h-full overflow-y-auto overscroll-contain space-y-4 w-80 bg-white shadow-2xl p-6 flex flex-col border-l border-slate-200 transition-transform duration-300 ease-out ${isSheetOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">Shortcut Sheet</h2>
              <button
                onClick={() => setIsSheetOpen(false)}
                className="text-slate-500 hover:text-slate-800 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Tab
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Advances focus forward to the next interactive web element.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Shift + Tab
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Reverses focus direction, moving back to the previous element.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Enter
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Triggers links, form submissions, and button activations.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Spacebar
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Toggles native checkboxes, activates buttons, and controls page scrolling.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Arrow Keys
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Navigates between internal items inside custom components like dropdown menus,
                  radio groups, and tabs.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Escape
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Instantly closes active popups, modal dialog windows, and dropdown menus.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Skip Links
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Hidden shortcuts that appear on first focus, allowing users to jump directly past
                  repetitive headers to the main content.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={() => setIsSheetOpen(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
            >
              Close Reference
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardTrainer;
