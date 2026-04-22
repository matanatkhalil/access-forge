import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import ContrastChecker from './tools/contrast-checker/ContrastChecker';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contrast-checker" element={<ContrastChecker />} />
    </Routes>
  );
};

export default App;
