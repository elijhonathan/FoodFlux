// src/models/Produto.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';

const Produto = sequelize.define('Produto', {
    id_produto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_cantina: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'cantinas', key: 'id_cantina' }
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descricao: {
        type: DataTypes.TEXT,
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    estoque: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    imagem_url: { // Novo campo
        type: DataTypes.STRING(500),
    },
    categoria: { // Novo campo
        type: DataTypes.STRING(500),
    },
    status: {
        type: DataTypes.ENUM('disponivel', 'indisponivel'),
        defaultValue: 'disponivel',
    }
}, {
    tableName: 'produtos',
    timestamps: false,
});

export default Produto;