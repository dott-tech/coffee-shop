const CART_STORAGE_KEY = 'coffee_shop_cart';
let cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
const listContainer = document.querySelector('.cart-items-list');


let isFirstLoad = true;

function renderCart() {
    if (!listContainer) return;

    if (cartItems.length === 0) {
        listContainer.innerHTML = `<div class="empty-cart-message">Your cart is currently empty. Head back to the menu to add delicious crafts!</div>`;
        updateTotalsDisplay(0);
        return;
    }

    listContainer.innerHTML = cartItems.map((item, index) => {
        const totalItemPrice = item.price * (item.quantity || 1);
        const rowIndex = index % 10; 
        
       
        const animationClasses = isFirstLoad ? 'scroll-animate slide-down' : 'visible';
        
        return `
            <div class="cart-item ${animationClasses}" data-index="${index}" style="--card-index: ${rowIndex};">
                <img src="images/${item.name}.jpg" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">$${totalItemPrice.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn minus" data-index="${index}">-</button>
                    <span class="qty-val">${item.quantity || 1}</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                </div>
                <button class="remove-btn" data-index="${index}">×</button>
            </div>
        `;
    }).join('');

    calculateCartTotals();

    
    if (isFirstLoad) {
        setTimeout(() => {
            document.querySelectorAll('.cart-item.scroll-animate').forEach(card => {
                card.classList.add('visible');
            });
           
            isFirstLoad = false; 
        }, 50);
    }
}

function calculateCartTotals() {
    let subtotal = 0;
    
   
    cartItems.forEach(item => {
        subtotal += item.price * (item.quantity || 1);
    });

    updateTotalsDisplay(subtotal);
}

function updateTotalsDisplay(subtotal) {
    const taxRate = 0.08; // 8% Tax rate
    const calculatedTax = subtotal * taxRate;
    const finalTotal = subtotal + calculatedTax;

   
    document.getElementById('subtotal-val').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax-val').innerText = `$${calculatedTax.toFixed(2)}`;
    document.getElementById('total-val').innerText = `$${finalTotal.toFixed(2)}`;
}

if (listContainer) {
    listContainer.addEventListener('click', (e) => {
       
        const index = parseInt(e.target.dataset.index);
        if (isNaN(index)) return; 

        
        if (e.target.classList.contains('plus')) {
            cartItems[index].quantity = (cartItems[index].quantity || 1) + 1;
        } 
       
        else if (e.target.classList.contains('minus')) {
            if ((cartItems[index].quantity || 1) > 1) {
                cartItems[index].quantity -= 1;
            } else {
               
                cartItems.splice(index, 1);
            }
        } 
       
        else if (e.target.classList.contains('remove-btn')) {
            cartItems.splice(index, 1);
        }

        
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        
       
        renderCart();
    });
}

const placeOrderBtn = document.getElementById('placeOrderBtn');

if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty! Add items from the menu first.');
            return;
        }
        
        alert('Thank you for your order! Your craft espresso is brewing. ☕');
        
       
        cartItems = [];
        
       
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        
       
        renderCart();
    });
}

renderCart();
