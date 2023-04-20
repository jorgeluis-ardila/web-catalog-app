'use strict';
import { getData } from '../utils/getData';
import { getDOMObjects } from '../DOMElements';

const $ = document;
const {
  productContainerEl,
  searchBarEl,
  searchBarElButtonEl,
  orderByEl,
  orderByLabelEl,
  orderByOptionEl,
  orderViewButtonEl,
  paginationEl,
  pageCounterEl,
  currentPagesEl,
  totalPagesEl,
  prevButtonEl,
  nextButtonEl,
  paginationButton
} = getDOMObjects();
const screenSize = {
  Xlarge: 1025,
  large: 900,
  medium: 768,
  Xsmall: 320,
  small: 0
};
const productsPerPage = 15;
let currentPage = 0;

// PRODUCT ITEM STRUCTURE / PROTOTIPE
const ProductStructure = function (
  id,
  name,
  price,
  type,
  description,
  image
) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.type = type;
  this.description = description;
  this.image = image;
  this.template = () => {
    const productItem = $.createElement('li');
    const figureImage = $.createElement('figure');
    const image = $.createElement('img');
    const info = $.createElement('div');
    const tag = $.createElement('span');
    const name = $.createElement('p');
    const price = $.createElement('p');

    figureImage.classList.add('product-item__image');
    image.setAttribute('alt', this.name);
    image.src = this.image;

    tag.classList.add('product-item__tag');
    name.classList.add('product-item__name');
    price.classList.add('product-item__price');

    info.classList.add('product-item__info');
    info.appendChild(tag).innerText = this.type;
    info.appendChild(name).innerText = this.name;
    info.appendChild(price).innerText = `$${this.price}000 COP`;

    productItem.classList.add('product-item');
    productItem.dataset.id = this.id;
    productItem.appendChild(image);
    productItem.appendChild(info);

    productItem.onclick = () => this.handleModal.show();

    return productItem;
  };
  this.modalTemplate = () => {
    const background = $.createElement('div');
    const modal = $.createElement('div');

    background.setAttribute('id', '');
    background.appendChild(modal);
    background.style.height = '100px';
    background.onclick = () => this.handleModal.close();
    modal.innerHTML = this.description;

    return background;
  };
  this.handleModal = {
    show: () => {
      $.body.appendChild(this.modalTemplate());
    },
    close: () => {
      console.log(this.modalTemplate());
      this.modalTemplate().remove();
    }
  };
};

// HANDLE RESIZE SCREEN
const resizeHandler = () => {
  const innerwidth = window.innerWidth;
  const buttonView = (classToFind) => orderViewButtonEl.find(button => button.classList.contains(classToFind));

  productContainerEl.removeAttribute('style');
  orderViewButtonEl.forEach(button => button.classList.remove('active', 'one-column'));
  if (innerwidth >= screenSize.Xlarge) return buttonView('orderView__button--five').classList.add('active');
  if (innerwidth >= screenSize.large) return buttonView('orderView__button--four').classList.add('active');
  if (innerwidth >= screenSize.medium) return buttonView('orderView__button--three').classList.add('active');
  if (innerwidth >= screenSize.Xsmall) return buttonView('orderView__button--two').classList.add('active');
  if (innerwidth >= screenSize.small) {
    productContainerEl.classList.add('one-column');
    buttonView('orderView__button--one').classList.add('active');
    return;
  };
};

// GET ORDER BY STATUS
const getCheckOrderBy = () => orderByOptionEl.find(radio => radio.checked).value;

// GET SEARCH BAR VALUE
const getSearchBarEl = () => searchBarEl.value;

// GET THE PRODUCTS BASED ON THE ORDER BY
const getProductsList = async (ENDPOINT, filterEndpoint, orderBy) => {
  const products = await getData(ENDPOINT + filterEndpoint);
  let sortedProducts;
  switch (orderBy) {
    // BY NAME ASC
    case 'asc':
      sortedProducts = products.sort((p1, p2) => (p1.title.toUpperCase() > p2.title.toUpperCase()) ? 1 : (p1.title.toUpperCase() < p2.title.toUpperCase()) ? -1 : 0);
      break;
    // BY NAME DES
    case 'dec':
      sortedProducts = products.sort((p1, p2) => (p1.title.toUpperCase() < p2.title.toUpperCase()) ? 1 : (p1.title.toUpperCase() > p2.title.toUpperCase()) ? -1 : 0);
      break;
    // BY NAME DES
    case 'maxPrice':
      sortedProducts = products.sort((p1, p2) => (p1.price < p2.price) ? 1 : (p1.price > p2.price) ? -1 : 0);
      break;
    // BY NAME DES
    case 'minPrice':
      sortedProducts = products.sort((p1, p2) => (p1.price > p2.price) ? 1 : (p1.price < p2.price) ? -1 : 0);
      break;
    default:
      sortedProducts = products;
      break;
  }
  return sortedProducts;
};

