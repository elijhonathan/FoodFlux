// Menu navigation
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Search functionality
const searchInput = document.getElementById('searchInput');
const productsGrid = document.getElementById('productsGrid');
const emptyState = document.getElementById('emptyState');

searchInput.addEventListener('input', filterProducts);

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterProducts();
    });
});

// Category filter
document.getElementById('categoryFilter').addEventListener('change', filterProducts);

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        const name = product.querySelector('.product-name').textContent.toLowerCase();
        const description = product.querySelector('.product-description').textContent.toLowerCase();
        const status = product.dataset.status;
        const category = product.dataset.category;
        const isFeatured = product.querySelector('.badge.featured') !== null;
        
        let matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
        let matchesFilter = activeFilter === 'all' || 
                           (activeFilter === 'available' && status === 'available') ||
                           (activeFilter === 'unavailable' && status === 'unavailable') ||
                           (activeFilter === 'featured' && isFeatured);
        let matchesCategory = categoryFilter === 'all' || category === categoryFilter;
        
        if (matchesSearch && matchesFilter && matchesCategory) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    if (visibleCount === 0) {
        emptyState.style.display = 'block';
        productsGrid.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        productsGrid.style.display = 'grid';
    }
}

// Edit product
function editProduct(id) {
    alert(`Editando produto ID: ${id}\n\nAqui você pode redirecionar para uma página de edição ou abrir um modal.`);
    // window.location.href = `edit-product.html?id=${id}`;
}

// Toggle product availability
function toggleProduct(id) {
    const product = document.querySelector(`.product-card[data-id="${id}"]`);
    const status = product.dataset.status;
    const badge = product.querySelector('.badge.available, .badge.unavailable');
    const toggleBtn = product.querySelector('.btn-toggle');
    
    if (status === 'available') {
        // Desativar produto
        if (confirm('Deseja desativar este produto?')) {
            product.dataset.status = 'unavailable';
            badge.classList.remove('available');
            badge.classList.add('unavailable');
            badge.textContent = 'Indisponível';
            
            toggleBtn.innerHTML = `
                <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                Ativar
            `;
            alert('Produto desativado com sucesso!');
        }
    } else {
        // Ativar produto
        if (confirm('Deseja ativar este produto?')) {
            product.dataset.status = 'available';
            badge.classList.remove('unavailable');
            badge.classList.add('available');
            badge.textContent = 'Disponível';
            
            toggleBtn.innerHTML = `
                <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
                Desativar
            `;
            alert('Produto ativado com sucesso!');
        }
    }
}

// Delete product
function deleteProduct(id) {
    const product = document.querySelector(`.product-card[data-id="${id}"]`);
    const productName = product.querySelector('.product-name').textContent;
    
    if (confirm(`Tem certeza que deseja excluir "${productName}"?\n\nEsta ação não pode ser desfeita.`)) {
        product.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            product.remove();
            filterProducts();
            alert('Produto excluído com sucesso!');
        }, 300);
    }
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
`;
document.head.appendChild(style);