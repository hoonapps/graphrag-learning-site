"use client";

import { useState } from "react";

type RouteKey = "vector" | "fulltext" | "cypher" | "hybrid";

const routeContent: Record<RouteKey, { badge: string; title: string; body: string; items: string[] }> = {
  vector: {
    badge: "의미가 비슷한 문서 조각을 찾을 때",
    title: "Vector Search",
    body:
      "임베딩은 문장을 숫자 벡터로 바꿔 의미가 가까운 문서를 찾는 기술입니다. 사용자가 정확한 단어를 몰라도 비슷한 의미의 문서를 찾을 수 있어서 RAG의 기본 검색 축이 됩니다.",
    items: [
      "좋은 질문: '영상 편집용 노트북에서 발열이 중요한 이유 알려줘'",
      "강점: 표현이 달라도 의미가 가까우면 검색됩니다.",
      "한계: 관계, 소유, 계층, 정확한 조건 비교에는 약합니다.",
    ],
  },
  fulltext: {
    badge: "정확한 모델명, 티커, 조항, 고유명사가 중요할 때",
    title: "Full-text Search",
    body:
      "전문 검색은 정확한 문자열 단서를 놓치지 않기 위한 검색입니다. Neo4j에서는 Full-text index를 만들어 제품명, 법 조항, 기업명, 기자명 같은 고유명사를 빠르게 찾을 수 있습니다.",
    items: [
      "좋은 질문: 'RTX 4070 SUPER가 들어간 견적 찾아줘'",
      "강점: 모델명, 코드, 조항명처럼 정확한 단어 검색에 강합니다.",
      "한계: 한국어는 CJK/nori 분석기 같은 언어 처리가 품질을 좌우합니다.",
    ],
  },
  cypher: {
    badge: "관계와 조건을 따라가야 할 때",
    title: "Text2Cypher",
    body:
      "Text2Cypher는 자연어 질문을 Cypher 쿼리로 바꿔 그래프 데이터베이스에서 관계 조건을 직접 탐색합니다. 온톨로지와 스키마 설명이 정확할수록 좋은 쿼리가 나옵니다.",
    items: [
      "좋은 질문: 'AM5 소켓 CPU와 호환되는 B650 견적 중 750W 파워 이상만 보여줘'",
      "강점: 노드와 관계를 따라가며 조건을 정확히 걸 수 있습니다.",
      "한계: 스키마가 불명확하면 LLM이 존재하지 않는 관계를 만들 수 있습니다.",
    ],
  },
  hybrid: {
    badge: "실서비스 답변 품질을 높이고 싶을 때",
    title: "Enhanced GraphRAG",
    body:
      "Enhanced GraphRAG는 벡터 검색으로 후보 문서를 찾고, 그래프 탐색으로 관련 엔티티와 관계를 확장한 뒤, 검증된 근거만 LLM에게 전달합니다.",
    items: [
      "좋은 질문: '200만원 영상 편집용 PC 견적을 근거와 함께 추천해줘'",
      "강점: 의미 검색과 관계 검색을 함께 사용해 설명 가능한 답변을 만듭니다.",
      "실무 팁: LangGraph로 검색, 검증, 재검색, 답변 생성을 노드로 분리합니다.",
    ],
  },
};

const mapNodes = [
  { title: "LLM Foundation", a: "LLM", b: "기초", tone: "gold" },
  { title: "LCEL Chain", a: "LCEL", b: "체인", tone: "ink" },
  { title: "Knowledge Graph", a: "Neo4j", b: "지식그래프", tone: "graph" },
  { title: "LangGraph Agent", a: "LangGraph", b: "워크플로", tone: "blue" },
];

