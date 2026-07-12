import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import TabExercise from './exercises/TabExercise';
import ArrowKeyExercise from './exercises/ArrowKeyExercise';
import SkipLinkExercise from './exercises/SkipLinkExercise';
import ModalFocusTrapExercise from './exercises/ModalFocusTrapExercise';

const EXERCISES = [
  {
    id: 'tab-navigation',
    title: 'Challenge 1: Tab Navigation Flow',
    description: 'Learn to move through interactive elements sequentially using the Tab key.',
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
        instruction: 'Press Tab to advance onto the "I agree to the terms" checkbox.',
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
    description: 'Learn to navigate through a dropdown menu using the arrow keys.',
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
    id: 'modal-focus',
    title: 'Challenge 4: Modal Focus Management',
    description:
      "Learn to keep your keyboard focus inside a modal so you don't get lost in the background.",
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
          'Press Tab to navigate inside the modal. Notice how the focus is contained within it.',
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
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const activeExerciseId = exerciseId ?? null;
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isError, setIsError] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const exerciseContainerRef = useRef(null);
  const shortcutTriggerRef = useRef(null);
  const sheetCloseBtnRef = useRef(null);
  const lastExerciseElementRef = useRef(null);

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
    setResetCount((prev) => prev + 1);

    // Warp focus back to the container wrapper so the next Tab press hits Step 1
    exerciseContainerRef.current?.focus();
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

  useEffect(() => {
    if (isSheetOpen) {
      sheetCloseBtnRef.current?.focus();
    } else {
      const target = lastExerciseElementRef.current;
      if (target && document.contains(target)) {
        target.focus();
      } else {
        exerciseContainerRef.current?.focus();
      }
    }
  }, [isSheetOpen]);

  // Focus the exercise panel whenever we land on a new exercise via navigation
  useEffect(() => {
    if (activeExerciseId) {
      exerciseContainerRef.current?.focus();
    }
  }, [activeExerciseId]);

  // Guard: if the URL has an exerciseId that doesn't match any known exercise, bounce to dashboard
  if (activeExerciseId && !currentExercise) {
    return <Navigate to="/keyboard-trainer" replace />;
  }

  // Dashboard Selector View
  if (!activeExerciseId) {
    return (
      <div className="w-full min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Keyboard Navigation Workspace
          </h1>
          <p className="text-lg text-slate-600 mb-10">
            Select an interactive environment below to practice accessible navigation patterns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXERCISES.map((ex) => (
              <div
                key={ex.id}
                data-testid={`exercise-card-${ex.id}`}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{ex.title}</h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{ex.description}</p>
                </div>
                <button
                  onClick={() => {
                    navigate(`/keyboard-trainer/${ex.id}`);
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
      <div
        className={`max-w-2xl mx-auto p-8 bg-white text-slate-800 rounded-xl shadow-sm border border-slate-200 ${
          isSheetOpen || isModalOpen ? 'pointer-events-none select-none' : ''
        }`}
        inert={isSheetOpen ? true : undefined}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <button
            onClick={() => navigate('/keyboard-trainer')}
            disabled={isModalOpen}
            className={`text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 inline-block focus:outline-none focus:ring-2 focus:ring-slate-400 ${isModalOpen ? 'pointer-events-none opacity-50' : ''}`}
          >
            ← Back to Selection
          </button>

          <button
            ref={shortcutTriggerRef}
            onClick={() => setIsSheetOpen(true)}
            disabled={isModalOpen}
            className={`text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-slate-400 ${isModalOpen ? 'pointer-events-none opacity-50' : ''}`}
          >
            View Shortcuts
          </button>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          {currentExercise.title}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-y-2 mb-6 border-b border-slate-100 pb-3">
          <p className="text-sm font-semibold text-slate-500">
            {isCompleted
              ? 'Challenge Complete'
              : `Step ${currentStepIdx + 1} of ${currentExercise.steps.length}`}
          </p>

          {/* Only show these secondary controls while the user is actively playing */}
          {!isCompleted && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={resetTrainer}
                disabled={isModalOpen}
                className={`px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-md text-[11px] font-bold transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                  isModalOpen ? 'opacity-50 pointer-events-none' : ''
                }`}
                title="Restart this challenge from Step 1"
              >
                {/* Vector SVG for restart icon */}
                <svg
                  className="w-3 h-3 stroke-[2.5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Reset
              </button>

              <button
                onClick={() => {
                  if (nextExercise) {
                    navigate(`/keyboard-trainer/${nextExercise.id}`);
                    resetTrainer();
                  } else {
                    navigate('/keyboard-trainer');
                    resetTrainer();
                  }
                }}
                disabled={isModalOpen}
                className={`px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-md text-[11px] font-bold transition focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                  isModalOpen ? 'opacity-50 pointer-events-none' : ''
                }`}
                title={nextExercise ? 'Skip to the next challenge' : 'Return to dashboard'}
              >
                {nextExercise ? 'Skip Challenge →' : 'Skip to End →'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-indigo-50 p-5 rounded-lg mb-8 border-l-4 border-indigo-600 min-h-[72px] flex items-center">
          <p className="text-base text-slate-800 font-medium leading-relaxed">
            {isCompleted
              ? '🎉 Excellent work! You successfully completed this entire exercise using only your keyboard.'
              : currentStep?.instruction}
          </p>
        </div>

        {/* Exercise Environment Panel */}
        <div
          ref={exerciseContainerRef}
          tabIndex={-1}
          onFocus={(e) => {
            if (e.target !== exerciseContainerRef.current) {
              lastExerciseElementRef.current = e.target;
            }
          }}
          className="bg-slate-50 p-8 rounded-xl border border-slate-200 space-y-6 focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
              key={resetCount}
            />
          )}

          {activeExerciseId === 'skip-links' && (
            <SkipLinkExercise
              isCompleted={isCompleted}
              handleFocus={handleFocus}
              handleKeyDown={handleKeyDown}
            />
          )}

          {activeExerciseId === 'modal-focus' && (
            <ModalFocusTrapExercise
              handleKeyDown={handleKeyDown}
              handleFocus={handleFocus}
              isCompleted={isCompleted}
              onModalToggle={setIsModalOpen}
            />
          )}
        </div>

        {isCompleted && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap justify-end gap-3">
            <button
              onClick={resetTrainer}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Retry Challenge
            </button>

            {nextExercise ? (
              /* If there is another game next in line */
              <button
                onClick={() => {
                  navigate(`/keyboard-trainer/${nextExercise.id}`);
                  resetTrainer();
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black whitespace-nowrap"
              >
                Next Challenge →
              </button>
            ) : (
              /* If they just completed the 4th and final game */
              <button
                onClick={() => {
                  navigate('/keyboard-trainer');
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
                ref={sheetCloseBtnRef}
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
                  Moves focus forward to the next interactive element.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Shift + Tab
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Moves focus backward to the previous interactive element.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Enter
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Activates links and buttons, and submits forms.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Spacebar
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Toggles checkboxes, activates buttons, and scrolls the page.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Arrow Keys
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Navigates between items inside components like dropdown menus, lists, radio
                  groups, and tabs.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Escape
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Closes active modals, dropdown menus, and popups.
                </p>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-xs font-bold text-slate-700">
                  Skip Links
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Hidden shortcuts that appear on first focus, allowing you to jump directly past
                  repetitive headers to the main content.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={() => setIsSheetOpen(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
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
