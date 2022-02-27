const CartwindowEl = document.querySelector('.cartwindow')
function openWindowCart () {
    CartwindowEl.classList.add("cartwindowopen")
}
function closeWindowCart () {
    CartwindowEl.classList.remove('cartwindowopen')
}
const btnCartEl = document.getElementById('buttoncart')
    btnCartEl.addEventListener('click', openWindowCart)
const closeCartEl = document.getElementById('btnclosecart')
    closeCartEl.addEventListener('click', closeWindowCart )
    