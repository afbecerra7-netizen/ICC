const nodeContent = {
  pnd: {
    name: "PND",
    description:
      "El Plan Nacional de Desarrollo fija el marco programático general desde el cual se orientan prioridades, metas y recursos para el sector. En este esquema funciona como punto de arranque de la articulación nacional y como referencia para la continuidad de la política pública ICC.",
    norms: ["PND", "DNP", "Presupuesto nacional"],
    role: "Orienta / enmarca / prioriza"
  },
  enicc: {
    name: "ENICC",
    description:
      "El ENICC opera como instancia nacional de concertación y priorización. Su tarea es promover, definir y priorizar iniciativas, programas y proyectos estratégicos para el fortalecimiento de las industrias creativas y culturales, y proyectarlos hacia la escala departamental mediante la ADICC.",
    norms: ["ENICC", "Ley 1834 de 2017", "Planeación nacional"],
    role: "Promueve / define / prioriza"
  },
  iniciativas: {
    name: "COMITÉ NACIONAL ICC",
    description:
      "Instancia nacional de representación y concertación para priorizar iniciativas del ecosistema ICC. En esta versión del esquema se sintetiza en cinco miembros base: juventud, cultura, sector empresarial, Consejo Privado de Competitividad y representación de Confecámaras, como núcleo mínimo para la deliberación sectorial y la articulación con el ecosistema productivo.",
    norms: ["Participación ciudadana", "Consejo Nacional de Cultura", "Consejos de Juventud", "Sector empresarial", "Consejo Privado de Competitividad", "Confecámaras"],
    role: "Conceptúa / vigila / propone"
  },
  pdd: {
    name: "PDD",
    description:
      "El Plan Departamental de Desarrollo funciona aquí como marco de referencia territorial. Desde este nodo se alinean prioridades, metas y recursos del departamento con la agenda ICC y con la continuidad entre planeación nacional, departamental y municipal.",
    norms: ["PDD", "Planeación territorial", "Gobernanza departamental"],
    role: "Enmarca / orienta / articula"
  },
  comite: {
    name: "COMITÉ DEPARTAMENTAL ICC",
    description:
      "Instancia territorial de concertación que replica la lógica del comité nacional en clave ampliada. El bloque conserva nueve integrantes: consejo departamental de juventud, consejo departamental de cultura, sector empresarial, consejo departamental de planeación, academia, secretarías de cultura, CTeI y planeación, además del frente de desarrollo económico.",
    norms: ["Consejo Departamental de Cultura", "Consejo Departamental de Juventud", "Sector empresarial", "Planeación territorial", "CTeI", "Desarrollo económico"],
    role: "Alinea / territorializa / prioriza"
  },
  adicc: {
    name: "ADICC",
    description:
      "La Agenda Departamental de Industrias Creativas y Culturales es el instrumento donde se aterrizan las prioridades del sistema. Allí quedan consignados programas, proyectos estratégicos y actividades clave, dando continuidad entre PND, PDD y PMD. En esta propuesta existirían 32 ADICC, una por departamento y Distrito Capital, con horizonte de mediano plazo.",
    norms: ["ADICC", "PND", "PDD", "PMD", "Agenda departamental"],
    role: "Articula / prioriza / da continuidad"
  },
  presupuesto: {
    name: "PRESUPUESTO DE DESTINACIÓN",
    description:
      "La ADICC necesita respaldo financiero mediante presupuesto nacional y territorial de destinación programática. Su ejecución se relaciona con los planes de desarrollo y con las instancias de aprobación política y presupuestal, como Congreso, asambleas y concejos.",
    norms: ["Presupuesto nacional", "Presupuesto territorial", "Congreso", "Asamblea", "Concejo"],
    role: "Financia / habilita ejecución"
  },
  ministerios: {
    name: "MINISTERIOS Y AGENCIAS NACIONALES",
    description:
      "Este bloque concentra la ejecución nacional con enfoque departamental. Incluye al Ministerio de Cultura con sus direcciones de Patrimonio y Memoria, Fomento Regional, Poblaciones, Artes, Audiovisuales, Cine y Medios Interactivos, y Estrategia, Desarrollo y Emprendimiento; y suma también al Ministerio del Interior y a las agencias nacionales que concurren en la implementación de programas, convocatorias y proyectos.",
    norms: ["Ministerio de Cultura", "Ministerio del Interior", "Agencias nacionales", "Presupuesto nacional"],
    role: "Ejecuta / implementa"
  },
  entidades: {
    name: "ENTIDADES TERRITORIALES",
    description:
      "Gobernaciones, secretarías y otras instancias territoriales adaptan la agenda al contexto local. Desde allí se articula la ejecución departamental y se enlazan los determinantes municipales para que la ADICC no quede solo en el nivel nacional.",
    norms: ["Entidad territorial", "PDD", "PMD", "Gobernanza multinivel"],
    role: "Coordina / ejecuta / territorializa"
  },
  replica: {
    name: "RÉPLICA TERRITORIAL",
    description:
      "La escala departamental incorpora determinantes municipales y produce una cadena de gobernanza multinivel. Así, la agenda no termina en el departamento sino que dialoga con municipios, consejos locales y otras unidades de gestión territorial.",
    norms: ["ADICC", "Gobernanza multinivel", "Entidades municipales", "Continuidad territorial"],
    role: "Replica / conecta / escala"
  }
};

