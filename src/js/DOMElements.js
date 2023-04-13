'use strict';
const $ = document;

export const getDOMObjects = () => {
  // MAIN CONTAINERS
  const wrapper = document.getElementById('wrapper');
  const header = wrapper.getElementsByTagName('header')[0];
  const footer = wrapper.getElementsByTagName('footer')[0];
  wrapper.style.paddingBottom = `${footer.clientHeight - 10}px`;

  // PRODUCTS LIST ELEMENTS
  const productContainerEl = $.getElementsByClassName('products__list')[0];

  // PAGINATION ELEMENTS
  const paginationEl = $.getElementsByClassName('pagination')[0];
  const pageCounterEl = $.createElement('p');
  const currentPagesEl = $.createElement('span');
  const totalPagesEl = $.createElement('span');
  const prevButtonEl = $.createElement('button');
  const nextButtonEl = $.createElement('button');
  const paginationButton = [prevButtonEl, nextButtonEl];

  currentPagesEl.classList.add('pagination__current');
  totalPagesEl.classList.add('pagination__total');
  pageCounterEl.classList.add('pagination__counter');
  prevButtonEl.classList.add('pagination__button', 'pagination__button--prevPage');
  nextButtonEl.classList.add('pagination__button', 'pagination__button--nextPage');
  prevButtonEl.innerText = 'PREV';
  nextButtonEl.innerText = 'NEXT';

  return {
    wrapper,
    header,
    productContainerEl,
    paginationEl,
    pageCounterEl,
    currentPagesEl,
    totalPagesEl,
    prevButtonEl,
    nextButtonEl,
    paginationButton
  };
};