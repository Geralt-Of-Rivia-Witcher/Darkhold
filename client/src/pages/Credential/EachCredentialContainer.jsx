import React from "react";

function EachCredentialContainer(props) {
    return (
        <div className="each-credential-container">
            <h3 className="each-credential-platfrom">{props.platform}</h3>
        </div>
    );
}

export default EachCredentialContainer;
