document.getElementById("botao").onclick = function() { abrir ()}

function abrir() {
document.getElementById("info").classList.toggle("show");
}

function openSideBar() {
    const cartSidebarEl = document.querySelector('.cart-sidebar')
    cartSidebarEl.classList.add('cart-sidebar-open')
    }
    function closeSideBar() {
        const cartSidebarEl = document.querySelector('.cart-sidebar')
        cartSidebarEl.classList.remove('cart-sidebar-open')
    }