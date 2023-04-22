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

    background.setAttribute('id', 'modal-product');
    background.classList.add('modal-background');
    modal.classList.add('modal-product');
    modal.onclick = (e) => e.stopPropagation();
    modal.innerHTML = `
                        <figure class="modal-product__image">
                          <img class="modal-product__image" src="${this.image}" alt="${this.name}">
                        </figure>
                        <div class="modal-product__info">
                          <div class="">
                            <p class="modal-product__name">${this.name}</p>
                            <em class="modal-product__type">${this.type}</em>
                          </div>
                          <p class="modal-product__price">$${this.price}000 COP</p>
                          <p class="modal-product__description">${this.description}</p>
                        </div>
                        <button class="modal-product__close" onclick="document.getElementById('modal-product').remove()">
                          <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6049 10.5L20.2712 1.83372C20.5763 1.5286 20.5763 1.03392 20.2712 0.728838C19.966 0.42376 19.4714 0.423721 19.1663 0.728838L10.5 9.39516L1.83372 0.728838C1.5286 0.423721 1.03391 0.423721 0.728837 0.728838C0.42376 1.03395 0.423721 1.52864 0.728837 1.83372L9.3951 10.5L0.728837 19.1663C0.423721 19.4714 0.423721 19.9661 0.728837 20.2712C0.881376 20.4237 1.08134 20.5 1.2813 20.5C1.48126 20.5 1.68118 20.4237 1.83376 20.2712L10.5 11.6049L19.1662 20.2712C19.3188 20.4237 19.5187 20.5 19.7187 20.5C19.9187 20.5 20.1186 20.4237 20.2712 20.2712C20.5763 19.9661 20.5763 19.4714 20.2712 19.1663L11.6049 10.5Z"/>
                          </svg>
                        </button>`;
    // $.querySelector('.modal-product__close').onclick = () => this.handleModal.close();
    background.onclick = () => this.handleModal.close();
    background.appendChild(modal);

    return background;
  };
  this.handleModal = {
    show: () => {
      $.body.appendChild(this.modalTemplate());
    },
    close: () => {
      if ($.body.contains($.getElementById('modal-product'))) $.getElementById('modal-product').remove();
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

// CLEAN HTML AND RESET THE PAGE COUNTER
const resetLayout = (pageValue) => {
  if (pageValue === 0) currentPage = 0;
  productContainerEl.innerHTML = '';
};

// GET ORDER BY STATUS
const getCheckOrderBy = () => orderByOptionEl.find(radio => radio.checked).value;

// VALIDATE THE VALUES TO FILTER THE FETCH
const validateGetFilter = () => {
  const searchBarValue = searchBarEl.value;
  const categoryValue = Number($.querySelector('.category-item.active').dataset.id);
  const filter = searchBarValue && categoryValue
    ? `/?categoryId=${categoryValue}&title=${searchBarValue}`
    : searchBarValue
      ? `/?title=${searchBarValue}`
      : categoryValue && categoryValue !== 0
        ? `/?categoryId=${categoryValue}`
        : '';
  return filter;
};

// GET THE PRODUCTS BASED ON THE ORDER BY
const sortProducts = async (ENDPOINT, filterEndpoint) => {
  const orderBy = getCheckOrderBy();
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
const getElementsByPage = (totalProducts, totalPages) => {
  const initialSplit = currentPage * productsPerPage;
  const finalSplit = initialSplit + productsPerPage;
  currentPage < totalPages && currentPage++;
  return totalProducts.slice(initialSplit, finalSplit);
};

const renderProducts = async () => {
  // GET THE TOTAL PAGES BASE ON THE TOTAL PRODUCTS
  const ENDPOINT = '/products';
  const filterEndpoint = validateGetFilter();
  const totalProducts = await sortProducts(ENDPOINT, filterEndpoint);
  const totalPages = Math.ceil(totalProducts.length / productsPerPage);

  // HANDLE STATE OF PAGINATION BUTTONS
  function handleButtons (totalPages) {
    prevButtonEl.toggleAttribute('disabled', currentPage === 1);
    nextButtonEl.toggleAttribute('disabled', currentPage === totalPages);
  };

  // RENDER PRODUCTE LIST AND PAGINATION
  const productsByPage = getElementsByPage(totalProducts, totalPages);
  console.log(productsByPage.length);
  if (productsByPage.length) {
    // RENDER PRODUCTS
    productsByPage.forEach(product => {
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
  }
};

// HANDLE ACTIONS
(function () {
  // HANDLE PAGINATION BUTTON
  paginationButton.forEach(button => {
    button.onclick = async () => {
      button.classList.contains('pagination__button--prevPage') && currentPage > 1 && (currentPage = currentPage - 2);
      resetLayout();
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
      resetLayout(0);
      await renderProducts();
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
    // console.log(e.target.value);
    resetLayout(0);
    await renderProducts();
  });
  searchBarElButtonEl.onclick = async (e) => {
    // console.log(getSearchBarEl());
    resetLayout(0);
    await renderProducts();
  };
})();

export {
  resetLayout,
  renderProducts,
  getCheckOrderBy
};
