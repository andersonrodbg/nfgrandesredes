

// ===============================
// 🔗 URL DA API
// ===============================
const URL_API = "https://script.google.com/macros/s/AKfycbzsHDX_PczWtTMKSHuzvi3qZ9w_bUXeMQ6erFbKfccxBsberTrMzfWK5IArJBVg4SkOww/exec";

// ===============================
// 📌 REGISTRAR NOTA
// ===============================
async function registrarNota() {
  const usuario = document.getElementById("usuario").value.trim();
  const dataFaturamento = document.getElementById("dataFaturamento").value;
  const nota = document.getElementById("nota").value.trim();
  const volumes = document.getElementById("volumes").value.trim();
  const msg = document.getElementById("msg");

if (!usuario || !dataFaturamento || !nota || !volumes) {
  msg.innerText = "Preencha todos os campos";
  msg.style.color = "red";
  return;
}

  const form = new FormData();
  form.append("usuario", usuario);
  form.append("dataFaturamento", dataFaturamento);
  form.append("nota", nota);
  form.append("volumes", volumes);


  try {
    const res = await fetch(URL_API, {
      method: "POST",
      body: form
    });

    const json = await res.json();
    msg.innerText = json.msg;
    msg.style.color = json.status === "ok" ? "green" : "red";

    if (json.status === "ok") {
      document.getElementById("nota").value = "";
    }
  } catch {
    msg.innerText = "Erro ao registrar nota";
    msg.style.color = "red";
  }
}

// ===============================
// 🔍 BUSCAR NOTA
// ===============================
async function buscarNota() {
  const notaInput = document.getElementById("notaBusca");
  const resultado = document.getElementById("resultadoBusca");

  if (!notaInput || !resultado) {
    console.error("Elemento notaBusca ou resultadoBusca não encontrado");
    return;
  }

  const nota = notaInput.value.trim();

  if (!nota) {
    resultado.innerHTML = "<p class='erro'>Informe o número da nota</p>";
    return;
  }

  resultado.innerHTML = "Buscando nota...";

  try {
    const res = await fetch(`${URL_API}?nota=${encodeURIComponent(nota)}`);
    const json = await res.json();

    console.log("Resposta buscar nota:", json);

    if (json.status !== "ok") {
      resultado.innerHTML = `<p class='erro'>${json.msg}</p>`;
      return;
    }

    resultado.innerHTML = `
      <div class="card">
        <p><strong>Nota:</strong> ${json.nota}</p>
        <p><strong>Usuário:</strong> ${json.usuario}</p>
        <p><strong>Data Faturamento:</strong> ${json.dataFaturamento}</p>
        <p><strong>Data Registro:</strong> ${json.dataRegistro}</p>
        ${json.volumes !== undefined ? `<p><strong>Volumes:</strong> ${json.volumes}</p>` : ""}
      </div>
    `;

  } catch (err) {
    console.error("Erro ao buscar nota:", err);
    resultado.innerHTML = "<p class='erro'>Erro ao buscar nota</p>";
  }
}

// ===============================
// 📊 FILTRAR NOTAS
// ===============================
async function filtrarNotas() {
  const usuario = document.getElementById("usuarioFiltro").value.trim();
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;
  const resultado = document.getElementById("resultado");

  resultado.innerHTML = "Buscando...";

  if (!usuario || !inicio || !fim) {
    resultado.innerHTML = "<p class='erro'>Preencha todos os filtros</p>";
    return;
  }

  try {
    const res = await fetch(
      `${URL_API}?acao=filtrar&usuario=${usuario}&inicio=${inicio}&fim=${fim}`
    );

    const json = await res.json();

    if (json.status !== "ok" || !json.dados.length) {
      resultado.innerHTML = "<p class='erro'>Nenhuma nota encontrada</p>";
      window.dadosFiltrados = []; // 🔴 importante
      return;
    }

    const dados = json.dados;

    // 🔥 SALVA GLOBALMENTE PARA DOWNLOAD
    window.dadosFiltrados = dados;

    let totalVolumes = 0;
    resultado.innerHTML = "";

    dados.forEach(n => {
      totalVolumes += Number(n.volumes || 0);

      resultado.innerHTML += `
        <div class="card">
          <p><strong>Nota:</strong> ${n.nota}</p>
          <p><strong>Usuário:</strong> ${n.usuario}</p>
          <p><strong>Data Faturamento:</strong> ${n.dataFaturamento}</p>
          <p><strong>Volumes:</strong> ${n.volumes}</p>
        </div>
      `;
    });

    resultado.innerHTML += `
      <div class="total-volumes">
        <h3>${usuario} — Total de volumes: ${totalVolumes}</h3>
      </div>
    `;

  } catch (err) {
    console.error(err);
    resultado.innerHTML = "<p class='erro'>Erro ao buscar dados</p>";
    window.dadosFiltrados = [];
  }
}


// ===============================
// 📥 DOWNLOAD CSV
// ===============================
function baixarCSV() {
  if (!window.dadosFiltrados || window.dadosFiltrados.length === 0) {
    alert("Não há dados filtrados para baixar");
    return;
  }

  let csv = "Nota,Usuário,Data Faturamento,Volumes\n";
  let totalVolumes = 0;

  window.dadosFiltrados.forEach(n => {
    const volumes = Number(n.volumes || 0);
    totalVolumes += volumes;

    csv += `${n.nota},${n.usuario},${n.dataFaturamento},${volumes}\n`;
  });

  // 🔥 LINHA FINAL COM TOTAL
  csv += `\nTOTAL DE VOLUMES,,,"${totalVolumes}"`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "notas_filtradas_com_total.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
