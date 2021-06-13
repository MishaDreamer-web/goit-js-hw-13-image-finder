import hitsTpl from '../templates/hits.hbs';
import ApiService from './apiService.js';
import LoadMoreBtn from './load-more-btn.js';

import { error } from '@pnotify/core';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/PNotify.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryList: document.querySelector('.gallery'),
  scrollAnchor: document.querySelector('#scroll-anchor'),
  input: document.querySelector('input'),
  // loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

// console.log(refs.galleryList.childElementCount);

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const apiService = new ApiService();

// console.log(loadMoreBtn);

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  apiService.query = event.currentTarget.elements.query.value;

  if (apiService.query.trim() === '') {
    return error({
      text: 'Type something please!',
      delay: 1300,
    });
  }

  loadMoreBtn.show();
  apiService.resetPage();
  clearGalleryList();
  fetchHits();
}

function onLoadMore() {
  fetchHits();
  scroll();
}

function fetchHits() {
  loadMoreBtn.disable();

  apiService.fetchArticles().then(hits => {
    appendHitsMarkup(hits);
    loadMoreBtn.enable();
    console.log(hits.length);
    if (hits.length === 0) {
      loadMoreBtn.hide();
      return error({
        text: 'Its all images!',
        delay: 1500,
      });
    }
  });
}

function appendHitsMarkup(hits) {
  refs.galleryList.insertAdjacentHTML('beforeend', hitsTpl(hits));
}

function clearGalleryList() {
  refs.galleryList.innerHTML = '';
}

// const element = document.querySelector('#scroll-anchor');
function scroll() {
  setTimeout(() => {
    console.log('тут был скролл');
    refs.galleryList.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  }, 700);
}
// function scroll() {
//   console.log('тут был скролл');

//   refs.scrollAnchor.scrollIntoView({
//     behavior: 'smooth',
//     block: 'nearest',
//   });
// }
