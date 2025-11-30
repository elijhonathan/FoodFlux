// src/models/Pedido.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';

const Pedido = sequelize.define('Pedido', {
    id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    id_cliente_anonimo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'clientes_anonimos', key: 'id_cliente' }
    },
    id_cantina: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'cantinas', key: 'id_cantina' }
    },
    valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    codigo_retirada: {
        type: DataTypes.STRING(20),
        allowNull: true, // Será gerado no controller
    },
    status: {
        type: DataTypes.ENUM('pendente', 'preparando', 'pronto', 'finalizado', 'cancelado'),
        defaultValue: 'pendente',
    },
    data_criacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'pedidos',
    timestamps: false,
});

export default Pedido;