const curriculum = [
  {
    title: "LLM 기초와 구조화 출력",
    goal: "모델이 왜 같은 질문에도 다른 답을 하는지, JSON 출력은 왜 깨지는지 이해합니다.",
    concepts: ["temperature", "system/user message", "Pydantic schema", "JSON mode"],
    mastery:
      "LLM은 확률적으로 다음 토큰을 고르는 모델입니다. temperature는 후보 토큰 분포를 얼마나 넓게 탐색할지 정합니다. 실서비스에서는 자유로운 글보다 구조화 출력이 중요하므로 Pydantic 같은 스키마로 결과 형식을 강제합니다.",
  },
  {
    title: "LangChain Core와 LCEL",
    goal: "Prompt, model, parser, retriever를 파이프라인처럼 조립합니다.",
    concepts: ["Runnable", "RunnableSequence", "RunnableParallel", "RunnablePassthrough"],
    mastery:
      "LCEL의 핵심은 모든 단계를 Runnable로 보고 input과 output 계약을 맞추는 것입니다. prompt | model | parser 형태는 단순 문법이 아니라 관찰 가능하고 재사용 가능한 실행 그래프의 기본 단위입니다.",
  },
  {
    title: "프롬프트와 Few-shot",
    goal: "좋은 답을 우연히 얻는 것이 아니라 재현 가능한 입력 형식을 설계합니다.",
    concepts: ["Zero-shot", "One-shot", "Few-shot", "Example selector"],
    mastery:
      "프롬프트는 말투를 꾸미는 문장이 아니라 모델에게 작업 정의, 입력 형식, 출력 형식, 실패 조건을 알려주는 인터페이스입니다. Few-shot은 모델에게 규칙을 설명하는 대신 정답 패턴을 보여주는 방식입니다.",
  },
  {
    title: "Tool Calling과 Agent",
    goal: "LLM이 직접 모르는 일을 도구 호출로 해결하게 만듭니다.",
    concepts: ["tool schema", "bind_tools", "ReAct", "tool result grounding"],
    mastery:
      "Tool Calling은 함수 시그니처를 모델의 선택지로 제공하는 구조입니다. Agent는 Reasoning과 Acting을 반복하면서 필요한 도구를 고르고, 결과를 다시 컨텍스트로 넣어 다음 행동을 결정합니다.",
  },
  {
    title: "RAG 파이프라인",
    goal: "모델 파라미터가 아니라 외부 근거를 주입해 환각을 줄입니다.",
    concepts: ["loader", "chunking", "embedding", "vector store", "retriever"],
    mastery:
      "RAG는 질문과 관련된 근거 문서를 찾아 프롬프트에 넣는 패턴입니다. 핵심 품질은 모델보다 청크 전략, 메타데이터, 검색 방식, 근거 압축, 출처 검증에서 갈립니다.",
  },
  {
    title: "Neo4j와 Cypher",
    goal: "데이터를 표가 아니라 노드와 관계로 생각합니다.",
    concepts: ["Node", "Relationship", "MATCH", "WHERE", "variable path"],
    mastery:
      "그래프 DB는 연결 자체가 1급 데이터입니다. 누가 무엇을 만들었는지, 어떤 부품이 어떤 견적에 들어가는지, 어떤 리뷰가 어떤 리스크를 유발했는지 같은 관계형 질문에 강합니다.",
  },
  {
    title: "온톨로지와 GraphRAG",
    goal: "LLM이 사용할 데이터 세계의 설계도를 만듭니다.",
    concepts: ["ontology", "constraint", "LLMGraphTransformer", "Text2Cypher"],
    mastery:
      "온톨로지는 노드, 관계, 속성, 제약조건의 합의입니다. GraphRAG는 벡터 검색만으로 찾기 어려운 관계와 경로를 그래프로 보강해 설명 가능한 RAG를 만듭니다.",
  },
  {
    title: "LangGraph 제품화",
    goal: "검색, 검증, 재시도, 답변 생성을 상태 기반 워크플로로 분리합니다.",
    concepts: ["StateGraph", "node", "edge", "conditional edge", "checkpoint"],
    mastery:
      "LangGraph는 Agent를 한 덩어리 함수로 두지 않고 상태 전이로 설계합니다. 어떤 단계에서 실패했는지 추적하고, 낮은 확신도면 재검색하거나 사용자에게 되묻는 구조를 만들 수 있습니다.",
  },
];

