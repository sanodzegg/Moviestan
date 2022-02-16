const API_KEY = 'api_key=da0ec74f280b41c3b79d45fa4cd12578';
const BASE_URL = 'https://api.themoviedb.org/3';
const MOST_POPULAR = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const POSTER_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';
const THEATRE_URL = BASE_URL + `/discover/movie?primary_release_date.gte=2020-01-01&primary_release_date.lte=${currentDate()}&` + API_KEY;

$(document).ready(function(){
    $('.main-loader').fadeOut("slow");
    let content = {
        0: {
            loader : $('.main-loader').prop('outerHTML'),
            mainSect : $('.main-section').html(),
            moviescroll : $('.movie-list-section').html()
        }
    }
    getMovies(MOST_POPULAR)
    randomScroll();
    // contentDrag();
    setTimeout(() => {
        if($('.description-par').text().length > 350) {
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
    $('#searchField').keyup(function(){
        search();
        if($('#searchField').val().length == 0) {
            $('.search-results').text('')
        }
    })

    // navigation
    function navigation() {
        let nav = $('li');
        for(let i = 0; i < nav.length; i++) {
            nav[i].addEventListener('click', function(){
                if(i == 0) {
                    $('body').css('height','100vh')
                    $('body').append(`${content[0].loader}`);
                    $('nav').css({
                        'background':'transparent',
                        'box-shadow':'unset',
                        'border-bottom':'1px solid #56626D'
                    })
                    $('.main-loader').fadeOut("slow");
                    $('.main-section').html(`${content[0].mainSect}`);
                    $('.movie-list-section').show();
                    $('.movie-list-section').html(`${content[0].moviescroll}`);
                    getMovies(MOST_POPULAR)
                    randomScroll();
                    setTimeout(() => {
                        if($('.description-par').text().length > 350) {
                            $('.description-par').addClass('overflow-scroll');
                        }
                    },100)
                    $(this).css('pointer-events','none');
                } else {
                    $('.main-loader').remove();
                    $('body').css('background', 'none');
                    $('section').html('');
                    $('.movie-list-section').hide();
                    $(nav[0]).css('pointer-events','all');
                }
                if(i == 1) {
                    $('body').css({
                        'background':'#0B0B10',
                        'overflow-y':'scroll',
                        'height':'100%'
                    });
                    $('body').append('<section role="Film poster and description" class="shows-main-grid"></section>')
                    getShows(getRandom(1, 20)); // must be greater than 0;
                    $(this).css('pointer-events','none');
                    $('body').append('<button class="load-content-btn">see more</button>')
                    $('.load-content-btn').on('click', function(){
                        getShows(getRandom(1, 20))
                        $('.load-content-btn').text('see all');
                        if($('.load-content-btn').text() == 'see all') {
                            $('.load-content-btn').on('click', function(){
                                for(let i = 1; i <= 5; i++) {
                                    getShows(i)
                                }
                                $('.load-content-btn').remove();
                            })
                        }
                    })
                } else {
                    $('.shows-main-grid').remove();
                    $(nav[1]).css('pointer-events','all');
                    $('.load-content-btn').remove();
                }
                if(i == 2) {
                    $('body').css({
                        'background':'#0B0B10',
                        'overflow-y':'scroll',
                        'height':'100%'
                    });
                    $('nav').css({
                        'background':'#13131A',
                        'box-shadow':'0 0px 10px #00000081',
                        'border-bottom':'none'
                    })
                    getMovQuerries(3);
                    $(nav[2]).css('pointer-events','none');
                } else {
                    $(nav[2]).css('pointer-events','all');
                    $('.movie-quarry').remove();
                }
            })
        }
    }
    navigation();
});

function getConf() {
    fetch('https://api.themoviedb.org/3/configuration?api_key=da0ec74f280b41c3b79d45fa4cd12578')
    .then(res=> res.json())
    .then(data => {
        // console.log(data);
    })
}
getConf()

let obj = {};

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
        randomMovie(data.results);
        $('.watch').on('click', function(){
            getVideo(data)
        })
    })
}

let val = new Number;

