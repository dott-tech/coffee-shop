import { products, specials } from './specials.js';


const introScreen = document.getElementById('intro');
const navbar = document.querySelector('.navbar');

const heroText = document.querySelector('.hero-text');
const heroBtn = document.querySelector('.hero-text button');


if (sessionStorage.getItem('shop_unlocked') === 'true') {
   
    if (introScreen) introScreen.style.display = 'none';
    
   
    if (navbar) navbar.classList.add('navbar-animate');
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    
    if (heroText) heroText.classList.add('text-animate');
    if (heroBtn) heroBtn.classList.add('button-animate');
} else {
    
    const orderBtn = document.getElementById('orderBtn');
    if (orderBtn && introScreen) {
        orderBtn.addEventListener('click', function () {
            introScreen.classList.add('fade-out');

            introScreen.addEventListener('animationend', () => {
                introScreen.style.display = 'none';
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';

                if (navbar) navbar.classList.add('navbar-animate');

              
                if (heroText) heroText.classList.add('text-animate');
                if (heroBtn) heroBtn.classList.add('button-animate');
                
               
                sessionStorage.setItem('shop_unlocked', 'true');
            }, { once: true });
        });
    }
}





const specialsContainer = document.querySelector('.specials-container');
const gridContainer = document.querySelector('.products-grid');


if (specialsContainer && specials) {
    specialsContainer.innerHTML = specials.map((item, index) => {
        const rowIndex = index % 5; 
        return `
            <div class="special-card scroll-animate slide-left" data-id="${item.id}" style="--card-index: ${rowIndex};">
                <div class="special-badge">Special</div>
                <img src="/images/${item.name}.jpg" alt="${item.name}" class="special-img">
                <h3 class="special-title">${item.name}</h3>
                <div class="special-price">$${item.price.toFixed(2)}</div>
                <p class="special-desc">${item.description}</p>
                <button class="product-btn" data-id="${item.id}">Add to Order</button>
            </div>
        `;
    }).join('');
}


if (gridContainer && products) {
    gridContainer.innerHTML = products.map((product, index) => {
        const rowIndex = index % 4; 
        return `
            <div class="product-card scroll-animate slide-left" data-id="${product.id}" style="--card-index: ${rowIndex};">
                <img src="/images/${product.name}.jpg" alt="${product.name}" class="product-img">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-desc">${product.description}</p>
                <button class="product-btn" data-id="${product.id}">Add to Order</button>
            </div>
        `;
    }).join('');
}


const cards = document.querySelectorAll('.scroll-animate');

if (cards.length > 0) {
    const observerOptions = {
        root: null, 
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px" 
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    cards.forEach(card => scrollObserver.observe(card));
}


document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('product-btn')) {
        
        
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('bump');
            setTimeout(() => { cartIcon.classList.remove('bump'); }, 400);
        }
        
        const productId = e.target.dataset.id;
        if (!productId) return;
        
        const itemData = [...products, ...specials].find(p => p.id == productId);
        
        if (itemData) {
            let localCart = JSON.parse(localStorage.getItem('coffee_shop_cart')) || [];
            const existingItem = localCart.find(item => item.id == productId);
            
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                localCart.push({ ...itemData, quantity: 1 });
            }
            
            localStorage.setItem('coffee_shop_cart', JSON.stringify(localCart));
            console.log(`Successfully synced ${itemData.name} to localStorage.`);
        }
    }
});