const deepLessons = [
  {
    number: "01",
    title: "LLM은 지식 저장소가 아니라 확률적 생성기입니다",
    explanation:
      "LLM은 데이터베이스처럼 사실을 조회하지 않습니다. 질문을 토큰으로 보고 다음 토큰의 확률분포를 계산합니다. 그래서 같은 질문도 temperature, system prompt, 이전 대화, 출력 형식에 따라 달라질 수 있습니다.",
    whyItMatters:
      "서비스에서는 그럴듯한 문장보다 안정적인 계약이 중요합니다. 그래서 JSON schema, Pydantic, structured output을 사용해 모델 출력이 다음 코드 단계에서 깨지지 않게 만듭니다.",
    code: `from pydantic import BaseModel

class ProductIntent(BaseModel):
    budget_krw: int
    purpose: str
    must_haves: list[str]
    exclusions: list[str]`,
    takeaway: "LLM 출력은 신뢰하지 말고 검증 가능한 구조로 받습니다.",
  },
  {
    number: "02",
    title: "LCEL은 AI 파이프라인의 배관입니다",
    explanation:
      "LangChain Expression Language는 prompt, model, retriever, parser, custom function을 같은 방식으로 연결합니다. 각 단계는 Runnable이고, 입력과 출력만 맞으면 교체할 수 있습니다.",
    whyItMatters:
      "나중에 Gemini에서 OpenAI로, FAISS에서 Neo4jVector로, 단순 parser에서 Pydantic parser로 바꿔도 전체 구조를 유지할 수 있습니다.",
    code: `chain = prompt | model | parser

rag_chain = {
    "context": retriever,
    "question": RunnablePassthrough(),
} | prompt | model | parser`,
    takeaway: "LCEL을 알면 RAG, Agent, GraphRAG의 실행 단위를 읽을 수 있습니다.",
  },
  {
    number: "03",
    title: "프롬프트는 요청 문장이 아니라 인터페이스입니다",
    explanation:
      "좋은 프롬프트는 역할, 입력 데이터, 판단 기준, 출력 형식, 금지사항을 분리합니다. Few-shot은 '이런 입력이면 이런 출력'이라는 패턴을 모델에게 보여주는 방식입니다.",
    whyItMatters:
      "Text2Cypher, 리뷰 리스크 분석, 견적 점수화처럼 정확한 형식이 필요한 작업은 말투보다 출력 계약이 중요합니다.",
    code: `system = """
You are a PC build analyst.
Return only JSON.
Never invent price or compatibility facts.
"""

human = """
User request: {query}
Known schema: {schema}
"""`,
    takeaway: "프롬프트는 LLM에게 제공하는 API 문서처럼 작성합니다.",
  },
  {
    number: "04",
    title: "Tool Calling은 LLM에게 손과 발을 달아주는 방식입니다",
    explanation:
      "LLM은 자체적으로 웹을 검색하거나 DB를 조회하지 못합니다. Tool schema를 주면 모델은 어떤 함수를 어떤 인자로 호출해야 할지 결정합니다.",
    whyItMatters:
      "PC 구매 AI에서는 가격 검색, 부품 호환성 체크, 벤치마크 조회, 리뷰 요약이 모두 도구가 됩니다. 도구 결과를 다시 모델에게 넣어 근거 있는 결론을 만듭니다.",
    code: `@tool
def check_compatibility(cpu_socket: str, board_socket: str, psu_watt: int) -> dict:
    return {
        "socket_ok": cpu_socket == board_socket,
        "psu_ok": psu_watt >= 650,
    }`,
    takeaway: "Agent의 품질은 모델보다 도구 설계와 결과 검증에서 갈립니다.",
  },
  {
    number: "05",
    title: "RAG는 문서를 붙이는 기술이 아니라 근거 선택 기술입니다",
    explanation:
      "RAG는 문서 로드, 청크 분할, 임베딩, 저장, 검색, 답변 생성으로 이어집니다. 중요한 것은 많은 문서를 넣는 것이 아니라 질문에 맞는 근거만 압축해 넣는 것입니다.",
    whyItMatters:
      "잘못된 청크는 좋은 모델도 망칩니다. 제목, 섹션, 날짜, 출처, 제품명 같은 메타데이터가 있어야 검색 결과를 필터링하고 답변 근거를 설명할 수 있습니다.",
    code: `docs = loader.load()
chunks = splitter.split_documents(docs)
vectorstore.add_documents(chunks)
context = retriever.invoke(question)`,
    takeaway: "RAG 품질은 chunking, metadata, retriever, reranker의 합입니다.",
  },
  {
    number: "06",
    title: "Neo4j는 관계 질문을 위한 검색 엔진입니다",
    explanation:
      "표 데이터는 row 중심이지만 그래프는 관계 중심입니다. Build가 Component를 사용하고, Offer가 Seller에 의해 제공되고, Review가 RiskSignal을 유발하는 구조를 자연스럽게 표현합니다.",
    whyItMatters:
      "질문이 '무엇과 무엇이 연결되어 있는가', '어떤 경로로 영향을 주는가', '이 조건을 만족하는 관계만 골라라'라면 Cypher가 벡터 검색보다 정확합니다.",
    code: `MATCH (b:Build)-[:USES]->(gpu:Component {type: "GPU"})
MATCH (b)-[:CHECKED_BY]->(signal:CompatibilitySignal)
WHERE gpu.name CONTAINS "RTX 4070" AND signal.status = "ok"
RETURN b.name, gpu.name, signal.reason`,
    takeaway: "GraphRAG의 힘은 문장 유사도가 아니라 관계 탐색에서 나옵니다.",
  },
  {
    number: "07",
    title: "온톨로지는 AI가 보는 세계의 설계도입니다",
    explanation:
      "온톨로지는 어떤 개념을 노드로 둘지, 어떤 동사를 관계로 둘지, 어떤 속성을 필수로 둘지 정한 규칙입니다. 설계가 흔들리면 LLMGraphTransformer와 Text2Cypher도 흔들립니다.",
    whyItMatters:
      "PC 구매 도메인에서는 Build, Laptop, Component, Offer, Seller, Benchmark, Review, CompatibilitySignal이 핵심 노드가 됩니다.",
    code: `(Build)-[:USES]->(Component)
(Build)-[:SOLD_AS]->(Offer)
(Offer)-[:OFFERED_BY]->(Seller)
(Build)-[:CHECKED_BY]->(CompatibilitySignal)`,
    takeaway: "온톨로지스트는 도메인을 AI가 탐색 가능한 구조로 바꾸는 사람입니다.",
  },
  {
    number: "08",
    title: "LangGraph는 Agent를 운영 가능한 시스템으로 바꿉니다",
    explanation:
      "복잡한 Agent를 while loop 하나로 만들면 디버깅이 어렵습니다. LangGraph는 상태, 노드, 엣지, 조건 분기를 명시해 어디서 실패했는지 추적할 수 있게 합니다.",
    whyItMatters:
      "검색 결과가 부족하면 재검색, 가격 출처가 없으면 verifier에서 차단, 호환성 확신이 낮으면 사용자에게 질문하는 구조를 만들 수 있습니다.",
    code: `workflow = StateGraph(PurchaseState)
workflow.add_node("intent_parser", parse_intent)
workflow.add_node("compatibility_checker", check_parts)
workflow.add_node("report_writer", write_report)
workflow.add_edge("intent_parser", "compatibility_checker")`,
    takeaway: "LangGraph를 쓰면 데모 Agent가 아니라 관찰 가능한 제품 워크플로가 됩니다.",
  },
];

