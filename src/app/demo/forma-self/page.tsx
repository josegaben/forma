"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import { AgentBadgeRow, FormaLogo, GitHubIcon } from "@/components/FormaLogo";

/**
 * DOGFOOD SPECIMEN (/demo/forma-self):
 * What `forma.to` looks like when synthesized strictly from its own [TRG+RSZ+PDP+21D+RNO] DESIGN.md
 * + `sec-treg-to-hero` Clean DOM blueprint + `pdepablo.com` frosted dock + `unslop-ui` subtractive pass.
 */
const ROLES = [
  "a Swiss brand studio",
  "a design engineer",
  "a motion director",
  "a SaaS UI architect",
];

const JOBS = [
  {
    task: "Synthesize a 5-layer brand & UI system",
    legacy: "$6,000 agency",
    formaRate: "$0.00 · /api/compose",
    refs: "treg.to × resiz.es × pdepablo",
  },
  {
    task: "Extract real Hero, Navbar & Pricing Clean DOM",
    legacy: "$15/mo Mobbin",
    formaRate: "$0.04 · Playwright + Vision",
    refs: "linear.app · cal.com · resend.com",
  },
  {
    task: "60-30-10 perceptual OKLCH color harmony",
    legacy: "Manual contrast math",
    formaRate: "$0.00 · 16 WCAG AAA sets",
    refs: "Sanzo Wada · Radix · Happy Hues",
  },
  {
    task: "Install tactile React & spring primitives",
    legacy: "$149 UI kit",
    formaRate: "$0.00 · shadcn CLI",
    refs: "Rare UI · Vaul · 21st.dev · cmdk",
  },
];

