// src/models/Cantina.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';

const Cantina = sequelize.define('Cantina', {
    id_cantina: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_proprietario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' }
    },
    id_cidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'cidades', key: 'id_cidade' }
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    endereco: {
        type: DataTypes.STRING(255),
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo',
    }
}, {
    tableName: 'cantinas',
    timestamps: false,
});

export default Cantina;