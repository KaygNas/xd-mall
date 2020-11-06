import React from "react";
import "./Content.scss"

function Content(props) {
    return (
        <main
            className={"content-wraper " + (props.isfolded ? "fold" : "")}
        >
            {props.children}
        </main>
    );
}

export default Content;