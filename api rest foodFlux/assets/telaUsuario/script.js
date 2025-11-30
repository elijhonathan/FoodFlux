// VARIÁVEIS DE API

const API_URL_LOCALIZACOES_PERFIL = 'http://localhost:3000/localizacoes';
let localizacoesDataPerfil = [];

// ==========================================================
// FUNÇÕES DO NOVO POPUP DE NOVO PEDIDO (Para carregar Cidades/Cantinas da API)
// ==========================================================

// Função que carrega as cidades no dropdown
async function carregarCidadesPedido() {
    const cidadeSelect = document.getElementById('cidade-pedido');
    if (!cidadeSelect) return;
    
    cidadeSelect.innerHTML = '<option value="" selected disabled>Escolha a cidade</option>';

    try {
        const response = await fetch(API_URL_LOCALIZACOES_PERFIL, { method: 'GET' });
        if (!response.ok) {
            throw new Error('Erro ao buscar localizações na API.');
        }
        localizacoesDataPerfil = await response.json();

        localizacoesDataPerfil.forEach(cidade => {
            cidadeSelect.innerHTML += `<option value="${cidade.id_cidade}">${cidade.nome}</option>`;
        });

    } catch (err) {
        console.error('Erro ao carregar cidades:', err);
    }
}

// Exibe campo de local após escolher cidade e preenche com as cantinas
function mostrarLocalPedido() {
    const cidadeId = document.getElementById('cidade-pedido').value;
    const localGroup = document.getElementById('local-group-pedido');
    const localSelect = document.getElementById('local-pedido');

    localGroup.style.display = 'block';
    localSelect.innerHTML = '<option value="" selected disabled>Escolha o local</option>';
    
    if (cidadeId) {
        // Usa o operador == para igualdade de valor, já que cidadeId pode ser string/number
        const cidadeSelecionada = localizacoesDataPerfil.find(c => c.id_cidade == cidadeId); 

        if (cidadeSelecionada && cidadeSelecionada.cantinasAssociadas) {
            cidadeSelecionada.cantinasAssociadas.forEach(cantina => {
                localSelect.innerHTML += `<option value="${cantina.id_cantina}">${cantina.nome}</option>`;
            });
        }
    }
}

function abrirPopupNovoPedido() {
    document.getElementById("novoPedidoPopup").style.display = "flex";
    carregarCidadesPedido(); // Carrega as cidades da API ao abrir o popup
}

function fecharPopupNovoPedido() {
    document.getElementById("novoPedidoPopup").style.display = "none";
}

// Para o fechamento do popup sem cadastro (se ele estiver na página)
function fecharPopupSemCadastro() {
    document.getElementById("semCadastroPopup").style.display = "none";
}

// Fechar popup clicando fora
window.onclick = function(event) {
    const novoPedidoPopup = document.getElementById("novoPedidoPopup");
    const semCadastroPopup = document.getElementById("semCadastroPopup");
    
    // Fechamento para o popup de Novo Pedido
    if (event.target === novoPedidoPopup) {
        fecharPopupNovoPedido();
    }
    
    // Fechamento para o popup sem cadastro (se presente)
    if (event.target === semCadastroPopup) {
        fecharPopupSemCadastro();
    }
}

// ==========================================================
// LÓGICA DE CARREGAMENTO DE DADOS DO PERFIL (ao carregar a página)
// ==========================================================

function loadProfileData() {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    const profileNameElement = document.getElementById('profile-name');
    const profileEmailElement = document.getElementById('profile-email');

    if (userName && profileNameElement) {
        // Exibe a saudação e o nome
        profileNameElement.textContent = `Bem vinde ${userName}`;
    }

    if (userEmail && profileEmailElement) {
        // Formata o email para o formato @usuario
        let formattedEmail = `@${userEmail.split('@')[0]}`;
        profileEmailElement.textContent = userEmail;
    }
}

document.addEventListener('DOMContentLoaded', loadProfileData);


// ==========================================================
// EVENT LISTENERS (INTERATIVIDADE)
// ==========================================================

// Interatividade dos filtros
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Interatividade dos itens do menu (Sidebar)
document.querySelectorAll('.menu-item').forEach(item => {
    // Usamos um seletor mais específico para não quebrar a lógica dos cliques
    if (!item.id.includes('logout') && !item.id.includes('pedido')) {
        item.addEventListener('click', function() {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    }
});

// ----------------------------------------------------------
// LÓGICA DE PEDIDO E LOGOUT (Ações Principais)
// ----------------------------------------------------------

// 1. Botão 'Novo Pedido' na Sidebar (Usando o ID)
document.getElementById('novo-pedido-menu-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    abrirPopupNovoPedido();
});

// 2. Botão 'Fazer Novo Pedido' (o grande no conteúdo principal)
document.querySelector('.quick-order-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    abrirPopupNovoPedido();
});

// 3. Lógica para o formulário do popup 'Continuar Pedido'
document.querySelector('#novoPedidoPopup form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    var cidade = document.getElementById('cidade-pedido').value;
    var local = document.getElementById('local-pedido').value;
    
    if (cidade && local) {
        // Redireciona para a tela de Menu/Restaurantes
        window.location.href = '../cardapio/index.html'; 
    } else {
        alert('Selecione a cidade e o local antes de continuar.');
    }
});

// Lógica de Logout
document.getElementById('logout-btn')?.addEventListener('click', function(e) {
    e.preventDefault(); 
    
    // 1. Remove os dados de autenticação e de perfil
    localStorage.removeItem('token');
    localStorage.removeItem('userName'); 
    localStorage.removeItem('userEmail'); 
    
    // 2. Redireciona para a tela principal (raiz do projeto)
    window.location.href = '../../../index.html'; 
});


// ----------------------------------------------------------
// ANIMAÇÕES E PAGINAÇÃO
// ----------------------------------------------------------

// Animação nos cards de produtos
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function() {
        alert('Produto selecionado! Aqui você pode adicionar lógica para ver detalhes ou fazer novo pedido.');
    });
});

// Animação nos pedidos
document.querySelectorAll('.order-item').forEach(order => {
    order.addEventListener('click', function() {
        alert('Visualizar detalhes do pedido');
    });
});

// Paginação
document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.textContent !== '←' && this.textContent !== '→') {
            document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// script.js (Trecho da submissão do formulário do Novo Pedido)

document.querySelector('#novoPedidoPopup form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    var cidade = document.getElementById('cidade-pedido').value;
    var local = document.getElementById('local-pedido').value; // Este é o id_cantina

    if (cidade && local) {
        // MUITO IMPORTANTE: Salvar o ID da cantina para esta página usar
        localStorage.setItem('cantinaId', local); 
        
        // Redireciona para a tela de Menu
        window.location.href = '../cardapio/index.html'; 
    } else {
        alert('Selecione a cidade e o local antes de continuar.');
    }
});