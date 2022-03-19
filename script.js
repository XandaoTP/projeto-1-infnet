const CartwindowEl = document.querySelector('.cartwindow')
const missIconCart = document.querySelector('#buttoncart')
const transparentPage = document.querySelector('.transparentcartpage')
function openWindowCart (event) {
  event.stopPropagation()
    CartwindowEl.classList.add("cartwindowopen")
    missIconCart.classList.add("missiconcart")
    transparentPage.classList.add("transparenton")
}
function closeWindowCart () {
  if (CartwindowEl){
    missIconCart.classList.remove('missiconcart')
    CartwindowEl.classList.remove('cartwindowopen')
    transparentPage.classList.remove("transparenton")
}}
const btnCartEl = document.getElementById('buttoncart')
if (btnCartEl) {
    btnCartEl.addEventListener('click', openWindowCart)
}
const closeCartEl = document.getElementById('btnclosecart')
if (closeCartEl) {
    closeCartEl.addEventListener('click', closeWindowCart )
}
    document.addEventListener('click', closeWindowCart)
    if (CartwindowEl) {
    CartwindowEl.addEventListener('click', (event) => {
      event.stopPropagation()
    })}
    const groupsproducts = document.querySelector('#prodcontents')    
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
        sectionTitleEl.classList.add('h2')
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
              ${product.description ? `<p class="descr">${product.description}</p>` : ''}
              <button class="btnaddcart">Adicionar ao carrinho</button>
            </div>
          `
          const btnAddCartEl = cardWrapEl.querySelector('.btnaddcart')
          btnAddCartEl.addEventListener('click', () => {
            addToCart(product)
          })
//           const btnAddDescription = cardWrapEl.querySelector('#btnDescription')
//           btnAddDescription.addEventListener('click', () => {
//           const btnDescriptionEl = document.querySelector('#btnDescription')
//           const descriptionProd = document.querySelector('#productdescription')
//           const descriptionAba = document.createElement('div')
//           descriptionProd.appendChild(descriptionAba)
//           descriptionAba.innerHTML = `<p>asa</p><img src="${product.image}" alt="${product.name}" width="250" height="250" />`
// })
          productsGridEl.appendChild(cardWrapEl)
        })
        return sectionEl
      }
      if (groupsproducts){
loadProducts()
      }
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
  const listItemEL = cartWithProductsEl?.querySelector('ul')
  const cartBadgeEl = document?.querySelector('.buttonunits')
  if (productsCart.length > 0) {
    cartBadgeEl?.classList.add('buttonunitsshow')
    let total = 0
    let finalPrice = 0
    productsCart.forEach(product => {
      total = total + product.qty
      finalPrice = finalPrice + product.price * product.qty
    })
    if (cartBadgeEl) {
    cartBadgeEl.textContent = total
    }
    const finalPriceEl = document.querySelector('.totalprice p:last-child')
    if (finalPriceEl) {
    finalPriceEl.textContent = finalPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }
    const cartWithProductsEl = document.querySelector('#cartwithproducts')
    cartWithProductsEl?.classList.add('cartwithproductsshow')
    noProdcutsEL?.classList.remove('noproductsshow')
    if (renderItens) {
      if (listItemEL) {
      listItemEL.innerHTML = ''
      }
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
        listItemEL?.appendChild(showItemEl)      
    })
  }
  } else {
    cartBadgeEl?.classList.remove('buttonunitsshow')
    cartWithProductsEl?.classList.remove('cartwithproductsshow')
    noProdcutsEL?.classList.add('noproductsshow')
  }
}
handleCartUpdate()  
window.addEventListener('storage', (attpage) =>{
  if (attpage.key === 'productsorder') {
    productsCart = JSON.parse(attpage.newValue)
    handleCartUpdate()
  }
})
const formCheckEL = document.querySelector('.formcheck')
formCheckEL?.addEventListener('submit',(event) => {
  event.preventDefault()
  if (productsCart.length == 0) {
    alert('Seu carrinho está vazio')
    return
  }
    let text = 'Solicito forma de pagamento do pedido abaixo\n------------------------\n\n '
    let total = 0
    productsCart.forEach(product => {
    text += `*${product.qty}x ${product.name}* - ${product.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}\n`
    total += product.price * product.qty
    })
    text += '\n*Frete grátis\n'
    text += `*Total: ${total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}*`
    text += '\n---------------------------------------\n\n'
    text += `*${formCheckEL.elements['inputname'].value}*\n`
    text += `${formCheckEL.elements['inputphone'].value}\n\n`
    text += `${formCheckEL.elements['inputaddress'].value}, ${formCheckEL.elements['inputnumber'].value}`
    const complement = formCheckEL.elements['inputcomplement'].value
    if (complement) {
      text += ` - ${complement} `
    }
    text += `\n${formCheckEL.elements['inputneig'].value}, ${formCheckEL.elements['inputcity'].value}\n`
  text += formCheckEL.elements['inputzipcode'].value
  const domain = window.innerWidth > 768 ? 'web' : 'api'
  window.open(`https://${domain}.whatsapp.com/send?phone=5534998700924&text=${encodeURI(text)}`)
})
if (typeof IMask !== 'undefined') {
  const inputPhoneEl = document.querySelector('#inputphone')
  IMask(inputPhoneEl, {
    mask: '(00) 00000-0000'
  })
  const inputCepEl = document.querySelector('#inputzipcode')
  IMask(inputCepEl, {
    mask: '00000-000'
  }) 
}
// const descriptionFinal = document.querySelector('#listfinal')
// const descriptionList = document.createElement('li')
// descriptionList?.classList.add('listf')
// descriptionFinal.appendChild(descriptionList)
// if (productsCart) {
// productsCart.forEach((product => {
// descriptionList.innerHTML = `${product.name}`
// }))
// if (productsCart == 0) {
//   descriptionList.innerHTML = '<p>sdfsdfsdfsdfdsfsdfsd</p>'
// }}
