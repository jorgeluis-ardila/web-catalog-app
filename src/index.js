'use strict';
import './styles/main.styl';
// import { asyncTimeout } from './js/utils/getData';
import { getDOMObjects } from './js/DOMElements';
import { renderProducts } from './js/templates/products';
import { renderCategories } from './js/templates/categories';

const {
  wrapper,
  header,
  filtersBarEl
} = getDOMObjects();
const headerHeight = header.clientHeight;

(async function App () {
  await renderCategories();
  await renderProducts();
})();

wrapper.onscroll = async function (e) {
  const scrollY = this.scrollTop;
  const headerValidation = scrollY > headerHeight + 5;
  // ACTION FOR INFINITE SCROLL
  if ((this.scrollHeight - this.clientHeight) === scrollY) await renderProducts();
  // STICKY HEADER
  header.classList.toggle('sticky', headerValidation);
  header.style.height = `${header.clientHeight}px`;
  filtersBarEl.classList.toggle('sticky', headerValidation);
};
