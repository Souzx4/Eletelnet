// --- FUNÇÃO DE CADASTRO (Conectada ao Node.js) ---
async function fazerCadastro(event) {
    event.preventDefault();

    const nome = document.getElementById('inome').value;
    const email = document.getElementById('iemail').value;
    const senha = document.getElementById('isenha').value;

    if (!email || !senha || !nome) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        // Envia os dados para o seu servidor
        const resposta = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Conta criada! Suas informações estão salvas no servidor.");
            window.location.href = 'login.html';
        } else {
            alert(dados.mensagem); // Ex: "E-mail já cadastrado"
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor. Verifique se o Node.js está rodando.");
    }
}

// --- FUNÇÃO DE LOGIN (Conectada ao Node.js) ---
async function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('ilogin').value;
    const senha = document.getElementById('isenha').value;

    try {
        const resposta = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            // Sucesso!
            localStorage.setItem('usuarioLogado', email);
            localStorage.setItem(`nome_${email}`, dados.nome); // Salva o nome vindo do banco
            localStorage.setItem(`depto_${email}`, dados.departamento);
            window.location.href = '../documentacao.html';
        } else {
            alert(dados.mensagem); // Ex: "Senha incorreta"
        }

    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor.");
    }
}