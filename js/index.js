const API_KEY = 'api_key=da0ec74f280b41c3b79d45fa4cd12578';
const BASE_URL = 'https://api.themoviedb.org/3';
const MOST_POPULAR = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const POSTER_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';
const THEATRE_URL = BASE_URL + '/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2021-10-22&' + API_KEY;

$(document).ready(()=>{
    $('.main-loader').fadeOut("slow");
    randomMovie();
    randomScroll();
    contentDrag();
    setTimeout(() => {
        if($('.description-par').text().length > 350) {
            $('.description-par').addClass('fade')
        }
    },100)
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
            $('.list-section-inner').append(
                `<div class="movie-list item">
                    <img src="${'https://image.tmdb.org/t/p/w185' + data.results[i].poster_path}">
                    <span>${data.results[i].original_title}</span>
                </div>`
            )
        }
    })
    $('.movie-list-section').append(`<button class="show-content-btn"><svg id="arrow-vector" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg></button>`)
}

function contentDrag() {
    $('.movie-list-section').draggable({
        axis: 'y',
        drag: function(){
            try {
                if(parseInt($(this).css('top')) > 600) {
                    $(this).draggable('destroy')
                } else if (parseInt($(this).css('top')) < 600) {
                    $(this).draggable('destroy')
                }
            } catch (err) {
                throw 'Ignore';
            }
        },
        stop: function(){
            $(this).css({
                'top': '910px',
                'transition': 'all .5s'
            })
            $('.description-par').removeClass('fade')
            $('#arrow-vector').css({
                'transform': 'translate(-50%, -50%) rotate(180deg)',
                'transition': 'all .5s'
            })
            $('.movie-list-section').removeClass('display-on')
        }
    })

    $('.show-content-btn').on('click', function(){
        $('.movie-list-section').toggleClass('display-on')
        if($('.movie-list-section').hasClass('display-on')) {
            $('.movie-list-section').css({
                'top':'614px',
                'transition': 'all .5s'
            })
            $('#arrow-vector').css({
                'transform': 'translate(-50%, -50%) rotate(0deg)',
                'transition': 'all .5s'
            })

            // fix this
            
            // if($('.description-par').text().length > 350) {
            //     $('.description-par').addClass('fade')
            // } else {
            //     $('.description-par').removeClass('fade')
            // }
        }
        else {
            $('.movie-list-section').css({
                'top':'910px',
                'transition': 'all .5s'
            })
            $('#arrow-vector').css({
                'transform': 'translate(-50%, -50%) rotate(180deg)',
                'transition': 'all .5s'
            })
        }
    })
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