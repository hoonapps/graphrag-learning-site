import type { Metadata } from "next";
import type { ReactNode } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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
        <style dangerouslySetInnerHTML={{ __html: inlineCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
