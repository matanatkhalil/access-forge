import { useState } from 'react';
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
      // Additional steps will go here
    ],
  },
  {
    id: 'skip-links',
    title: 'Challenge 3: Bypass Blocks (Skip Links)',
    description:
      'Learn to skip repetitive navigation headers and jump straight to the main page content.',
    steps: [],
  },
  {
    id: 'focus-trap',
    title: 'Challenge 4: Modal Focus Trapping',
    description:
      'Practice navigating inside modal dialogs securely without losing semantic context.',
    steps: [],
  },
];

const KeyboardTrainer = () => {
  const [activeExerciseId, setActiveExerciseId] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);

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
    setNameValue('');
    setIsChecked(false);
  };

  const handleFocus = (e) => {
    if (!currentStep || currentStep.type !== 'focus') return;
    if (e.target.id === currentStep.targetId) {
      setFeedback('Focus reached! Follow the next instruction please.');
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (!currentStep || currentStep.type !== 'keydown') return;
    if (e.key === currentStep.key && e.target.id === currentStep.targetId) {
      if (e.key === ' ') {
        e.preventDefault(); // Prevents page scrolling on spacebar press

        if (e.target.id === 'terms-checkbox') {
          setIsChecked(true);
        }
      }
      setFeedback('Perfect activation!');
      setCurrentStepIdx((prev) => prev + 1);
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
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition text-center text-sm"
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
        <button
          onClick={() => setActiveExerciseId(null)}
          className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 mb-4 inline-block focus:underline"
        >
          ← Back to Selection
        </button>

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
              ? '🎉 Outstanding work! You successfully completed this entire flow using keyboard operations.'
              : currentStep?.instruction}
          </p>
        </div>

        {/* Exercise Environment Panel */}
        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 space-y-6">
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

          {activeExerciseId === 'skip-links' && <SkipLinkExercise isCompleted={isCompleted} />}

          {activeExerciseId === 'focus-trap' && (
            <ModalFocusTrapExercise isCompleted={isCompleted} />
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
              >
                Finish & Return to Dashboard
              </button>
            )}
          </div>
        )}

        {feedback && !isCompleted && (
          <div className="mt-6 p-3 bg-slate-100 rounded-lg text-center">
            <p className="text-sm font-semibold text-indigo-700">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyboardTrainer;
