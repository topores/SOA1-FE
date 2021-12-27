import {history} from "../components/App";
import {BASE, PERSON_SERVLET} from "../constants/backendConstants";
import {convert, options, options1} from "../utils/xmlUtils";
import {SET_EDITED_PERSON, SET_PERSONS} from "../constants/personActionsConsts";
import Notifications from "react-notification-system-redux";
import {serverException} from "../notifications/sendNotification";


export function getSinglePerson(id) {
    return (dispatch) => {
        const url = BASE + PERSON_SERVLET + "/" + id;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            },
        })
            .then(response => {
                console.log("STATUS " + response.status);
                if (!response.ok)
                    throw response;
                return response.text();
            })
            .then(response => {
                console.log(response)
                const result = JSON.parse(response)
                let movie = result;
                movie.eyeColor=movie.passportID;
                //alert(JSON.stringify(movie))
                dispatch({
                    type: SET_EDITED_PERSON,
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

export function getPerson() {
    return (dispatch) => {
        const url = BASE + PERSON_SERVLET;
        fetch(url, {
            method: 'GET',
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
                console.log(response)

                const result = JSON.parse(response)
                //console.log("DDD: "+JSON.stringify(result.personsList))
                let coordinates = result.personsList;

                dispatch({
                    type: SET_PERSONS,
                    payload: coordinates
                });
                //console.log("DDD2: "+JSON.stringify(result.personsList))
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

function transferFormDataToCoordinatesDTO(form) {
    let result = {};
    result.id = form.id;
    result.name = form.name;
    result.weight = form.weight;
    result.passportID = form.eyeColor;
    result.birthday = form.birthday;
    result.location = {};
    result.location.id = form.locations;
    return result;
}

export function updatePerson(movie, id) {
    //let xml = convert.js2xml(transferFormDataToCoordinatesDTO(movie), options1);
    let body = transferFormDataToCoordinatesDTO(movie)
    console.log("XML = " + body);
    return (dispatch) => {
        const url = BASE + PERSON_SERVLET;
        //alert(JSON.stringify(body))
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

export function createPerson(coordinates, id) {
    let body = {
        personsList : [transferFormDataToCoordinatesDTO(coordinates)]
    }
    console.log("XML = " + body);
    return (dispatch) => {
        const url = BASE + PERSON_SERVLET;
        //alert(JSON.stringify(body))
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