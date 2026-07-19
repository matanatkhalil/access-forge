import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
      <header className="max-w-4xl mx-auto mb-12 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600">Access Forge</h1>
        <p className="mt-2 text-lg text-slate-600">
          A growing suite of assistive technology and accessibility tools.
        </p>
      </header>

      <section className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2 items-stretch">
        {/* AAC Board */}
        <Link
          to="/aac-board"
          className="rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        >
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-indigo-300 transition-colors">
            <h2 className="text-xl font-bold mb-2">AAC Board</h2>
            <p className="text-slate-500 mb-4">
              Customizable high-contrast board for augmentative and alternative communication.
            </p>
          </div>
        </Link>

        {/* Contrast Checker */}
        <Link
          to="/contrast-checker"
          className="rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        >
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-indigo-300 transition-colors">
            <h2 className="text-xl font-bold mb-2">Contrast Checker</h2>
            <p className="text-slate-500 mb-4">WCAG-compliant color contrast evaluator.</p>
          </div>
        </Link>

        {/* Keyboard Trainer */}
        <Link
          to="/keyboard-trainer"
          className="rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        >
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-indigo-300 transition-colors">
            <h2 className="text-xl font-bold mb-2">Keyboard Navigation Trainer</h2>
            <p className="text-slate-500 mb-4">
              Interactive practice tool with guided exercises for mastering keyboard-only browsing.
            </p>
          </div>
        </Link>
      </section>
    </main>
  );
};

export default Home;
