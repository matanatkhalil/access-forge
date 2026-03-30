const App = () => {
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

      <section className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-indigo-300 transition-colors">
          <h2 className="text-xl font-bold mb-2">AAC Communication Board</h2>
          <p className="text-slate-500 mb-4">
            Customizable high-contrast board for non-verbal communication.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 opacity-60">
          <h2 className="text-xl font-bold mb-2">Contrast Checker</h2>
          <p className="text-slate-500">WCAG-compliant vision accessibility tool.</p>
        </div>
      </section>
    </main>
  );
};

export default App;
