import React from "react";
const City = ({city}) => {
    return(
        <React.Fragment >
            <circle cx={city.x}
                    cy={city.y}
                    r={5}
                    fill={'black'}
            />
            <text x={+city.x - 5} y={+city.y + 15}>{city.cityNumber}</text>
        </React.Fragment >

    )
}

export default City