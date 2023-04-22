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
  const categoriesInnerContainerEl = $.querySelector('.categories__inner');
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
  prevButtonEl.innerHTML = `<svg viewBox="0 0 49 87" xmlns="http://www.w3.org/2000/svg">
                              <path d="M47.8041 85.8417C49.3985 84.2976 49.3988 81.7936 47.8039 80.2492L9.85798 43.5009L47.8041 6.75081C49.3985 5.20669 49.3988 2.70267 47.8039 1.15829C46.2092 -0.386096 43.6239 -0.386096 42.0292 1.15829L1.19587 40.7048C0.430106 41.4464 -6.98164e-06 42.4522 -7.02749e-06 43.5009C-7.07333e-06 44.5497 0.430376 45.5557 1.19614 46.2971L42.0295 85.8415C43.6239 87.3861 46.2094 87.3861 47.8041 85.8417Z"/>
                            </svg>`;
  nextButtonEl.innerHTML = `<svg viewBox="0 0 49 87" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.19587 1.15825C-0.398537 2.70237 -0.398809 5.20638 1.19614 6.75077L39.142 43.4991L1.19587 80.2492C-0.398534 81.7933 -0.398806 84.2973 1.19614 85.8417C2.79082 87.3861 5.37612 87.3861 6.9708 85.8417L47.8041 46.2952C48.5699 45.5536 49 44.5478 49 43.4991C49 42.4503 48.5696 41.4443 47.8039 40.7029L6.97052 1.15852C5.37611 -0.386131 2.79055 -0.386132 1.19587 1.15825Z"/>
                            </svg>`;
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
    categoriesInnerContainerEl,
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
