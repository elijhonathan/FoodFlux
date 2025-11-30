// Interatividade dos itens do menu
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Filtros de gráfico
document.querySelectorAll('.chart-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.chart-filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Gráfico de Vendas
const salesCtx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(salesCtx, {
    type: 'line',
    data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [{
            label: 'Vendas (R$)',
            data: [1850, 2200, 1950, 2450, 2100, 2800, 1247],
            borderColor: '#ffa500',
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#ffa500',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return 'R$ ' + value;
                    }
                }
            }
        }
    }
});

// Gráfico de Estoque
const stockCtx = document.getElementById('stockChart').getContext('2d');
const stockChart = new Chart(stockCtx, {
    type: 'doughnut',
    data: {
        labels: ['Pizza', 'Massas', 'Saladas', 'Sobremesas', 'Bebidas'],
        datasets: [{
            data: [35, 25, 15, 15, 10],
            backgroundColor: [
                '#ffa500',
                '#14424b',
                '#ffb732',
                '#1a5460',
                '#ff8c00'
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    usePointStyle: true
                }
            }
        }
    }
});

// Botões de ação
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Visualizar detalhes do pedido');
    });
});