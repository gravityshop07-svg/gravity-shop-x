// ==========================================
// GRAVITY SHOP - JavaScript (VERSIÓN CORREGIDA - TODOS LOS BUGS SOLUCIONADOS)
// ==========================================

// 1. CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = 'https://hotcjinskytleluersrc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdGNqaW5za3l0bGVsdWVyc3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzI2NzIsImV4cCI6MjA4NTgwODY3Mn0.7Z7bOOzj10kwPjwELzGtgHoXPN2BvrAqqp1Fsln-bQI';

// TU NÚMERO DE WHATSAPP
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
// FUNCIÓN AUXILIAR: GENERAR ESTRELLAS
// ==========================================
function generateStars(rating) {
    const fullStars = Math.floor(rating || 5);
    const hasHalfStar = (rating || 5) % 1 !== 0;
    
    let starsHtml = '<i class="fas fa-star"></i>'.repeat(fullStars);
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    return starsHtml;
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // ============================================
    // SOLUCIÓN DEFINITIVA PARA SUBMENÚ DE ROPA
    // ============================================
    const ropaButton = document.querySelector('.link-split');
    const ropaSubmenu = document.getElementById('ropaSubmenu');
    const arrow = document.querySelector('.arrow-icon');
    let submenuAbierto = false; // Flag de control
    
    if (ropaButton && ropaSubmenu) {
        console.log('✅ Elementos encontrados - Inicializando submenú');
        
        // Asegurar estado inicial SOLO EN MÓVIL
        if (window.innerWidth <= 992) {
            ropaSubmenu.style.display = 'none';
            ropaSubmenu.classList.remove('show');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
        
        // Evento principal - SOLO PARA MÓVIL
        ropaButton.addEventListener('click', function(e) {
            // IMPORTANTE: Solo funcionar en móvil
            if (window.innerWidth > 992) {
                console.log('⚠️ Modo PC - hover activo, evento ignorado');
                return; // En PC, dejar que el hover funcione
            }
            
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log('🖱️ CLIC en botón ROPA detectado (MÓVIL)');
            console.log('Estado actual:', submenuAbierto ? 'ABIERTO' : 'CERRADO');
            
            // TOGGLE con flag
            if (submenuAbierto) {
                // CERRAR
                ropaSubmenu.style.display = 'none';
                ropaSubmenu.classList.remove('show');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
                submenuAbierto = false;
                console.log('❌ Submenú CERRADO');
            } else {
                // ABRIR
                ropaSubmenu.style.display = 'block';
                ropaSubmenu.classList.add('show');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
                submenuAbierto = true;
                console.log('✅ Submenú ABIERTO');
            }
        }, true); // useCapture = true
        
        // Cerrar submenú cuando seleccionas una opción (SOLO MÓVIL)
        const subLinks = ropaSubmenu.querySelectorAll('a');
        subLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                console.log('📌 Clic en subcategoría');
                if (window.innerWidth <= 992) {
                    ropaSubmenu.style.display = 'none';
                    ropaSubmenu.classList.remove('show');
                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                    submenuAbierto = false;
                    
                    // Cerrar también el menú principal
                    const menu = document.getElementById('navMenu');
                    if (menu) menu.classList.remove('active');
                }
            });
        });
        
        // Limpiar estilos inline cuando cambias de móvil a PC
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                // Modo PC - quitar estilos inline para que funcione el hover
                ropaSubmenu.style.display = '';
                ropaSubmenu.classList.remove('show');
                if (arrow) arrow.style.transform = '';
                submenuAbierto = false;
                console.log('🖥️ Cambiado a modo PC - Hover activado');
            } else {
                // Modo móvil - resetear
                ropaSubmenu.style.display = 'none';
                submenuAbierto = false;
                console.log('📱 Cambiado a modo MÓVIL');
            }
        });
        
    } else {
        console.error('❌ ERROR: No se encontraron los elementos del submenú');
        console.log('ropaButton:', ropaButton);
        console.log('ropaSubmenu:', ropaSubmenu);
    }
});

