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

  if (tipo) {
    elemento.classList.add(tipo);
  }
}

function escaparHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
