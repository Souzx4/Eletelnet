const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Isso libera o acesso aos arquivos HTML para quem acessar pelo IP
app.use(express.static('public'));

const ARQUIVO_BANCO = 'usuarios.json';

// --- Rota de CADASTRO ---
app.post('/cadastro', (req, res) => {
    // Recebe o departamento junto com os outros dados
    const { nome, email, senha, departamento } = req.body;

    let usuarios = [];
    if (fs.existsSync(ARQUIVO_BANCO)) {
        const dados = fs.readFileSync(ARQUIVO_BANCO);
        usuarios = JSON.parse(dados);
    }

    const usuarioExiste = usuarios.find(u => u.email === email);
    if (usuarioExiste) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado!" });
    }

    // Define 'comum' se nenhum departamento for enviado, por segurança
    const deptoSalvar = departamento || 'comum';

    usuarios.push({ nome, email, senha, departamento: deptoSalvar });
    fs.writeFileSync(ARQUIVO_BANCO, JSON.stringify(usuarios, null, 2));

    console.log(`Novo usuário: ${nome} | Depto: ${deptoSalvar}`);
    res.status(201).json({ mensagem: "Cadastrado com sucesso!" });
});

// --- Rota de LOGIN ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    let usuarios = [];
    if (fs.existsSync(ARQUIVO_BANCO)) {
        usuarios = JSON.parse(fs.readFileSync(ARQUIVO_BANCO));
    }

    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuario) {
        // Envia o departamento de volta para o site saber o que mostrar
        res.status(200).json({
            mensagem: "Login aprovado",
            nome: usuario.nome,
            departamento: usuario.departamento
        });
    } else {
        res.status(401).json({ mensagem: "E-mail ou senha incorretos" });
    }
});

// --- Rotas de Recuperação de Senha ---
app.post('/verificar-usuario', (req, res) => {
    const { email } = req.body;
    let usuarios = [];
    if (fs.existsSync(ARQUIVO_BANCO)) usuarios = JSON.parse(fs.readFileSync(ARQUIVO_BANCO));
    
    const usuarioExiste = usuarios.find(u => u.email === email);
    if (usuarioExiste) res.status(200).json({ mensagem: "Usuário encontrado." });
    else res.status(404).json({ mensagem: "E-mail não cadastrado." });
});

app.post('/redefinir-senha', (req, res) => {
    const { email, novaSenha } = req.body;
    let usuarios = [];
    if (fs.existsSync(ARQUIVO_BANCO)) usuarios = JSON.parse(fs.readFileSync(ARQUIVO_BANCO));

    const indice = usuarios.findIndex(u => u.email === email);
    if (indice !== -1) {
        usuarios[indice].senha = novaSenha;
        fs.writeFileSync(ARQUIVO_BANCO, JSON.stringify(usuarios, null, 2));
        res.status(200).json({ mensagem: "Senha alterada com sucesso!" });
    } else {
        res.status(404).json({ mensagem: "Usuário não encontrado." });
    }
});

// --- Rota 5: EDITAR PERMISSÕES ---
app.put('/editar-usuario', (req, res) => {
    const { email, novosDepartamentos } = req.body;

    let usuarios = [];
    if (fs.existsSync(ARQUIVO_BANCO)) {
        usuarios = JSON.parse(fs.readFileSync(ARQUIVO_BANCO));
    }

    // Procura o usuário
    const indice = usuarios.findIndex(u => u.email === email);

    if (indice !== -1) {
        // Atualiza apenas os departamentos, mantém o resto (senha/nome) igual
        usuarios[indice].departamento = novosDepartamentos;
        
        fs.writeFileSync(ARQUIVO_BANCO, JSON.stringify(usuarios, null, 2));
        
        console.log(`Permissões atualizadas para: ${email} -> ${novosDepartamentos}`);
        res.status(200).json({ mensagem: "Permissões atualizadas com sucesso!" });
    } else {
        res.status(404).json({ mensagem: "Usuário não encontrado." });
    }
});

// --- Rota 6: LISTAR TODOS OS USUÁRIOS (Para o Painel) ---
app.get('/usuarios', (req, res) => {
    let usuarios = [];
    if (fs.existsSync(ARQUIVO_BANCO)) {
        usuarios = JSON.parse(fs.readFileSync(ARQUIVO_BANCO));
    }
    // Retorna a lista para o site
    res.status(200).json(usuarios);
});

// --- Rota 7: DELETAR USUÁRIO ---
app.delete('/usuario', (req, res) => {
    const { email } = req.body;

    let usuarios = [];
    if (fs.existsSync(ARQUIVO_BANCO)) {
        usuarios = JSON.parse(fs.readFileSync(ARQUIVO_BANCO));
    }

    // Filtra a lista, mantendo apenas quem NÃO for o e-mail deletado
    const novaLista = usuarios.filter(u => u.email !== email);

    if (usuarios.length !== novaLista.length) {
        fs.writeFileSync(ARQUIVO_BANCO, JSON.stringify(novaLista, null, 2));
        console.log(`Usuário deletado: ${email}`);
        res.status(200).json({ mensagem: "Usuário removido com sucesso!" });
    } else {
        res.status(404).json({ mensagem: "Usuário não encontrado." });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log("Servidor rodando na porta 3000!");
});