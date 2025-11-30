// src/controllers/controller.js
import Usuario from '../models/model.js';
import { Cidade, Cantina, Produto, ClienteAnonimo, Pedido, ItemPedido } from '../models/index.js';
import sequelize from '../config/config.js';


class Controller {

    static teste(req, res) {
        try {
            res.status(200).json({
                message: "API Funcionando na rota teste",
                status: "OK",
                timeStamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({
                message: "Erro interno do servidor",
                error: error.message
            });
        }
    }


    static async cadastrarUsuario(req, res) {
        // Pega apenas os campos necessários do corpo da requisição
        const { nome, email, senha, telefone, tipo } = req.body;

        try {
            // Cria o usuário no banco. 
            // O hook 'beforeCreate' no modelo fará a criptografia da senha automaticamente.
            const novoUsuario = await Usuario.create({
                nome,
                email,
                senha, // Essa senha é a em texto puro que será criptografada
                telefone,
                tipo: tipo || 'aluno' // Usa 'aluno' como padrão se 'tipo' não for enviado
            });

            // Retorna a resposta de sucesso (com status 201 Created)
            res.status(201).json({
                message: 'Usuário cadastrado com sucesso!',
                usuario: {
                    id_usuario: novoUsuario.id_usuario,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email
                    // NUNCA retorne a senha, mesmo criptografada
                }
            });
        } catch (error) {
            // Trata erros comuns, como e-mail já existente (unique constraint)
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'Erro: O email fornecido já está em uso.' });
            }

            console.error(error); // Loga o erro completo no console
            res.status(500).json({ message: 'Erro interno do servidor ao cadastrar usuário.' });
        }
    }

    static async login(req, res) {
        const { email, senha } = req.body;

        // 1. Busca o usuário pelo email
        const usuario = await Usuario.findOne({ where: { email } });

        // 2. Verifica se o usuário existe
        if (!usuario) {
            // É importante usar uma mensagem genérica para não dar dicas a invasores
            return res.status(401).json({ message: 'Credenciais inválidas. Verifique o email e a senha.' });
        }

        // 3. Compara a senha (texto puro) com o hash (banco)
        const senhaCorreta = await usuario.compararSenha(senha);

        if (senhaCorreta) {
            // ✅ CORREÇÃO: Usar .toJSON() e desestruturar para acessar os dados
            const { id_usuario, nome, email, codigo_usuario } = usuario.toJSON();

            // 4. Sucesso no login
            return res.status(200).json({
                message: 'Login efetuado com sucesso!',
                usuario: {
                    // Usando a desestruturação (shorthand property)
                    id_usuario,
                    nome,
                    email,
                    codigo_usuario 
                }
            });
        } else {
            // 5. Falha na senha
            return res.status(401).json({ message: 'Credenciais inválidas. Verifique o email e a senha.' });
        }
    }



    static async buscarCidadesECantinas(req, res) {
     try {
     // Usa o 'include' para buscar as Cantinas associadas a CADA Cidade
        const cidadesComCantinas = await Cidade.findAll({
        attributes: ['id_cidade', 'nome'],
        include: [{
            model: Cantina,
            as: 'cantinasAssociadas', // Alias correto
             attributes: ['id_cantina', 'nome', 'endereco', 'status'],
             where: { status: 'ativo' },
             required: false
                }],
            order: [
         ['nome', 'ASC'], // Ordena cidades
         // Correção: Usa o alias da associação para ordenar as cantinas
        ['cantinasAssociadas', 'nome', 'ASC'] 
        ]
        });

        // Retorna o array de cidades com as cantinas aninhadas
         return res.status(200).json(cidadesComCantinas);

         } catch (error) {
             console.error('Erro ao buscar cidades e cantinas:', error);
             res.status(500).json({ message: 'Erro interno ao consultar dados de localização e cantinas.' });
    }
 }

 static async atualizarUsuario(req, res) {
        // 1. Pega o ID do usuário da URL
        const id = req.params.id;
        // 2. Pega os dados a serem atualizados do corpo da requisição
        const novosDados = req.body;

        // Opcional: Impedir a atualização da senha ou email por essa rota
        if (novosDados.senha) {
             // 💡 Melhor ter uma rota separada para a senha, 
             // mas se for atualizar aqui, a criptografia DEVE ser feita.
             // Para simplificar, vamos assumir que apenas nome, telefone ou tipo serão atualizados.
             delete novosDados.senha;
        }
        if (novosDados.email) {
             // Impedir alteração de email por PUT simples
             delete novosDados.email; 
        }

        try {
            // 3. Executa a atualização no banco de dados
            const [rowsUpdated] = await Usuario.update(novosDados, {
                where: { id_usuario: id }
            });

            // O Sequelize retorna um array onde o primeiro elemento é o número de linhas afetadas
            if (rowsUpdated > 0) {
                // Se a atualização foi bem-sucedida
                return res.status(200).json({ message: 'Dados cadastrais atualizados com sucesso.' });
            } else {
                // Se o ID não foi encontrado
                return res.status(404).json({ message: `Usuário com ID ${id} não encontrado.` });
            }

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ message: 'Erro interno do servidor ao atualizar dados.' });
        }
    }

    /**
     * @description Cadastra um novo produto no banco de dados.
     */
    static async cadastrarProduto(req, res) {
        // Pega todos os campos que vêm no corpo da requisição
        const dadosProduto = req.body;

        try {
            // Verifica se o ID da cantina (id_cantina) existe e se é válida
            if (!dadosProduto.id_cantina) {
                return res.status(400).json({ message: 'O ID da cantina é obrigatório para cadastrar um produto.' });
            }

            // Opcional: Você pode verificar aqui se o usuário logado é o proprietário da cantina (segurança)

            // Cria o produto no banco
            const novoProduto = await Produto.create(dadosProduto);

            // Retorna o produto cadastrado (status 201 Created)
            res.status(201).json({
                message: 'Produto cadastrado com sucesso!',
                produto: novoProduto.toJSON() // Retorna o objeto puro
            });

        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            // Verifica se o erro é de validação do Sequelize
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ message: 'Dados inválidos ou ID da cantina não existe.', details: error.errors });
            }
            res.status(500).json({ message: 'Erro interno do servidor ao cadastrar produto.' });
        }
    }

    /**
     * @description Atualiza os dados de um produto específico.
     */
    static async atualizarProduto(req, res) {
        // 1. Pega o ID do produto da URL
        const id = req.params.id;
        // 2. Pega os dados a serem atualizados do corpo da requisição
        const novosDados = req.body;

        try {
            // Opcional: Impedir que o ID da cantina seja alterado por essa rota.
            if (novosDados.id_cantina) {
                delete novosDados.id_cantina;
            }

            // 3. Executa a atualização no banco de dados
            const [rowsUpdated] = await Produto.update(novosDados, {
                where: { id_produto: id }
            });

            // O Sequelize retorna um array onde o primeiro elemento é o número de linhas afetadas
            if (rowsUpdated > 0) {
                // Se a atualização foi bem-sucedida
                return res.status(200).json({ message: `Produto com ID ${id} atualizado com sucesso.` });
            } else {
                // Se o ID não foi encontrado ou se os dados eram idênticos (zero linhas afetadas)
                return res.status(404).json({ message: `Produto com ID ${id} não encontrado.` });
            }

        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            // Captura erro de validação (ex: preço nulo) ou outros erros de banco
            if (error.name === 'SequelizeValidationError') {
                 return res.status(400).json({ message: 'Erro de validação nos dados fornecidos.', details: error.errors });
            }
            res.status(500).json({ message: 'Erro interno do servidor ao atualizar produto.' });
        }
    }

    /**
     * @description Busca produtos de uma cantina e os agrupa por categoria.
     */
    static async buscarProdutosPorCantinaECategoria(req, res) {
        // 1. Pega o ID da cantina da URL
        const id_cantina = req.params.id_cantina;

        try {
            // 2. Busca todos os produtos para a cantina especificada
            const produtos = await Produto.findAll({
                where: { id_cantina: id_cantina },
                // Ordena por categoria para que o agrupamento fique mais organizado, se desejar
                order: [
                    ['categoria', 'ASC'],
                    ['nome', 'ASC'] 
                ],
                raw: true // Retorna objetos JavaScript simples
            });

            if (produtos.length === 0) {
                return res.status(404).json({ message: `Nenhum produto encontrado para a cantina ID ${id_cantina}.` });
            }

            // 3. Agrupa os produtos por categoria usando Array.prototype.reduce
            const produtosAgrupados = produtos.reduce((acumulador, produto) => {
                // Usa a coluna 'categoria' como chave. Se for nula, usa 'Outros'.
                const categoria = produto.categoria || 'Outros'; 
                
                // Inicializa o array para a categoria, se ainda não existir
                if (!acumulador[categoria]) {
                    acumulador[categoria] = [];
                }

                // Adiciona o produto à categoria
                acumulador[categoria].push(produto);

                return acumulador;
            }, {}); // O objeto inicial para o acumulador é {}

            // 4. Retorna os produtos agrupados
            return res.status(200).json(produtosAgrupados);

        } catch (error) {
            console.error('Erro ao buscar e agrupar produtos:', error);
            res.status(500).json({ message: 'Erro interno do servidor ao buscar produtos.' });
        }
    }
    

    /**
     * @description Cadastra um cliente anônimo.
     */
    static async cadastrarClienteAnonimo(req, res) {
        // Pega os dados do corpo da requisição (nome e telefone)
        const { nome, telefone } = req.body;

        try {
            // Cria o registro no banco de dados.
            // Se nome ou telefone não forem fornecidos, o Sequelize usa NULL ou os defaults definidos.
            const novoCliente = await ClienteAnonimo.create({ nome, telefone });

            // Retorna o cliente cadastrado (status 201 Created)
            res.status(201).json({
                message: 'Cliente anônimo cadastrado com sucesso!',
                cliente: novoCliente.toJSON()
            });

        } catch (error) {
            console.error('Erro ao cadastrar cliente anônimo:', error);
            res.status(500).json({ message: 'Erro interno do servidor ao cadastrar cliente anônimo.' });
        }
    }
    
    /**
     * @description Cadastra um novo pedido, verifica e subtrai o estoque em uma transação.
     */
    static async cadastrarPedido(req, res) {
        // Dados principais do pedido
        const { id_usuario, id_cliente_anonimo, id_cantina, valor_total, itens } = req.body;

        // Gerar um código de retirada simples (ex: 6 dígitos aleatórios)
        const codigo_retirada = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // 1. Iniciar a Transação
        const t = await sequelize.transaction();

        try {
            // --- 2. VERIFICAÇÃO DE ESTOQUE E PREPARAÇÃO DA SUBTRAÇÃO ---
            
            // Cria uma lista de IDs de produtos para buscar de uma vez
            const produtoIds = itens.map(item => item.id_produto);

            // Busca os dados e o estoque atual de todos os produtos envolvidos
            const produtosEstoque = await Produto.findAll({
                where: { id_produto: produtoIds },
                attributes: ['id_produto', 'estoque', 'preco'],
                transaction: t // Incluir a transação na consulta
            });

            // Mapeia os dados do estoque para acesso rápido
            const mapaEstoque = produtosEstoque.reduce((mapa, produto) => {
                mapa[produto.id_produto] = produto;
                return mapa;
            }, {});

            const produtosParaAtualizar = [];

            for (const item of itens) {
                const produtoNoBanco = mapaEstoque[item.id_produto];

                // a) Verifica se o produto existe
                if (!produtoNoBanco) {
                    throw new Error(`Produto ID ${item.id_produto} não encontrado.`);
                }
                
                // b) Verifica se há estoque suficiente
                if (produtoNoBanco.estoque < item.quantidade) {
                    throw new Error(`Estoque insuficiente para o produto ID ${item.id_produto}.`);
                }
                
                // c) Verifica se o preço unitário enviado corresponde ao preço atual do banco (segurança)
                const precoBase = parseFloat(produtoNoBanco.preco);
                const precoUnitarioEnviado = parseFloat(item.preco_unitario);
                if (Math.abs(precoBase - precoUnitarioEnviado) > 0.01) {
                    // É melhor usar o preço do banco, ou validar a diferença
                    item.preco_unitario = precoBase;
                }

                // Prepara a atualização do estoque
                produtosParaAtualizar.push({
                    id_produto: item.id_produto,
                    novoEstoque: produtoNoBanco.estoque - item.quantidade
                });
            }

            // --- 3. CRIAÇÃO DO PEDIDO (Tabela pedidos) ---

            const novoPedido = await Pedido.create({
                id_usuario: id_usuario || null,
                id_cliente_anonimo: id_cliente_anonimo || null,
                id_cantina,
                valor_total,
                codigo_retirada,
                status: 'pendente'
            }, { transaction: t });

            // --- 4. CRIAÇÃO DOS ITENS DO PEDIDO (Tabela itens_pedido) ---

            const itensParaSalvar = itens.map(item => ({
                id_pedido: novoPedido.id_pedido,
                id_produto: item.id_produto,
                quantidade: item.quantidade,
                // Garantir que o preco_unitario seja o do corpo ou o ajustado
                preco_unitario: item.preco_unitario || mapaEstoque[item.id_produto].preco
            }));

            await ItemPedido.bulkCreate(itensParaSalvar, { transaction: t });

            // --- 5. ATUALIZAÇÃO DO ESTOQUE (Tabela produtos) ---

            const promisesAtualizacaoEstoque = produtosParaAtualizar.map(item =>
                Produto.update({ estoque: item.novoEstoque }, {
                    where: { id_produto: item.id_produto },
                    transaction: t
                })
            );

            await Promise.all(promisesAtualizacaoEstoque);
            
            // --- 6. SUCESSO: COMMIT da Transação ---
            await t.commit(); 

            // Resposta de sucesso
            return res.status(201).json({
                message: 'Pedido cadastrado e estoque atualizado com sucesso!',
                id_pedido: novoPedido.id_pedido,
                codigo_retirada: novoPedido.codigo_retirada
            });

        } catch (error) {
            // 7. FALHA: ROLLBACK da Transação
            await t.rollback();
            
            console.error('Erro na transação do pedido:', error.message);
            
            // Retorna o erro específico do estoque
            if (error.message.includes('Estoque insuficiente') || error.message.includes('Produto ID')) {
                 return res.status(400).json({ message: error.message });
            }

            res.status(500).json({ message: 'Erro interno do servidor ao processar o pedido.' });
        }
    }

}

export default Controller;