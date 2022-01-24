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
    // contentDrag();
    setTimeout(() => {
        if($('.description-par').text().length > 350) {
            // $('.description-par').addClass('fade')
            $('.description-par').addClass('overflow-scroll')
        }
    },100)
    let navBox = $('nav').find('li')
    for(let e = 0; e < navBox.length; e++) {
        navBox[e].addEventListener('click', function(){
            $('nav').find('li').removeClass('active');
            for(let a = 0; a < navBox.length; a++) {
                if(a == e) {
                    navBox[e].classList.add('active');
                    break;
                }
            }
        })
    }
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

function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        randomMovie(data);
        $('.watch').on('click', function(){
            getVideo(data)
        })
    })
}
getMovies(MOST_POPULAR)

let val = new Number;

function randomMovie(data) {
    try {
        val = getRandom(0, 20)
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
        
    }
}

function randomScroll() {
    fetch(THEATRE_URL)
    .then(res => res.json())
    .then(data => {
        for(let i = 0; i < data.results.length; i++) {
            $('.list-section-inner').append(
                `<div class="movie-list item">
                    <div class="img-loader"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 11c.511-6.158 5.685-11 12-11s11.489 4.842 12 11h-2.009c-.506-5.046-4.793-9-9.991-9s-9.485 3.954-9.991 9h-2.009zm21.991 2c-.506 5.046-4.793 9-9.991 9s-9.485-3.954-9.991-9h-2.009c.511 6.158 5.685 11 12 11s11.489-4.842 12-11h-2.009z"/></svg></div>
                    <img src="${'https://image.tmdb.org/t/p/w185' + data.results[i].poster_path}">
                    <span>${data.results[i].original_title}</span>
                </div>`
            )
            $('img').ready(function(){
                $('.img-loader').fadeOut('slow');
            })
            if(data.results[i].original_title.length >= 12){
                let teststr = $('.movie-list').find('span')[i];
                teststr.innerText = teststr.innerText.substring(0, 9) + '...'
            }
        }
        let box = document.querySelectorAll('.movie-list');
        for(let e = 0; e < box.length; e++) {
            box[e].addEventListener('click', function(){
                val = e;
                $('.watch').off('click')
                $('.watch').on('click', function(){
                    getVideo(data);
                })
                $('.movie-list').removeClass('selected');
                $('.movie-list').addClass('item')
                $('body').css({
                    'background' : `radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%), 
                    url(${'https://image.tmdb.org/t/p/original' + data.results[e].poster_path})`,
                    'background-position' : '0 20%',
                    'background-repeat' : 'no-repeat',
                    'background-size' : 'cover'
                })
                $('.stars').attr('style',`--rating: ${data.results[e].vote_average/2};`);
                $('.header').text(data.results[e].original_title)
                $('.genres').empty()
                for(let i = 0; i < data.results[e].genre_ids.length; i++) {
                    $('.genres').append(`<span>${obj[i].name}</span>`)
                }
                $('.description-par').text(data.results[e].overview)
                if($('.description-par').text().length > 350) {
                    $('.description-par').addClass('overflow-scroll')
                } else {
                    $('.description-par').addClass('overflow-scroll')
                }
                for(let a = 0; a < box.length; a++) {
                    if(a == e) {
                        box[e].classList.toggle('selected');
                        box[e].classList.remove('item');
                        break;
                    }
                }
            })
        }
    })
}

function getVideo(data){
    fetch(`${BASE_URL}/movie/${data.results[val].id}/videos?${API_KEY}`).then(res => res.json())
    .then(data => {
       if(data){
           var embed = [];
           data.results.forEach(v => {
               let {name, key, site, type} = v;
               if(site == 'YouTube' && type == 'Trailer') {
                   embed.push(`
                   <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" 
                   title="${name}" frameborder="0" allow="accelerometer; autoplay; 
                   clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                   `)
               }
           })
       }
       $('body').append(`<div class="background-shadow">
       <div class="embed-loader"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 11c.511-6.158 5.685-11 12-11s11.489 4.842 12 11h-2.009c-.506-5.046-4.793-9-9.991-9s-9.485 3.954-9.991 9h-2.009zm21.991 2c-.506 5.046-4.793 9-9.991 9s-9.485-3.954-9.991-9h-2.009c.511 6.158 5.685 11 12 11s11.489-4.842 12-11h-2.009z"/></svg></div>
       <div class="embed-video trailer">${embed[0]}</div>
       </div>`)
       $('embed').ready(function(){
           $('.embed-loader').fadeOut('slow')
       })
       $(document).mouseup(function(e){
            var container = $("embed");
            if (!container.is(e.target) && container.has(e.target).length === 0) 
            {
                $('.background-shadow').remove();
            }
        });
    })
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}