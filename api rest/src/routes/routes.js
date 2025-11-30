import {Router} from 'express';
import Controller from '../controllers/controller.js';

const router = Router();

// Rota de teste
router.get('/teste', Controller.teste); // Teste simples de api Postman: http://localhost:3000/teste


// Rota de cantinas
router.get('/localizacoes', Controller.buscarCidadesECantinas);


// Rotas de usuario padrão
router.post('/usuarios', Controller.cadastrarUsuario);

router.post('/login', Controller.login);

router.put('/usuarios/:id', Controller.atualizarUsuario);


// Rotas de proprietario
router.post('/produtos', Controller.cadastrarProduto);

router.put('/produtos/:id', Controller.atualizarProduto);

router.get('/cantinas/:id_cantina/produtos', Controller.buscarProdutosPorCantinaECategoria);


// Rotas de pedido
router.post('/pedidos', Controller.cadastrarPedido);


// Rotas de usuario sem login
router.post('/clientes-anonimos', Controller.cadastrarClienteAnonimo);




export default router;