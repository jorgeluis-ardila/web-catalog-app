'use strict';
import './styles/main.styl';
import { asyncTimeout } from './js/utils/getData';
import { getDOMObjects } from './js/DOMElements';
import { renderProducts } from './js/templates/products';

const {
  wrapper,
  header
} = getDOMObjects();
// const renderProductsList = renderProducts();

(async function App () {
  // await renderProductsList();
  await renderProducts();
})();

wrapper.onscroll = async function (e) {
  const scrollY = this.scrollTop;
  // ACTION FOR INFINITE SCROLL
  if ((this.scrollHeight - this.clientHeight) === scrollY) await /* renderProductsList('') */ renderProducts();
  // STICKY HEADER
  await asyncTimeout(500).then(() => header.classList.toggle('sticky', scrollY > 0));
  if (scrollY > 0) header.style.top = 0;
  else header.removeAttribute('style');
};
