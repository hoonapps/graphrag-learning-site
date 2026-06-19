import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const criticalCss = `
  :root { color-scheme: light; --bg: #f6f7f2; --ink: #1f2523; --muted: #63706b; --line: #d6ddd6; --accent: #0f7c72; }
  * { box-sizing: border-box; }
  html, body { max-width: 100%; overflow-x: hidden; }
  body { margin: 0; background: var(--bg); color: var(--ink); font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .topbar { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; min-height: 76px; padding: 0 3vw; border-bottom: 1px solid var(--line); background: rgba(246, 247, 242, 0.94); }
  .brand { display: inline-flex; align-items: center; gap: .8rem; color: inherit; text-decoration: none; }
  .brand-mark { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 10px; background: var(--ink); color: #fff; font-weight: 800; }
  .brand strong, .brand small { display: block; }
  .brand small, nav a, p { color: var(--muted); }
  nav { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .35rem; }
  nav a { padding: .62rem .82rem; border-radius: 8px; text-decoration: none; }
  main { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 56px; }
  .workspace { display: grid; grid-template-columns: minmax(0, .92fr) minmax(420px, 1.08fr); gap: 22px; align-items: stretch; }
  .panel { min-width: 0; border: 1px solid var(--line); border-radius: 8px; background: rgba(255,255,255,.94); }
  .intro-panel, .graph-panel { padding: clamp(24px, 4vw, 54px); }
  h1, h2, h3, p { margin-top: 0; }
  h1 { font-size: clamp(2.05rem, 4.15vw, 3.5rem); line-height: 1.04; letter-spacing: 0; }
  h1 span { display: block; }
  p { line-height: 1.7; overflow-wrap: anywhere; }
  .quick-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 2rem; }
  .knowledge-map { display: block; width: 100%; max-width: 100%; height: auto; aspect-ratio: 39 / 22; }
  @media (max-width: 920px) { .topbar { align-items: flex-start; flex-direction: column; padding: 18px 16px; } .workspace { grid-template-columns: 1fr; } }
  @media (max-width: 620px) { main { width: min(100% - 24px, 1180px); } .quick-grid { grid-template-columns: 1fr; } }
`;

export const metadata: Metadata = {
  title: "GraphRAG Learning Map",
  description:
    "LangChain, LangGraph, Neo4j, ontology and GraphRAG concepts explained through a Korean learning site.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
