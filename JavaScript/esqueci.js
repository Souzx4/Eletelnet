let codigoGerado = 0; // Variavel global
let emailAlvo = "";   // O email que estamos recuperando

function enviarCodigo() {
    const email = document.getElementById("emailRecuperacao").value;

    // 1. Verificar se o usuario existe no LocalStorage
    if (!localStorage.getItem(`senha_${email}`)) {
        alert("Este email não possui cadastro.");
        return;
    }

    // 2. Gerar código (Math.random gera entre 0 e 1, * 9000 + 1000 garante 4 dígitos)
    codigoGerado = Math.floor(1000 + Math.random() * 9000);
    emailAlvo = email;

    console.log(`Código de recuperação (Debug): ${codigoGerado}`);

    // 3. Preparar parâmetros para o EmailJS
    const parametros = {
        to_email: email,
        codigo: codigoGerado,
        time: new Date().toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' })
    };

    // 4. Enviar email
    emailjs.send("service_uyxwnpj", "template_5k9e6ke", parametros)
        .then(function(response) {
            alert("Código de recuperação enviado com sucesso! Verifique seu email.");
            // Troca de tela apenas se der sucesso
            document.getElementById('etapa1').style.display = 'none';
            document.getElementById('etapa2').style.display = 'block';
        })
        .catch(function(error) {
            console.error("Erro ao enviar email:", error);
            alert("Erro ao enviar o código. Tente novamente mais tarde.");
        });
}

// ESTA FUNÇÃO PRECISA FICAR FORA DA DE CIMA
function verificarEAlterar() {
    const inputCodigo = document.getElementById('codigoDigitado').value;
    const novaSenha = document.getElementById('novaSenha').value;

    // Verificar se o código bate (CORRIGIDO: codigoGerado com G maiúsculo)
    if (parseInt(inputCodigo) === codigoGerado) {
        
        if (novaSenha.length < 4) {
            alert("A senha deve ter no minimo 4 caracteres.");
            return;
        }

        // Alterar a senha no LocalStorage
        localStorage.setItem(`senha_${emailAlvo}`, novaSenha);

        alert("Senha alterada com sucesso! Faça login com a nova senha.");
        window.location.href = 'login.html';
    } else {
        alert("Código incorreto! Tente novamente.");
    }
}