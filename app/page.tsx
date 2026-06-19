"use client";

import { useState } from "react";

type RouteKey = "vector" | "fulltext" | "cypher" | "hybrid";

const routeContent: Record<RouteKey, { badge: string; title: string; body: string; items: string[] }> = {
  vector: {
    badge: "의미가 비슷한 문서 조각을 찾을 때",
    title: "Vector Search",
    body:
      "질문과 문서 청크를 임베딩으로 바꾼 뒤 의미적으로 가까운 내용을 찾습니다. LangChain RAG 실습의 기본 검색 축입니다.",
    items: [
      "예: '퇴직금 산정 방식 설명해줘'",
      "장점: 표현이 달라도 의미가 가까우면 검색됨",
      "주의: 관계, 순서, 소유 구조를 직접 설명하기 어렵습니다.",
    ],
  },
  fulltext: {
    badge: "정확한 고유명사, 코드, 키워드가 중요할 때",
    title: "Full-text Search",
    body:
      "Neo4j의 전문 검색 인덱스로 사람 이름, ETF 티커, 법 조항명, 기업명처럼 정확한 문자열 단서를 찾습니다.",
    items: [
      "예: 'KODEX 200 관련 상품 찾아줘'",
      "장점: 키워드 기반 매칭이 강함",
      "주의: 한국어는 nori, CJK 분석기 같은 언어 설정이 품질에 영향을 줍니다.",
    ],
  },
  cypher: {
    badge: "관계와 조건을 따라가야 할 때",
    title: "Text2Cypher",
    body:
      "LLM이 자연어 질문을 Cypher 쿼리로 바꾸고, Neo4j가 관계 조건을 따라 결과를 반환합니다.",
    items: [
      "예: 'A회사를 많이 언급한 언론사와 기자를 보여줘'",
      "장점: 그래프 구조를 직접 활용해 근거를 좁힙니다.",
      "주의: 온톨로지와 스키마 설명이 부정확하면 쿼리도 흔들립니다.",
    ],
  },
  hybrid: {
    badge: "실서비스 답변 품질을 높이고 싶을 때",
    title: "Enhanced GraphRAG",
    body:
      "벡터 검색으로 후보 문서를 찾고, 그래프 탐색으로 관련 엔티티와 관계를 확장한 뒤 LLM에게 근거를 제공합니다.",
    items: [
      "예: '이 규정 위반의 원인과 담당 부서를 근거와 함께 알려줘'",
      "장점: 의미 검색과 관계 검색을 함께 씁니다.",
      "주의: LangGraph 같은 상태 기반 워크플로로 라우팅과 검증 단계를 분리하는 편이 좋습니다.",
    ],
  },
};

const mapNodes = [
  { title: "LLM Foundation", x: 120, y: 210, r: 54, a: "LLM", b: "기초" },
  { title: "LCEL Chain", x: 390, y: 150, r: 62, a: "LCEL", b: "체인" },
  { title: "Knowledge Graph", x: 455, y: 275, r: 68, a: "Neo4j", b: "지식그래프" },
  { title: "LangGraph Agent", x: 660, y: 195, r: 64, a: "LangGraph", b: "워크플로" },
];

