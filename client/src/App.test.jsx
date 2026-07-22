// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KeyboardTrainer from './tools/keyboard-trainer/KeyboardTrainer';
import AACBoard from './tools/aac-board/AACBoard';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('KeyboardTrainer', () => {
  async function startTabNavigationChallenge(user) {
    render(
      <MemoryRouter initialEntries={['/keyboard-trainer']}>
        <Routes>
          <Route path="/keyboard-trainer" element={<KeyboardTrainer />} />
          <Route path="/keyboard-trainer/:exerciseId" element={<KeyboardTrainer />} />
        </Routes>
      </MemoryRouter>
    );
    // Find the "Tab Navigation Flow" card specifically, then click its button
    const card = screen.getByTestId('exercise-card-tab-navigation');
    const startButton = within(card).getByRole('button', { name: /start environment/i });
    await user.click(startButton);

    expect(screen.getByText(/step 1 of/i)).toBeInTheDocument();
  }

  it('advances exercise state on correct key press', async () => {
    const user = userEvent.setup();
    await startTabNavigationChallenge(user);

    // Step 1 (focus-type): Tab into name-input
    await user.tab();
    expect(screen.getByRole('textbox')).toHaveFocus();
    expect(screen.getByText(/step 2 of/i)).toBeInTheDocument();

    // Step 2 (input-type): typing satisfies validate()
    await user.type(screen.getByRole('textbox'), 'Matanat');
    expect(screen.getByText(/step 3 of/i)).toBeInTheDocument();

    // Step 3 (focus-type): Tab onto terms-checkbox
    await user.tab();
    expect(screen.getByRole('checkbox')).toHaveFocus();
    expect(screen.getByText(/step 4 of/i)).toBeInTheDocument();

    // Step 4 (keydown-type): Space checks it and advances
    await user.keyboard(' ');
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByText(/step 5 of/i)).toBeInTheDocument();
  });

  it('shows error feedback on incorrect key press without crashing', async () => {
    const user = userEvent.setup();
    await startTabNavigationChallenge(user);

    await user.tab(); // -> step 2 (focus on name-input)
    await user.type(screen.getByRole('textbox'), 'Matanat'); // -> step 3 (input satisfied)
    await user.tab(); // -> step 4 (focus on checkbox)
    expect(screen.getByText(/step 4 of/i)).toBeInTheDocument();

    // Step 4 expects Spacebar; press Enter instead
    await user.keyboard('{Enter}');

    expect(screen.getByText(/wrong key! you pressed "enter"/i)).toBeInTheDocument();
    expect(screen.getByText(/step 4 of/i)).toBeInTheDocument(); // unchanged
    expect(screen.getByRole('checkbox')).not.toBeChecked(); // no side effect

    // App remains usable — correct key still works after the mistake
    await user.keyboard(' ');
    expect(screen.getByText(/step 5 of/i)).toBeInTheDocument();
  });
});

describe('AACBoard', () => {
  it('appends selected tile label to the sentence bar', () => {
    render(<AACBoard />);

    const eatBtn = screen.getByRole('button', { name: /^eat$/i });
    fireEvent.click(eatBtn);

    const sentenceDisplay = screen.getByRole('status');
    expect(sentenceDisplay).toHaveTextContent('Eat');
  });
});
