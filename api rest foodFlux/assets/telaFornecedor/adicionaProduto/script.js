// script.js (Código Final, Limpo e Unificado)

// ==========================================================
// 1. VARIÁVEIS DO DOM
// ==========================================================
const API_PRODUTOS_URL = 'http://localhost:3000/produtos';
let imageUploadArea, imageInput, imagePreview, removeImageBtn, uploadPlaceholder, previewBtn, previewModal, closeModal;
let hasDiscountCheckbox, discountField; 

// ==========================================================
// 2. FUNÇÕES E LISTENERS DE INTERATIVIDADE
// ==========================================================

// Função principal de inicialização do DOM
document.addEventListener('DOMContentLoaded', () => {

    // 1. ATRIBUIÇÃO DE VARIÁVEIS DO DOM
    imageUploadArea = document.getElementById('imagePreviewArea'); // Usando o ID ajustado no HTML
    imageInput = document.getElementById('imageInput');
    imagePreview = document.getElementById('imagePreview');
    removeImageBtn = document.getElementById('removeImage');
    previewBtn = document.getElementById('previewBtn');
    previewModal = document.getElementById('previewModal');
    closeModal = document.getElementById('closeModal');
    hasDiscountCheckbox = document.getElementById('hasDiscount');
    discountField = document.getElementById('discountField');

    // Verifica se os elementos cruciais para o Preview/Upload existem no HTML
    if (imageUploadArea) {
        uploadPlaceholder = imageUploadArea.querySelector('#previewPlaceholder'); // ID do placeholder
    }


    // --- Menu navigation ---
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // --- Lógica de Preview de URL (Novo) ---
    const imageUrlInput = document.getElementById('imageUrl');
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', function() {
            if (this.value) {
                imagePreview.src = this.value;
                imagePreview.style.display = 'block';
                if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
            } else {
                imagePreview.src = '';
                imagePreview.style.display = 'none';
                if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
            }
        });
    }

    // --- Toggle do Campo de Desconto (Mantido para o preview, mesmo que removido da API) ---
    if (hasDiscountCheckbox && discountField) {
        hasDiscountCheckbox.addEventListener('change', function() {
            discountField.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) {
                document.getElementById('discountPrice').value = '';
            }
        });
    }

    // --- Lógica de Preview ---
    if (previewBtn && previewModal) {
        previewBtn.addEventListener('click', () => {
            const name = document.getElementById('productName').value || 'Nome do Produto';
            const description = document.getElementById('productDescription').value || 'Descrição do produto';
            const price = document.getElementById('productPrice').value || '0,00';
            
            // Update preview
            document.getElementById('previewName').textContent = name;
            document.getElementById('previewDescription').textContent = description;
            
            // Usa o preço promocional se estiver marcado, senão usa o preço normal
            let finalPrice = price;
            if (hasDiscountCheckbox && hasDiscountCheckbox.checked) {
                 finalPrice = document.getElementById('discountPrice')?.value || price;
            }
            
            document.getElementById('previewPrice').textContent = `R$ ${parseFloat(finalPrice).toFixed(2)}`;
            
            // REMOVIDO: Tempo de Preparo, Tags (simplificado para o HTML atual)
            document.getElementById('previewTime').textContent = ''; 
            document.getElementById('previewTags').innerHTML = '';
            
            // Image preview
            const previewProductImage = document.getElementById('previewProductImage');
            if (imagePreview.src && imagePreview.style.display === 'block') {
                previewProductImage.src = imagePreview.src;
            } else {
                previewProductImage.src = 'https://via.placeholder.com/600x400?text=Sem+Imagem';
            }
            
            previewModal.classList.add('active');
        });
    }

    if (closeModal) closeModal.addEventListener('click', () => {
        previewModal.classList.remove('active');
    });

    if (previewModal) previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.classList.remove('active');
        }
    });

    // --- Botão Cancelar ---
    document.getElementById('cancelBtn')?.addEventListener('click', () => {
        if (confirm('Deseja realmente cancelar? Todas as informações serão perdidas.')) {
            window.location.href = '../telaPrincipal/index.html'; 
        }
    });


    // ==========================================================
    // 3. LÓGICA DE SUBMISSÃO PARA A API (POST)
    // ==========================================================

    document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. OBTENÇÃO DO ID DA CANTINA
        const idCantina = localStorage.getItem('cantinaId'); 
        
        if (!idCantina) {
            alert("ERRO CRÍTICO: ID da Cantina não encontrado. Verifique seu login.");
            return;
        }

        // 2. COLETA DE DADOS E MONTAGEM DO OBJETO (Payload)
        
        // Campos necessários (Preço e Estoque são convertidos para número)
        const precoBase = parseFloat(document.getElementById('productPrice').value);
        const estoque = parseInt(document.getElementById('stockQuantity').value);
        const imageUrl = document.getElementById('imageUrl').value; // Captura do novo campo de URL
        
        const productData = {
            // Campos obrigatórios da API
            id_cantina: parseInt(idCantina),
            nome: document.getElementById('productName').value,
            descricao: document.getElementById('productDescription').value,
            preco: precoBase, 
            estoque: estoque,
            imagem_url: imageUrl, 
            categoria: document.getElementById('productCategory').value,
            // Mapeia o checkbox de disponibilidade (status)
            status: document.getElementById('isAvailable').checked ? 'disponivel' : 'indisponivel',
        };
        
        console.log('Payload enviado:', productData);
        
        // 3. CHAMADA DA API (Fetch POST)
        try {
            const response = await fetch(API_PRODUTOS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Adicione o token se a API exigir
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify(productData)
            });

            const result = await response.json();
            
            if (response.ok || response.status === 201) { 
                // SUCESSO
                alert(`Produto "${productData.nome}" adicionado com sucesso! ✅ ID: ${result.id_produto || 'N/A'}`);
                
                // 4. Resetar formulário no sucesso
                document.getElementById('productForm').reset();
                if (imagePreview) imagePreview.src = '';
                if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
                
                window.location.href = '../telaPrincipal/index.html';

            } else {
                // FALHA NA API (Status 4xx ou 5xx)
                console.error('Erro da API:', result);
                alert(`FALHA NO CADASTRO! Status: ${response.status}\n\nMensagem do Servidor: ${JSON.stringify(result, null, 2)}`);
            }

        } catch (error) {
            // FALHA DE CONEXÃO (Network Error, CORS, etc.)
            console.error('Erro de conexão ou processamento:', error);
            alert('ERRO DE CONEXÃO: Não foi possível alcançar o servidor. Verifique a API e o CORS.');
        }
    });

});