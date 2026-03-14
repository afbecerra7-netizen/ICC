const nodeContent = {
  cultura: {
    name: "CULTURA",
    description:
      "Reconocida constitucionalmente como derecho, implica el acceso, la participación y la protección de la diversidad cultural. El Estado tiene responsabilidad activa en su promoción y garantía. Normas: C.P. arts. 70–72, Ley 397 de 1997.",
    norms: ["C.P. arts. 70–72", "Ley 397 de 1997"],
    role: "Derecho / garantía / acceso"
  },
  creacion: {
    name: "CREACIÓN",
    description:
      "Producción de bienes y servicios culturales y creativos que generan valor simbólico y económico, protegidos por propiedad intelectual. La Ley 1834 de 2017 (Ley Naranja) define las industrias creativas como aquellas que generan valor fundamentado en la PI. Estrategia: Las 7i. Coordina el Consejo Nacional de la Economía Naranja.",
    norms: ["Ley 1834 de 2017", "Propiedad intelectual", "Consejo Nacional de la Economía Naranja"],
    role: "Creación / valor simbólico / economía creativa"
  },
  patrimonio: {
    name: "PATRIMONIO",
    description:
      "Conjunto de bienes materiales e inmateriales que constituyen memoria colectiva, sujetos a protección especial del Estado. Implica tensión entre protección y circulación. Normas: C.P. art. 72, Ley 397/1997, UNESCO 2005.",
    norms: ["C.P. art. 72", "Ley 397/1997", "UNESCO 2005"],
    role: "Protección / memoria / circulación"
  },
  documento: {
    name: "DOCUMENTO DE CONCILIACIÓN",
    description:
      "Nodo de mayor concentración de decisiones del sistema. Articula el Plan Nacional de Desarrollo, el Plan Departamental de Desarrollo y los planes del Consejo ICC. Su redacción y aprobación define las prioridades del ecosistema completo. Aquí se expresa la tensión entre interés público e interés sectorial.",
    norms: ["PND", "Plan Dptal de Desarrollo", "Plan Consejo ICC"],
    role: "Decide / articula / concentra"
  },
  consejo: {
    name: "CONSEJO ICC",
    description:
      "Organismo de representación nacional del sector creativo. Conformado por: empresarios del sector, asociaciones gremiales, consejos de cultura, creadores independientes. Equivale institucionalmente al Consejo Nacional de la Economía Naranja creado por la Ley 1834. Rol: decide y regula.",
    norms: ["Ley 1834 de 2017", "Consejo Nacional de la Economía Naranja"],
    role: "Decide / regula"
  },
  ministerio: {
    name: "MINISTERIO DE CULTURA + CARTERA",
    description:
      "Delegados del gobierno nacional. Junto con otros ministerios con cartera (Comercio, TIC, Educación), ejecutan las estrategias definidas en el documento de conciliación. Rol: ejecuta y financia.",
    norms: ["Ley 397 de 1997", "Ministerio de Cultura", "Carteras asociadas"],
    role: "Ejecuta / financia"
  },
  territorial: {
    name: "ENTIDAD TERRITORIAL DEPARTAMENTAL",
    description:
      "Representación departamental del sistema. Integrada por: consejo departamental de cultura, consejos de juventud, empresas departamentales, sociedad civil organizada. Rol: regula y ejecuta a nivel territorial.",
    norms: ["Plan Departamental de Desarrollo", "Consejo departamental de cultura"],
    role: "Regula / ejecuta"
  },
  sncci: {
    name: "SNCCI / DNP",
    description:
      "Sistema Nacional de Competitividad e Innovación. Es el puente entre cultura y economía. Conecta las ICC con las dinámicas de mercado, innovación y competitividad del país. El DNP articula los planes de desarrollo con los objetivos del sector creativo.",
    norms: ["SNCCI", "DNP", "Competitividad e innovación"],
    role: "Vincula / articula"
  },
  regalias: {
    name: "SISTEMA DE REGALÍAS",
    description:
      "Fuente de financiación territorial para proyectos culturales y creativos. Permite que departamentos y municipios ejecuten recursos en fortalecimiento del sector ICC a nivel local.",
    norms: ["Sistema General de Regalías", "Financiación territorial"],
    role: "Financia"
  },
  creadores: {
    name: "CREADORES / CIUDADANÍA",
    description:
      "Base del ecosistema. Son quienes producen el valor simbólico y cultural. Inciden en el sistema a través de los consejos de cultura, asociaciones y movilización social. Son el sujeto de derecho que la Constitución y la Ley 397 buscan proteger.",
    norms: ["C.P. arts. 70–72", "Ley 397 de 1997", "Consejos de cultura"],
    role: "Incide / produce"
  },
  industrias: {
    name: "INDUSTRIAS CULTURALES Y CREATIVAS",
    description:
      "Actor productivo del ecosistema. Agrupa empresas, emprendimientos y organizaciones que transforman la creación en bienes y servicios culturales y creativos, compiten por circulación, audiencias y mercado, y se articulan con innovación, propiedad intelectual y competitividad.",
    norms: ["Ley 1834 de 2017", "OMPI", "SNCCI / DNP"],
    role: "Compite / circula"
  },
  replica: {
    name: "RÉPLICA TERRITORIAL",
    description:
      "El modelo nacional puede replicarse: el Consejo ICC nacional se convierte en Consejo Departamental ICC, que dialoga con entidades municipales. A nivel municipal, el modelo se replica en comunas o localidades. Esto genera una cadena de gobernanza cultural multinivel.",
    norms: ["Gobernanza multinivel", "Consejo Departamental ICC", "Entidades municipales"],
    role: "Replica / coordina"
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
      --color-muted: #66625f;
      font-family: "DM Sans", sans-serif;
      background: #f8f7f4;
    }
    .map-heading { font-family: "DM Serif Display", serif; font-size: 30px; fill: #18161f; }
    .map-subheading { font-size: 13px; fill: #66625f; }
    .map-heading, .map-subheading, .node-title, .node-subtitle, .node-meta, .node-role, .replica-text, .edge-label, .decision-badge text, .layer-label { dominant-baseline: hanging; }
    .layer-label, .decision-badge text { letter-spacing: 0.04em; text-transform: uppercase; }
    .layer-label { font-size: 10px; font-weight: 700; fill: rgba(24, 22, 31, 0.48); }
    .node-card { fill: rgba(255,255,255,0.96); stroke-width: 1.5; }
    .node-bar { fill: var(--node-color); }
    .tone-cultura { --node-color: var(--color-cultura); }
    .tone-creacion { --node-color: var(--color-creacion); }
    .tone-patrimonio { --node-color: var(--color-patrimonio); }
    .tone-sncci { --node-color: var(--color-sncci); }
    .tone-regalias { --node-color: var(--color-regalias); }
    .tone-creadores { --node-color: var(--color-creadores); }
    .tone-territorial, .tone-replica { --node-color: var(--color-territorial); }
    .tone-documento { --node-color: var(--color-central); }
    .tone-cultura .node-card { stroke: rgba(29, 158, 117, 0.34); }
    .tone-creacion .node-card { stroke: rgba(127, 119, 221, 0.34); }
    .tone-patrimonio .node-card { stroke: rgba(239, 159, 39, 0.34); }
    .tone-sncci .node-card { stroke: rgba(55, 138, 221, 0.34); }
    .tone-regalias .node-card { stroke: rgba(99, 153, 34, 0.34); }
    .tone-creadores .node-card { stroke: rgba(216, 90, 48, 0.34); }
    .tone-territorial .node-card, .tone-replica .node-card { stroke: rgba(136, 135, 128, 0.34); }
    .central-fill { fill: var(--color-central-soft); stroke: var(--color-central); stroke-width: 2; }
    .node-double-border { fill: none; stroke: rgba(83, 74, 183, 0.36); stroke-width: 1.4; }
    .decision-badge rect { fill: rgba(83, 74, 183, 0.12); }
    .decision-badge text { font-size: 10px; font-weight: 700; fill: var(--color-central); }
    .node-title { font-size: 14px; font-weight: 700; fill: #18161f; }
    .central-title { font-size: 18px; }
    .node-subtitle { font-size: 12px; fill: #66625f; }
    .node-meta, .node-role, .replica-text { font-size: 11px; fill: #66625f; }
    .node-role, .replica-text { font-weight: 700; fill: #18161f; }
    .replica-band { fill: rgba(136, 135, 128, 0.08); stroke: #888780; stroke-width: 1.6; stroke-dasharray: 6 7; }
    .edge { fill: none; stroke: currentColor; vector-effect: non-scaling-stroke; }
    .edge-track { stroke-width: 2.2; }
    .edge-dashed { stroke-dasharray: 6 8; }
    .edge-flow { stroke-width: 1.2; opacity: 0.75; }
    .edge-flow-solid { stroke-dasharray: 12 18; }
    .edge-flow-dashed { stroke-dasharray: 4 10; }
    .edge-label { font-size: 10px; font-weight: 700; stroke: rgba(255, 253, 249, 0.92); stroke-width: 4px; paint-order: stroke; }
    .is-dimmed { opacity: 0.18; }
    .edge-group { color: var(--edge-color); }
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

fillSidebar("documento");
renderFocusState();
