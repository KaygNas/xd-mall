import "./SearchBox.scss";
function SearchBox(props) {
    return (
        <div className="search-box">
            <input className="search-box__input"></input>
            <button className="search-box__btn btn-2">{props.searchBtnText}</button>
        </div>
    )
}

export default SearchBox;