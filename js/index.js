const API_KEY = 'api_key=da0ec74f280b41c3b79d45fa4cd12578';
const BASE_URL = 'https://api.themoviedb.org/3';
const MOST_POPULAR = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const POSTER_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';
const THEATRE_URL = BASE_URL + '/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2021-10-22&' + API_KEY;

$(document).ready(()=>{
    $('.main-loader').fadeOut("slow");
    randomMovie()
    randomScroll()
})

function getConf() {
    fetch('https://api.themoviedb.org/3/configuration?api_key=da0ec74f280b41c3b79d45fa4cd12578')
    .then(res=> res.json())
    .then(data => {
        // console.log(data);
    })
}
getConf()

var obj = {};

function getGenres() {
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=da0ec74f280b41c3b79d45fa4cd12578&language=en-US')
    .then(res=> res.json())
    .then(data => {
        obj = Object.assign({}, data.genres)
    })
}
getGenres()

function randomScroll() {
    fetch(THEATRE_URL)
    .then(res => res.json())
    .then(data => {
        for(let i = 0; i < data.results.length; i++) {
            $('.movie-list-section').append(
                `<div class="movie-list item">
                    <img src="${'https://image.tmdb.org/t/p/w185' + data.results[i].poster_path}">
                    <span>${data.results[i].original_title}</span>
                </div>`
            )
            $('.movie-list').on('click', ()=>{
                console.log(true);
            })
        }
    })

    // es gasaketebelia <-------------------------------------------------------------------------------------

    // $('.movie-list-section').draggable({
    //     axis: 'x',
    //     drag: drag
    // })

    // function drag() {
    //     console.log(parseInt($('.movie-list-section').css('left')));
    //     if(parseInt($('.movie-list-section').css('left')) < -2271) {
    //         $('.movie-list-section').draggable({
    //             disabled: true
    //         })

    //     }
    //     // console.log($('.movie-list-section').css('left'));
    // }
}


function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        randomMovie(data)
    })
}
getMovies(MOST_POPULAR)


function randomMovie(data) {
    try {
        let val = getRandom(0, 20)
        $('body').css({
            'background' : `radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%), url(${BACKDROP_URL + data.results[val].backdrop_path})`,
            'background-position' : 'center',
            'background-repeat' : 'no-repeat',
            'background-size' : 'cover'
        })
        $('.header').text(data.results[val].original_title)
        $('.stars').attr('style',`--rating: ${data.results[val].vote_average/2};`);
        for(let i = 0; i < data.results[val].genre_ids.length; i++) {
            $('.genres').append(`<span>${obj[i].name}</span>`)
        }
        $('.description-par').text(data.results[val].overview)
    } catch (err) {
        console.error(err)
    }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}