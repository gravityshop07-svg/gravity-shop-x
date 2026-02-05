// ==========================================
// GRAVITY SHOP - JavaScript (Arquitectura Original + Tallas + WhatsApp Directo)
// ==========================================

// 1. CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = 'https://hotcjinskytleluersrc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdGNqaW5za3l0bGVsdWVyc3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzI2NzIsImV4cCI6MjA4NTgwODY3Mn0.7Z7bOOzj10kwPjwELzGtgHoXPN2BvrAqqp1Fsln-bQI';

// TU NÚMERO DE WHATSAPP (Formato internacional)
const PHONE_NUMBER = '593983105527';

// --- INICIALIZACIÓN SEGURA ---
let db;
try {
    if (typeof supabase !== 'undefined') {
        db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
        console.error("Error: Librería Supabase no cargada en HTML");
    }
} catch (error) {
    console.error("Error inicializando Supabase:", error);
}

// Estado Global
let products = []; 
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';
let currentSlide = 0;
let slideInterval;

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    // 1. Descargar productos de Supabase
    await fetchProductsFromDB();

    // 2. Iniciar el resto (Carrito, Slider, Scroll, Tema)
    updateCartUI();
    initSlider();
    initScrollEffects();
    loadTheme();
    
    // --- CORRECCIÓN SOLICITADA: PRECIO MÁXIMO $50 ---
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    if (priceRange) {
        priceRange.max = 50;     // Cambia el tope de 500 a 50
        priceRange.value = 50;   // Pone la bolita al máximo
        if(priceValue) priceValue.textContent = '$50';
    }

    // --- CORRECCIÓN SOLICITADA: BOTÓN FLOTANTE AL NÚMERO REAL ---
    const floatBtn = document.querySelector('.whatsapp-float');
    if (floatBtn) {
        floatBtn.href = `https://wa.me/${PHONE_NUMBER}`;
    }
    
    // Ocultar pantalla de carga
    setTimeout(() => {
        const loader = document.getElementById('loadingScreen');
        if(loader) loader.classList.add('hidden');
    }, 1000);
    
    // Event Listeners
    const searchInput = document.getElementById('searchInput');
    if(searchInput) searchInput.addEventListener('input', renderProducts);

    if(priceRange) {
        priceRange.addEventListener('input', (e) => {
            const val = document.getElementById('priceValue');
            if(val) val.textContent = '$' + e.target.value;
            renderProducts();
        });
    }

    const sortSelect = document.getElementById('sortSelect');
    if(sortSelect) sortSelect.addEventListener('change', renderProducts);
}

// NUEVA FUNCIÓN: CONEXIÓN A BASE DE DATOS
async function fetchProductsFromDB() {
    const container = document.getElementById('productsContainer');
    
    if (!db) {
        console.error("No hay conexión a la base de datos (db es null)");
        return;
    }

    try {
        let { data, error } = await db
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        
        products = data || []; // Guardamos los datos reales
        renderProducts(); // Pintamos los productos

    } catch (err) {
        console.error("Error cargando productos:", err);
        if(container) container.innerHTML = '<p style="text-align:center; padding:20px;">Error cargando productos. Revisa tu conexión.</p>';
    }
}

// ==========================================
// RENDERIZAR PRODUCTOS
// ==========================================
function renderProducts() {
    const container = document.getElementById('productsContainer');
    if(!container) return;

    // Verificación segura de elementos
    const priceRange = document.getElementById('priceRange');
    // Usamos el valor del rango, si no existe asumimos 50
    const maxPrice = priceRange ? parseInt(priceRange.value) : 50;
    
    const searchInput = document.getElementById('searchInput');
    const searchVal = searchInput ? searchInput.value.toLowerCase() : '';
    
    const sortSelect = document.getElementById('sortSelect');
    const sortType = sortSelect ? sortSelect.value : 'default';
    
    // Filtrado
    let filtered = products.filter(p => {
        const pCategory = p.category || ''; // Evitar error si es null
        const matchCategory = currentFilter === 'all' || pCategory === currentFilter;
        
        const safePrice = p.price || 0;
        const safeName = p.name || '';
        const safeDesc = p.desc || '';
        
        const matchPrice = safePrice <= maxPrice;
        const matchSearch = safeName.toLowerCase().includes(searchVal) || 
                           safeDesc.toLowerCase().includes(searchVal);
        return matchCategory && matchPrice && matchSearch;
    });
    
    // Ordenamiento
    switch(sortType) {
        case 'price-low':
            filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
        case 'price-high':
            filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
        case 'rating':
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
    }
    
    // Renderizar vacio
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0;">
                <i class="fas fa-search" style="font-size: 4rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <h4 style="color: var(--text-muted);">No encontramos productos que coincidan</h4>
                <p style="color: var(--text-muted);">Intenta con otros filtros</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(p => createProductCard(p)).join('');
}

