// ==========================================================
// Variáveis Globais e URLs da API
// ==========================================================
let localizacoesData = []; 
const API_URL = 'http://localhost:3000/api';
const API_URL_LOCALIZACOES = 'http://localhost:3000/localizacoes';


// ==========================================================
// FUNÇÕES DE POPUP E INTERATIVIDADE
// ==========================================================

// Função que carrega as cidades no dropdown
async function carregarCidades() {
    const cidadeSelect = document.getElementById('cidade');
    cidadeSelect.innerHTML = '<option value="" selected disabled>Escolha a cidade</option>';

    try {
        const response = await fetch(API_URL_LOCALIZACOES, { method: 'GET' });
        if (!response.ok) {
            throw new Error('Erro ao buscar localizações na API.');
        }
        localizacoesData = await response.json();

        localizacoesData.forEach(cidade => {
            // Usa id_cidade como 'value' e nome como o texto a ser exibido
            cidadeSelect.innerHTML += `<option value="${cidade.id_cidade}">${cidade.nome}</option>`;
        });

    } catch (err) {
        console.error('Erro ao carregar cidades:', err);
    }
}

function mostrarLocal() {
    const cidadeId = document.getElementById('cidade').value;
    const localGroup = document.getElementById('local-group');
    const localSelect = document.getElementById('local');

    // Sempre mostra o grupo do local, pois uma cidade foi selecionada
    localGroup.style.display = 'block';
    
    // Limpa opções anteriores
    localSelect.innerHTML = '<option value="" selected disabled>Escolha o local</option>';
    
    if (cidadeId) {
        // Encontra os dados da cidade usando o ID selecionado (que é o value do <select>)
        const cidadeSelecionada = localizacoesData.find(c => c.id_cidade == cidadeId);

        if (cidadeSelecionada && cidadeSelecionada.cantinasAssociadas) {
            cidadeSelecionada.cantinasAssociadas.forEach(cantina => {
                // Usa id_cantina como 'value' e nome como o texto a ser exibido
                localSelect.innerHTML += `<option value="${cantina.id_cantina}">${cantina.nome}</option>`;
            });
        }
    }
}

// Lógica de menu responsivo
var menuIcon = document.querySelector('.menu-icon'); 
var ul = document.querySelector('ul'); 

if (menuIcon) {
    menuIcon.addEventListener('click', ()=>{ 
        if(ul.classList.contains('ativo')){ 
            ul.classList.remove('ativo'); 
            document.querySelector('.menu-icon img').src="../assets/menuicon (2).png"; 
        } else{
            ul.classList.add('ativo'); 
            document.querySelector('.menu-icon img').src="../assets/close_icon.png"; 
        }
    });
}


function abrirPopup(aba) {
    document.getElementById("authPopup").style.display = "flex";
    abrirAbaDireto(aba);
}

function fecharPopup() {
    document.getElementById("authPopup").style.display = "none";
}

function abrirAba(evt, aba) {
    const tabs = document.querySelectorAll('.tab-content');
    const links = document.querySelectorAll('.tablink');
    tabs.forEach(t => t.classList.remove('ativo'));
    links.forEach(l => l.classList.remove("active"));

    document.getElementById(aba).classList.add("ativo");
    evt.currentTarget.classList.add("active");
}

function abrirAbaDireto(aba) {
    const tabs = document.querySelectorAll('.tab-content');
    const links = document.querySelectorAll('.tablink');
    tabs.forEach(t => t.classList.remove('ativo'));
    links.forEach(l => l.classList.remove("active"));

    document.getElementById(aba).classList.add("ativo");
    document.querySelector(`.tablink[onclick*="${aba}"]`).classList.add("active");
}

// Funções para popup sem cadastro
function abrirPopupSemCadastro() {
    document.getElementById("semCadastroPopup").style.display = "flex";
    carregarCidades(); // Chama a função para carregar as cidades da API
}

function fecharPopupSemCadastro() {
    document.getElementById("semCadastroPopup").style.display = "none";
}


// ==========================================================
// EVENT LISTENERS PRINCIPAIS (DOMContentLoaded)
// ==========================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ----------------------------------------------------------
    // A. CONTINUAR COMPRA (Comprar sem registro)
    // ----------------------------------------------------------
    var form = document.querySelector('#semCadastroPopup form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var cidade = document.getElementById('cidade').value;
            var local = document.getElementById('local').value; // Este é o id_cantina
            
            if (cidade && local) {
                // CORREÇÃO: Salva o ID da cantina no localStorage
                localStorage.setItem('cantinaId', local);

                // Redireciona para a tela do cardápio
                // O caminho é relativo ao index.html atual (Raiz)
                window.location.href = './assets/cardapio/index.html';
            } else {
                alert('Selecione a cidade e o local antes de continuar.');
            }
        });
    }

    // ----------------------------------------------------------
    // B. REGISTRO
    // ----------------------------------------------------------
    const registroForm = document.querySelector('#registro form');
    registroForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const nome = registroForm.querySelector('input[placeholder="Nome completo"]').value;
        const email = registroForm.querySelector('input[placeholder="Email"]').value;
        const telefone = registroForm.querySelector('input[placeholder="Telefone"]').value; 
        const senha = registroForm.querySelector('input[placeholder="Senha"]').value;
        const confirmarSenha = registroForm.querySelector('input[placeholder="Confirmar senha"]').value;


        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        try {
            // URL completa para Registro
            const response = await fetch(`http://localhost:3000/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    telefone,
                    tipo: 'aluno' 
                })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); 
                window.location.href = 'assets/telaUsuario/index.html';
            } else {
                alert(data.error || 'Erro ao cadastrar!');
            }
        } catch (err) {
            alert('Erro de conexão com o servidor!');
        }
    });

    // ----------------------------------------------------------
    // C. LOGIN
    // ----------------------------------------------------------
    const loginForm = document.querySelector('#login form');
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const senha = loginForm.querySelector('input[type="password"]').value;

        try {
            // URL completa para Login
            const response = await fetch(`http://localhost:3000/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });
            const data = await response.json();
            
            if (response.ok) {
                // 1. Armazena o token
                localStorage.setItem('token', data.token);

                // 2. Armazena dados de perfil
                if (data.usuario) {
                    localStorage.setItem('userName', data.usuario.nome);
                    localStorage.setItem('userEmail', data.usuario.email);
                    localStorage.setItem('cantinaId', data.usuario.id_cantina || null); // Armazena ID da cantina se for fornecedor
                }

                // 3. Lógica de Redirecionamento Condicional
                let redirectURL = 'assets/telaUsuario/index.html'; // Padrão
                const codigoUsuario = data.usuario ? data.usuario.codigo_usuario : null;

                if (codigoUsuario == 2) {
                    redirectURL = 'assets/telaFornecedor/telaPrincipal/index.html';
                } 
                
                window.location.href = redirectURL;

            } else {
                alert(data.error || 'Email ou senha inválidos!');
            }
        } catch (err) {
            alert('Erro de conexão com o servidor!');
        }
    });
});

// ==========================================================
// FUNÇÕES DE FECHAMENTO (CLIQUE FORA)
// ==========================================================
window.onclick = function(event) {
    const popup = document.getElementById("authPopup");
    const semCadastroPopup = document.getElementById("semCadastroPopup");
    
    if (event.target === popup) {
        fecharPopup();
    }
    if (event.target === semCadastroPopup) {
        fecharPopupSemCadastro();
    }
}