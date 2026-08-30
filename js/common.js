function obterParametroId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function formatarData(dataIso) {
  if (!dataIso) return "-";

  const data = new Date(dataIso);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(data);
}

function mostrarMensagem(texto, tipo = "") {
  const elemento = document.getElementById("mensagem");
  if (!elemento) return;

  elemento.textContent = texto;
  elemento.classList.remove("hidden", "error", "success");

  if (tipo) elemento.classList.add(tipo);
}

function escaparHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function abrirModalConfirmacao({
  titulo = "Confirmar ação",
  mensagem = "Deseja continuar?",
  confirmarTexto = "Confirmar",
  cancelarTexto = "Cancelar",
  perigoso = false
} = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "modal-app";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "modal-titulo");

    modal.innerHTML = `
      <h2 id="modal-titulo">${escaparHtml(titulo)}</h2>
      <p>${escaparHtml(mensagem)}</p>
      <div class="modal-actions">
        <button type="button" class="button secondary" data-modal-cancelar>
          ${escaparHtml(cancelarTexto)}
        </button>
        <button type="button"
                class="button ${perigoso ? "danger" : "primary"}"
                data-modal-confirmar>
          ${escaparHtml(confirmarTexto)}
        </button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const cancelar = modal.querySelector("[data-modal-cancelar]");
    const confirmar = modal.querySelector("[data-modal-confirmar]");

    function fechar(resultado) {
      document.removeEventListener("keydown", onKeyDown);
      overlay.remove();
      resolve(resultado);
    }

    function onKeyDown(event) {
      if (event.key === "Escape") fechar(false);
    }

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) fechar(false);
    });

    cancelar.addEventListener("click", () => fechar(false));
    confirmar.addEventListener("click", () => fechar(true));
    document.addEventListener("keydown", onKeyDown);

    confirmar.focus();
  });
}