function createProductCard(product) {
    const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    const imageSrc = product.img || 'https://via.placeholder.com/300?text=Sin+Imagen';
    
    // --- LÓGICA DE TALLAS (NUEVO) ---
    let sizesHtml = '';
    if (product.sizes) {
        const allSizes = product.sizes.split(',').map(s => s.trim());
        const soldSizes = product.sold_out ? product.sold_out.split(',').map(s => s.trim()) : [];
        
        const badges = allSizes.map(s => {
            if (soldSizes.includes(s)) {
                // Talla agotada: Tachada y gris
                return `<span style="text-decoration:line-through; color:#aaa; margin-right:6px; font-size:0.85rem;">${s}</span>`;
            } else {
                // Talla disponible: Normal/Negrita
                return `<span style="font-weight:bold; color:var(--text-color); margin-right:6px; font-size:0.85rem; border:1px solid #ddd; padding:1px 5px; border-radius:4px;">${s}</span>`;
            }
        }).join('');
        
        sizesHtml = `<div style="margin-top:8px; margin-bottom:5px;">${badges}</div>`;
    }

    return `
        <div class="card-product animate__animated animate__fadeInUp">
            <div class="img-wrapper">
                <img src="${imageSrc}" class="card-img-top" alt="${product.name}" loading="lazy">
                
                ${product.isNew ? '<span class="product-badge badge-new">Nuevo</span>' : ''}
                ${discount > 0 ? `<span class="product-badge badge-discount">-${discount}%</span>` : ''}
                
                <div class="product-actions">
                    <button class="action-btn" onclick="quickView(${product.id})" title="Vista rápida">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            
            <div class="card-body">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h5 class="product-title">${product.name}</h5>
                
                ${sizesHtml}
                
                <div class="product-rating">
                    <span class="stars">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating || 5))}
                        ${(product.rating || 5) % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    </span>
                    <span>${product.rating || 5}</span>
                </div>
                
                <div class="product-footer">
                    <div>
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="add-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getCategoryName(category) {
    if (!category) return 'General';
    const names = {
        'tecnologia': 'Tecnología',
        'accesorios': 'Accesorios',
        'camisa-hombre': 'Camisa de Hombre',
        'buso-hombre': 'Buso de Hombre',
        'dividi-hombre': 'Dividi de Hombre',
        'buso-mujer': 'Buso de Mujer'
    };
    return names[category] || category;
}

// ==========================================
// FILTROS Y BÚSQUEDA
// ==========================================
function filterByCategory(category) {
    currentFilter = category;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (event && event.target && event.target.closest('.filter-btn')) {
        event.target.closest('.filter-btn').classList.add('active');
    }
    
    renderProducts();
    
    const prodSection = document.getElementById('productViewSection');
    if(prodSection) {
        prodSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function sortProducts() {
    renderProducts();
}

// ==========================================
// CARRITO DE COMPRAS
// ==========================================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    updateCartUI();
    showNotification(`¡${product.name} agregado al carrito!`);
    toggleCart(true);
}

function updateQty(id, change) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    
    item.qty += change;
    
    if (item.qty <= 0) {
        removeFromCart(id);
    } else {
        updateCartUI();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    showNotification('Producto eliminado del carrito');
}

function updateCartUI() {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = totalQty;
    
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Tu carrito está vacío</p>
                <small>¡Agrega productos y comienza a comprar!</small>
            </div>
        `;
        const totalEl = document.getElementById('cartTotal');
        if (totalEl) totalEl.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <img src="${item.img}" class="cart-item-image" alt="${item.name}">
                
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="qty-display">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div style="text-align: right;">
                    <div style="font-weight: 700; margin-bottom: 0.5rem;">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    const totalEl = document.getElementById('cartTotal');
    if(totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

function toggleCart(forceOpen = false) {
    const sidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.cart-overlay');
    
    if (forceOpen || !sidebar.classList.contains('show')) {
        sidebar.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    } else {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ==========================================
// CHECKOUT WHATSAPP (MODIFICADO: DIRECTO Y AUTOMATIZADO)
// ==========================================
function checkoutWhatsApp() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }

    // --- CORRECCIÓN: SIN PREGUNTAS, DIRECTO AL CHAT ---
    
    let total = 0;
    let message = "✨ *NUEVO PEDIDO - GRAVITY SHOP X* ✨\n";
    message += "─────────────────────\n";
    message += "🛒 *RESUMEN DE COMPRA:*\n\n";
    
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        // Agregamos tallas al mensaje si el producto tiene
        const sizeInfo = item.sizes ? ` (Tallas: ${item.sizes})` : '';
        
        message += `▪️ *${item.name}*${sizeInfo}\n`;
        message += `   ╰ ${item.qty} x $${item.price.toFixed(2)} = *$${itemTotal.toFixed(2)}*\n\n`;
    });
    
    message += "─────────────────────\n";
    message += `💰 *TOTAL A PAGAR: $${total.toFixed(2)}*\n`;
    message += "─────────────────────\n\n";
    
    message += "👋 ¡Hola! Ya tengo listo mi pedido en el carrito. Quedo atento/a para finalizar la compra. 🚀";
    
    // Usamos la constante PHONE_NUMBER definida arriba
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

// ==========================================
// VISTA RÁPIDA (QUICK VIEW) CON GALERÍA
// ==========================================

// Función auxiliar para cambiar imagen de galería
window.changeModalImage = function(src, element) {
    const mainImg = document.getElementById('quickViewMainImg');
    if(mainImg) {
        mainImg.style.opacity = '0.5';
        setTimeout(() => {
            mainImg.src = src;
            mainImg.style.opacity = '1';
        }, 150);
    }
    // Actualizar estilo activo
    document.querySelectorAll('.thumb-img').forEach(el => el.classList.remove('active'));
    if(element) element.classList.add('active');
}

function quickView(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    
    // LÓGICA DE GALERÍA DE IMÁGENES
    let imagesHtml = '';
    
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        // Modo Galería
        const thumbnails = product.images.map((img, index) => 
            `<img src="${img}" class="thumb-img ${index === 0 ? 'active' : ''}" onclick="changeModalImage('${img}', this)">`
        ).join('');

        imagesHtml = `
            <div class="gallery-container">
                <div class="main-image-container">
                    <img src="${product.images[0]}" id="quickViewMainImg" class="modal-main-img" alt="${product.name}">
                </div>
                <div class="thumbnails-row">
                    ${thumbnails}
                </div>
            </div>
        `;
    } else {
        // Modo Imagen Única (Usa product.img si no hay galería)
        const imageSrc = product.img || 'https://via.placeholder.com/300?text=Sin+Imagen';
        imagesHtml = `
            <div class="main-image-container">
                <img src="${imageSrc}" id="quickViewMainImg" class="modal-main-img" alt="${product.name}">
            </div>
        `;
    }

    // TALLAS EN EL MODAL (CON ESTADO AGOTADO)
    let sizeHtml = '';
    if (product.sizes) {
        const allSizes = product.sizes.split(',').map(s => s.trim());
        const soldSizes = product.sold_out ? product.sold_out.split(',').map(s => s.trim()) : [];
        const badges = allSizes.map(s => {
            if (soldSizes.includes(s)) return `<span style="text-decoration:line-through; color:#aaa; margin-right:8px;">${s}</span>`;
            else return `<span style="font-weight:bold; color:var(--text-color); margin-right:8px; border:1px solid #ddd; padding:2px 6px; border-radius:4px;">${s}</span>`;
        }).join('');
        sizeHtml = `<div style="margin:15px 0;"><strong>Tallas:</strong> ${badges}</div>`;
    }

    // CONTENIDO DEL MODAL
    const content = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; align-items: start;">
            
            <div>
                ${imagesHtml}
            </div>
            
            <div>
                <div class="product-category" style="margin-bottom: 0.5rem;">${getCategoryName(product.category)}</div>
                <h2 style="margin-bottom: 1rem;">${product.name}</h2>
                
                ${sizeHtml}

                <div class="product-rating" style="margin-bottom: 1rem;">
                    <span class="stars">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating || 5))}
                        ${(product.rating || 5) % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    </span>
                    <span>${product.rating || 5} (${product.reviews || 0} reseñas)</span>
                </div>
                
                <p style="color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.8;">${product.desc || ''}</p>
                
                <div style="margin-bottom: 2rem;">
                    ${product.oldPrice ? `
                        <div style="color: var(--text-muted); text-decoration: line-through; font-size: 1rem; margin-bottom: 0.5rem;">
                            $${product.oldPrice.toFixed(2)}
                        </div>
                    ` : ''}
                    <div style="font-size: 2rem; font-weight: 900; color: var(--primary);">
                        $${product.price.toFixed(2)}
                    </div>
                    ${discount > 0 ? `
                        <div style="display: inline-block; background: var(--danger); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; margin-top: 0.5rem;">
                            Ahorra ${discount}%
                        </div>
                    ` : ''}
                </div>
                
                <button onclick="addToCart(${product.id}); closeQuickView();" style="width: 100%; padding: 1rem; background: var(--primary); color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: var(--transition);">
                    <i class="fas fa-shopping-cart" style="margin-right: 0.5rem;"></i>
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('quickViewContent').innerHTML = content;
    document.getElementById('quickViewModal').classList.add('show');
    document.getElementById('quickViewOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) modal.classList.remove('show');

    const overlay = document.getElementById('quickViewOverlay');
    if (overlay) overlay.classList.remove('show');
    
    document.body.style.overflow = 'auto';
}

// ==========================================
// HERO SLIDER
// ==========================================
function initSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    const dots = document.querySelectorAll('.dot');
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        if(dots[index]) dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto slide
    slideInterval = setInterval(nextSlide, 5000);
    
    // Pausar en hover
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    
    slides[currentSlide].classList.add('active');
    const dots = document.querySelectorAll('.dot');
    if(dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    currentSlide = index;
    
    slides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    
    slides[currentSlide].classList.add('active');
    const dots = document.querySelectorAll('.dot');
    if(dots[currentSlide]) dots[currentSlide].classList.add('active');
}

// ==========================================
// TEMA OSCURO/CLARO
// ==========================================
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Buscamos el ícono de forma genérica
    const themeIcon = document.querySelector('.icon-btn i.fa-moon') || document.querySelector('.icon-btn i.fa-sun');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if(themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
}

// Nota: La función toggleTheme ya no se usa aquí porque el HTML la maneja directamente
// para evitar conflictos, pero la dejamos por si acaso algún otro script la llama.
function toggleTheme() {
    // Dejamos esta función vacía o redirigimos al HTML si fuera necesario.
}

// ==========================================
// NOTIFICACIONES
// ==========================================
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const msgElement = document.getElementById('notifMsg');
    
    if (!notification || !msgElement) return;

    msgElement.textContent = message;
    
    if (type === 'error') {
        notification.style.borderLeftColor = 'var(--danger)';
    } else {
        notification.style.borderLeftColor = 'var(--success)';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ==========================================
// EFECTOS DE SCROLL
// ==========================================
function initScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        // Mostrar botón de scroll to top
        if (scrollTopBtn) {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
        
        // Animación de productos al hacer scroll
        const products = document.querySelectorAll('.card-product');
        products.forEach(product => {
            const rect = product.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }
        });
    });
}