function randomMovie(data) {
    try {
        val = getRandom(0, 20)
        $('body').css({
            'background' : `radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%), url(${BACKDROP_URL + data[val].backdrop_path})`,
            'background-position' : 'center',
            'background-repeat' : 'no-repeat',
            'background-size' : 'cover'
        })
        $('.header').text(data[val].original_title)
        $('.stars').attr('style',`--rating: ${data[val].vote_average/2};`);
        for(let i = 0; i < data[val].genre_ids.length; i++) {
            $('.genres').append(`<span>${obj[i].name}</span>`)
        }
        $('.description-par').text(data[val].overview)
    } catch (err) {
        // console.error(err);
    }
}

async function randomScroll() {
    let res = await fetch(THEATRE_URL);
    let data = await res.json();
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
            let str = $('.movie-list').find('span')[i];
            str.innerText = str.innerText.substring(0, 9) + '...'
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
}

function getVideo(data){
    fetch(`${BASE_URL}/movie/${data.results[val].id}/videos?${API_KEY}`).then(res => res.json())
    .then(data => {
       if(data){
        try {
            var embed = [];
            data.results.forEach(v => {
                let {name, key, site, type} = v;
                if(site == 'YouTube' && type == 'Trailer') {
                    embed.push(`
                    <iframe src="https://www.youtube.com/embed/${key}" 
                    title="${name}" frameborder="0" allow="accelerometer; autoplay; 
                    clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    `)
                }
            })
        } catch(err) {
            console.error(err);
        }
       }
       $('body').append(`<div class="background-shadow">
        <div class="embed-loader"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 11c.511-6.158 5.685-11 12-11s11.489 4.842 12 11h-2.009c-.506-5.046-4.793-9-9.991-9s-9.485 3.954-9.991 9h-2.009zm21.991 2c-.506 5.046-4.793 9-9.991 9s-9.485-3.954-9.991-9h-2.009c.511 6.158 5.685 11 12 11s11.489-4.842 12-11h-2.009z"/></svg></div>
        <div class="embed-video trailer">${embed[0]}</div>
       </div>`)
       $('embed').ready(function(){
           $('.embed-loader').fadeOut('slow')
       })
       $(document).mouseup(function(e){
            let container = $("embed");
            if (!container.is(e.target) && container.has(e.target).length === 0) 
            {
                $('.background-shadow').remove();
            }
        });
    })
}

async function search(){
    let term = $('#searchField').val()
    let res = await fetch(`${BASE_URL}/search/movie?${API_KEY}&query=${term}`);
    let data = await res.json();
    try{
        for(let i = 0; i < 5; i++){
            $('.search-results').append(
                `<div>
                    <h5>${data.results[i].original_title}</h5>
                    <img class="search-poster" src="https://image.tmdb.org/t/p/w92${data.results[i].backdrop_path}"></img>
                </div>`
            )
            if($('.search-results').children().length > 5) {
                $('.search-results').children()[i].remove();
            }
        };
    } catch(err) {

    }

    $(document).mouseup(function(e){
        let container = $('.search-results');
        if(!container.is(e.target) && container.has(e.target).length === 0) 
        {
            $('.search-results').text('');
        }
    });
}


async function getShows(page) {
    let res = await fetch(`${BASE_URL}/tv/popular?${API_KEY}&page=${page}`)
    let data = await res.json();
    data.results.forEach(show => {
        let {name, backdrop_path} = show;
        generateShows(name, backdrop_path, 'shows-main-grid');
        $('img').ready(function(){
            $('.img-loader').fadeOut('slow')
        })
        $('.shows-main-grid').mouseup(function(e){
            let container = $('.settings-menu');
            if(!container.is(e.target) && container.has(e.target).length === 0) 
            {
                $('.settings-menu').removeClass('focused');
            }
        });
    });
    $('img').on('error', function(){
        $(this).attr('src', './media/jpg/error-image.jpg');
    })
    $('.settings').on('click', function(){
        $(this).children($('.settings-menu')).toggleClass('focused');
        $(this).find('.inner-loader').fadeOut('slow');
    })
}