const labs = [
  {
    title: "실습 1. PC 구매 요청을 구조화하기",
    input: "영상 편집과 게임용 데스크톱 200만원 안에서 맞춰줘. QHD 144Hz, 32GB RAM이면 좋겠어.",
    output: `{
  "category": "desktop_pc",
  "budget_krw": 2000000,
  "purpose": ["video_editing", "qhd_gaming"],
  "must_haves": ["QHD 144Hz", "32GB RAM"],
  "exclusions": ["used_parts", "refurbished"]
}`,
    lesson:
      "자연어를 바로 검색하지 말고 먼저 의도를 구조화합니다. 이 단계가 좋아야 검색어, 필터, 점수화가 안정됩니다.",
  },
  {
    title: "실습 2. 벡터 RAG와 그래프 검색을 분리하기",
    input: "RTX 4070 견적 중 파워 용량이 충분하고 리뷰에서 소음 불만이 적은 후보를 찾아줘.",
    output: `Vector: 리뷰/벤치마크 문서에서 소음 불만 근거 검색
Cypher: Build-USES-Component, Build-CHECKED_BY-Signal 관계 탐색
Merge: 점수표에 review_trust와 compatibility를 함께 반영`,
    lesson:
      "문서 의미 검색과 관계 조건 검색은 같은 문제가 아닙니다. GraphRAG는 두 검색 결과를 합쳐 근거를 만듭니다.",
  },
  {
    title: "실습 3. Verifier로 환각 차단하기",
    input: "추천 리포트 초안에 가격, 출처, 호환성 근거가 모두 있는지 검사합니다.",
    output: `if not citations:
    block("출처 없는 추천")
if price.captured_at is None:
    block("가격 수집 시각 없음")
if compatibility.status != "ok":
    ask_follow_up("호환성 확인 필요")`,
    lesson:
      "LLM이 만든 답을 그대로 사용자에게 보여주지 않습니다. 제품에서는 verifier가 마지막 방어선입니다.",
  },
];

