const usuario = localStorage.getItem("usuarioLogado");

if (!usuario) {
  window.location.href = "login.html";
} else {
  document.getElementById("user").innerText = "Usuário: " + usuario;
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}
