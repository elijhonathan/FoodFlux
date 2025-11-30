// src/models/index.js
import sequelize from '../config/config.js'; // 🚨 Necessário para inicializar ou usar sequelize.define

import Cidade from './Cidade.js';
import Cantina from './Cantina.js';
import Produto from './Produto.js';
import ClienteAnonimo from './ClienteAnonimo.js';
import Pedido from './Pedido.js'; // Assumindo que Pedido.js contém a definição do modelo
import ItemPedido from './ItemPedido.js'; // Assumindo que ItemPedido.js contém a definição do modelo

// --- ❌ REMOVER AQUI: As linhas const Pedido = sequelize.define(...) e const ItemPedido = sequelize.define(...) ---

// --- ASSOCIAÇÕES DE LOCALIZAÇÃO (CIDADE <-> CANTINA) ---

// 1. Uma Cidade pode ter MÚLTIPLAS Cantinas (Um-para-Muitos)
Cidade.hasMany(Cantina, {
    foreignKey: 'id_cidade',
    as: 'cantinasAssociadas'
});

// 2. Uma Cantina pertence a UMA Cidade
Cantina.belongsTo(Cidade, {
    foreignKey: 'id_cidade',
    as: 'cidade'
});

// --- ASSOCIAÇÕES DE NEGÓCIO (CANTINA <-> PRODUTO) ---

// Uma Cantina pode ter MÚLTIPLOS Produtos (Um-para-Muitos)
Cantina.hasMany(Produto, {
    foreignKey: 'id_cantina',
    as: 'produtos'
});

// Um Produto pertence a UMA Cantina
Produto.belongsTo(Cantina, {
    foreignKey: 'id_cantina',
    as: 'cantina'
});

// --- ASSOCIAÇÕES DE PEDIDOS (PEDIDO <-> ITEMPEDIDO <-> PRODUTO) ---

// 1. Um Pedido pode ter MÚLTIPLOS ItensPedido
Pedido.hasMany(ItemPedido, { 
    foreignKey: 'id_pedido', 
    as: 'itens' // Usado no Controller para criar itens
});

// 2. Um ItemPedido pertence a UM Pedido
ItemPedido.belongsTo(Pedido, { 
    foreignKey: 'id_pedido', 
    as: 'pedido' 
});

// 3. Um ItemPedido pertence a UM Produto
ItemPedido.belongsTo(Produto, { 
    foreignKey: 'id_produto', 
    as: 'produtoDetalhe' // Usado para buscar detalhes do produto
});

// ------------------------------------

// Exporte todos os modelos para acesso fácil no Controller
export { Cidade, Cantina, Produto, ClienteAnonimo, Pedido, ItemPedido };