async function getMovQuerries(page) {
    $(`
    <div class="movie-quarry">
        <div class="filter-wrapper">
            <div class="genre-list">
                
            </div>
            <div class="filters-applied">
                <select name="filter" id="filter" class="unfiltered">
                    <option value="default" selected disabled hidden>Select</option>
                    <option value="vote_avg">IMDB Rating</option>
                    <option value="popularity">Popularity</option>
                </select>
            </div>
        </div>
    </div>
    `
    ).insertBefore('.main-section');
    for(let i = 0; i < Object.keys(obj).length; i++) {
        $('.genre-list').append(`<span class="filter-genre">${obj[i].name}</span>`)
    }
    let fbox = $('.filter-genre');
    let filterarr = [];
    let cache = new String;
    for(let i = 0; i < fbox.length; i++) {
        fbox[i].addEventListener('click', function(){
            $(this).toggleClass('active');
            if($(this).hasClass('active')){
                filterarr.push(obj[i].id)
            } else {
                filterarr.splice(filterarr.indexOf(obj[i].id), 1)
            }
            $('#filter').attr('class', 'filtered');
            fetch(`${BASE_URL}/movie/popular?${API_KEY}&page=${3}&with_genres=${filterarr.join(',')}`)
            .then(res => res.json()).then(data => {
                for(let e = 0; e < $('.movie-wrapper-flex').length; e++) {
                    if($('.filter-genre').hasClass('active')){
                        $('.movie-wrapper-flex').remove();
                    }
                }
                if(data.results.length != 0) {
                    for(let i = 0; i < 3; i++) {
                        $('.movie-quarry').append('<div class="movie-wrapper-flex"></div>');
                    }
                    for(let d = 0; d < data.results.length; d++) {
                        if(data.results[d].title.length > 21) {
                            data.results[d].title = `${data.results[d].title.slice(0, 20)}...`;
                        };
                        generateShows(data.results[d].title, data.results[d].backdrop_path, 'movie-wrapper-flex');
                    }
                    $('img').on('error', function(){
                        $(this).attr('src', './media/jpg/error-image.jpg');
                    })
                    $('.settings').on('click', function(){
                        $(this).children($('.settings-menu')).toggleClass('focused');
                        $(this).find('.inner-loader').fadeOut('slow');
                    })
                    $('.snap').remove()
                } else {
                    $('.snap').remove()
                    $('.movie-wrapper-flex').remove();
                    $('.movie-quarry').append(
                        `<div class="snap">
                            <img src="./media/svg/generic/error-icon.svg" alt="snap-img">
                            <p>Oops! Something went wrong...</p>
                        </div>`
                    )
                }
            })
            if(filterarr.length == 0) {
                $('#filter').attr('class', 'unfiltered');
                $('.movie-wrapper-flex').remove();
                $('.movie-quarry').append(cache);
                $('img').ready(function(){
                    $('.img-loader').fadeOut('slow')
                });
                $('.movie-quarry').mouseup(function(e){
                    let container = $('.settings-menu');
                    if(!container.is(e.target) && container.has(e.target).length === 0) 
                    {
                        $('.settings-menu').removeClass('focused');
                    }
                });
                $('img').on('error', function(){
                    $(this).attr('src', './media/jpg/error-image.jpg');
                })
                $('.settings').on('click', function(){
                    $(this).children($('.settings-menu')).toggleClass('focused');
                    $(this).find('.inner-loader').fadeOut('slow');
                })
            }
        });
    }
    let once = 0;
    for(let i = 1; i <= page; i++) {
        let res = await fetch(`${BASE_URL}/movie/popular?${API_KEY}&page=${i}`)
        let data = await res.json();
        $('.movie-quarry').append('<div class="movie-wrapper-flex"></div>')
        data.results.forEach(movie => {
            let {title, backdrop_path} = movie;
            if(once == 0) {
                $('#filter').on('change', function(){
                    if(filterarr.length > 0) {
                        $('.movie-wrapper-flex').remove();
                        filtered(
                            `${BASE_URL}/movie/popular?sort_by=vote_average.desc&${API_KEY}&vote_count.gte=120&page=${3}&with_genres=${filterarr.join(',')}`,
                            `${BASE_URL}/movie/popular?sort_by=popularity.desc&${API_KEY}&vote_count.gte=120&page=${3}&with_genres=${filterarr.join(',')}`
                        );
                    } else {
                        $('.movie-wrapper-flex').remove();
                        filtered(
                            `${BASE_URL}/movie/popular?sort_by=vote_average.desc&${API_KEY}&vote_count.gte=120&page=${1}`,
                            `${BASE_URL}/movie/popular?sort_by=popularity.desc&${API_KEY}&vote_count.gte=120&page=${1}`
                        );
                    }
                })
                once = 1;
            }
            if(title.length > 21) {
                title = `${title.slice(0, 20)}...`;
            }
            generateShows(title, backdrop_path, 'movie-wrapper-flex');
            $('img').ready(function(){
                $('.img-loader').fadeOut('slow')
            })
            $('.movie-quarry').mouseup(function(e){
                let container = $('.settings-menu');
                if(!container.is(e.target) && container.has(e.target).length === 0) 
                {
                    $('.settings-menu').removeClass('focused');
                }
            });
        });
        cache = $('.movie-wrapper-flex').prop('outerHTML');
        $('.settings').on('click', function(){
            $(this).children($('.settings-menu')).toggleClass('focused');
            $(this).find('.inner-loader').fadeOut('slow');
        })
    }
    function filtered(avgurl, popurl) {
        if($('#filter').val() == 'vote_avg') {
            $('.movie-wrapper-flex').remove();
            fetch(avgurl).then(res => res.json())
            .then(data => {
                for(let i = 0; i < 3; i++) {
                    $('.movie-quarry').append('<div class="movie-wrapper-flex"></div>');
                }
                for(let d = 0; d < data.results.length; d++) {
                    if(data.results[d].title.length > 21) {
                        data.results[d].title = `${data.results[d].title.slice(1, 21)}...`;
                    };
                    generateShows(data.results[d].title, data.results[d].backdrop_path, 'movie-wrapper-flex');
                }
                $('img').on('error', function(){
                    $(this).attr('src', './media/jpg/error-image.jpg');
                })
                $('.settings').on('click', function(){
                    $(this).children($('.settings-menu')).toggleClass('focused');
                    $(this).find('.inner-loader').fadeOut('slow');
                })
            });   
        } else if ($('#filter').val() == 'popularity') {
            $('.movie-wrapper-flex').remove();
            fetch(popurl).then(res => res.json())
            .then(data => {
                for(let i = 0; i < 3; i++) {
                    $('.movie-quarry').append('<div class="movie-wrapper-flex"></div>');
                }
                for(let d = 0; d < data.results.length; d++) {
                    if(data.results[d].title.length > 21) {
                        data.results[d].title = `${data.results[d].title.slice(1, 21)}...`;
                    };
                    generateShows(data.results[d].title, data.results[d].backdrop_path, 'movie-wrapper-flex');
                }
                $('img').on('error', function(){
                    $(this).attr('src', './media/jpg/error-image.jpg');
                })
                $('.settings').on('click', function(){
                    $(this).children($('.settings-menu')).toggleClass('focused');
                    $(this).find('.inner-loader').fadeOut('slow');
                })
            });
        };
    }
}


