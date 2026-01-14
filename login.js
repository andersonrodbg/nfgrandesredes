function login() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("msg");

localStorage.setItem("usuarioLogado", json.usuario);

// força escrita antes de redirecionar
setTimeout(() => {
  window.location.replace("index.html");
}, 100);

  const usuarios = [
    { usuario: "grandesredes", senha: "Santa.123@2" },
  
  ];

  const valido = usuarios.find(
    u => u.usuario === usuario && u.senha === senha
  );

  if (valido) {
    localStorage.setItem("usuarioLogado", usuario);
    window.location.href = "index.html";
  } else {
    msg.innerText = "Usuário ou senha inválidos";
  }
}
