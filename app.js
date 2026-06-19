const routeContent = {
  vector: {
    badge: "의미가 비슷한 문서 조각을 찾을 때",
    title: "Vector Search",
    body:
      "질문과 문서 청크를 임베딩으로 바꾼 뒤 의미적으로 가까운 내용을 찾습니다. LangChain RAG 실습의 기본 검색 축입니다.",
    items: [
      "예: '퇴직금 산정 방식 설명해줘'",
      "장점: 표현이 달라도 의미가 가까우면 검색됨",
      "주의: 관계, 순서, 소유 구조를 직접 설명하기 어렵습니다."
    ]
  },
  fulltext: {
    badge: "정확한 고유명사, 코드, 키워드가 중요할 때",
    title: "Full-text Search",
    body:
      "Neo4j의 전문 검색 인덱스로 사람 이름, ETF 티커, 법 조항명, 기업명처럼 정확한 문자열 단서를 찾습니다.",
    items: [
      "예: 'KODEX 200 관련 상품 찾아줘'",
      "장점: 키워드 기반 매칭이 강함",
      "주의: 한국어는 nori, CJK 분석기 같은 언어 설정이 품질에 영향을 줍니다."
    ]
  },
  cypher: {
    badge: "관계와 조건을 따라가야 할 때",
    title: "Text2Cypher",
    body:
      "LLM이 자연어 질문을 Cypher 쿼리로 바꾸고, Neo4j가 관계 조건을 따라 결과를 반환합니다.",
    items: [
      "예: 'A회사를 많이 언급한 언론사와 기자를 보여줘'",
      "장점: 그래프 구조를 직접 활용해 근거를 좁힙니다.",
      "주의: 온톨로지와 스키마 설명이 부정확하면 쿼리도 흔들립니다."
    ]
  },
  hybrid: {
    badge: "실서비스 답변 품질을 높이고 싶을 때",
    title: "Enhanced GraphRAG",
    body:
      "벡터 검색으로 후보 문서를 찾고, 그래프 탐색으로 관련 엔티티와 관계를 확장한 뒤 LLM에게 근거를 제공합니다.",
    items: [
      "예: '이 규정 위반의 원인과 담당 부서를 근거와 함께 알려줘'",
      "장점: 의미 검색과 관계 검색을 함께 씁니다.",
      "주의: LangGraph 같은 상태 기반 워크플로로 라우팅과 검증 단계를 분리하는 편이 좋습니다."
    ]
  }
};

const output = document.querySelector("#route-output");
const routeButtons = document.querySelectorAll(".route-button");
const nodeTitle = document.querySelector("#active-node-title");
const mapNodes = document.querySelectorAll(".map-node");

function renderRoute(route) {
  const content = routeContent[route];
  output.innerHTML = `
    <span class="badge">${content.badge}</span>
    <h3>${content.title}</h3>
    <p>${content.body}</p>
    <ul>${content.items.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
}

routeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    routeButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    renderRoute(button.dataset.route);
  });
});

mapNodes.forEach((node) => {
  const activate = () => {
    mapNodes.forEach((item) => item.classList.remove("active"));
    node.classList.add("active");
    nodeTitle.textContent = node.dataset.title;
  };
  node.addEventListener("click", activate);
  node.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });
});

renderRoute("vector");