export default function FormaSelfDesignedPage() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [idea, setIdea] = useState("");

  const copyBootstrap = async () => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://forma.to";
    await navigator.clipboard
      .writeText(`set up forma - ${origin}/llms.txt`)
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const launchInStudio = (e: React.FormEvent) => {
    e.preventDefault();
    const q = idea.trim();
    window.location.href = q ? `/?idea=${encodeURIComponent(q)}#studio` : "/#studio";
  };

  return (
    <div
      className="min-h-screen pb-28 editorial-dot-canvas"
      style={{ backgroundColor: "#f4f4f1", color: "#141413" }}
    >
      {/* Skeleton 01 — Airy Top Bar (sec-treg-to-navbar) */}
      <header className="mx-auto max-w-[1120px] px-6 py-6 flex items-center justify-between">
        <a href="/" aria-label="forma home">
          <FormaLogo size={27} />
        </a>

        <nav
          aria-label="Primary"
          className="flex items-center gap-6 text-[13.5px] text-[#6e6d68]"
        >
          <a href="/#catalog" className="hover:text-[#141413] transition-colors">
            Catalog
          </a>
          <a href="/credits" className="hover:text-[#141413] transition-colors">
            Pricing
          </a>
          <a
            href="https://github.com/josegaben/forma-xray"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[#141413] font-medium hover:opacity-75"
          >
            <GitHubIcon className="w-4 h-4" />
            <span>Repo</span>
          </a>
          <a
            href="/credits"
            className="px-3.5 py-1.5 rounded-full bg-[#141413] text-[#fbfbfa] text-[12.5px] font-medium"
          >
            Start free
          </a>
        </nav>
      </header>

      {/* Skeleton 02 — Centered Editorial Hero + 3-Node Agent Routing Flow (sec-treg-to-hero) */}
      <main className="mx-auto max-w-[1080px] px-6 pt-10">
        <section className="text-center max-w-[820px] mx-auto">
          <a
            href="https://github.com/josegaben/forma-xray"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-black/8 text-[12px] text-[#6e6d68] hover:text-[#141413] mb-8 tabular-nums"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            <span>230+ design assets · 85 directories · open source ↗</span>
          </a>

          <h1
            className="text-[clamp(2.8rem,5.6vw,4.65rem)] leading-[1.02] tracking-[-0.03em] font-normal"
            style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
          >
            OpenRouter for <span className="italic">web design</span>
          </h1>

          <p
            className="mt-5 text-[clamp(1.3rem,2.3vw,1.75rem)] text-[#6e6d68] flex flex-wrap items-center justify-center gap-2.5"
            style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
          >
            <span>Turn</span>
            <AgentBadgeRow />
            <span>into</span>
            <button
              type="button"
              onClick={() => setRoleIdx((i) => (i + 1) % ROLES.length)}
              className="text-[#141413] underline decoration-black/20 underline-offset-4 hover:decoration-black cursor-pointer"
            >
              {ROLES[roleIdx]}
            </button>
          </p>

          {/* 3-Node Routing Diagram extracted from sec-treg-to-hero Clean DOM */}
          <div
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-[12px] max-w-[680px] mx-auto py-3.5 px-5 rounded-[16px] bg-white/75 border border-black/8"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            <div className="text-left sm:text-center">
              <div className="text-[#8a8880] text-[10.5px]">input</div>
              <div className="text-[#141413] font-medium mt-0.5">your project idea</div>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#e06d44] font-medium">
              <span>───</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#141413] text-white text-[11px]">
                forma
              </span>
              <span>──▶</span>
            </div>
            <div className="text-left sm:text-center">
              <div className="text-[#141413] font-medium">DESIGN.md + Clean DOM</div>
              <div className="text-[#118453] text-[10.5px] mt-0.5">0% AI slop · $0 protocol</div>
            </div>
          </div>

          {/* Dark Floating "Give this to your agent" Terminal Bar */}
          <div className="mt-7 mx-auto max-w-[580px] rounded-[16px] bg-[#141413] text-[#fbfbfa] p-3.5 shadow-[var(--shadow-lg)] text-left">
            <div className="flex items-center justify-between px-1 mb-2 text-[11.5px] text-[#9e9d96]">
              <span>Give this to your agent</span>
              <span style={{ fontFamily: "var(--font-mono), monospace" }}>
                llms.txt · MCP · CLI
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 bg-[#0a0a09] border border-white/10 rounded-[11px] px-3.5 py-2.5">
              <code
                className="text-[12.5px] text-[#ededeb] truncate"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span className="text-[#706f69]">$ </span>set up forma - https://forma.to/llms.txt
              </code>
              <button
                type="button"
                onClick={copyBootstrap}
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#141413] text-[11.5px] font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#118453]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Single Effortless Idea Input -> Opens Full Interactive Studio */}
          <form
            onSubmit={launchInStudio}
            className="mt-4 mx-auto max-w-[580px] p-1.5 rounded-full bg-white border border-black/12 shadow-[var(--shadow-sm)] flex items-center gap-2"
          >
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Or type your project idea to synthesize a live preview..."
              aria-label="Project idea"
              className="flex-1 min-w-0 px-4 py-2 text-[14px] bg-transparent outline-none"
            />
            <button
              type="submit"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#141413] text-white text-[12.5px] font-medium cursor-pointer"
            >
              <span>Synthesize</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>

        {/* Skeleton 03 — 4-Column treg.to Strikethrough Legacy Replacement Grid */}
        <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {JOBS.map((job) => (
            <article
              key={job.task}
              className="visual-card p-5 flex flex-col justify-between gap-5"
            >
              <div>
                <h2 className="text-[15px] font-medium leading-snug">{job.task}</h2>
                <p
                  className="mt-2 text-[11px] text-[#767672]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {job.refs}
                </p>
              </div>
              <div
                className="pt-3 border-t border-black/8 flex items-center justify-between text-[11.5px] tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span className="line-through text-[#9a9891]">{job.legacy}</span>
                <span className="text-[#118453] font-medium">{job.formaRate}</span>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* P de Pablo Frosted Swiss Bottom Dock */}
      <nav
        aria-label="Quick navigation"
        className="fixed bottom-5 inset-x-0 mx-auto w-fit px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-black/10 shadow-[var(--shadow-md)] flex items-center gap-1 text-[12px]"
      >
        <a
          href="/#studio"
          className="px-3 py-1 rounded-full hover:bg-black/5 font-medium"
        >
          Interactive Studio
        </a>
        <a
          href="/#section-vault"
          className="px-3 py-1 rounded-full text-[#6e6d68] hover:text-[#141413]"
        >
          42 DOM Sections
        </a>
        <a
          href="/#proof"
          className="px-3 py-1 rounded-full text-[#6e6d68] hover:text-[#141413]"
        >
          Before / After
        </a>
        <a
          href="/credits"
          className="px-3 py-1 rounded-full bg-[#141413] text-white font-medium tabular-nums"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          $1.00 free
        </a>
      </nav>
    </div>
  );
}
