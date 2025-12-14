document.addEventListener('DOMContentLoaded', () => {
  // ===== MOBILE MENU =====
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    });
  });

  // ===== CART SYSTEM =====
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const overlay = document.getElementById('overlay');
  const closeCartBtn = document.getElementById('close-cart');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCountSpan = document.querySelector('.cart-count');
  const cartTotalPrice = document.querySelector('.cart-total-price');

  let cart = [];

  function formatPrice(price) {
    return `₹${price.toFixed(2)}`;
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cartCountSpan) cartCountSpan.textContent = totalCount;
    if (cartTotalPrice) cartTotalPrice.textContent = `Total: ${formatPrice(totalPrice)}`;
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = '';

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        return;
      }

      cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
          <div class="cart-item-info">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-quantity">Qty: ${item.quantity}</span>
            <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
          </div>
          <button class="remove-item-btn" data-index="${index}">✕</button>
        `;
        cartItemsContainer.appendChild(itemDiv);
      });

      document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', e => {
          const idx = parseInt(e.target.dataset.index);
          if (!isNaN(idx)) removeFromCart(idx);
        });
      });
    }
  }

  function addToCart(productName, productPrice) {
    const existingIndex = cart.findIndex(item => item.name === productName);
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    updateCartUI();
  }

  function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      updateCartUI();
    }
  }

  function openCart() {
    if (cartModal) cartModal.classList.add('active');
    if (overlay) overlay.classList.add('active');
  }

  function closeCart() {
    if (cartModal) cartModal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }

  if (cartBtn) cartBtn.addEventListener('click', e => { e.preventDefault(); openCart(); });
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;
      const productPrice = parseFloat(button.dataset.price);
      addToCart(productName, productPrice);
    });
  });

  // ===== NEWSLETTER =====
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim() !== '') {
        const email = emailInput.value.trim();
        alert(`Thank you for subscribing  ${email}!`);
        emailInput.value = '';
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }

  // ===== REGISTER PAGE SCRIPT =====
  const registerForm = document.getElementById("my_form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("regEmail").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        password: document.getElementById("regPassword").value
      };

      try {
        const res = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message);

        if (res.ok) {
          registerForm.reset();
          // Redirect to homepage after 1 second
          setTimeout(() => {
            window.location.href = "index.html"; // homepage file
          }, 1000);
        }
      } catch (err) {
        alert("Server error. Try again later.");
        console.error(err);
      }
    });
  }

  // ===== LOGIN PAGE SCRIPT =====
  const loginForm = document.getElementById('loginForm');
  const loginMsg = document.getElementById('loginMsg');

  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!email || !password) {
        loginMsg.textContent = "Please fill in all fields.";
        loginMsg.style.color = "red";
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
          loginMsg.textContent = data.message;
          loginMsg.style.color = "green";
          // Redirect to homepage after 1 second
          setTimeout(() => { window.location.href = "index.html"; }, 1000);
        } else {
          loginMsg.textContent = data.message;
          loginMsg.style.color = "red";
        }
      } catch (err) {
        loginMsg.textContent = "Server error. Try again later.";
        loginMsg.style.color = "red";
        console.error(err);
      }
    });
  }




 // About section animation
const aboutHeading = document.querySelector('.animate-heading');
const aboutTexts = document.querySelectorAll('.animate-text');

if (aboutHeading) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate heading
                aboutHeading.classList.add('active');

                // Animate paragraphs and button sequentially
                aboutTexts.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('active');
                    }, 300 * (index + 1)); // 0.3s delay between each
                });

                observer.unobserve(aboutHeading);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(aboutHeading);
}



// Smooth scroll for navbar links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});



document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const yOffset = -70; // adjust according to your navbar height
            const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
});


});