const nodes = [...document.querySelectorAll("[data-node]")];
const edges = [...document.querySelectorAll("[data-edge]")];
const sidebar = document.getElementById("sidebar");
const sidebarTitle = document.getElementById("sidebarTitle");
const sidebarDescription = document.getElementById("sidebarDescription");
const sidebarRole = document.getElementById("sidebarRole");
const sidebarNorms = document.getElementById("sidebarNorms");
const closeSidebarButton = document.getElementById("closeSidebar");
const toggleTensionsButton = document.getElementById("toggleTensions");
const tensionsOverlay = document.getElementById("tensionsOverlay");
const exportPngButton = document.getElementById("exportPng");
const ecosystemMap = document.getElementById("ecosystemMap");

let selectedNodeId = null;
let hoveredNodeId = null;

function connectedNodeIds(nodeId) {
  const ids = new Set([nodeId]);

  edges.forEach((edge) => {
    const from = edge.dataset.from;
    const to = edge.dataset.to;

    if (from === nodeId || to === nodeId) {
      ids.add(from);
      ids.add(to);
    }
  });

  return ids;
}

function renderFocusState() {
  const activeNodeId = hoveredNodeId || selectedNodeId;

  nodes.forEach((node) => {
    node.classList.remove("is-active", "is-linked", "is-selected", "is-dimmed");
  });

  edges.forEach((edge) => {
    edge.classList.remove("is-active", "is-dimmed");
  });

  if (!activeNodeId) {
    return;
  }

  const relatedNodes = connectedNodeIds(activeNodeId);

  nodes.forEach((node) => {
    const nodeId = node.dataset.node;

    if (nodeId === activeNodeId) {
      node.classList.add("is-active");
    } else if (nodeId === selectedNodeId) {
      node.classList.add("is-selected");
    }

    if (relatedNodes.has(nodeId) && nodeId !== activeNodeId) {
      node.classList.add("is-linked");
    }

    if (!relatedNodes.has(nodeId)) {
      node.classList.add("is-dimmed");
    }
  });

  if (selectedNodeId && selectedNodeId !== activeNodeId) {
    const selectedElement = document.querySelector(`[data-node="${selectedNodeId}"]`);
    if (selectedElement && !selectedElement.classList.contains("is-active")) {
      selectedElement.classList.add("is-selected");
      selectedElement.classList.remove("is-dimmed");
    }
  }

  edges.forEach((edge) => {
    const from = edge.dataset.from;
    const to = edge.dataset.to;
    const isRelated = from === activeNodeId || to === activeNodeId;

    if (isRelated) {
      edge.classList.add("is-active");
    } else {
      edge.classList.add("is-dimmed");
    }
  });
}

