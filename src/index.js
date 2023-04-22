'use strict';
import './styles/main.styl';
// import { asyncTimeout } from './js/utils/getData';
import { getDOMObjects } from './js/DOMElements';
import { renderProducts } from './js/templates/products';
import { renderCategories } from './js/templates/categories';

const {
  wrapper,
  header,
  innerHeader,
  filtersBarEl
} = getDOMObjects();

(async function App () {
  await renderCategories();
  await renderProducts();
})();

wrapper.onscroll = async function (e) {
  const scrollY = this.scrollTop;
  const headerHeight = header.clientHeight;
  const innerHeaderHeight = innerHeader.clientHeight;
  // ACTION FOR INFINITE SCROLL
  if ((this.scrollHeight - this.clientHeight) === scrollY) await renderProducts();
  // STICKY HEADER
  header.classList.toggle('sticky', scrollY > 10);
  header.style.height = `${headerHeight}px`;
  filtersBarEl.classList.toggle('sticky', (scrollY + innerHeaderHeight) >= filtersBarEl.offsetTop);
};
