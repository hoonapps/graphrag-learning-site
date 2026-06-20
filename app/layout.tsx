import type { Metadata } from "next";
import type { ReactNode } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import "./globals.css";

const inlineCss = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");

export const metadata: Metadata = {
  title: "GraphRAG Learning Map",
  description:
    "LangChain, LangGraph, Neo4j, ontology and GraphRAG concepts explained through a Korean learning site.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="build-version" content="layout-guard-2026-06-20" />
        <style dangerouslySetInnerHTML={{ __html: inlineCss }} />
      </head>
      <body
        style={{
          margin: 0,
          maxWidth: "100%",
          overflowX: "hidden",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(246, 247, 242, 0.9)), radial-gradient(circle at top left, rgba(15, 124, 114, 0.14), transparent 34rem), #f6f7f2",
          color: "#1f2523",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
