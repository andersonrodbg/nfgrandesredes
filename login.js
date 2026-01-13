async function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;
  const msg = document.getElementById("msg");

  msg.innerText = "Conectando...";

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxHgwmWKMLCCMwpq0-MkOzBpge0uhE9H-0TPuQBsw17wLkp0CLf38Xb7lBD0yKO7wLd/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usuario, senha })
    });

    const data = await response.json();

    if (data.status === "ok") {
      msg.style.color = "green";
      msg.innerText = "Login realizado com sucesso";

      // Exemplo:
      // window.location.href = "index.html";
    } else {
      msg.style.color = "red";
      msg.innerText = data.msg;
    }

  } catch (err) {
    msg.style.color = "red";
    msg.innerText = "Erro ao conectar";
    console.error(err);
  }
}
