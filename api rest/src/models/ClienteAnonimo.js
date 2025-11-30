// src/models/ClienteAnonimo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js'; // Assumindo que seu objeto de conexão está aqui

const ClienteAnonimo = sequelize.define('ClienteAnonimo', {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: true, // Se for anônimo, o nome não é obrigatório
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: true, // O telefone também pode ser opcional
    }
}, {
    tableName: 'clientes_anonimos',
    timestamps: false, // Desativa createdAt e updatedAt
});

export default ClienteAnonimo;