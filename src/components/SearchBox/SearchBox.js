import { useRef } from "react";
import "./SearchBox.scss";
function SearchBox({ btnText, fn }) {
    const input = useRef()
    const onClick = (e) => {
        const value = input.current.value
        fn(value)
    }

    return (
        <div className="search-box">
            <input ref={input} className="search-box__input"></input>
            <button
                className="search-box__btn btn-2"
                onClick={onClick}
            >{btnText}</button>
        </div>
    )
}

export default SearchBox;