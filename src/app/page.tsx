import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_0%,#ecfeff,transparent_70%)]" />
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
            Voice that ships. <span className="text-emerald-600">ODIADEV</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl">
            Nigerian voices, instant playback, zero fuss. Add an AI assistant with audio to any site.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="/admin" className="px-5 py-3 rounded-xl bg-black text-white">Get a Site Key</a>
            <a href="#demo" className="px-5 py-3 rounded-xl border">Try the Demo</a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {[
          ["Drop-in widget", "Paste one script and go."],
          ["Your site key", "Rate-limited, domain-locked."],
          ["Audio that converts", "Fast TTS for real users."]
        ].map(([t, s])=>(
          <div key={t} className="p-6 rounded-2xl border shadow-sm bg-white">
            <h3 className="text-xl font-semibold">{t}</h3>
            <p className="mt-2 text-slate-600">{s}</p>
          </div>
        ))}
      </section>

      <section id="demo" className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-semibold">Live demo</h2>
        <div className="mt-4 border rounded-2xl p-4">
          <odiadev-chat project="landing"></odiadev-chat>
        </div>
      </section>

      <footer className="border-t py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ODIADEV
      </footer>
    </main>
  );
}
