const usuario = localStorage.getItem("usuarioLogado");

if (!usuario) {
  window.location.href = "login.html";
}

const API_URL = "https://script.google.com/macros/s/AKfycbzpXOu4KBjYGepFPv0aDVe0Sc48RH2941jDVDF3xfA_L5l6RnbHpITeTqjoAflwb3lHvA/exec";

function registrarNota() {
  const usuario = document.getElementById("usuario").value.trim();
  const dataFat = document.getElementById("dataFaturamento").value;
  const nota = document.getElementById("nota").value.trim();
  const msg = document.getElementById("msg");

  if (!usuario || !dataFat || !nota) {
    msg.innerText = "Preencha todos os campos!";
    msg.style.color = "red";
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `nota=${nota}&usuario=${usuario}&dataFaturamento=${dataFat}`
  })
    .then(res => res.text())
    .then(text => {
      const data = JSON.parse(text);
      msg.innerText = data.msg;
      msg.style.color = data.status === "ok" ? "green" : "red";
    })
    .catch(err => {
      msg.innerText = "Erro ao enviar";
      msg.style.color = "red";
      console.error(err);
    });
}

function buscarNota() {
  const nota = document.getElementById("notaBusca").value.trim();
  const resultado = document.getElementById("resultado");

  if (!nota) {
    resultado.innerHTML = "<p class='erro'>Digite uma nota</p>";
    return;
  }

  resultado.innerHTML = "<p>Buscando...</p>";

  fetch(`${API_URL}?nota=${encodeURIComponent(nota)}`)
    .then(res => res.json())
    .then(data => {
      console.log("RETORNO API:", data); // 🔍 DEBUG

      if (data.status !== "ok") {
        resultado.innerHTML = `<p class='erro'>${data.msg}</p>`;
        return;
      }

      resultado.innerHTML = `
        <div class="card">
          <p><strong>Nota:</strong> ${data.nota}</p>
          <p><strong>Usuário:</strong> ${data.usuario}</p>
          <p><strong>Data de faturamento:</strong> ${formatarData(data.dataFaturamento)}</p>
          <p><strong>Registrado em:</strong> ${formatarDataHora(data.dataRegistro)}</p>
        </div>
      `;
    })
    .catch(err => {
      console.error("ERRO FETCH:", err);
      resultado.innerHTML = "<p class='erro'>Erro ao buscar a nota</p>";
    });
}


function formatarData(data) {
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR");
}

function formatarDataHora(data) {
  const d = new Date(data);
  return d.toLocaleString("pt-BR");
}

