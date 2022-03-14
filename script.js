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
            // groupsproducts.innerHTML = ''
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

const productsCart = []
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
const handleCartUpdate = () => {
  const noProdcutsEL = document.querySelector('#noproducts')
  const cartWithProductsEl = document.querySelector('#cartwithproducts')
  if (productsCart.length > 0) {
    const cartBadgeEl = document.querySelector('.buttonunits')
    cartBadgeEl.classList.add('buttonunitsshow')
    let total = 0
    productsCart.forEach(product => {
      total = total + product.qty
    })
    cartBadgeEl.textContent = total
    const cartWithProductsEl = document.querySelector('#cartwithproducts')
    cartWithProductsEl.classList.add('cartwithproductsshow')
    noProdcutsEL.classList.remove('noproductsshow')
  } else {
    cartWithProductsEl.classList.remove('cartwithproductsshow')
    noProdcutsEL.classList.add('noproductsshow')
    
  
  }
}
handleCartUpdate()