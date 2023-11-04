import React from "react";
import ReactDOM from "react-dom" 

const ContentPopOver = () => {
    return(
        <div>
            <p>huhu</p>
        </div>
    )
}

const PopOver = () => {
    return(
        <React.Fragment>
            {ReactDOM.createPortal(<ContentPopOver />, document.getElementById('popover-cart'))}
        </React.Fragment>
    )
}

export default PopOver;