async function initApp() {
    await fetchProductsFromDB();
    updateCartUI();
    initSlider();
    initScrollEffects();
    loadTheme();
    
    // Configuración de Precio Máximo $50
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    if (priceRange) {
        priceRange.max = 50;
        priceRange.value = 50; 
        if(priceValue) priceValue.textContent = '$50';
    }

    // Botón Flotante WhatsApp
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

// CONEXIÓN A BASE DE DATOS
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
        
        products = data || [];
        renderProducts();

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

    const priceRange = document.getElementById('priceRange');
    const maxPrice = priceRange ? parseInt(priceRange.value) : 50;
    
    const searchInput = document.getElementById('searchInput');
    const searchVal = searchInput ? searchInput.value.toLowerCase() : '';
    
    const sortSelect = document.getElementById('sortSelect');
    const sortType = sortSelect ? sortSelect.value : 'default';
    
    let filtered = products.filter(p => {
        const pCategory = p.category || ''; 
        const matchCategory = currentFilter === 'all' || pCategory === currentFilter;
        const safePrice = p.price || 0;
        const safeName = p.name || '';
        const safeDesc = p.desc || '';
        
        const matchPrice = safePrice <= maxPrice;
        const matchSearch = safeName.toLowerCase().includes(searchVal) || 
                            safeDesc.toLowerCase().includes(searchVal);
        return matchCategory && matchPrice && matchSearch;
    });
    
    switch(sortType) {
        case 'price-low': filtered.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
        case 'price-high': filtered.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
        case 'rating': filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }
    
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
    
    let sizesHtml = '';
    if (product.sizes) {
        const allSizes = product.sizes.split(',').map(s => s.trim());
        const soldSizes = product.sold_out ? product.sold_out.split(',').map(s => s.trim()) : [];
        
        const badges = allSizes.map(s => {
            if (soldSizes.includes(s)) {
                return `<span style="text-decoration:line-through; color:#aaa; margin-right:6px; font-size:0.85rem;">${s}</span>`;
            } else {
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
                        ${generateStars(product.rating)}
                    </span>
                    <span>${product.rating || 5}</span>
                </div>
                <div class="product-footer">
                    <div>
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="add-cart-btn" onclick="quickView(${product.id})">
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
        'tecnologia': 'Tecnología', 'accesorios': 'Accesorios',
        'camisa-hombre': 'Camisa de Hombre', 'buso-hombre': 'Buso de Hombre',
        'dividi-hombre': 'Dividi de Hombre', 'buso-mujer': 'Buso de Mujer'
    };
    return names[category] || category;
}

// ==========================================
// FILTROS Y CARRITO
// ==========================================
function filterByCategory(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target && event.target.closest('.filter-btn')) {
        event.target.closest('.filter-btn').classList.add('active');
    }
    renderProducts();
    const prodSection = document.getElementById('productViewSection');
    if(prodSection) prodSection.scrollIntoView({ behavior: 'smooth' });
}

function sortProducts() { renderProducts(); }

// ==========================================
// FUNCIÓN updateQty CORREGIDA
// ==========================================
function updateQty(id, change, size = '') {
    const item = cart.find(c => c.id === id && (size ? c.size === size : !c.size));
    if (!item) return;
    item.qty += change;
    if (item.qty <= 0) {
        removeFromCart(id, size);
    } else {
        updateCartUI();
    }
}

// ==========================================
// FUNCIÓN removeFromCart CORREGIDA
// ==========================================
function removeFromCart(id, size = '') {
    cart = cart.filter(item => !(item.id === id && (size ? item.size === size : !item.size)));
    updateCartUI();
    showNotification('Producto eliminado del carrito');
}

// ==========================================
// FUNCIÓN updateCartUI CORREGIDA CON TALLAS
// ==========================================
function updateCartUI() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = totalQty;
    
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-basket"></i><p>Tu carrito está vacío</p><small>¡Agrega productos y comienza a comprar!</small></div>`;
        const totalEl = document.getElementById('cartTotal');
        if (totalEl) totalEl.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        
        // MOSTRAR TALLA SI EXISTE
        const sizeInfo = item.size ? `<div style="font-size: 0.85rem; color: #6b7280; margin-top: 3px; font-weight: 600;">📏 Talla: ${item.size}</div>` : '';
        
        return `
            <div class="cart-item">
                <img src="${item.img}" 
                     class="cart-item-image" 
                     alt="${item.name}" 
                     onclick="quickView(${item.id}); event.stopPropagation();" 
                     style="cursor: pointer;" 
                     title="Clic para ver detalles">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    ${sizeInfo}
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQty(${item.id}, -1, '${item.size || ''}')"> <i class="fas fa-minus"></i> </button>
                        <span class="qty-display">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${item.id}, 1, '${item.size || ''}')"> <i class="fas fa-plus"></i> </button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; margin-bottom: 0.5rem;">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.size || ''}')"> <i class="fas fa-trash"></i> </button>
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
// FUNCIÓN checkoutWhatsApp CORREGIDA CON TALLAS
// ==========================================
function checkoutWhatsApp() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    let total = 0;
    let message = "✨ *NUEVO PEDIDO - GRAVITY SHOP X* ✨\n─────────────────────\n🛒 *RESUMEN DE COMPRA:*\n\n";
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        const sizeInfo = item.size ? ` - Talla: *${item.size}*` : '';
        message += `▪️ *${item.name}*${sizeInfo}\n   ╰ ${item.qty} x $${item.price.toFixed(2)} = *$${itemTotal.toFixed(2)}*\n\n`;
    });
    message += `─────────────────────\n💰 *TOTAL A PAGAR: $${total.toFixed(2)}*\n─────────────────────\n\n👋 ¡Hola! Ya tengo listo mi pedido.`;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// ==========================================
// VISTA RÁPIDA (MODAL) - CORREGIDA
// ==========================================
window.changeModalImage = function(src, element) {
    const mainImg = document.getElementById('quickViewMainImg');
    if(mainImg) {
        mainImg.style.opacity = '0.5';
        setTimeout(() => {
            mainImg.src = src;
            mainImg.style.opacity = '1';
        }, 150);
    }
    document.querySelectorAll('.thumb-img').forEach(el => el.classList.remove('active'));
    if(element) element.classList.add('active');
}

// ==========================================
// FUNCIÓN quickView CORREGIDA - IMAGEN PRINCIPAL EN GALERÍA
// ==========================================
function quickView(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    let imagesHtml = '';
    
    // CONSTRUIR GALERÍA COMPLETA (IMAGEN PRINCIPAL + IMÁGENES ADICIONALES)
    let allImages = [];
    
    // 1. Agregar la imagen principal primero
    if (product.img) {
        allImages.push(product.img);
    }
    
    // 2. Agregar imágenes de la galería
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        allImages = allImages.concat(product.images);
    }
    
    // 3. Generar HTML de la galería
    if (allImages.length > 0) {
        const thumbnails = allImages.map((img, index) => 
            `<img src="${img}" class="thumb-img ${index === 0 ? 'active' : ''}" onclick="changeModalImage('${img}', this)">`
        ).join('');
        imagesHtml = `<div class="gallery-container"><div class="main-image-container"><img src="${allImages[0]}" id="quickViewMainImg" class="modal-main-img" alt="${product.name}"></div><div class="thumbnails-row">${thumbnails}</div></div>`;
    } else {
        const imageSrc = 'https://via.placeholder.com/300?text=Sin+Imagen';
        imagesHtml = `<div class="gallery-container"><div class="main-image-container"><img src="${imageSrc}" id="quickViewMainImg" class="modal-main-img" alt="${product.name}"></div></div>`;
    }

    // SELECTOR DE TALLAS
    let sizeHtml = '';
    if (product.sizes) {
        const allSizes = product.sizes.split(',').map(s => s.trim());
        const soldSizes = product.sold_out ? product.sold_out.split(',').map(s => s.trim()) : [];
        
        const sizeButtons = allSizes.map(s => {
            if (soldSizes.includes(s)) {
                return `<button class="size-btn size-sold-out" disabled>${s}</button>`;
            } else {
                return `<button class="size-btn" onclick="selectSize(this, '${s}')">${s}</button>`;
            }
        }).join('');
        
        sizeHtml = `
            <div style="margin:15px 0; text-align: center;">
                <strong style="display: block; margin-bottom: 10px; font-size: 1rem;">Selecciona tu talla:</strong>
                <div class="size-selector" id="sizeSelector">
                    ${sizeButtons}
                </div>
                <input type="hidden" id="selectedSize" value="">
            </div>
        `;
    }

    const content = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; align-items: start;">
            ${imagesHtml}
            <div style="display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%;">
                <div class="product-category" style="margin-bottom: 0.5rem;">${getCategoryName(product.category)}</div>
                <h2 style="margin-bottom: 1rem;">${product.name}</h2>
                ${sizeHtml}
                <div class="product-rating" style="margin-bottom: 1rem; display: flex; gap: 0.5rem; align-items: center; justify-content: center;">
                    <span class="stars">
                        ${generateStars(product.rating)}
                    </span>
                    <span>${product.rating || 5} (${product.reviews || 0} reseñas)</span>
                </div>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.8; text-align: center;">${product.desc || ''}</p>
                <div style="margin-bottom: 2rem;">
                    <div style="font-size: 2rem; font-weight: 900; color: var(--primary);">$${product.price.toFixed(2)}</div>
                    ${product.oldPrice ? `<div style="font-size: 1.2rem; color: var(--text-muted); text-decoration: line-through; margin-top: 0.5rem;">$${product.oldPrice.toFixed(2)}</div>` : ''}
                </div>
                <button onclick="addToCartWithSize(${product.id}); closeQuickView();" style="width: 100%; max-width: 100%; padding: 1rem; background: var(--primary); color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; display: block; margin: 0 auto;">
                    <i class="fas fa-shopping-cart" style="margin-right: 0.5rem;"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('quickViewContent').innerHTML = content;
    document.getElementById('quickViewModal').classList.add('show');
    document.getElementById('quickViewOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

// NUEVA FUNCIÓN: Seleccionar talla
function selectSize(button, size) {
    // Quitar selección de todos los botones
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Marcar el botón seleccionado
    button.classList.add('selected');
    
    // Guardar la talla seleccionada
    document.getElementById('selectedSize').value = size;
}

// ==========================================
// FUNCIÓN addToCartWithSize CORREGIDA
// ==========================================
function addToCartWithSize(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    // Verificar si tiene tallas
    if (product.sizes) {
        const selectedSize = document.getElementById('selectedSize').value;
        
        if (!selectedSize) {
            showNotification('⚠️ Por favor selecciona una talla', 'error');
            return;
        }
        
        // Buscar si ya existe en el carrito con la misma talla
        const existingItem = cart.find(item => item.id === id && item.size === selectedSize);
        
        if (existingItem) {
            existingItem.qty++;
        } else {
            cart.push({ 
                ...product, 
                qty: 1,
                size: selectedSize // GUARDAR LA TALLA
            });
        }
    } else {
        // Si no tiene tallas, agregar normal
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.qty++;
        } else {
            cart.push({ ...product, qty: 1 });
        }
    }
    
    updateCartUI();
    showNotification(`✅ ${product.name} agregado al carrito!`);
    toggleCart(true);
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) modal.classList.remove('show');
    const overlay = document.getElementById('quickViewOverlay');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ==========================================
// UTILIDADES (Slider, Scroll, Tema)
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
    
    slideInterval = setInterval(nextSlide, 5000);
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', () => { slideInterval = setInterval(nextSlide, 5000); });
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

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.icon-btn i.fa-moon') || document.querySelector('.icon-btn i.fa-sun');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if(themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
    }
}

function toggleTheme() { }

// ==========================================
// FUNCIÓN showNotification CORREGIDA - SE OCULTA AUTOMÁTICAMENTE
// ==========================================
let notificationTimeout; // Variable global para el timeout

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const msgElement = document.getElementById('notifMsg');
    if (!notification || !msgElement) return;
    
    // Limpiar timeout anterior si existe
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    
    // Forzar reset de la notificación
    notification.classList.remove('show');
    notification.style.opacity = '0';
    notification.style.visibility = 'hidden';
    
    // Pequeño delay para permitir que la animación se resetee
    setTimeout(() => {
        msgElement.textContent = message;
        notification.style.borderLeftColor = type === 'error' ? 'var(--danger)' : 'var(--success)';
        notification.style.opacity = '1';
        notification.style.visibility = 'visible';
        notification.classList.add('show');
        
        // OCULTAR AUTOMÁTICAMENTE DESPUÉS DE 3 SEGUNDOS
        notificationTimeout = setTimeout(() => { 
            notification.classList.remove('show');
            notification.style.opacity = '0';
            notification.style.visibility = 'hidden';
        }, 3000);
    }, 50);
}

function initScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 300) scrollTopBtn.classList.add('show');
            else scrollTopBtn.classList.remove('show');
        }
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

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeQuickView();
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar && cartSidebar.classList.contains('show')) toggleCart();
    }
});

function preventScroll() { document.body.style.overflow = 'hidden'; }
function allowScroll() { document.body.style.overflow = 'auto'; }
function formatCurrency(amount) { return '$' + amount.toFixed(2); }
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout); timeout = setTimeout(later, wait);
    };
}

// ==========================================
// FUNCIONES MÓVILES (Menú Hamburguesa) - CORREGIDO
// ==========================================

// 1. Abrir/Cerrar Menú Principal
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    if (menu) menu.classList.toggle('active');
}

// 2. Control Inteligente de Clics en el Menú (Cierra el menú SOLO en enlaces normales)
document.querySelectorAll('.nav-link:not(.link-split *)').forEach(link => {
    link.addEventListener('click', (e) => {
        // Solo cerrar si NO es parte del dropdown de ropa
        if (!e.target.closest('.dropdown-wrapper')) {
            const menu = document.getElementById('navMenu');
            if (menu && window.innerWidth <= 992) {
                menu.classList.remove('active');
            }
        }
    });
});