function generateShows(n, bp, d) {
    $(`.${d}`).append(`
    <div class="show-block">
        <div class="img-container">
            <div class="img-loader"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 11c.511-6.158 5.685-11 12-11s11.489 4.842 12 11h-2.009c-.506-5.046-4.793-9-9.991-9s-9.485 3.954-9.991 9h-2.009zm21.991 2c-.506 5.046-4.793 9-9.991 9s-9.485-3.954-9.991-9h-2.009c.511 6.158 5.685 11 12 11s11.489-4.842 12-11h-2.009z"/></svg></div>
            <div class="img-container-shade"></div>
            <div class="hover-control-buttons">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z"/></svg>
            </div>
            <img src="${'https://image.tmdb.org/t/p/w300'+ bp}">
        </div>
        <div class="title-space">
        <h6>${n}</h6>
        <div class="settings">
        <div class="settings-menu">
            <div class="inner-loader">
                <div class="settings-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
            <ul>
                <li><img src="./media/svg/generic/favorites-icon.svg" alt="favourites icon"><span>Add to favourites</span></li>
                <li><img src="./media/svg/generic/list-icon.svg" alt="watch later icon"><span>Add to watch later</span></li>
                <li><img src="./media/svg/generic/share-icon.svg" alt="share icon"><span>Share</span></li>
                <li><img src="./media/svg/generic/subscribe-icon.svg" alt="subscribe icon"><span>Subscribe</span></li>
            </ul>
        </div>
        •••</div>
    </div>
    </div>
`)
$('img').ready(function(){
    $('.img-loader').fadeOut('slow')
})
};

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function currentDate(date) {
    date = new Date();
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    date = `${yyyy}-${mm}-${dd}`;
    return date
}
