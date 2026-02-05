/* ==========================================
   GRAVITY SHOP - PRODUCTOS
   Edita este archivo para agregar o modificar productos
   ========================================== */

const products = [
    // ==========================================
    // TECNOLOGÍA (Sin cambios)
    // ==========================================
    {
        id: 1,
        name: "Camiseta Urbana Gravity",
        category: "camisa-hombre",
        price: 25.00,
        rating: 5,
        img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", // Foto portada
        
        // AGREGA ESTO AQUÍ (Las fotos extra)
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", // La misma portada
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop"  // Detalle
        ]
    },
    {
        id: 2,
        name: "Smartwatch Fitness+",
        category: "tecnologia",
        price: 199.00,
        oldPrice: null,
        rating: 4.6,
        reviews: 89,
        isNew: false,
        img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
        desc: "Ideal para deportistas. Monitoreo de actividad física, pulsómetro y notificaciones smart."
    },
    {
        id: 3,
        name: "Smartwatch Ultra GPS",
        category: "tecnologia",
        price: 349.00,
        oldPrice: 449.00,
        rating: 4.9,
        reviews: 203,
        isNew: true,
        img: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&h=600&fit=crop",
        desc: "Tecnología de punta con GPS de alta precisión, pantalla AMOLED y batería de 7 días."
    },
    {
        id: 4,
        name: "Smartwatch Classic",
        category: "tecnologia",
        price: 149.00,
        oldPrice: null,
        rating: 4.4,
        reviews: 67,
        isNew: false,
        img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop",
        desc: "Diseño elegante y funcional. Perfecto para el día a día con todas las funciones esenciales."
    },
    {
        id: 5,
        name: "Auriculares Bluetooth Pro",
        category: "tecnologia",
        price: 159.00,
        oldPrice: 199.00,
        rating: 4.7,
        reviews: 142,
        isNew: false,
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        desc: "Cancelación de ruido activa, sonido Hi-Fi y hasta 30 horas de batería."
    },
    {
        id: 6,
        name: "Auriculares Gaming RGB",
        category: "tecnologia",
        price: 129.00,
        oldPrice: null,
        rating: 4.5,
        reviews: 98,
        isNew: true,
        img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
        desc: "Audio envolvente 7.1, micrófono con cancelación de ruido e iluminación RGB personalizable."
    },
    {
        id: 7,
        name: "Power Bank 20000mAh",
        category: "tecnologia",
        price: 45.00,
        oldPrice: 65.00,
        rating: 4.6,
        reviews: 234,
        isNew: false,
        img: "https://images.unsplash.com/photo-1609592043299-1cf8e7503762?w=600&h=600&fit=crop",
        desc: "Carga rápida USB-C, múltiples dispositivos simultáneos y diseño compacto."
    },
    {
        id: 8,
        name: "Cámara Web 4K Ultra HD",
        category: "tecnologia",
        price: 89.00,
        oldPrice: null,
        rating: 4.8,
        reviews: 76,
        isNew: true,
        img: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600&h=600&fit=crop",
        desc: "Resolución 4K, autofocus inteligente, ideal para videollamadas y streaming profesional."
    },

    // ==========================================
    // ACCESORIOS (Sin cambios)
    // ==========================================
    {
        id: 9,
        name: "Gafas de Sol Aviator Premium",
        category: "accesorios",
        price: 89.00,
        oldPrice: 129.00,
        rating: 4.9,
        reviews: 187,
        isNew: false,
        img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
        desc: "Protección UV400, lentes polarizadas y montura de metal de alta calidad."
    },
    {
        id: 10,
        name: "Gafas de Sol Wayfarer",
        category: "accesorios",
        price: 75.00,
        oldPrice: null,
        rating: 4.7,
        reviews: 145,
        isNew: false,
        img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop",
        desc: "Diseño clásico atemporal, protección total UV y lentes antirreflejos."
    },
    {
        id: 11,
        name: "Gafas Deportivas Pro",
        category: "accesorios",
        price: 95.00,
        oldPrice: 135.00,
        rating: 4.8,
        reviews: 112,
        isNew: true,
        img: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=600&fit=crop",
        desc: "Diseño ergonómico, ultra ligeras y resistentes a impactos. Perfectas para deportes."
    },
    {
        id: 12,
        name: "Mochila Urbana Impermeable",
        category: "accesorios",
        price: 69.00,
        oldPrice: null,
        rating: 4.6,
        reviews: 201,
        isNew: false,
        img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
        desc: "Compartimento para laptop, puerto USB, material resistente al agua y diseño moderno."
    },
    {
        id: 13,
        name: "Billetera de Cuero Premium",
        category: "accesorios",
        price: 49.00,
        oldPrice: 75.00,
        rating: 4.7,
        reviews: 165,
        isNew: false,
        img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop",
        desc: "Cuero genuino, diseño minimalista con protección RFID y múltiples compartimentos."
    },
    {
        id: 14,
        name: "Reloj Análogo Clásico",
        category: "accesorios",
        price: 125.00,
        oldPrice: 179.00,
        rating: 4.9,
        reviews: 93,
        isNew: true,
        img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
        desc: "Movimiento de cuarzo japonés, cristal de zafiro y correa de cuero italiano."
    },
    {
        id: 15,
        name: "Gorra Snapback Urban",
        category: "accesorios",
        price: 29.00,
        oldPrice: null,
        rating: 4.5,
        reviews: 178,
        isNew: false,
        img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop",
        desc: "Algodón premium, ajuste cómodo y diseño urbano moderno. Varios colores disponibles."
    },
    {
        id: 16,
        name: "Cinturón de Cuero Reversible",
        category: "accesorios",
        price: 39.00,
        oldPrice: 59.00,
        rating: 4.6,
        reviews: 134,
        isNew: false,
        img: "https://images.unsplash.com/photo-1624222247344-550fb60583aa?w=600&h=600&fit=crop",
        desc: "Dos colores en uno, hebilla elegante y cuero de alta calidad. Versátil y duradero."
    },
    {
        id: 17,
        name: "Pulsera Inteligente Fitness",
        category: "accesorios",
        price: 55.00,
        oldPrice: null,
        rating: 4.4,
        reviews: 89,
        isNew: true,
        img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=600&fit=crop",
        desc: "Monitor de actividad, contador de pasos, seguimiento del sueño y notificaciones."
    },
    {
        id: 18,
        name: "Bufanda de Lana Merino",
        category: "accesorios",
        price: 45.00,
        oldPrice: 65.00,
        rating: 4.8,
        reviews: 72,
        isNew: false,
        img: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=600&fit=crop",
        desc: "Lana merino 100% natural, suave al tacto, cálida y elegante. Perfecta para invierno."
    },

    // ==========================================
    // ROPA (ACTUALIZADO PARA EL NUEVO MENÚ)
    // ==========================================
    
    // CAMISAS DE HOMBRE
    {
        id: 19,
        name: "Camisa Casual Oxford",
        category: "camisa-hombre", // CATEGORIA NUEVA
        price: 35.00,
        oldPrice: 49.00,
        rating: 4.5,
        reviews: 198,
        isNew: false,
        img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        desc: "Tela Oxford transpirable, corte regular fit ideal para oficina o salidas."
    },
    {
        id: 20,
        name: "Camisa Hawaiana Playera",
        category: "camisa-hombre", // CATEGORIA NUEVA
        price: 29.00,
        oldPrice: null,
        rating: 4.7,
        reviews: 221,
        isNew: true,
        img: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&h=600&fit=crop",
        desc: "Estampado moderno para el verano, tela ligera de secado rápido."
    },

    // BUSOS DE HOMBRE
    {
        id: 21,
        name: "Buso Hoodie Urbano",
        category: "buso-hombre", // CATEGORIA NUEVA
        price: 59.00,
        oldPrice: 85.00,
        rating: 4.8,
        reviews: 267,
        isNew: true,
        img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=600&fit=crop",
        desc: "Algodón perchado, con capucha ajustable y bolsillo canguro. Muy cómodo."
    },
    {
        id: 22,
        name: "Sweater Cuello Redondo",
        category: "buso-hombre", // CATEGORIA NUEVA
        price: 45.00,
        oldPrice: null,
        rating: 4.6,
        reviews: 143,
        isNew: false,
        img: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&h=600&fit=crop",
        desc: "Estilo minimalista, tejido suave. Perfecto para climas fríos."
    },

    // DIVIDIS DE HOMBRE (Tank Tops)
    {
        id: 23,
        name: "Dividi Gym Performance",
        category: "dividi-hombre", // CATEGORIA NUEVA
        price: 25.00,
        oldPrice: 35.00,
        rating: 4.7,
        reviews: 95,
        isNew: false,
        img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop",
        desc: "Corte olímpico para máxima movilidad en el gimnasio. Tela transpirable."
    },
    {
        id: 24,
        name: "Musculosa Casual Playa",
        category: "dividi-hombre", // CATEGORIA NUEVA
        price: 20.00,
        oldPrice: null,
        rating: 4.4,
        reviews: 62,
        isNew: true,
        img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop",
        desc: "Fresca y ligera, perfecta para días de sol y playa."
    },
        {
        id: 2324,
        name: "Sudadera Compresión",
        category: "buso-hombre",
        price: 12,
        oldPrice: 15,
        
        rating: 5,
        reviews: 324,
        img: "img/buzo1.jpg",
        desc: "Sudadera deportiva compresión, Manga larga,  agarre antideslizante y ajuste ceñido. Ideal para correr, levantar pesas, senderismo. Ropa deportiva fácil de cuidar, con tejido de alta elasticidad y material que absorbe la humedad.",
        images: [
            "img/buzo1.1.jpg","img/buzo1.jpg"
        ]
    },

    // BUSOS DE MUJER
    {
        id: 25,
        name: "Buso Crop Top Rosa",
        category: "buso-mujer", // CATEGORIA NUEVA
        price: 49.00,
        oldPrice: 69.00,
        rating: 4.8,
        reviews: 187,
        isNew: true,
        img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop",
        desc: "Diseño crop en tendencia, tejido suave y color vibrante."
    },
    {
        id: 26,
        name: "Hoodie Oversized Beige",
        category: "buso-mujer", // CATEGORIA NUEVA
        price: 55.00,
        oldPrice: 75.00,
        rating: 4.9,
        reviews: 210,
        isNew: false,
        img: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=600&h=600&fit=crop",
        desc: "El favorito de la temporada. Ajuste holgado para un look relajado."
    }
];

// Función auxiliar para buscar productos por ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Función para obtener productos por categoría
function getProductsByCategory(category) {
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
}

// Función para obtener productos en oferta
function getProductsOnSale() {
    return products.filter(p => p.oldPrice !== null);
}

// Función para obtener productos nuevos
function getNewProducts() {
    return products.filter(p => p.isNew === true);
}

// Exportar para uso en otros archivos (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, getProductById, getProductsByCategory, getProductsOnSale, getNewProducts };
}