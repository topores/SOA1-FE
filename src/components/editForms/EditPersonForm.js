import React, {useEffect} from 'react'
import {Field, reduxForm} from 'redux-form'
import '../../css/app.css';
import '../../css/edit-form.css';
import {useDispatch, useSelector} from "react-redux";
import {renderedInputField} from "../customFormComponents/rendetedInputField";
import {colors} from "../../constants/enumConstants";
import {getSinglePerson} from "../../actions/personsActions";
import {getLocations} from "../../actions/locationsActions";
import {useHistory} from "react-router-dom";

const EditPersonForm = (props) => {
    const {handleSubmit, pristine, reset, submitting, id} = props
    const dispatch = useDispatch();
    const person = useSelector(state => state.person.editedPerson);
    const locationList = useSelector(state => state.location.locationsList)
    const history = useHistory();

    useEffect(() => {
        dispatch(getSinglePerson(id));
        dispatch(getLocations());
    }, []);

    useEffect(() => {
        props.reset();
        props.initialize({
            id: person.id,
            name: person.name,
            weight: person.weight,
            eyeColor: person.eyeColor,
            birthday: person.birthday,
            locations: person.location.id
        });
    }, [person, locationList])

    function handleEditLocationSubmit(evt) {
        evt.preventDefault();
        let element = document.getElementById("locations");
        history.push("/my-app/location/edit/" + element.value);
    }

    function handleCreateLocationSubmit(evt) {
        evt.preventDefault();
        history.push("/my-app/location/new");
    }

    return (
        <form onSubmit={handleSubmit} id={"movie-form"}>
            <div className={"movie-form"}>
                <h3>Director</h3>
                <div className="label">Location name</div>

                <div className={"buttons-div"}>
                    <Field name="locations" id="locations"
                           component="select" label="Coordinates">
                        {locationList.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </Field>
                    <button id={"location-form-but"} onClick={handleEditLocationSubmit}>Edit</button>
                    <button id={"location-form-but"} onClick={handleCreateLocationSubmit}>Create</button>
                </div>
                <Field name="name" type="text"
                       component={renderedInputField} label="Name"
                    /* validate={[required]}*/
                />
                <Field name="weight" type="number"
                       component={renderedInputField} label="Weight"
                    /* validate={[required]}*/
                />

                <Field name="eyeColor" type="text"
                       component={renderedInputField} label="Passport ID">
                </Field>
                <Field name="birthday" type="text"
                       component={renderedInputField} label="Birthday">
                </Field>
                <div>
                    <button id="edit-form-but" disabled={submitting}>Submit</button>
                </div>
            </div>

        </form>
    )
}

export default reduxForm({
    form: 'edit-person-form',
    keepDirtyOnReinitialize: true
})(EditPersonForm)