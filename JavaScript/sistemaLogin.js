function criarConta() {
    const email = document.getElementById('ilogin').value;
    const senha = document.getElementById('isenha').value;

    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    //Verificar se já existe uma senha salva para esse email
    if (localStorage.getItem(`senha_${email}`)) {
        alert("Este usuario já existe! Clique em entrar.");
        return;

    }
    //Salva a conta
    localStorage.setItem(`senha_${email}`, senha);
    alert("Conta criada com sucesso! Agora clique em entrar.");
}


function fazerLogin(event) {
    event.preventDefault(); //impede a pagina de recarregar

    const email = document.getElementById('ilogin').value;
    const senha = document.getElementById('isenha').value;

    //Busca a senha salva no navegador
    const senhaSalva = localStorage.getItem(`senha_${email}`);

    if (senha === senhaSalva) {
        //sucesso
        
    }

}