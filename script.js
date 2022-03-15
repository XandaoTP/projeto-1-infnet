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
    
const loadProducts= () => {
    const groupsproducts = document.querySelector('#prodcontents')
    fetch('/listproducts.json')
        .then(data => data.json())
        .then(list => {
            groupsproducts.innerHTML = ''
            list.groups.forEach((group) => {
            const groupSectionEl = getSectionElement(group)
            groupsproducts.appendChild(groupSectionEl)
            })
          })
          .catch(() => {
            groupsproducts.innerHTML = '<p class="errorpage">Desculpe, tivemos um pequeno problema. Por favor, tente novamente.</p>'
          })
      }
      const getSectionElement = (group) => {
        const sectionEl = document.createElement('section')
        const sectionTitleEl = document.createElement('h2')
        sectionTitleEl.textContent = group.name
        sectionEl.appendChild(sectionTitleEl)
        const productsGridEl = document.createElement('div')
        productsGridEl.classList.add('gridproducts')
        sectionEl.appendChild(productsGridEl)
        group.products.forEach((product) => {
          const cardWrapEl = document.createElement('article')
          cardWrapEl.classList.add('banner')
          cardWrapEl.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="250" height="250" />
            <div class="productcontent">
              <h3>${product.name}</h3>
              <p class="price">R$ ${product.price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</p>
              ${product.description ? `<p>${product.description}</p>` : ''}
              <button class="btnaddcart">Adicionar ao carrinho</button>
            </div>
          `
          const btnAddCartEl = cardWrapEl.querySelector('button')
          btnAddCartEl.addEventListener('click', () => {
            addToCart(product)
          })
          productsGridEl.appendChild(cardWrapEl)
        })
        return sectionEl
      }
loadProducts()

let productsCart = []
const SavedProductsOrder = localStorage.getItem('productsorder')
if (SavedProductsOrder) {
productsCart = JSON.parse(SavedProductsOrder)
}
const addToCart = newProduct => {
  const productIndex = productsCart.findIndex(
    item => item.id === newProduct.id
  )
  if (productIndex === -1) {
    productsCart.push({
      ...newProduct,
      qty: 1
    })
  } else {
    productsCart[productIndex].qty++
  }
  handleCartUpdate()
}
const deleteOfCart = id => {
   productsCart = productsCart.filter((product) =>{
    if (product.id === id) {
      return false
    }
      return true
  })
  handleCartUpdate()
  if (productsCart.length === 0) {
    closeWindowCart()
  }
}
const updateItemQty = (id, newQty) => {
  const newOrderQty = parseInt(newQty)
  if (isNaN(newOrderQty)) {
    return
  }
  if (newOrderQty > 0) {
  const productListIndex = productsCart.findIndex((product) => {
    if(product.id === id) {
      return true
    }
      return false
  })
  productsCart[productListIndex].qty = newOrderQty
  handleCartUpdate(false)
  }else {
    deleteOfCart(id)
  } 
}
const handleCartUpdate = (renderItens = true) => {
  const productsCartString = JSON.stringify(productsCart)
  localStorage.setItem('productsorder', productsCartString)
  const noProdcutsEL = document.querySelector('#noproducts')
  const cartWithProductsEl = document.querySelector('#cartwithproducts')
  const listItemEL = cartWithProductsEl.querySelector('ul')
  const cartBadgeEl = document.querySelector('.buttonunits')
  if (productsCart.length > 0) {
    cartBadgeEl.classList.add('buttonunitsshow')
    let total = 0
    let finalPrice = 0
    productsCart.forEach(product => {
      total = total + product.qty
      finalPrice = finalPrice + product.price * product.qty
    })
    cartBadgeEl.textContent = total
    const finalPriceEl = document.querySelector('.totalprice p:last-child')
    finalPriceEl.textContent = finalPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    const cartWithProductsEl = document.querySelector('#cartwithproducts')
    cartWithProductsEl.classList.add('cartwithproductsshow')
    noProdcutsEL.classList.remove('noproductsshow')
    if (renderItens) {
      listItemEL.innerHTML = ''
      productsCart.forEach((product) => {
        const showItemEl = document.createElement('li')
        showItemEl.classList.add('listcartproducts')
        showItemEl.innerHTML = `<img src="${product.image}" alt="${product.name}"  width="90" height="90">
        <div>
            <p class="nameproductcart">${product.name}</p>
            <p class="priceincart">R$ ${product.price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</p>
        </div>   
        <input class="inputcart" type="number" value=${product.qty} />
        <button id="deleteproduct">
            <i class="fa-solid fa-trash-can"></i>
        </button>`
        const buttonDeleteEL = showItemEl.querySelector('button')
        buttonDeleteEL.addEventListener('click', (event) => {
          deleteOfCart(product.id)
        })
        const inputQtyEl = showItemEl.querySelector('input')
        inputQtyEl.addEventListener('keyup', (event) => {
          updateItemQty(product.id, event.target.value)
        })
        inputQtyEl.addEventListener('change', (event) => {
          updateItemQty(product.id, event.target.value)
        })
        inputQtyEl.addEventListener('keydown', (event) => {
          if (event.key === '-' || event.key === '.' || event.key === ',') {
            event.preventDefault()
          }
        })
        listItemEL.appendChild(showItemEl)      
    })
  }
  } else {
    cartBadgeEl.classList.remove('buttonunitsshow')
    cartWithProductsEl.classList.remove('cartwithproductsshow')
    noProdcutsEL.classList.add('noproductsshow')
  }
}
handleCartUpdate()
window.addEventListener('storage', (attpage) =>{
  if (attpage.key === 'productsorder') {
    productsCart = JSON.parse(attpage.newValue)
    handleCartUpdate()
  }
})
