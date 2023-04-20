'use strict';
const $ = document;

export const getDOMObjects = () => {
  // MAIN CONTAINERS
  const wrapper = document.getElementById('wrapper');
  const header = wrapper.querySelector('header');
  const innerHeader = wrapper.querySelector('.innerHeader');
  const footer = wrapper.querySelector('footer');
  const root = $.getElementById('root');
  wrapper.style.paddingBottom = `${footer.clientHeight - 10}px`;

  // CATEGORIES ELEMENTS
  const categoriesContainerEl = $.querySelector('.categories');
  const categoriesWrapperEl = $.querySelector('.categories__wrapper');

  // PRODUCTS LIST ELEMENTS
  const productsContentEl = $.querySelector('.products');
  const productContainerEl = $.querySelector('.products__list');
  productsContentEl.style.minHeight = `${wrapper.clientHeight - ((footer.clientHeight - 10) + header.clientHeight)}px`;

  // FILTERS ELEMENTS
  const searchBarEl = $.querySelector('.search-bar__box');
  const searchBarElButtonEl = $.querySelector('.search-bar__button');
  const filtersBarEl = $.querySelector('.products__filters');
  const orderByEl = $.querySelector('.orderbyBox__current');
  const orderByLabelEl = [...$.querySelectorAll('.orderbyBox__option')];
  const orderByOptionEl = [...$.getElementsByName('orderby')];
  const orderViewButtonEl = [...$.querySelectorAll('.orderView__button')];

  // PAGINATION ELEMENTS
  const paginationEl = $.querySelector('.pagination');
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
    innerHeader,
    root,
    categoriesContainerEl,
    categoriesWrapperEl,
    productContainerEl,
    filtersBarEl,
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
  };
};
