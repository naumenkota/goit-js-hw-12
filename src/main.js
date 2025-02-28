import SimpleLightbox from 'simplelightbox'; 
import 'simplelightbox/dist/simple-lightbox.min.css'; 
import iziToast from 'izitoast';  
import 'izitoast/dist/css/iziToast.min.css';  
import  { fetchImages } from './js/pixabay-api';
import { renderImages, clearGallery } from './js/render-functions';


const form = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const loader = document.querySelector('.loader');
const loadButton = document.querySelector('#load-more-button');

let page = 1;  
const limit = 40; 
let totalPages = 0;

form.addEventListener('submit', async e => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    clearGallery();
    page = 1;
    loader.style.display = 'block';
    loadButton.style.display = 'none'; 

     try {
        const { hits, totalHits } = await fetchImages(query, page, limit);
        totalPages = Math.ceil(totalHits / limit);
  
      if (hits.length === 0) {
        iziToast.error({
          title: 'Error',
          message: 'Sorry, there are no images matching your search query. Please try again!'
        }); } else {
          renderImages(hits);
          loadButton.style.display = 'block';
      }
    }
    catch(error) {
      console.error('Error fetching images:', error);
      iziToast.error({
        title: 'Error',
        message: 'Failed. Please try again later.'
      });
    }
    finally {
        loader.style.display = 'none';
        
    };
});

loadButton.addEventListener('click', async e => {
    try {
      const query = searchInput.value.trim();
            page++;
       const { hits, totalHits } = await fetchImages(query, page, limit);
      totalPages = Math.ceil(totalHits / limit);
      renderImages(hits);
         if (page >= totalPages || hits.length === 0) {
            loadButton.style.display = 'none';
            iziToast.info({
                title: 'No more results',
                message: 'You have reached the last page of results.',
            });
             return;
      }

        const firstImageCard = document.querySelector('.image-card');
        let cardHeight = 0;
           if (firstImageCard) {
                 cardHeight = firstImageCard.getBoundingClientRect().height;
                }
        if (cardHeight > 0) {
            window.scrollBy({
                top: cardHeight * 2,  
                behavior: 'smooth',    
            });
        }

      loadButton.style.display = 'block';

    } catch (error) {
        console.error('Error fetching images:', error);
        iziToast.error({
            title: 'Error',
            message: 'Failed. Please try again later.'
        });
    }
});