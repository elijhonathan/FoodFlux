// src/models/Cidade.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';

const Cidade = sequelize.define('Cidade', {
    id_cidade: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
}, {
    tableName: 'cidades',
    timestamps: false,
});

export default Cidade;