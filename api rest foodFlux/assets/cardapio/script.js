// script.js (Código Completo Corrigido)

// ==========================================================
// VARIÁVEIS DE API E FUNÇÕES AUXILIARES
// ==========================================================
const MENU_API_URL = 'http://localhost:3000/cantinas/';
let localizacoesData = []; 
let cart = [];

// Função que verifica o horário de funcionamento
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 9 && hora < 21;
}

// Função para formatar o preço para BRL
function formatPrice(price) {
    return parseFloat(price).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Função para criar o HTML de um único item do cardápio
function createMenuItemHTML(item) {
    const formattedPrice = formatPrice(item.preco);
    const description = item.descricao || "Descrição indisponível."; 
    // Usando toLowerCase().replace(/ /g, '') para tentar mapear a imagem
    const imageUrl = item.imagem_url || './assets/placeholder.jpg';
    
    return `
        <div class="flex gap-2">
            <img src="${imageUrl}" 
            alt="${item.nome}" 
            class="w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration-300">
        
            <div>
                <p class="font-bold">${item.nome}</p>
                <p class="text-sm">${description}</p>

                <div class="flex items-center gap-2 justify-between mt-3">
                    <p class="font-bold text-lg">${formattedPrice}</p>
                    <button 
                    class="bg-gray-900 px-5 rounded add-to-cart-btn"
                    data-name="${item.nome}"
                    data-price="${item.preco}">
                        <i class="fa fa-cart-plus text-lg text-white"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Função para adicionar item ao carrinho
function addToCart(name, price, cartCounter, cartItemsContainer, cartTotal) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartModal(cartCounter, cartItemsContainer, cartTotal);
};

// Função para remover item do carrinho
function removeItemCart(name, cartCounter, cartItemsContainer, cartTotal) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal(cartCounter, cartItemsContainer, cartTotal);
    }
};

// Função para atualizar o modal do carrinho
function updateCartModal(cartCounter, cartItemsContainer, cartTotal) {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `;

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    cartCounter.innerHTML = cart.length;   
};

// Função principal para buscar e renderizar o menu
async function fetchAndRenderMenu() {
    const cantinaId = localStorage.getItem('cantinaId'); 
    
    // ATENÇÃO: Verifique o ID no index.html. Se lá está 'menu', use 'menu'
    const menuContainer = document.getElementById('menu'); 

    if (!cantinaId) {
        if (menuContainer) menuContainer.innerHTML = "<p class='text-center text-red-500 font-bold'>Erro: ID da cantina não encontrado. Volte e selecione um local.</p>";
        return;
    }

    if (menuContainer) menuContainer.innerHTML = "<p class='text-center'>Carregando cardápio...</p>";

    try {
        const endpoint = `${MENU_API_URL}${cantinaId}/produtos`;
        const response = await fetch(endpoint, { method: 'GET' });
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: Falha ao buscar cardápio.`);
        }

        const menuData = await response.json();
        let fullMenuHTML = '';
        
        for (const category in menuData) {
            if (menuData.hasOwnProperty(category) && menuData[category].length > 0) {
                fullMenuHTML += `
                    <div class="mx-auto max-w-7xl px-2 my-8">
                        <h2 id="${category.toLowerCase()}" class="font-bold text-3xl">
                            ${category}
                        </h2>
                    </div>
                    <main class="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 mx-auto max-w-7xl px-2 mb-16">
                `;

                menuData[category].forEach(item => {
                    fullMenuHTML += createMenuItemHTML(item);
                });

                fullMenuHTML += `</main>`;
            }
        }
        
        if (menuContainer) menuContainer.innerHTML = fullMenuHTML;
        
    } catch (error) {
        console.error("Erro ao carregar o cardápio da API:", error);
        if (menuContainer) menuContainer.innerHTML = `<p class='text-center text-red-500 font-bold'>Erro ao carregar o cardápio: ${error.message}</p>`;
    }
}


// ==========================================================
// AÇÕES DO DOM (Chamadas após o HTML carregar)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. DECLARAÇÃO DE VARIÁVEIS DO DOM (Movido para dentro do DOMContentLoaded)
    const menuElement = document.getElementById("menu"); // Usado para adicionar ao carrinho
    const cartBtn = document.getElementById("cart-btn");
    const cartModal = document.getElementById("cart-modal");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const cartCounter = document.getElementById("cart-count");
    const addressInput = document.getElementById("address");
    const addressWarn = document.getElementById("address-warn");
    const dateSpan = document.getElementById("date-span");

    // 2. VERIFICAÇÃO DE HORÁRIO E ESTADO (Ajustado)
    const isOpen = checkRestaurantOpen();

    if(dateSpan) {
        if(isOpen) {
            dateSpan.classList.remove("bg-red-500");
            dateSpan.classList.add("bg-green-600");
        } else {
            dateSpan.classList.remove("bg-green-600");
            dateSpan.classList.add("bg-red-500");
        }
    }

    // 3. CARREGAR CARDÁPIO
    fetchAndRenderMenu(); 
    
    // 4. EVENT LISTENERS DO CARRINHO (Usando as variáveis recém-declaradas)

    if (cartBtn) cartBtn.addEventListener("click", function() {
        updateCartModal(cartCounter, cartItemsContainer, cartTotal);
        if (cartModal) cartModal.style.display = "flex";
    });

    if (cartModal) cartModal.addEventListener("click", function(event) {
        if(event.target === cartModal || event.target === closeModalBtn) {
            cartModal.style.display = "none";
        }
    });

    // Event Listener para adicionar ao carrinho (ANEXADO AO ELEMENTO PAI CORRETO)
    if (menuElement) menuElement.addEventListener("click", function(event) {
        let parentButton = event.target.closest(".add-to-cart-btn");

        if(parentButton) {
            const name = parentButton.getAttribute("data-name");
            const price = parseFloat(parentButton.getAttribute("data-price"));
            addToCart(name, price, cartCounter, cartItemsContainer, cartTotal);
        }
    });

    // Event Listener para remover do carrinho
    if (cartItemsContainer) cartItemsContainer.addEventListener("click", function(event) {
        if(event.target.classList.contains("remove-from-cart-btn")) {
            const name = event.target.getAttribute("data-name")
            removeItemCart(name, cartCounter, cartItemsContainer, cartTotal);
        }
    });

    // Event Listener do Input de Endereço/Nome
    if (addressInput) addressInput.addEventListener("input", function(event) {
        let inputValue = event.target.value;
        if(inputValue !== "" && addressWarn) {
            addressInput.classList.remove("border-red-500");
            addressWarn.classList.add("hidden");
        }
    });

    // Event Listener de Finalizar Pedido
    if (checkoutBtn) checkoutBtn.addEventListener("click", function() {
        const isOpen = checkRestaurantOpen();

        if(!isOpen) {
           // Toastify logic...
           Toastify({
              text: "A lanchonete está fechada no momento!",
                duration: 3000,
                close: true,
                gravity: "top", 
                position: "right", 
                stopOnFocus: true, 
                style: {
                background: "#fc6601",
                }
            }).showToast();
            return;        
        }

        if(cart.length === 0) return;
        if(addressInput && addressInput.value === "") {
            if(addressWarn) addressWarn.classList.remove("hidden");
            addressInput.classList.add("border-red-500");
            return;   
        }

        const cartItems = cart.map((item) => {
            return(`${item.name} Quantidade: ${item.quantity} Preço: R$ ${item.price.toFixed(2)} |`)
        }).join("");

        const message = encodeURIComponent(cartItems);
        const phone = "+5541988031440";

        window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

        cart = [];
        updateCartModal(cartCounter, cartItemsContainer, cartTotal);
        
    });

});