const productWorkflow = [
  ["Intent Parser", "예산, 용도, 카테고리, 필수 조건, 제외 조건을 구조화합니다."],
  ["Query Planner", "가격, 스펙, 벤치마크, 리뷰를 어디서 찾을지 검색 계획을 만듭니다."],
  ["Collector", "가격 비교 소스, 공식 스토어, 리뷰 문서에서 후보를 수집합니다."],
  ["Compatibility", "CPU 소켓, 보드, RAM, PSU, 케이스 간섭을 규칙으로 점검합니다."],
  ["Retriever", "리뷰와 벤치마크는 벡터 검색, 부품 관계는 Cypher로 검색합니다."],
  ["Scoring", "목적 적합도, 가격, 리뷰 신뢰도, 구매 안정성, 호환성을 점수화합니다."],
  ["Verifier", "출처 누락, 가격 시점, 호환성 근거 부족을 차단합니다."],
  ["Report", "TOP 3, 제외 후보, 구매 전 체크리스트를 생성합니다."],
];

const colors = {
  bg: "#f6f7f2",
  ink: "#1f2523",
  muted: "#63706b",
  line: "#d6ddd6",
  panel: "rgba(255, 255, 255, 0.92)",
  panelSoft: "#eef4ee",
  accent: "#0f7c72",
  accentStrong: "#07594f",
  gold: "#c98b2c",
  blue: "#315f91",
};

