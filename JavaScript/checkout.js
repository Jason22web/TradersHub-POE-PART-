// The payment feature...

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('checkout-modal');
    const closeBtn = document.getElementById('close-modal');
    const openCartBtn = document.getElementById('cart-btn');
    const cartCountSpan = document.getElementById('cart-count');

    // Modal Steps
    const step1 = document.getElementById('modal-step-1');
    const step2 = document.getElementById('modal-step-2');
    const step3 = document.getElementById('modal-step-3');

    // Step navigation buttons
    const toPaymentBtn = document.getElementById('to-payment-btn');
    const payNowBtn = document.getElementById('pay-now-btn');
    const finishBtn = document.getElementById('finish-btn');

    // Cart summary elements
    const summaryList = document.getElementById('summary-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const discountRow = document.getElementById('discount-row');
    const discountPercentSpan = document.getElementById('discount-percent');
    const summaryDiscount = document.getElementById('summary-discount');
    const summaryTotal = document.getElementById('summary-total');

    // Local storage helper (Fixed quotes)
    const getCart = () => JSON.parse(localStorage.getItem('tradersHubCart')) || {};

    const saveCart = (cart) => {
        localStorage.setItem('tradersHubCart', JSON.stringify(cart));
        updateCartBadge();
    };

    // Updates the cart icon with the amount of items in the cart
    const updateCartBadge = () => {
        const cart = getCart();
        const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
        if (cartCountSpan) {
            cartCountSpan.textContent = totalItems;
        }
    };

    // Add items to the cart
    const addToCartButtons = document.querySelectorAll('.button-shop-collectibles');

    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            const article = e.target.closest('article');
            if (!article) return;

            // Prefer data-attributes from HTML button if present
            const title = button.getAttribute('data-name') || article.querySelector('h3')?.textContent.trim() || `Item #${index + 1}`;
            const rawPrice = button.getAttribute('data-price') || article.querySelector('strong')?.textContent || article.querySelector('p:last-of-type')?.textContent || '0';
            const numericPrice = parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0;
            const itemId = title.toLowerCase().replace(/\s+/g, '-');

            const cart = getCart();

            // Fixed typo: qty instead of gty
            if (cart[itemId]) {
                cart[itemId].qty += 1;
            } else {
                cart[itemId] = {
                    name: title,
                    price: numericPrice,
                    qty: 1
                };
            }

            saveCart(cart);

            const originalText = button.textContent;
            button.textContent = 'Added! ✓';
            button.style.backgroundColor = 'var(--action-accent)';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 1000);
        });
    });

    // Render the cart
    const renderCartModal = () => {
        const currentCart = getCart();
        const cartItems = Object.entries(currentCart);

        if (cartItems.length === 0) {
            alert('Your cart is empty! Add items before proceeding to checkout.');
            return false;
        }

        if (summaryList) summaryList.innerHTML = '';
        let subtotal = 0;
        let totalCount = 0;

        cartItems.forEach(([id, item]) => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;
            totalCount += item.qty;

            if (summaryList) {
                const listItem = document.createElement('li');
                listItem.className = 'cart-item-row';
                listItem.innerHTML = `
                    <span><strong>${item.name}</strong> (x${item.qty})</span> 
                    <span>R${itemTotal.toFixed(2)}</span>
                `;
                summaryList.appendChild(listItem);
            }
        });

        // Discount logic based on item quantity
        let discountPercent = 0;
        if (totalCount >= 5 && totalCount < 7) {
            discountPercent = 0.05; // 5% off for 2 items
        } else if (totalCount >= 7 && totalCount < 10) {
            discountPercent = 0.10; // 10% off for 3 items
        } else if (totalCount >= 10) {
            discountPercent = 0.15; // 15% off for 4+ items
        }

        const discountAmount = subtotal * discountPercent;
        const finalTotal = subtotal - discountAmount;

        if (summarySubtotal) summarySubtotal.textContent = `R${subtotal.toFixed(2)}`;

        if (discountPercent > 0) {
            if (discountPercentSpan) discountPercentSpan.textContent = `${Math.round(discountPercent * 100)}%`;
            if (summaryDiscount) summaryDiscount.textContent = `-R${discountAmount.toFixed(2)}`;
            if (discountRow) discountRow.classList.remove('hidden');
        } else {
            if (discountRow) discountRow.classList.add('hidden');
        }

        if (summaryTotal) summaryTotal.textContent = `R${finalTotal.toFixed(2)}`;

        // Open Modal at Step 1
        if (step1) step1.classList.remove('hidden');
        if (step2) step2.classList.add('hidden');
        if (step3) step3.classList.add('hidden');
        if (modal) modal.classList.remove('hidden');

        return true;
    };

    // Open cart when clicking header button
    if (openCartBtn) {
        openCartBtn.addEventListener('click', () => {
            renderCartModal();
        });
    }

    // Step 1 -> Step 2 - Proceed to payment form
    if (toPaymentBtn) {
        toPaymentBtn.addEventListener('click', () => {
            if (step1) step1.classList.add('hidden');
            if (step2) step2.classList.remove('hidden');
        });
    }

    // Step 2 -> Step 3 - Payment validation and order completion
    if (payNowBtn) {
        payNowBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const cardName = document.getElementById('card-name')?.value.trim();
            const cardNum = document.getElementById('card-num')?.value.trim();
            const cardExp = document.getElementById('card-exp')?.value.trim();
            const cardCvv = document.getElementById('card-cvv')?.value.trim();

            // Checks if required inputs are empty
            if (!cardName || !cardNum || !cardExp || !cardCvv) {
                alert('Please enter your Cardholder Name, Card Number, Expiry Date, and CVV to complete payment.');
                return;
            }

            // Transition to step 3 (Success Screen)
            if (step2) step2.classList.add('hidden');
            if (step3) step3.classList.remove('hidden');

            // Wipe cart after successful payment
            localStorage.removeItem('tradersHubCart');
            updateCartBadge();
        });
    }

    // Close modal popup functions
    const closeModal = () => {
        if (modal) modal.classList.add('hidden');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (finishBtn) finishBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    updateCartBadge();
});