
// MARK: - Properties.

let products = [
  { name: "Помідори", count: 2, bought: true },
  { name: "Печиво", count: 2, bought: false },
  { name: "Сир", count: 1, bought: false }
];

// MARK: - Rendering.

function renderAllProducts() {
  const productList = document.getElementById("product-list-container");
  productList.innerHTML = "";

  for (let product of products) {
    productList.appendChild(renderSpacer());
    productList.appendChild(renderProduct(product));
  }
}

function renderSpacer() {
  const spacer = document.createElement("div");
  spacer.className = "row-spacer";

  return spacer;
}

function renderProduct(product) {
  const productEntry = document.createElement("div");
  productEntry.className = "row-add";

  const nameColumn = document.createElement("div");
  nameColumn.className = "row-column";
  const productName = document.createElement("span");
  productName.className = "product-name";

  if (product.bought) {
    productName.className += " crossed";
  }

  productName.textContent = product.name;
  productName.onclick = () => { onEdit(productName) };
  nameColumn.appendChild(productName);
  productEntry.appendChild(nameColumn);

  const countColumn = document.createElement("div");
  countColumn.className = "row-column center-content";

  const minusButton = document.createElement("span");
  minusButton.className = "circle-button minus tooltip-button";
  minusButton.dataset.tooltip = "Minus button";
  if (product.bought) {
    minusButton.className += " hidden-opacity";
  } else if (product.count == 1) {
    minusButton.className += " disabled-opacity";
  }

  const minusButtonText = document.createElement("span");
  minusButtonText.className = "button-text";
  minusButtonText.textContent = "-";
  minusButton.onclick = () => { didTapMinusOn(product); };
  minusButton.appendChild(minusButtonText);

  const productCountContainer = document.createElement("span");
  productCountContainer.className = "product-count-container";

  const productCountText = document.createElement("span");
  productCountText.className = "product-count-text";
  productCountText.textContent = product.count;
  productCountContainer.appendChild(productCountText);

  const plusButton = document.createElement("span");
  plusButton.className = "circle-button plus tooltip-button";
  plusButton.dataset.tooltip = "Plus button";
  if (product.bought) {
    plusButton.className += " hidden-opacity";
  }

  const plusButtonText = document.createElement("span");
  plusButtonText.className = "button-text";
  plusButtonText.textContent = "+";
  plusButton.onclick = () => { didtapPlusOn(product); };
  plusButton.appendChild(plusButtonText);

  countColumn.appendChild(minusButton);
  countColumn.appendChild(productCountContainer);
  countColumn.appendChild(plusButton);
  productEntry.appendChild(countColumn);

  const buttonColumn = document.createElement("div");
  buttonColumn.className = "row-column right-content";

  if (!product.bought) {
    const buyButton = document.createElement("div");
    buyButton.className = "buy-button line-bottom tooltip-button";
    buyButton.dataset.tooltip = "Foo";
    buyButton.textContent = "Куплено";
    buyButton.onclick = () => { buy(product); };

    const deleteButton = document.createElement("span");
    deleteButton.className = "square-button minus line-bottom tooltip-button";
    deleteButton.dataset.tooltip = "X";

    const deleteButtonText = document.createElement("span");
    deleteButtonText.className = "button-text";
    deleteButtonText.textContent = "x";
    deleteButton.onclick = () => { remove(product); };
    deleteButton.appendChild(deleteButtonText);

    buttonColumn.appendChild(buyButton);
    buttonColumn.appendChild(deleteButton);
  } else {
    const unbuyButton = document.createElement("div");
    unbuyButton.className = "buy-button line-bottom tooltip-button";
    unbuyButton.dataset.tooltip = "Foo";
    unbuyButton.textContent = "Не куплено";
    unbuyButton.onclick = () => { unbuy(product); };

    buttonColumn.appendChild(unbuyButton);
  }

  productEntry.appendChild(buttonColumn);

  return productEntry;
}

function rerender(product) {
  rerenderRowAt(products.findIndex(pr => pr.name == product.name));
}

function rerenderRowAt(index) {
  console.log("rendering row at " + index + ". Products: " + products.length);
  if (index < 0 || index >= products.length) { return; }

  removeRowAt(index);
  createRowAt(index);
}

// MARK: - Add/remove.

function addProduct() {
  const input = document.getElementById("add-product-input");

  const productName = input.value.trim();

  console.log("Name: " + productName);

  if (!productName) {
    input.focus();

    return;
  }

  let product = {
    name: productName, count: 1, bought: false
  }

  const productList = document.getElementById("product-list-container");
  productList.appendChild(renderSpacer());
  productList.appendChild(renderProduct(product));
  products.push(product);

  input.value = "";
  input.focus();
}

function remove(product) {
  let index = products.findIndex(pr => pr.name === product.name);

  if (index == -1) { return; }

  removeRowAt(index);
  products.splice(index, 1);

  console.log("Removing " + product.name + " at index " + index);
}

// MARK: - Buy/unbuy.

function buy(product) {
  console.log("trying to buy " + product.name + ", bought: " + product.bought);

  if (product.bought) { return; }

  product.bought = true;
  rerender(product);
}

function unbuy(product) {
  if (!product.bought) { return; }

  product.bought = false;
  rerender(product);
}

// MARK: - Plus/minus.

function didTapMinusOn(product) {
  if (product.bought || product.count <= 1) { return; }

  product.count--;
  rerender(product);
}

function didtapPlusOn(product) {
  if (product.bought) { return; }

  product.count++;
  rerender(product);
}

// MARK: - Helping funcs.

function removeRowAt(index) {
  if (index < 0 || index >= products.length) { return; }

  const container = document.getElementById("product-list-container");

  const spacer = container.getElementsByClassName("row-spacer")[index];
  const row = container.getElementsByClassName("row-add")[index];

  container.removeChild(spacer);
  container.removeChild(row);
}

function createRowAt(index) {
  if (index < 0 || index >= products.length) { return; }

  let product = products[index];

  const newRow = renderProduct(product);
  const spacer = renderSpacer();

  const container = document.getElementById("product-list-container");
  const nextSibling = container.getElementsByClassName("row-spacer")[index];

  if (nextSibling) {
    container.insertBefore(spacer, nextSibling);
    container.insertBefore(newRow, nextSibling);
  } else {
    container.appendChild(spacer);
    container.appendChild(newRow);
  }
}

// MARK: - Edit.

function onEdit(element) {
  const name = element.textContent;
  const index = products.findIndex(pr => pr.name == name);

  if (index == -1) { return; }

  let product = products[index];

  if (product.bought) { return; }

  let input = document.createElement('input');
  input.value = name;
  element.parentNode.replaceChild(input, element);
  input.focus();
  
  let onEndEditing = () => {
    const newName = input.value;
  
    element.textContent = newName;
    input.parentNode.replaceChild(element, input);

    product.name = newName;
  };

  input.addEventListener('blur', onEndEditing);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      onEndEditing();
    }
  });
}

// MARK: - Initial setup.

renderAllProducts();

document
  .getElementById("add-product-input")
  .addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addProduct();
    }
  });