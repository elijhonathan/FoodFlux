// src/config/config.js
import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

// 🚨 Correção: Criar uma função assíncrona para lidar com o 'await'
async function conectarBanco() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso');
    } catch (error) {
        console.error('❌ Não foi possível conectar ao banco de dados:', error.message);
        // Opcional: Se a conexão falhar, você pode encerrar o processo.
        // process.exit(1); 
    }
}

// Chame a função para iniciar o processo de conexão
conectarBanco(); 

export default sequelize;