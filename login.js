function login() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("msg");

  
  const USUARIO_CORRETO = "grandesredes";
  const SENHA_CORRETA = "Santa.123";

  if (!usuario || !senha) {
    msg.style.color = "red";
    msg.innerText = "Preencha usuário e senha";
    return;
  }

  if (usuario === USUARIO_CORRETO && senha === SENHA_CORRETA) {
    localStorage.setItem("logado", "true");
    localStorage.setItem("usuario", usuario);

    window.location.href = "index.html";
  } else {
    msg.style.color = "red";
    msg.innerText = "Usuário ou senha inválidos";
  }
}