function fillSidebar(nodeId) {
  const content = nodeContent[nodeId];
  if (!content) {
    return;
  }

  sidebarTitle.textContent = content.name;
  sidebarDescription.textContent = content.description;
  sidebarRole.textContent = content.role;
  sidebarNorms.innerHTML = "";

  content.norms.forEach((item) => {
    const chip = document.createElement("span");
    chip.textContent = item;
    sidebarNorms.appendChild(chip);
  });

  document.body.classList.add("sidebar-open");
  sidebar.setAttribute("aria-hidden", "false");
}

function selectNode(nodeId) {
  selectedNodeId = nodeId;
  fillSidebar(nodeId);
  renderFocusState();
}

function clearSidebar() {
  document.body.classList.remove("sidebar-open");
  sidebar.setAttribute("aria-hidden", "true");
  selectedNodeId = null;
  renderFocusState();
}

nodes.forEach((node) => {
  const nodeId = node.dataset.node;

  node.addEventListener("mouseenter", () => {
    hoveredNodeId = nodeId;
    renderFocusState();
  });

  node.addEventListener("mouseleave", () => {
    hoveredNodeId = null;
    renderFocusState();
  });

  node.addEventListener("focus", () => {
    hoveredNodeId = nodeId;
    renderFocusState();
  });

  node.addEventListener("blur", () => {
    hoveredNodeId = null;
    renderFocusState();
  });

  node.addEventListener("click", () => {
    selectNode(nodeId);
  });

  node.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectNode(nodeId);
    }
  });
});

closeSidebarButton.addEventListener("click", clearSidebar);

toggleTensionsButton.addEventListener("click", () => {
  const isVisible = tensionsOverlay.classList.toggle("is-visible");
  toggleTensionsButton.setAttribute("aria-pressed", String(isVisible));
  toggleTensionsButton.textContent = isVisible ? "Ocultar tensiones" : "Ver tensiones";
  tensionsOverlay.setAttribute("aria-hidden", String(!isVisible));
});

