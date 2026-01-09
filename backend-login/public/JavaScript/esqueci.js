let codigoGerado = 0;
let emailAlvo = "";

// 1. FUNÇÃO PARA ENVIAR O CÓDIGO
async function enviarCodigo() {
    const email = document.getElementById("emailRecuperacao").value;

    if (!email) {
        alert("Digite um e-mail.");
        return;
    }

    // --- NOVA PARTE: Pergunta ao servidor se o e-mail existe ---
    try {
        // CORREÇÃO: Caminho relativo (Universal)
        const resposta = await fetch('/verificar-usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        if (!resposta.ok) {
            alert("Este e-mail não possui cadastro no sistema.");
            return;
        }

        // Se o servidor disse que existe, continuamos...
        codigoGerado = Math.floor(1000 + Math.random() * 9000);
        emailAlvo = email;

        console.log(`Código de recuperação (Debug): ${codigoGerado}`);

        const parametros = {
            to_email: email,
            codigo: codigoGerado,
            time: new Date().toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' })
        };

        emailjs.send("service_uyxwnpj", "template_5k9e6ke", parametros)
            .then(function(response) {
                alert("Código enviado! Verifique seu e-mail.");
                document.getElementById('etapa1').style.display = 'none';
                document.getElementById('etapa2').style.display = 'block';
            })
            .catch(function(error) {
                console.error("Erro emailjs:", error);
                alert("Erro ao enviar e-mail. (Veja o console para detalhes)");
            });

    } catch (error) {
        console.error(error);
        alert("Erro de conexão com o servidor. O Node.js está ligado?");
    }
}

// 2. FUNÇÃO PARA TROCAR A SENHA
async function verificarEAlterar() {
    const inputCodigo = document.getElementById('codigoDigitado').value;
    const novaSenha = document.getElementById('novaSenha').value;

    if (parseInt(inputCodigo) === codigoGerado) {
        
        if (novaSenha.length < 8) {
            alert("A senha deve ter no minimo 8 caracteres.");
            return;
        }

        // --- NOVA PARTE: Manda a nova senha para o servidor ---
        try {
            // CORREÇÃO: Caminho relativo (Universal)
            const resposta = await fetch('/redefinir-senha', {
                method: 'POST', // Enviamos os dados
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailAlvo,
                    novaSenha: novaSenha
                })
            });

            if (resposta.ok) {
                alert("Senha alterada com sucesso!");
                // Se o arquivo login.html estiver na mesma pasta, isso funciona.
                // Se der erro, mude para '/login/login.html'
                window.location.href = 'login.html';
            } else {
                alert("Erro ao salvar nova senha no servidor.");
            }

        } catch (error) {
            console.error(error);
            alert("Erro ao conectar com o servidor.");
        }

    } else {
        alert("Código incorreto!");
    }
}