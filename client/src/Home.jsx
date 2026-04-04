import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
      <header className="max-w-4xl mx-auto mb-12 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600">
          Access Forge <span className="text-slate-400">/</span>
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Building high-fidelity assistive technology for inclusive communication.
        </p>
      </header>

      <section className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2 items-stretch">
        <div className="relative group p-6 bg-white rounded-xl shadow-sm border border-slate-100 opacity-60 cursor-not-allowed transition-all">
          <div className="absolute inset-0 bg-slate-900/5 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Coming Soon
            </span>
          </div>

          <h2 className="text-xl font-bold mb-2 text-slate-400">AAC Communication Board</h2>
          <p className="text-slate-400 mb-4">
            Customizable high-contrast board for non-verbal communication.
          </p>
        </div>
        <Link to="/contrast-checker">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-indigo-300 transition-colors">
            <h2 className="text-xl font-bold mb-2">Contrast Checker</h2>
            <p className="text-slate-500 mb-4">WCAG-compliant vision accessibility tool.</p>
          </div>
        </Link>
      </section>
    </main>
  );
};

export default Home;