async function exportSvgToPng() {
  const clonedSvg = ecosystemMap.cloneNode(true);
  const serializer = new XMLSerializer();

  clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clonedSvg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

  const exportStyle = document.createElementNS("http://www.w3.org/2000/svg", "style");
  exportStyle.textContent = `
    svg {
      --color-cultura: #1d9e75;
      --color-creacion: #7f77dd;
      --color-patrimonio: #ef9f27;
      --color-sncci: #378add;
      --color-regalias: #639922;
      --color-creadores: #d85a30;
      --color-territorial: #888780;
      --color-central: #534ab7;
      --color-central-soft: #eeedfe;
      --color-paper: #fffdf9;
      --color-ink: #18161f;
      --color-ink-soft: rgba(24, 22, 31, 0.62);
      --color-muted: #66625f;
      font-family: "DM Sans", sans-serif;
      background: #f8f7f4;
    }
    .map-dotfield { fill: url(#dotGrid); opacity: 0.92; }
    .map-heading { font-family: "DM Serif Display", serif; font-size: 34px; fill: #18161f; letter-spacing: -0.04em; }
    .map-subheading { font-size: 12px; fill: #66625f; }
    .map-microcopy { font-size: 10px; fill: rgba(24, 22, 31, 0.46); }
    .map-heading, .map-subheading, .map-microcopy, .node-display, .node-section-title, .node-annotation, .node-annotation-strong, .node-list, .node-caption, .node-highlight, .note-label, .mini-budget-label { dominant-baseline: hanging; }
    .node-card { fill: rgba(255,255,255,0.96); stroke-width: 1.4; }
    .text-node .node-card { fill: rgba(255,255,255,0.18); stroke: transparent; filter: drop-shadow(0 10px 24px rgba(24,22,31,0.04)); }
    .text-node#node-pnd .node-card { fill: rgba(83,74,183,0.08); stroke: rgba(83,74,183,0.16); }
    .text-node#node-enicc .node-card { fill: rgba(238,237,254,0.78); stroke: rgba(83,74,183,0.14); }
    .text-node#node-iniciativas .node-card { fill: rgba(255,253,249,0.84); stroke: rgba(24,22,31,0.08); }
    .text-node#node-pdd .node-card { fill: rgba(255,255,255,0.82); stroke: rgba(136,135,128,0.16); }
    .text-node#node-comite .node-card { fill: rgba(255,255,255,0.82); stroke: rgba(136,135,128,0.16); }
    .text-node#node-presupuesto .node-card { fill: rgba(55,138,221,0.06); stroke: rgba(55,138,221,0.18); }
    .text-node#node-ministerios .node-card { fill: rgba(29,158,117,0.05); stroke: rgba(29,158,117,0.18); }
    .text-node#node-entidades .node-card, .text-node#node-replica .node-card { fill: rgba(136,135,128,0.06); stroke: rgba(136,135,128,0.18); }
    .text-node.is-active .node-card, .text-node.is-linked .node-card, .text-node.is-selected .node-card { fill: rgba(255,253,249,0.96); stroke: rgba(24,22,31,0.12); filter: drop-shadow(0 18px 28px rgba(24,22,31,0.08)); }
    .highlight-node .node-card { fill: #ffe159; stroke: rgba(239,159,39,0.68); filter: drop-shadow(0 16px 28px rgba(239,159,39,0.22)); }
    .text-node-centered text { text-anchor: middle; }
    .node-display { font-size: 36px; font-weight: 700; fill: #18161f; letter-spacing: -0.03em; }
    .node-section-title { font-size: 24px; font-weight: 700; fill: #18161f; letter-spacing: -0.03em; }
    .node-section-medium { font-size: 19px; }
    .node-section-small { font-size: 18px; }
    .node-annotation { font-size: 10px; fill: #66625f; }
    .node-annotation-strong { font-size: 10px; font-weight: 700; fill: #18161f; }
    .node-list { font-size: 10px; fill: rgba(24,22,31,0.9); }
    .node-list-tight { font-size: 9.5px; }
    .node-caption { font-size: 10px; fill: rgba(24,22,31,0.54); }
    .node-caption-strong { font-weight: 700; fill: #18161f; }
    .node-highlight { font-size: 24px; font-weight: 700; fill: #18161f; letter-spacing: -0.03em; }
    .edge-group { color: var(--edge-color); }
    .edge { fill: none; stroke: currentColor; vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; }
    .edge-track { stroke-width: 1.9; opacity: 0.88; }
    .edge-dashed { stroke-dasharray: 6 8; }
    .edge-flow { stroke-width: 1; opacity: 0.48; }
    .edge-flow-solid { stroke-dasharray: 12 18; }
    .edge-flow-dashed { stroke-dasharray: 4 10; }
    .diagram-handline { fill: none; stroke: rgba(24,22,31,0.38); stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
    .budget-branch { fill: none; stroke: rgba(24,22,31,0.4); stroke-width: 1.3; stroke-linecap: round; vector-effect: non-scaling-stroke; }
    .note-label { font-size: 10px; fill: #66625f; stroke: rgba(255,253,249,0.98); stroke-width: 5px; paint-order: stroke; }
    .mini-budget-label { font-size: 10px; fill: rgba(24,22,31,0.68); }
    .is-dimmed { opacity: 0.14; }
    .edge-group.is-active .edge-track, .edge-group.is-active .edge-flow { stroke-width: 3; }
    .edge-group.is-active .edge-flow { stroke-width: 1.6; }
  `;

  clonedSvg.insertBefore(exportStyle, clonedSvg.firstChild);

  const svgString = serializer.serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    await document.fonts.ready;

    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    const scale = 2;
    canvas.width = 900 * scale;
    canvas.height = 700 * scale;

    const context = canvas.getContext("2d");
    context.fillStyle = "#f8f7f4";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const downloadLink = document.createElement("a");
    downloadLink.download = "ecosistema-icc-colombiano.png";
    downloadLink.href = canvas.toDataURL("image/png");
    downloadLink.click();
  } catch (error) {
    console.error("No fue posible exportar el mapa en PNG.", error);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

exportPngButton.addEventListener("click", exportSvgToPng);

fillSidebar("adicc");
renderFocusState();
