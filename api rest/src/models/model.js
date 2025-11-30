import {DataTypes} from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/config.js';

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    telefone: {
        type: DataTypes.STRING(20),
    },
    tipo: {
        type: DataTypes.ENUM('aluno', 'proprietario'),
        allowNull: false,
        defaultValue: 'aluno',
    },
    codigo_usuario: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    data_criacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'usuarios',
    timestamps: false,
});

Usuario.beforeCreate(async (usuario) => {
    if(usuario.senha){
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(usuario.senha, salt);
    }
});

/**
 * Método de instância para comparar a senha fornecida com o hash salvo no banco.
 * @param {string} senhaFornecida - Senha em texto puro digitada pelo usuário.
 * @returns {Promise<boolean>} True se as senhas coincidirem, False caso contrário.
 */
Usuario.prototype.compararSenha = async function(senhaFornecida) {
    // 'this.senha' é a senha HASHED salva no banco (acessível pois é um método de instância)
    return await bcrypt.compare(senhaFornecida, this.senha);
};

export default Usuario;