import {SET_COORDINATES, SET_EDITED_COORDINATES} from "../constants/coordinatesActionsConsts";
import {history} from "../components/App";
import {BASE, COORD_SERVLET} from "../constants/backendConstants";
import {convert, options, options1} from "../utils/xmlUtils";
import Notifications from "react-notification-system-redux";
import {serverException} from "../notifications/sendNotification";


export function getSingleCoordinates(id) {
    return (dispatch) => {
        const url = BASE + COORD_SERVLET + "/" + id;
        fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            },
        })
            .then(response => {
                if (!response.ok)
                    throw response;
                return response.text();
            })
            .then(response => {
                console.log("response="+response);

                const result = JSON.parse(response)
                const movie = result;
                dispatch({
                    type: SET_EDITED_COORDINATES,
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

export function getCoordinates() {
    return (dispatch) => {
        const url = BASE + COORD_SERVLET;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            },
        })
            .then(response => {
                console.log(response.status)
                if (!response.ok)
                    throw response;
                return response.text();
            })
            .then(response => {
                console.log("RESPONSE = " + response);
                const convert = require('xml-js');
                const result = JSON.parse(response)
                const coordinates = result.coordinatesList;
                console.log("COORDINATES = " + coordinates);
                dispatch({
                    type: SET_COORDINATES,
                    payload: coordinates
                });
            })
            .catch(error => {
                // error.text().then(errorMessage => {
                //     const convert = require('xml-js');
                //     const result = convert.xml2js(errorMessage, options);
                //     const msg = result.message;
                //     dispatch(Notifications.error(serverException(msg)));
                // })
            });
    }
}

function transferFormDataToCoordinatesDTO(form) {
    let result = {};
    result.id = form.id;
    result.x = form.x;
    result.y = form.y;
    return result;
}

export function updateCoordinates(movie, id) {
    console.log(movie);
    //let xml = convert.js2xml(transferFormDataToCoordinatesDTO(movie), options1);
    let body = transferFormDataToCoordinatesDTO(movie)
    console.log("XML = " + body);
    return (dispatch) => {
        //alert(JSON.stringify(body))
        const url = BASE + COORD_SERVLET;
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
                //history.push("/my-app/edit/" + id);
                history.push("/my-app/");
                window.location.reload(false);
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

export function createCoordinates(coordinates, id) {
    console.log(coordinates);
    //let xml = convert.js2xml(transferFormDataToCoordinatesDTO(movie), options1);
    let body = {
        coordinatesList : [transferFormDataToCoordinatesDTO(coordinates)]
    }
    return (dispatch) => {
        //alert(JSON.stringify(body))
        const url = BASE + COORD_SERVLET;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok)
                    throw response;
                //history.push("/my-app/edit/" + id);
                history.push("/my-app");
                window.location.reload(false);
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