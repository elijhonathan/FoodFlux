// src/models/ItemPedido.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';

const ItemPedido = sequelize.define('ItemPedido', {
    id_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_pedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'pedidos', key: 'id_pedido' }
    },
    id_produto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'produtos', key: 'id_produto' }
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    preco_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName: 'itens_pedido',
    timestamps: false,
});

export default ItemPedido;