// ==========================================
// UTILIDADES
// ==========================================

// Cerrar modales con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeQuickView();
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar && cartSidebar.classList.contains('show')) {
            toggleCart();
        }
    }
});

// Prevenir scroll cuando hay modales abiertos
function preventScroll() {
    document.body.style.overflow = 'hidden';
}

function allowScroll() {
    document.body.style.overflow = 'auto';
}

// Formato de moneda
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

// Debounce para búsqueda
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
// Función para abrir/cerrar menú en celular
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}
// ==========================================
// FUNCIONES PARA CELULAR
// ==========================================

// 1. ABRIR/CERRAR MENÚ
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Cerrar menú al tocar un enlace
// Cerrar menú al tocar un enlace (CORREGIDO)
document.querySelectorAll('.nav-link, .dropdown-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        // TRUCO: Si el enlace que toqué está dentro del botón de "ROPA", NO cierres el menú
        if (link.closest('.link-split')) {
            return; // Se detiene aquí y no cierra nada
        }

        // Si es cualquier otro enlace (Inicio, Tecnología, etc.), sí cierra el menú
        const menu = document.getElementById('navMenu');
        if (menu) menu.classList.remove('active');
    });
});

// 2. ARREGLO DEL PRECIO AL INICIAR
// Asegura que el slider funcione con los valores del HTML (3 a 50)
document.addEventListener('DOMContentLoaded', () => {
    const range = document.getElementById('priceRange');
    if(range) {
        range.max = 50; 
        range.min = 3;
        range.value = 50; // Empezar en el máximo
        
        // Actualizar etiqueta
        const valLabel = document.getElementById('priceValue');
        if(valLabel) valLabel.textContent = '$50';
    }
});
// ==========================================
// FUNCIONES MÓVILES (Main.js)
// ==========================================

function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}

// CORRECCIÓN PARA QUE ROPA ABRA SIEMPRE
function toggleSubmenu(event) {
    if (event) {
        event.preventDefault(); // Evita que recargue la página
        event.stopPropagation(); // Evita que se cierre el menú principal
    }
    
    const submenu = document.getElementById('ropaSubmenu');
    const arrow = document.querySelector('.arrow-icon');
    
    if (submenu.classList.contains('show')) {
        submenu.classList.remove('show');
        if(arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
        submenu.classList.add('show');
        if(arrow) arrow.style.transform = 'rotate(180deg)';
    }
}
