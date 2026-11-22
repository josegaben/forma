import React from "react";

/**
 * CONTROL A (English): Typical output when asking default ChatGPT / raw LLM:
 * "Build a very simple one-page website for Kanso, a small specialty coffee roaster in Madrid with a monthly subscription."
 * (Without forma DESIGN.md constraints)
 */
export default function WithoutFormaEnglishDemoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Generic Sticky Navbar */}
      <nav className="border-b border-white/10 bg-slate-900/80 backdrop-blur px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
            ☕
          </span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            KansoCoffee
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-300">
          <span>Home</span>
          <span>Features</span>
          <span>Pricing</span>
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-semibold text-white shadow-lg shadow-purple-500/30">
            Get Started Free! 🚀
          </button>
        </div>
      </nav>

      {/* AI Slop Hero */}
      <section className="relative overflow-hidden py-20 px-6 text-center bg-gradient-to-b from-indigo-950/60 via-purple-950/30 to-slate-950">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span>● LIVE · 01 // THE FUTURE OF COFFEE IN MADRID</span>
        </div>

        <h1 className="text-5xl font-extrabold max-w-3xl mx-auto leading-tight">
          Supercharge your mornings and take your coffee to the{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            next level
          </span>
        </h1>

        <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto">
          At Kanso we revolutionize the way you experience specialty coffee through a seamless, frictionless, next-generation morning workflow built to unlock your daily potential.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 font-bold shadow-xl shadow-purple-600/30">
            Subscribe Now ✨
          </button>
          <button className="px-7 py-3.5 rounded-full border border-slate-700 bg-slate-900 text-slate-300">
            Learn More
          </button>
        </div>
      </section>

      {/* 3 Identical Generic Icon Cards + Numbered Eyebrows */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
            02 // WHY CHOOSE US
          </div>
          <h2 className="text-3xl font-bold">Powerful features built for you</h2>
          <p className="text-slate-400 mt-2">
            Discover all the amazing features that make our coffee subscription stand out.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: "⚡",
              step: "01 // QUALITY",
              title: "100% Premium Beans",
              desc: "We carefully curate the world's finest beans to guarantee an unmatched, high-performance cup every morning.",
            },
            {
              icon: "🚀",
              step: "02 // SPEED",
              title: "Ultra-Fast Delivery",
              desc: "Our smart logistics engine delivers your coffee subscription straight to your doorstep with zero friction.",
            },
            {
              icon: "💎",
              step: "03 // EXPERIENCE",
              title: "Game-Changing Flavor",
              desc: "Transform your daily routine with aromatic profiles engineered to maximize your focus and productivity.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/20 shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl mb-4">
                {card.icon}
              </div>
              <div className="text-[11px] font-bold text-purple-400 mb-1">{card.step}</div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Absurd SaaS 3-Tier Pricing for a tiny coffee shop */}
      <section className="py-14 px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">
            03 // FLEXIBLE PLANS
          </div>
          <h2 className="text-3xl font-bold">Pick the right tier to scale your energy</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-sm text-slate-400">Starter</div>
            <div className="text-3xl font-extrabold my-2">$19<span className="text-sm font-normal">/mo</span></div>
            <button className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 text-sm font-semibold">Choose Starter</button>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-900/50 to-slate-900 border-2 border-purple-500 relative">
            <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-purple-500 text-[10px] font-bold">
              MOST POPULAR 🔥
            </span>
            <div className="text-sm text-purple-300">Pro Roaster</div>
            <div className="text-3xl font-extrabold my-2">$39<span className="text-sm font-normal">/mo</span></div>
            <button className="mt-4 w-full py-2.5 rounded-xl bg-purple-600 text-sm font-bold">Choose Pro</button>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-sm text-slate-400">Enterprise</div>
            <div className="text-3xl font-extrabold my-2">$99<span className="text-sm font-normal">/mo</span></div>
            <button className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 text-sm font-semibold">Contact Sales</button>
          </div>
        </div>
      </section>
    </div>
  );
}
