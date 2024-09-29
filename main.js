const APIURL = 'https://api.themoviedb.org/3/discover/movie?api_key=4f8e715da1bf57dbe238ec35ed60596d';
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?&api_key=4f8e715da1bf57dbe238ec35ed60596d&query='; 
const SLIDERAPI = 'https://api.themoviedb.org/3/movie/now_playing?api_key=4f8e715da1bf57dbe238ec35ed60596d&language=en-US&page=1';

const main = document.getElementById('content');
const form = document.getElementById('form');
const search =  document.getElementById('search');
const sliderContainer = document.getElementById('slider');

let currentIndex = 0;
let autoSlideInterval = null;

getMovies(APIURL);
getSliderMovies(SLIDERAPI);

//To fetch movies using Axios

async function getMovies(url) {
    try {
    const response = await axios.get(url);
    console.log(response.data);
    showMovies(response.data.results);
} catch (error) {
    console.error('Error fetching movies:', error);
}
}

//To fetch movies for the slider
async function getSliderMovies(url) {
    try {
        const response = await axios.get(url);
        showSliderMovies(response.data.results);
    } catch (error) {
        console.error('Error fetching slider movies:', error);
    }
}

//To Display slider movies
function showSliderMovies(movies) {
    sliderContainer.innerHTML = '';
    movies.forEach((movie) => {
        const { poster_path, title } = movie;
        const img = document.createElement('img');
        img.src = `${IMGPATH}${poster_path}`;
        img.alt = title;
        sliderContainer.appendChild(img);
    });
    setupSlider();
    startAutoSlide();
}

// To display main movie grid
function showMovies(movies) {
    main.innerHTML = '';
    movies.forEach(movie => {
        const { poster_path, title, overview, vote_average } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <img src='${IMGPATH}${poster_path}' alt='${title}'>
        <div class='movie-info'>
        <h3>${title}</h3>
        <span class='${getClassByRate(vote_average)}'>${vote_average}</span>
        </div>
        <div class='overview'>
        <h3>Overview:</h3>
        ${overview}
        </div>
        `;
        main.appendChild(movieEl);
    });
} 

//to setup the slider width and positioning
function setupSlider() {
    const sliderImages = document.querySelectorAll('#slider img');
    const imageWidth = sliderImages[0].offsetWidth; 
    sliderContainer.style.width = `${sliderImages.length * imageWidth}px`; 

    document.querySelector('.next').addEventListener('click', () => {
       clearInterval(autoSlideInterval);
       slide('next', sliderImages.length);
       startAutoSlide();
    });

    document.querySelector('.prev').addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        slide('prev', sliderImages.length);
        startAutoSlide();
});
}  

// To navigate Slider
function slide(direction, totalSlides) {
    const sliderImages = document.querySelectorAll('#slider img');
    const imageWidth = sliderImages[0].offsetWidth;

    if (direction === 'next') {
        currentIndex++
         if (currentIndex >= totalSlides) {
            currentIndex = 0;
         } 
    } else if(direction === 'prev') {
        currentIndex--
        if (currentIndex < 0) {
            currentIndex = totalSlides - 1;
    }
}
    sliderContainer.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        slide('next', document.querySelectorAll('#slider img').length);
    }, 3000);
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const searchTerm = search.value;
    if(searchTerm){
        getMovies(SEARCHAPI + searchTerm);
        search.value = '';
    }
 });

function getClassByRate(vote) {
    if(vote >= 8) {
        return 'green';
    }else if(vote >= 5) {
        return 'orange';
    }else{
        return 'red';
    }
}

