import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "GraphRAG Learning Map",
  description:
    "LangChain, LangGraph, Neo4j, ontology and GraphRAG concepts explained through a Korean learning site.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
