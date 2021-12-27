import '../../css/filter-header.css';
import '../../css/app.css';
import {useHistory} from "react-router-dom";

function AdditionalTasksHeader() {
    const history = useHistory();

    function handleDurationClick(evt) {
        evt.preventDefault();
        history.push("/my-app/additional/duration");
    }

    function handleGenreClick(evt) {
        evt.preventDefault();
        history.push("/my-app/additional/genre");
    }

    function handleScreenwriterClick(evt) {
        evt.preventDefault();
        history.push("/my-app/additional/screenwriter");
    }

    return (
        <div className="filter-header base">
            <div className={"tasks-div"}>
                <button id="new-movie-but" onClick={handleGenreClick}>
                    Genre add. task
                </button>
                <button id="new-movie-but" onClick={handleDurationClick}>
                    Orscars add. task
                </button>
                <button id="new-movie-but" onClick={handleScreenwriterClick}>
                    Director add. task
                </button>
            </div>
        </div>
    // <div className="filter-header base">
    //
    // </div>
    );
}

export default AdditionalTasksHeader;