export default function Home() {
  const [activeRoute, setActiveRoute] = useState<RouteKey>("vector");
  const [activeNode, setActiveNode] = useState("Knowledge Graph");
  const route = routeContent[activeRoute];

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="GraphRAG Learning Map home">
          <span className="brand-mark">G</span>
          <span>
            <strong>GraphRAG Learning Map</strong>
            <small>LangChain to Neo4j product path</small>
          </span>
        </a>
        <nav aria-label="주요 섹션">
          <a href="#roadmap">로드맵</a>
          <a href="#ontology">온톨로지</a>
          <a href="#retrieval">검색 전략</a>
          <a href="#product">제품 아이디어</a>
        </nav>
      </header>

      <main>
        <section className="workspace" id="overview">
          <div className="panel intro-panel">
            <div className="section-kicker">강의 자료 기반 정리</div>
            <h1>LangChain 기초에서 GraphRAG 제품까지 한 번에 연결하기</h1>
            <p>
              두 강의의 핵심은 단순히 “LLM을 호출하는 법”이 아니라, 문서와 데이터의 관계를
              모델링하고 검색 경로를 설계해서 실제 서비스 답변 품질을 높이는 것입니다.
            </p>
            <div className="quick-grid" aria-label="핵심 학습 축">
              {[
                ["01", "LCEL", "Prompt, model, parser, retriever를 파이프처럼 조립"],
                ["02", "Agent", "Tool calling과 ReAct로 필요한 행동을 선택"],
                ["03", "Neo4j", "노드와 관계로 지식의 구조를 저장"],
                ["04", "GraphRAG", "벡터 검색과 그래프 탐색을 결합"],
              ].map(([num, title, body]) => (
                <div key={num}>
                  <span>{num}</span>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>

          <section className="panel graph-panel" aria-label="GraphRAG 구조 시각화">
            <div className="panel-title">
              <span>학습 흐름</span>
              <strong>{activeNode}</strong>
            </div>
            <svg className="knowledge-map" viewBox="0 0 780 440" role="img">
              <path className="link" d="M120 210 C210 80 305 70 390 150" />
              <path className="link" d="M120 210 C260 305 315 330 455 275" />
              <path className="link" d="M390 150 C480 115 565 120 660 195" />
              <path className="link" d="M455 275 C535 315 620 295 660 195" />
              <path className="link strong" d="M390 150 C430 205 430 232 455 275" />
              {mapNodes.map((node) => (
                <g
                  key={node.title}
                  className={`map-node ${activeNode === node.title ? "active" : ""}`}
                  tabIndex={0}
                  transform={`translate(${node.x} ${node.y})`}
                  onClick={() => setActiveNode(node.title)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveNode(node.title);
                    }
                  }}
                >
                  <circle r={node.r} />
                  <text y="-4">{node.a}</text>
                  <text y="18">{node.b}</text>
                </g>
              ))}
            </svg>
            <div className="legend">
              <span><i className="dot lang" />LangChain</span>
              <span><i className="dot graph" />Neo4j</span>
              <span><i className="dot agent" />LangGraph</span>
            </div>
          </section>
        </section>

        <section className="band" id="roadmap">
          <div className="section-heading">
            <div>
              <span className="section-kicker">학습 순서</span>
              <h2>강의 내용을 제품 개발 순서로 재배열</h2>
            </div>
            <p>입문 강의와 GraphRAG 강의를 섞어서 “무엇을 먼저 이해해야 하는지” 기준으로 다시 묶었습니다.</p>
          </div>
          <div className="timeline">
            {[
              ["LLM 호출과 출력 제어", "temperature, JSON 출력, Pydantic 구조화 출력으로 답변 형식을 통제합니다."],
              ["LCEL로 RAG 파이프라인 조립", "RunnableSequence, Passthrough, Parallel, Lambda를 사용해 검색과 생성을 연결합니다."],
              ["Tool Calling과 Agent", "검색, 계산, 그래프 쿼리 같은 도구를 LLM이 선택하게 하고 실행 루프를 설계합니다."],
              ["Neo4j와 Cypher", "노드, 관계, 속성, MATCH, WHERE, 경로 탐색으로 연결된 데이터를 질의합니다."],
              ["온톨로지 설계", "도메인의 개념, 관계, 제약조건을 정해서 LLM이 데이터를 그래프로 바꾸는 기준을 만듭니다."],
              ["GraphRAG 제품화", "Full-text, Vector, Text2Cypher, 경로 탐색을 질문 유형별로 라우팅합니다."],
            ].map(([title, body], index) => (
              <article key={title}>
                <span>{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split" id="ontology">
          <div>
            <span className="section-kicker">Ontologist</span>
            <h2>온톨로지스트는 무엇을 하는 사람인가</h2>
            <p>
              온톨로지스트는 “AI가 이해할 데이터 세계의 설계자”에 가깝습니다. 어떤 것을
              노드로 둘지, 어떤 연결을 관계로 둘지, 어떤 속성과 제약조건이 필요한지 정리합니다.
            </p>
            <div className="definition-list">
              <div><strong>Node</strong><span>회사, 상품, 법 조항, 뉴스, 기자, 사람 같은 대상</span></div>
              <div><strong>Relationship</strong><span>발행했다, 투자한다, 포함한다, 위반한다 같은 연결</span></div>
              <div><strong>Property</strong><span>날짜, 금액, 카테고리, 위험등급, 문서 위치 같은 값</span></div>
              <div><strong>Constraint</strong><span>중복 방지, 필수 속성, 허용 관계 같은 품질 규칙</span></div>
            </div>
          </div>
          <aside className="panel ontology-card">
            <h3>예시: PC 구매 QA 온톨로지</h3>
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
            <p>버튼을 눌러 어떤 질문이 어떤 검색 전략으로 가야 하는지 확인하세요.</p>
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

        <section className="split product-split" id="product">
          <div>
            <span className="section-kicker">실제 제품형 프로젝트</span>
            <h2>SpecPilot AI</h2>
            <p>
              컴퓨터 견적과 노트북 구매를 위한 AI 의사결정 에이전트입니다. 예산, 용도, 모니터
              해상도, 필수 조건을 받아 부품 호환성, 가격, 리뷰, 벤치마크 근거를 함께 비교합니다.
            </p>
            <div className="product-actions">
              <a className="primary-link" href="https://github.com/hoonapps/specpilot-ai">제품 레포 보기</a>
              <a className="secondary-link" href="https://github.com/hoonapps/graphrag-learning-site">사이트 레포 보기</a>
            </div>
          </div>
          <div className="idea-grid">
            {[
              ["1. Desktop Build Copilot", "CPU/GPU/보드/파워 호환성과 예산을 기준으로 PC 견적 TOP 3를 추천합니다."],
              ["2. Laptop Advisor", "영상 편집, 개발, 게임, 사무 목적에 맞춰 노트북 성능과 휴대성을 비교합니다."],
              ["3. Upgrade Planner", "현재 부품에서 병목을 찾고 최소 교체로 성능을 올리는 경로를 제안합니다."],
              ["4. Price Watch", "부품 가격이 목표 예산에 들어오면 재조회와 알림으로 구매 타이밍을 잡습니다."],
            ].map(([title, body]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="source-strip" aria-label="참고한 강의와 공식 문서">
          <strong>References</strong>
          <a href="https://www.inflearn.com/course/graphrag-%EC%A7%80%EC%8B%9D%EA%B7%B8%EB%9E%98%ED%94%84-rag%EC%8B%9C%EC%8A%A4%ED%85%9C">Inflearn GraphRAG course</a>
          <a href="https://www.inflearn.com/course/%EC%9E%85%EB%AC%B8%EC%9E%90%EB%A5%BC%EC%9C%84%ED%95%9C-%EB%9E%AD%EC%B2%B4%EC%9D%B8-%EA%B8%B0%EC%B4%88">Inflearn LangChain course</a>
          <a href="https://docs.langchain.com/oss/python/langgraph/overview">LangGraph docs</a>
          <a href="https://neo4j.com/labs/genai-ecosystem/langchain/">Neo4j LangChain integration</a>
        </section>
      </main>
    </>
  );
}
