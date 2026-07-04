import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import ContrastChecker from './tools/contrast-checker/ContrastChecker';
import KeyboardTrainer from './tools/keyboard-trainer/KeyboardTrainer';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contrast-checker" element={<ContrastChecker />} />
      <Route path="/keyboard-trainer" element={<KeyboardTrainer />} />
    </Routes>
  );
};

export default App;
