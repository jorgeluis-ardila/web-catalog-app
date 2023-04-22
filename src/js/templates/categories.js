'use strict';
import { getData } from '../utils/getData';
import { getDOMObjects } from '../DOMElements';
import { resetLayout, renderProducts } from './products';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const $ = document;
const {
  categoriesInnerContainerEl,
  categoriesWrapperEl
} = getDOMObjects();

const CategoryStructure = function (
  id,
  name
) {
  this.id = id;
  this.name = name;
  this.template = () => {
    const categoryItem = $.createElement('li');
    const bgItem = `
      <svg class="category-item__bg" viewBox="0 0 75 75" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#mask-category)">
          <path d="M21.5 15.5C8.30002 13.5 -0.666656 25.5 -2.49999 29.5C-7.99997 46.5 1.00001 82.5 35 82.5C69 82.5 69 67 72.5 51.5C76 36 70.5 24.5 63.5 26.5C55.542 28.7737 48.5 40 36.5 39C24.5 38 38 18 21.5 15.5Z"/>
        </g>
        <defs>
          <clipPath id="mask-category">
            <rect width="75" height="75" rx="37.5"/>
          </clipPath>
        </defs>
      </svg>
    `;
    const text = $.createElement('p');

    categoryItem.classList.add('category-item', 'swiper-slide', (this.id === 0 && this.name === 'Todo') && 'active');
    categoryItem.dataset.id = this.id;
    text.classList.add('category-item__text');
    text.innerText = this.name;
    categoryItem.innerHTML = bgItem;
    categoryItem.appendChild(text);

    categoryItem.onclick = () => {
      const siblings = Array.from(categoryItem.parentElement.children);
      siblings.forEach(sibling => sibling.classList.remove('active'));
      categoryItem.classList.add('active');
      this.handleFilter();
    };

    return categoryItem;
  };
  this.handleFilter = () => {
    resetLayout(0);
    renderProducts();
  };
};

const renderCategories = async () => {
  const ENDPOINT = '/categories';
  const categoriesList = await getData(ENDPOINT);
  // RENDER CATEGORIES
  categoriesList.unshift({ id: 0, name: 'Todo' });
  categoriesList.forEach(category => {
    const categoryStructure = new CategoryStructure(
      category.id,
      category.name
    );
    categoriesWrapperEl.appendChild(categoryStructure.template());
  });

  // eslint-disable-next-line no-unused-vars
  const swiper = new Swiper(categoriesInnerContainerEl, {
    slidesPerView: 'auto',
    // slidesPerGroup: 1,
    grabCursor: true,
    containerModifierClass: 'categories-',
    speed: 500,
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
    /* breakpoints: {
      320: {
        slidesPerGroup: 2
      },
      480: {
        slidesPerGroup: 3
      },
      640: {
        slidesPerGroup: 4
      },
      900: {
        slidesPerGroup: 5
      }
    } */
  });
};

export {
  renderCategories
};
