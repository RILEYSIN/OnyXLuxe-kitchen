document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    const navMenu = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navClose = document.querySelector('.nav-close');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    }

    // Close nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // --- Shopping Cart ---
    const cartIconWrapper = document.querySelector('.cart-icon-wrapper');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartClose = document.querySelector('.cart-close');
    const cartContent = document.querySelector('.cart-content');
    const totalPriceEl = document.querySelector('.total-price');
    const cartItemCountEl = document.querySelector('.cart-item-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const checkoutBtn = document.querySelector('.btn-checkout');
    const cancelBtn = document.querySelector('.btn-cancel');

    // Load cart from localStorage or initialize as empty
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // --- Cart Functions ---

    const openCart = () => cartSidebar.classList.add('active');
    const closeCart = () => cartSidebar.classList.remove('active');

    const saveCart = () => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    };

    const updateCartCounter = () => {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCountEl.textContent = totalItems;
        if (totalItems > 0) {
            cartItemCountEl.classList.add('visible');
        } else {
            cartItemCountEl.classList.remove('visible');
        }
    };

    const updateTotal = () => {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalPriceEl.textContent = `$${total.toFixed(2)}`;
        updateCartCounter();
    };

    const renderCartItems = () => {
        cartContent.innerHTML = ''; // Clear current items
        if (cartItems.length === 0) {
            cartContent.innerHTML = '<p style="text-align: center;">Your cart is empty.</p>';
            updateTotal();
            return;
        }

        cartItems.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            // Use a unique ID for each item to handle removal correctly
            cartItemEl.dataset.name = item.name; 
            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <i class='bx bx-minus quantity-btn decrease-quantity'></i>
                    <span class="quantity-text">${item.quantity}</span>
                    <i class='bx bx-plus quantity-btn increase-quantity'></i>
                </div>
                <i class='bx bx-trash cart-item-remove'></i>
            `;
            cartContent.appendChild(cartItemEl);
        });
        updateTotal();
    };

    const handleAddToCart = (e) => {
        const button = e.currentTarget;
        const foodItem = button.closest('.food-item');
        
        const name = foodItem.querySelector('h3').textContent;
        const price = parseFloat(foodItem.dataset.price);
        const image = foodItem.querySelector('img').src;

        const existingItem = cartItems.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ name, price, image, quantity: 1 });
        }

        saveCart();
        renderCartItems();
        openCart();
    };
    
    const handleCartActions = (e) => {
        const itemEl = e.target.closest('.cart-item');
        if (!itemEl) return;

        const name = itemEl.dataset.name;
        const item = cartItems.find(i => i.name === name);

        if (e.target.classList.contains('increase-quantity')) {
            if (item) item.quantity++;
        } else if (e.target.classList.contains('decrease-quantity')) {
            if (item) {
                item.quantity--;
                if (item.quantity === 0) {
                    cartItems = cartItems.filter(i => i.name !== name);
                }
            }
        } else if (e.target.classList.contains('cart-item-remove')) {
            cartItems = cartItems.filter(i => i.name !== name);
        }

        saveCart();
        renderCartItems();
    };

    // Initial render on page load
    renderCartItems();

    // --- Event Listeners ---
    if (cartIconWrapper) {
        cartIconWrapper.addEventListener('click', (e) => {
            if (!e.target.classList.contains('cart-item-count')) openCart();
        });
    }
    cartClose.addEventListener('click', closeCart);
    cancelBtn.addEventListener('click', closeCart);
    addToCartButtons.forEach(button => button.addEventListener('click', handleAddToCart));
    cartContent.addEventListener('click', handleCartActions);

    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length > 0) {
            // In a real app, this would redirect to a checkout page or open a payment modal.
            alert(`Thank you for your order! Your total is ${totalPriceEl.textContent}.`);
            
            cartItems = []; // Clear the cart
            saveCart();
            renderCartItems();
            closeCart();
        } else {
            alert('Your cart is empty!');
        }
    });

});