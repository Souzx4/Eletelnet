// --- FUNÇÃO DE CADASTRO ---
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
        // CORREÇÃO: Caminho relativo (funciona em qualquer lugar)
        const resposta = await fetch('/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Conta criada! Suas informações estão salvas no servidor.");
            // CORREÇÃO: Removemos o 'public' do link, pois ele é a raiz do site
            window.location.href = '/login/login.html';
        } else {
            alert(dados.mensagem);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor. Verifique se o servidor Node está rodando!");
    }
}

// --- FUNÇÃO DE LOGIN ---
async function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('ilogin').value;
    const senha = document.getElementById('isenha').value;

    try {
        // CORREÇÃO: Caminho relativo
        const resposta = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            // Sucesso!
            localStorage.setItem('usuarioLogado', email);
            localStorage.setItem(`nome_${email}`, dados.nome);
            localStorage.setItem(`depto_${email}`, dados.departamento);
            
            // Redireciona (Garanta que este arquivo existe na pasta public)
            // Se documentacao.html estiver na raiz da public, use '/documentacao.html'
            window.location.href = '/documentacao.html'; 
        } else {
            alert(dados.mensagem);
        }

    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor. Verifique se o servidor Node está rodando!");
    }
}