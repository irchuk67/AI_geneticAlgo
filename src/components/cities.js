import React, {useEffect} from "react";
import {connect} from "react-redux";
import {drawCities} from "../redux/actions";

const Cities = (props) => {
    useEffect(() => {
        props.drawCities(props.cities)
    }, [])

    const dots = props.dots.map(dot => dot)
    return (
        <React.Fragment>
            {dots}
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return (
        {
            cities: state.cities,
            dots: state.dots
        }
    )

}
export default connect(mapStateToProps, {drawCities})(Cities)