// GET A SEGMENT OF PRODUCTS BASED ON THE MAX PER PAGE
const getElementsByPage = (dataProducts, totalPages) => {
  currentPage < totalPages && currentPage++;
  const initialSplit = (currentPage - 1) * productsPerPage;
  const finalSplit = initialSplit + productsPerPage;
  return dataProducts.slice(initialSplit, finalSplit);
};

const renderProducts = async (orderBy = getCheckOrderBy(), filterEndpoint = `/?title=${getSearchBarEl()}`) => {
  // GET THE TOTAL PAGES BASE ON THE TOTAL PRODUCTS
  const ENDPOINT = '/products';
  const productsList = orderBy ? await getProductsList(ENDPOINT, filterEndpoint, orderBy) : await getData(ENDPOINT + filterEndpoint);
  const totalPages = Math.ceil(productsList.length / productsPerPage);

  // HANDLE STATE OF PAGINATION BUTTONS
  function handleButtons (totalPages) {
    prevButtonEl.toggleAttribute('disabled', currentPage === 1);
    nextButtonEl.toggleAttribute('disabled', currentPage === totalPages);
  };

  // RENDER PRODUCTE LIST AND PAGINATION
  const dataProducts = getElementsByPage(productsList, totalPages);
  console.log(dataProducts);
  // RENDER PRODUCTS
  dataProducts.forEach(product => {
    const productStructure = new ProductStructure(
      product.id,
      product.title,
      product.price,
      product.category.name,
      product.description,
      product.images[0]
    );
    productContainerEl.appendChild(productStructure.template());
  });

  // RENDER PAGINATION
  currentPagesEl.innerHTML = currentPage;
  totalPagesEl.innerHTML = totalPages;
  if (!$.body.contains(pageCounterEl)) {
    pageCounterEl.appendChild(currentPagesEl);
    currentPagesEl.insertAdjacentText('afterend', 'de');
    pageCounterEl.appendChild(totalPagesEl);
    paginationEl.appendChild(prevButtonEl);
    paginationEl.appendChild(pageCounterEl);
    paginationEl.appendChild(nextButtonEl);
  }
  handleButtons(totalPages);
};

// HANDLE ACTIONS
(function () {
  // const render = renderProducts();
  // HANDLE PAGINATION BUTTON
  paginationButton.forEach(button => {
    button.onclick = async () => {
      button.classList.contains('pagination__button--prevPage') && currentPage > 1 && (currentPage = currentPage - 2);
      productContainerEl.innerHTML = '';
      // await render();
      await renderProducts();
    };
  });

  // HANDLE ORDER BY
  $.onclick = (e) => (!orderByEl.contains(e.target) || e.target.classList.contains('orderbyBox__input')) && orderByEl.parentNode.classList.remove('active');
  orderByEl.onclick = () => orderByEl.parentNode.classList.toggle('active');
  orderByLabelEl.forEach(option => {
    option.onclick = async (e) => {
      const siblings = Array.from(option.parentElement.parentElement.children);

      siblings.forEach(sibling => sibling.children[0].classList.remove('checked'));
      option.classList.add('checked');
    };
  });
  orderByOptionEl.forEach(option => {
    option.onclick = async () => {
      productContainerEl.innerHTML = '';
      currentPage = 0;
      await renderProducts(getCheckOrderBy());
    };
  });

  // HANDLE ORDER VIEW
  orderViewButtonEl.forEach(button => {
    button.onclick = (e) => {
      const columns = button.dataset.order;
      const siblings = Array.from(button.parentElement.children);

      siblings.forEach(sibling => sibling.classList.remove('active'));
      button.classList.add('active');
      productContainerEl.removeAttribute('style');
      productContainerEl.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      productContainerEl.classList.remove('one-column');
      if (button.classList.contains('orderView__button--one')) productContainerEl.classList.add('one-column');
    };
  });
  resizeHandler();
  window.addEventListener('resize', resizeHandler);

  // HANDLE SEARCH BAR
  searchBarEl.addEventListener('change', async (e) => {
    console.log(e.target.value);
    productContainerEl.innerHTML = '';
    currentPage = 0;
    await renderProducts(getCheckOrderBy(), `/?title=${e.target.value}`);
  });
  searchBarElButtonEl.onclick = async (e) => {
    console.log(getSearchBarEl());
    productContainerEl.innerHTML = '';
    currentPage = 0;
    await renderProducts(getCheckOrderBy(), `/?title=${getSearchBarEl()}`);
  };
})();

export {
  renderProducts,
  getSearchBarEl,
  getCheckOrderBy
};
