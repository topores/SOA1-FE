import {history} from '../components/App.js';
import {DELETE_MOVIE, SET_ITEM_COUNT} from "../constants/pageActionsConsts";
import {SET_EDITED_MOVIE, SET_MOVIES} from "../constants/movieActionsConsts";
import {COORDINATE, DATE, DURATION, GENRE, ID, NAME, OSCAR, RATING, WRITER} from "../constants/filterConstants";
import {BASE, MOVIE_SERVLET} from "../constants/backendConstants";
import {convert, options, options1} from "../utils/xmlUtils";
import Notifications from 'react-notification-system-redux';
import {serverException} from "../notifications/sendNotification";


function parseSortByParameter(criteria) {
    if (criteria.length === 0) {
        return "";
    }
    let result = "&sortBy=";
    for (const criterion of criteria) {
        result = result + criterion + ";";
    }
    return result.substring(0, result.length - 1);
}

function parseFilters(filters) {
    if (filters.length === 0) {
        return "";
    }
    let result = "&filterBy=";
    for (const filter of filters) {
        switch (filter.name) {
            case ID:
                result = result + ID + "," + filter.from + "," + filter.to + ";"
                break;
            case NAME:
                result = result + NAME + "," + filter.like + ";"
                break;
            case OSCAR:
                result = result + OSCAR + "," + filter.from + "," + filter.to + ";"
                break;
            case DURATION:
                result = result + DURATION + "," + filter.from + "," + filter.to + ";"
                break;
            case RATING:
                result = result + RATING + "," + filter.like + ";"
                break;
            case GENRE:
                result = result + GENRE + "," + filter.like + ";"
                break;
            case DATE:
                result = result + DATE + "," + filter.from + "," + filter.to + ";"
                break;
            case WRITER:
                result = result + WRITER + "," + filter.like + ";"
                break;
            case COORDINATE:
                result = result + COORDINATE + "," + filter.xfrom + "," + filter.xto + "," + filter.yfrom + "," + filter.yto + ";"
                break;
            default:
                break;
        }
    }
    return result.substring(0, result.length - 1);
}

export function getMovies(page) {
    let perPage = page.perPage;
    let curPage = page.currentPage;
    let sortBy = parseSortByParameter(page.sortBy);
    let filterBy = parseFilters(page.filters)
    return (dispatch) => {
        const url = BASE + MOVIE_SERVLET +
            "?perPage=" + perPage + "" +
            "&curPage=" + curPage +
            sortBy +
            filterBy;
        fetch(url, {
            method: 'GET',
            headers: {
                //'Content-Type': 'application/xml; charset=utf-8'
            },
        })
            .then(response => {
                //console.log(response)
                //alert(response.text())
                if (!response.ok) {
                    throw response;
                } else return response.text();
            })
            .then(response => {
                //const convert = require('xml-js');
                //const result = JSON.parse(response)
                const result = JSON.parse(response)
                //console.log(result)
                // alert(response)
                // alert(result.movieList)

                const count = result.count;
                const movies = result.movieList;
                dispatch({
                    type: SET_MOVIES,
                    payload: movies
                });
                dispatch({
                    type: SET_ITEM_COUNT,
                    payload: count
                });
            })
            .catch(error => {
                //alert(error.text)
                error.text()
                    .then(errorMessage => {
                        //const convert = require('xml-js');
                        //const result = JSON.parse(response)
                        const result = JSON.parse(errorMessage)
                        const msg = result.message;
                        dispatch(Notifications.error(serverException(msg)));
                    })
            });
    }
}


export function deleteMovie(id) {
    return (dispatch) => {
        const url = BASE + MOVIE_SERVLET + "/" + id;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            },
        })
            .then(response => {
                if (!response.ok)
                    throw response;
                else {
                    dispatch({type: DELETE_MOVIE});
                }
            })
            .catch(error => {
                error.text()
                    .then(errorMessage => {
                        //const convert = require('xml-js');
                        //const result = JSON.parse(response)
                        const result = JSON.parse(errorMessage)
                        const msg = result.message;
                        dispatch(Notifications.error(serverException(msg)));
                    })
            });
    }
}

export function updateMovie(movie) {
    //let xml = convert.js2xml(transferFormDataToMovieDTO(movie), options1);
    //let json = JSON.stringify(transferFormDataToMovieDTO(movie));
    // let body = {
    //     movieList : [transferFormDataToMovieDTO(movie)]
    // }
    let body = transferFormDataToMovieDTO(movie)
    console.log("XML = " + JSON.stringify(body));
    //alert(JSON.stringify(body))
    return (dispatch) => {
        const url = BASE + MOVIE_SERVLET+body.id;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok)
                    throw response;
                history.push("/my-app");
                window.location.reload(false);
            })
            .catch(error => {
                error.text()
                    .then(errorMessage => {
                        //const convert = require('xml-js');
                        //const result = JSON.parse(response)
                        const result = JSON.parse(errorMessage)
                        const msg = result.message;
                        dispatch(Notifications.error(serverException(msg)));
                    })
            });
    }
}

function transferFormDataToMovieDTO(form) {
    let result = {};
    result.id = form.id;
    result.name = form.name;
    result.creationDate = form.duration;
    result.genre = form.genre;
    result.mpaaRating = form.mpaaRating;
    result.oscarsCount = form.oscarsCount;
    result.coordinates = {};
    result.coordinates.id = form.coordinates;
    result.director = {};
    result.director.id = form.screenwriter;
    result.director.location = {};
    result.director.location.id = form.locations;
    return result;
}

export function createMovie(movie) {
    let body = {
        movieList : [transferFormDataToMovieDTO(movie)]
    }
    console.log("XML = " + body);
    return (dispatch) => {
        const url = BASE + MOVIE_SERVLET;
        //alert(JSON.stringify(body))
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok) {
                    throw response;
                } else {
                    history.push("/my-app");
                    window.location.reload(false);
                }
            })
            .catch(error => {

                error.text().then(errorMessage => {
                    const result = JSON.parse(errorMessage)
                    const msg = result.message;
                    dispatch(Notifications.error(serverException(msg)));
                })
            });
    }
}

export function getSingleMovie(id) {
    return (dispatch) => {
        const url = BASE + MOVIE_SERVLET + "/" + id;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            },
        })
            .then(response => {
                console.log("STATUS " + response.status)
                if (!response.ok)
                    throw response;
                return response.text();
            })
            .then(response => {
                console.log(response)
                const result = JSON.parse(response)
                const msg = result.message;
                //dispatch(Notifications.error(serverException(msg)));
                let movie = result;
                movie.duration=movie.creationDate;// = result.movieList[0];

                dispatch({
                    type: SET_EDITED_MOVIE,
                    payload: movie
                });
            })
            .catch(error => {
                error.text().then(errorMessage => {
                    const result = JSON.parse(errorMessage)
                    const msg = result.message;
                    dispatch(Notifications.error(serverException(msg)));
                })
            });
    }
}


