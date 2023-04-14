'use strict';
import { getData } from '../utils/getData';
import { getDOMObjects } from '../DOMElements';

const $ = document;

function CategoryStructure (
  id,
  name
) {
  this.id = id;
  this.name = name;
}