export default function Home() {
  const [activeRoute, setActiveRoute] = useState<RouteKey>("vector");
  const [activeNode, setActiveNode] = useState("Knowledge Graph");
  const route = routeContent[activeRoute];

  return (
    <>
      <header
        className="topbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
          minHeight: 76,
          padding: "0 3vw",
          borderBottom: `1px solid ${colors.line}`,
          background: "rgba(246, 247, 242, 0.9)",
          backdropFilter: "blur(18px)",
        }}
      >
        <a
          className="brand"
          href="#overview"
          aria-label="GraphRAG Learning Map home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.8rem",
            color: colors.ink,
            textDecoration: "none",
          }}
        >
          <span
            className="brand-mark"
            style={{
              display: "grid",
              placeItems: "center",
              width: 42,
              height: 42,
              borderRadius: 10,
              background: colors.ink,
              color: "#fff",
              fontWeight: 800,
            }}
          >
            G
          </span>
          <span>
            <strong style={{ display: "block" }}>GraphRAG Learning Map</strong>
            <small style={{ display: "block", color: colors.muted, fontSize: "0.78rem", marginTop: "0.15rem" }}>
              LangChain to Neo4j masterclass
            </small>
          </span>
        </a>
        <nav
          aria-label="주요 섹션"
          style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap", gap: "0.35rem" }}
        >
          {[
            ["#curriculum", "커리큘럼"],
            ["#masterclass", "핵심 강의"],
            ["#labs", "실습"],
            ["#product", "제품화"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              style={{
                padding: "0.62rem 0.82rem",
                borderRadius: 8,
                color: colors.muted,
                fontSize: "0.92rem",
                textDecoration: "none",
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main
        style={{
          width: "min(1180px, calc(100% - 32px))",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "28px 0 56px",
        }}
      >
        <section
          className="workspace"
          id="overview"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: 22,
            alignItems: "stretch",
            minHeight: "calc(100vh - 104px)",
            maxWidth: "100%",
          }}
        >
          <div
            className="panel intro-panel"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 0,
              padding: "clamp(24px, 4vw, 54px)",
              border: `1px solid ${colors.line}`,
              borderRadius: 8,
              background: colors.panel,
              boxShadow: "0 24px 60px rgba(31, 37, 35, 0.1)",
            }}
          >
            <div
              className="section-kicker"
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: colors.accentStrong,
                fontSize: "0.78rem",
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              강의 자료 기반 마스터클래스
            </div>
            <h1
              style={{
                marginTop: 0,
                marginBottom: "1rem",
                color: colors.ink,
                fontSize: "clamp(2.05rem, 4.15vw, 3.5rem)",
                lineHeight: 1.04,
                wordBreak: "keep-all",
                overflowWrap: "break-word",
              }}
            >
              <span>LangChain 기초에서</span>
              <span>GraphRAG 제품까지</span>
              <span>한 번에 연결하기</span>
            </h1>
            <p style={{ maxWidth: "58ch", marginTop: 0, color: colors.muted, lineHeight: 1.7 }}>
              이 페이지는 목차가 아니라 수업 자료입니다. LLM 호출, LCEL, 프롬프트, Tool Calling,
              Agent, RAG, Neo4j, Cypher, 온톨로지, GraphRAG, LangGraph 제품화까지 한 흐름으로
              이해하도록 구성했습니다.
            </p>
            <div
              className="quick-grid"
              aria-label="핵심 학습 축"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
                gap: 12,
                marginTop: "2rem",
              }}
            >
              {[
                ["01", "LLM", "확률적 생성, 파라미터, 구조화 출력"],
                ["02", "LCEL", "Runnable로 연결하는 AI 파이프라인"],
                ["03", "Graph", "Neo4j, Cypher, 온톨로지 설계"],
                ["04", "Product", "LangGraph 기반 SpecPilot AI 제품화"],
              ].map(([num, title, body]) => (
                <div
                  key={num}
                  style={{
                    minWidth: 0,
                    padding: "1rem",
                    border: `1px solid ${colors.line}`,
                    borderRadius: 8,
                    background: "#fff",
                  }}
                >
                  <span
                    style={{
                      display: "inline-grid",
                      placeItems: "center",
                      width: 30,
                      height: 30,
                      marginBottom: "0.7rem",
                      borderRadius: 999,
                      background: colors.panelSoft,
                      color: colors.accentStrong,
                      fontWeight: 800,
                      fontSize: "0.78rem",
                    }}
                  >
                    {num}
                  </span>
                  <strong style={{ display: "block", marginBottom: "0.25rem", color: colors.ink }}>{title}</strong>
                  <p style={{ margin: 0, color: colors.muted, fontSize: "0.94rem", lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>

          <section
            className="panel graph-panel"
            aria-label="GraphRAG 구조 시각화"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 24,
              minWidth: 0,
              overflow: "hidden",
              padding: 22,
              border: `1px solid ${colors.line}`,
              borderRadius: 8,
              background: colors.panel,
              boxShadow: "0 24px 60px rgba(31, 37, 35, 0.1)",
            }}
          >
            <div
              className="panel-title"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}
            >
              <span style={{ color: colors.muted, fontSize: "0.88rem" }}>개념 지도</span>
              <strong style={{ color: colors.accentStrong }}>{activeNode}</strong>
            </div>
            <div
              className="knowledge-map"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 14,
                width: "100%",
                maxWidth: 560,
                margin: "0 auto",
              }}
              role="list"
              aria-label="LLM, LCEL, Neo4j, LangGraph가 연결되는 GraphRAG 개념 카드"
            >
              {mapNodes.map((node) => (
                <button
                  key={node.title}
                  className={`map-node ${node.tone} ${activeNode === node.title ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveNode(node.title)}
                  role="listitem"
                  style={{
                    minHeight: 118,
                    padding: "1rem",
                    border: `1px solid ${activeNode === node.title ? colors.accent : colors.line}`,
                    borderRadius: 8,
                    background: activeNode === node.title ? "rgba(15, 124, 114, 0.1)" : "#fff",
                    color: colors.ink,
                    cursor: "pointer",
                    font: "inherit",
                    textAlign: "left",
                  }}
                >
                  <span className="map-node-label">{node.a}</span>
                  <strong>{node.b}</strong>
                  <small>{node.title}</small>
                </button>
              ))}
            </div>
            <div className="legend" style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem", color: colors.muted, fontSize: "0.9rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <i className="dot lang" style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: colors.gold }} />
                LangChain
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <i className="dot graph" style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: colors.accent }} />
                Neo4j
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <i className="dot agent" style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: colors.blue }} />
                LangGraph
              </span>
            </div>
          </section>
        </section>

        <section className="band" id="curriculum">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Full curriculum</span>
              <h2>이 순서대로 이해하면 전체 스택이 연결됩니다</h2>
            </div>
            <p>
              강의의 각 섹션을 제품 개발 순서로 재배열했습니다. 단순 암기가 아니라 어떤 문제를
              해결하기 위해 다음 개념이 필요한지 따라가면 됩니다.
            </p>
          </div>
          <div className="curriculum-grid">
            {curriculum.map((item, index) => (
              <article className="lesson-card" key={item.title}>
                <span className="lesson-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p className="lesson-goal">{item.goal}</p>
                <div className="concept-list">
                  {item.concepts.map((concept) => <span key={concept}>{concept}</span>)}
                </div>
                <p>{item.mastery}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="masterclass" id="masterclass">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Core lectures</span>
              <h2>핵심 개념 강의</h2>
            </div>
            <p>
              각 개념은 정의만 외우면 쓸 수 없습니다. 아래 강의는 실무에서 왜 필요한지,
              어떤 실패를 막는지, 어떤 코드 형태로 나타나는지까지 함께 설명합니다.
            </p>
          </div>
          <div className="deep-stack">
            {deepLessons.map((lesson) => (
              <article className="deep-lesson" key={lesson.number}>
                <div className="deep-number">{lesson.number}</div>
                <div>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.explanation}</p>
                  <div className="why-box">
                    <strong>왜 중요한가</strong>
                    <span>{lesson.whyItMatters}</span>
                  </div>
                  <pre><code>{lesson.code}</code></pre>
                  <p className="takeaway">{lesson.takeaway}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="split" id="ontology">
          <div>
            <span className="section-kicker">Ontologist</span>
            <h2>온톨로지스트는 AI가 볼 세계를 설계합니다</h2>
            <p>
              온톨로지스트는 “무엇을 노드로 둘 것인가”, “어떤 동사를 관계로 둘 것인가”,
              “어떤 속성이 없으면 데이터로 인정하지 않을 것인가”를 정합니다. GraphRAG에서
              온톨로지는 검색 품질의 바닥입니다.
            </p>
            <div className="definition-list">
              <div><strong>Node</strong><span>Build, Laptop, Component, Offer, Review 같은 대상</span></div>
              <div><strong>Relationship</strong><span>USES, SOLD_AS, OFFERED_BY, CHECKED_BY 같은 연결</span></div>
              <div><strong>Property</strong><span>cpu_socket, psu_watt, price, captured_at 같은 값</span></div>
              <div><strong>Constraint</strong><span>중복 방지와 필수 속성을 보장하는 데이터 품질 규칙</span></div>
            </div>
          </div>
          <aside className="panel ontology-card">
            <h3>PC 구매 QA 온톨로지</h3>
            <pre><code>{`(Build)-[:USES]->(Component)
(Build)-[:SOLD_AS]->(Offer)
(Offer)-[:OFFERED_BY]->(Seller)
(Build)-[:CHECKED_BY]->(CompatibilitySignal)`}</code></pre>
            <p>
              이 구조가 있으면 “200만원 안에서 영상 편집용 PC를 맞춰줘” 같은 질문에 가격뿐 아니라
              CPU/GPU 병목, 파워 용량, 업그레이드 여지까지 함께 판단할 수 있습니다.
            </p>
          </aside>
        </section>

        <section className="band retrieval-band" id="retrieval">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Retrieval router</span>
              <h2>질문에 따라 검색 방식을 바꿔야 합니다</h2>
            </div>
            <p>좋은 GraphRAG는 모든 질문을 벡터 검색으로 보내지 않습니다.</p>
          </div>
          <div className="router">
            <div className="router-controls" role="tablist" aria-label="검색 방식 선택">
              {(Object.keys(routeContent) as RouteKey[]).map((key) => (
                <button
                  key={key}
                  className={`route-button ${activeRoute === key ? "active" : ""}`}
                  role="tab"
                  aria-selected={activeRoute === key}
                  onClick={() => setActiveRoute(key)}
                >
                  {routeContent[key].title.replace(" Search", "")}
                </button>
              ))}
            </div>
            <div className="route-output panel" aria-live="polite">
              <span className="badge">{route.badge}</span>
              <h3>{route.title}</h3>
              <p>{route.body}</p>
              <ul>{route.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="labs" id="labs">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Hands-on labs</span>
              <h2>실습으로 개념을 묶기</h2>
            </div>
            <p>이 세 가지 실습을 이해하면 LangChain, LangGraph, Neo4j가 왜 함께 쓰이는지 보입니다.</p>
          </div>
          <div className="lab-grid">
            {labs.map((lab) => (
              <article className="lab-card" key={lab.title}>
                <h3>{lab.title}</h3>
                <p><strong>입력</strong> {lab.input}</p>
                <pre><code>{lab.output}</code></pre>
                <p>{lab.lesson}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="product-section" id="product">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Productization</span>
              <h2>SpecPilot AI로 제품화하기</h2>
            </div>
            <p>
              강의 개념을 실제 제품에 연결하면 컴퓨터 견적과 노트북 구매 의사결정 에이전트가 됩니다.
              여기서는 RAG가 문서 검색을, Neo4j가 부품 관계를, LangGraph가 전체 실행 흐름을 담당합니다.
            </p>
          </div>
          <div className="workflow-grid">
            {productWorkflow.map(([title, body], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <div className="product-summary panel">
            <div>
              <h3>최종적으로 만들 수 있는 것</h3>
              <p>
                사용자는 “QHD 144Hz 영상 편집/게임용 PC 200만원 안에서 맞춰줘”라고 말합니다.
                Agent는 요청을 구조화하고, 후보 견적을 수집하고, 그래프에서 부품 호환성을 검증하고,
                리뷰/벤치마크 근거를 검색한 뒤 TOP 3와 제외 후보를 설명합니다.
              </p>
            </div>
            <div className="product-actions">
              <a className="primary-link" href="https://github.com/hoonapps/specpilot-ai">제품 레포 보기</a>
              <a className="secondary-link" href="https://github.com/hoonapps/graphrag-learning-site">사이트 레포 보기</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
