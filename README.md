# GraphRAG Learning Map

Next.js learning site that explains LangChain, LangGraph, Neo4j, ontology design, RAG and GraphRAG in Korean.

The site also connects the course material to a concrete product project: **SpecPilot AI**, a PC and laptop purchase decision agent.

## Tech stack

- Next.js App Router
- React
- TypeScript
- CSS modules via global app CSS
- Static export for GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

The app uses `output: "export"`, so the static build is written to `out/`.

For a local static export that can be opened from the filesystem with working client-side JS, use:

```bash
npm run build:local
```

## Deployment

GitHub Actions deploys `out/` to GitHub Pages on every push to `main`.

## Source context

- Inflearn: graphRAG - Neo4J로 구현하는 지식 그래프 기반 RAG 시스템
- Inflearn: 입문자를 위한 LangChain 기초
- LangGraph official docs
- Neo4j LangChain integration docs
