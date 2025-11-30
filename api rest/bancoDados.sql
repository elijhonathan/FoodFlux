CREATE DATABASE IF NOT EXISTS foodflux;
USE foodflux;

-- Tabela de usuários
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- nova coluna para autenticação local
    telefone VARCHAR(20),
    tipo ENUM('aluno','proprietario') NOT NULL DEFAULT 'aluno',
    codigo_usuario INT DEFAULT 1, -- todos iniciam com 1
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cidades
CREATE TABLE cidades (
    id_cidade INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Tabela de cantinas
CREATE TABLE cantinas (
    id_cantina INT AUTO_INCREMENT PRIMARY KEY,
    id_proprietario INT NOT NULL,
    id_cidade INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(255),
    status ENUM('ativo','inativo') DEFAULT 'ativo',
    FOREIGN KEY (id_proprietario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_cidade) REFERENCES cidades(id_cidade) ON DELETE CASCADE
);

-- Tabela de produtos
CREATE TABLE produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    id_cantina INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT DEFAULT 0,
    imagem_url VARCHAR(500),
    categoria VARCHAR(500),
    status ENUM('disponivel','indisponivel') DEFAULT 'disponivel',
    FOREIGN KEY (id_cantina) REFERENCES cantinas(id_cantina) ON DELETE CASCADE
);

-- Tabela de clientes anônimos
CREATE TABLE clientes_anonimos (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    telefone VARCHAR(20)
);

-- Tabela de pedidos
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL,
    id_cliente_anonimo INT NULL,
    id_cantina INT NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    codigo_retirada VARCHAR(20),
    status ENUM('pendente','preparando','pronto','finalizado','cancelado') DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_cliente_anonimo) REFERENCES clientes_anonimos(id_cliente) ON DELETE SET NULL,
    FOREIGN KEY (id_cantina) REFERENCES cantinas(id_cantina) ON DELETE CASCADE
);

-- Tabela de itens do pedido
CREATE TABLE itens_pedido (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
);

-- Tabela de favoritos
CREATE TABLE favoritos (
    id_usuario INT NOT NULL,
    id_produto INT NOT NULL,
    id_cantina INT NOT NULL,
    data_favorito TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_produto, id_cantina),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE,
    FOREIGN KEY (id_cantina) REFERENCES cantinas(id_cantina) ON DELETE CASCADE
);
