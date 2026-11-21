import React from "react";

export function FormaLogo({
  size = 28,
  showWordmark = true,
}: {
  size?: number;
  showWordmark?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none group">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-[1.03]"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="#141413" />
        <rect
          x="0.5"
          y="0.5"
          width="31"
          height="31"
          rx="7.5"
          stroke="white"
          strokeOpacity="0.12"
        />
        {/* Top architectural lintel */}
        <path
          d="M7.5 8.5C7.5 7.94772 7.94772 7.5 8.5 7.5H24.5C25.0523 7.5 25.5 7.94772 25.5 8.5V11.75C25.5 12.3023 25.0523 12.75 24.5 12.75H12.75V13.75H7.5V8.5Z"
          fill="#FAF9F6"
        />
        {/* Middle composable layer (terracotta craft plane) */}
        <rect x="13.25" y="14.75" width="9.25" height="4.75" rx="1.25" fill="#E06D44" />
        {/* Vertical Swiss pillar */}
        <rect x="7.5" y="14.75" width="4.25" height="9.75" rx="1.25" fill="#FAF9F6" />
        {/* Modular frame corner indicator */}
        <rect
          x="19.75"
          y="21.25"
          width="5.75"
          height="3.25"
          rx="1"
          fill="#FAF9F6"
          fillOpacity="0.5"
        />
      </svg>

      {showWordmark && (
        <span className="inline-flex items-baseline gap-0.5">
          <span className="text-[17px] font-semibold tracking-[-0.04em] text-[#141413]">
            forma
          </span>
          <span
            className="text-[12px] text-[#8a8880] font-normal tracking-tight"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            .to
          </span>
        </span>
      )}
    </span>
  );
}

export function AgentBadgeRow() {
  return (
    <span
      className="inline-flex items-center gap-1.5 align-middle mx-1"
      aria-label="Claude, Codex, Cursor, and coding agents"
    >
      {/* Claude Terracotta Spark Squircle */}
      <span
        title="Claude Code"
        className="w-[24px] h-[24px] rounded-[7px] bg-[#D97757] inline-flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1.5V14.5M1.5 8H14.5M3.4 3.4L12.6 12.6M12.6 3.4L3.4 12.6"
            stroke="#FFF8F5"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {/* Codex / Terminal Royal Blue Squircle (homage to treg.to's blue >_ icon) */}
      <span
        title="Codex / CLI Agent"
        className="w-[24px] h-[24px] rounded-[7px] bg-[#5468FF] inline-flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 5.25L7.25 8L4 10.75M8.75 11H12"
            stroke="#FFFFFF"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Cursor Isometric Cube Squircle */}
      <span
        title="Cursor"
        className="w-[24px] h-[24px] rounded-[7px] bg-[#171716] inline-flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2L13.2 5V11L8 14L2.8 11V5L8 2Z"
            stroke="#FAF9F6"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M8 8L13 5.2M8 8V13.8M8 8L3 5.2" stroke="#FAF9F6" strokeWidth="1.2" />
        </svg>
      </span>
    </span>
  );
}

export function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}
