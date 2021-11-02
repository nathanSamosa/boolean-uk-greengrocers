const itemList = document.querySelector(".store--item-list");
const basketList = document.querySelector(".cart--item-list");
const basket = [];
let storeItems = null;
var price = 0;

init();

function init() {
  fetch("http://localhost:3000/storeitems")
    .then(function (response) {
      return response.json();
    })
    .then(function (storeitems) {
      console.log("store items:", storeitems);
      addStoreItems(storeitems);
      storeItems = storeItems;
    });
}

function addStoreItems(storeitems) {
  for (const storeItem of storeitems) {
    addItem(storeItem);
  }
}

function addItem(storeItem) {
  const liEl = document.createElement("li");
  const divEl = document.createElement("div");
  const imgEl = document.createElement("img");
  const butEl = document.createElement("button");

  butEl.innerHTML = "Add to cart"

  divEl.classList.add("store--item-icon");
  butEl.classList.add("item-" + storeItem.alt, "addButton");
  imgEl.src = storeItem.image;
  imgEl.alt = storeItem.name;

  liEl.append(divEl, butEl);
  divEl.append(imgEl);
  itemList.append(liEl);

  butEl.addEventListener("click", () => {
    addToBasket(storeItem, true);
  });

}

function addToBasket(storeItem, operator) {
  console.log(storeItem.name + " added to basket");
  //if store item already exists update quantity. if not push with quantity 1
  for (let i = 0; i < basket.length; i++) {
    if (basket[i].storeItem.id == storeItem.id) {
      changeBasketQuantity(storeItem, operator);
      return;
    }
  }
  basket.push({storeItem, quantity: 1});
  addBasketDiv(storeItem);
  calculatePrice();
}

function changeBasketQuantity(storeItem, operator) {
  for (let i = 0; i < basket.length; i++) {
    if (basket[i].storeItem.id == storeItem.id) {
      if (operator) {
        basket[i].quantity++;
      } else {
        basket[i].quantity--;
      }
      
      document.querySelector("." + storeItem.alt).innerHTML = basket[i].quantity;

      calculatePrice();

      if (basket[i].quantity == 0) {
        basket.splice(i, 1);
        deleteBasketItem(storeItem);
      }
    }
  }
}

function addBasketDiv(storeItem) {
  const liEl = document.createElement("li");
  const imgEl = document.createElement("img");
  const paraEl = document.createElement("p");
  const removeButEl = document.createElement("button");
  const spanEl = document.createElement("span");
  const addButEl = document.createElement("button");


  liEl.classList.add(storeItem.id);
  imgEl.classList.add("cart--item-icon");
  imgEl.src = storeItem.image;
  imgEl.alt = storeItem.name;

  spanEl.classList.add(storeItem.alt);

  paraEl.innerHTML = storeItem.name;
  removeButEl.innerHTML = "-";
  spanEl.innerHTML = 1;
  addButEl.innerHTML = "+";

  
  removeButEl.classList.add("quantity-btn", "remove-btn",  "center");
  spanEl.classList.add("quantity-text", "center");
  addButEl.classList.add("quantity-btn", "add-btn", "center");

  liEl.append(imgEl, paraEl, removeButEl, spanEl, addButEl);
  basketList.append(liEl);

  removeButEl.addEventListener("click", () => {
    changeBasketQuantity(storeItem, false);
  });

  addButEl.addEventListener("click", () => {
    changeBasketQuantity(storeItem, true);
  });
}

function deleteBasketItem(storeItem) {
  const basketItem = document.getElementsByClassName(storeItem.id);
  basketItem[0].remove();
}

function calculatePrice() {
  var price = 0;
  basket.forEach (element => {
    price = price + (element.storeItem.price * element.quantity);
  })

  priceFormatted = price.toFixed(2);
  document.querySelector(".total-number").innerHTML = "£" + priceFormatted;

}