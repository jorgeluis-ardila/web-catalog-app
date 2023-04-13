'use strict';
import { getData } from '../utils/getData';
import { getDOMObjects } from '../DOMElements';

const $ = document;
const {
  productContainerEl,
  paginationEl,
  pageCounterEl,
  currentPagesEl,
  totalPagesEl,
  prevButtonEl,
  nextButtonEl,
  paginationButton
} = getDOMObjects();
const productsPerPage = 15;
let currentPage = 1;

// PRODUCT ITEM STRUCTURE / PROTOTIPE
function ProductStructure (
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
    productItem.appendChild(figureImage).appendChild(image);
    productItem.appendChild(info);

    productItem.onclick = () => this.handleModal.show();

    return productItem;
  };
  this.modalInfo = () => {
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
      $.body.appendChild(this.modalInfo());
    },
    close: () => {
      console.log(this.modalInfo());
      this.modalInfo().remove();
    }
  };
};

const renderProducts = async (FILTER_ENDPOINT = '', ENDPOINT = '/products') => {
  // GET THE TOTAL PAGES BASE ON THE TOTAL PRODUCTS
  const productsList = await getData(ENDPOINT + FILTER_ENDPOINT);
  const totalPages = Math.ceil(productsList.length / productsPerPage);
  /*  const totalPages = async () => {
    const productsList = await getData(`${ENDPOINT}`);
    return Math.ceil(productsList.length / productsPerPage);
  }; */

  // GET A SEGMENT OF PRODUCTS BASED ON THE MAX PER PAGE
  const getElementsByPage = /* async  */(currentPage, dataProducts) => {
    /* const total = await totalPages(); */
    currentPage = currentPage < /* total */ totalPages ? currentPage++ : currentPage;
    const initialSplit = (currentPage - 1) * productsPerPage;
    const finalSplit = initialSplit + productsPerPage;
    return dataProducts.slice(initialSplit, finalSplit);
  };

  // HANDLE STATE OF PAGINATION BUTTONS
  const handleButtons = (totalPages) => {
    prevButtonEl.toggleAttribute('disabled', currentPage === 1);
    nextButtonEl.toggleAttribute('disabled', currentPage === totalPages);
  };

  // RENDER PRODUCTE LIST AND PAGINATION
  /* async */ (function render (/* FILTER_ENDPOINT = `?offset=${currentPage === 1 ? 0 : productsPerPage * currentPage}&limit=${productsPerPage}` */) {
    // const urlProducts = `${ENDPOINT}${FILTER_ENDPOINT}`;
    // const dataProducts = !FILTER_ENDPOINT ? await getElementsByPage(currentPage, await getData(urlProducts)) : await getData(urlProducts);
    const dataProducts = /* await  */getElementsByPage(currentPage, /* await getData(urlProducts) */ productsList);
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
    totalPagesEl.innerHTML = /* await  */totalPages/* () */;
    if (!$.body.contains(pageCounterEl)) {
      pageCounterEl.appendChild(currentPagesEl);
      currentPagesEl.insertAdjacentText('afterend', 'de');
      pageCounterEl.appendChild(totalPagesEl);
      paginationEl.appendChild(prevButtonEl);
      paginationEl.appendChild(pageCounterEl);
      paginationEl.appendChild(nextButtonEl);
    }
    handleButtons(totalPages);
  })();

  // return render;
};

// HANDLE PAGINATION BUTTONS CLICKS
(function () {
  // const render = renderProducts();
  paginationButton.forEach(button => {
    button.onclick = async () => {
      button.classList.contains('pagination__button--prevPage') ? currentPage-- : currentPage++;
      productContainerEl.innerHTML = '';
      // await render();
      await renderProducts();
    };
  });
})();

export {
  renderProducts
};
