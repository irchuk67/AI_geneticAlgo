import {connect} from "react-redux";
import {makeDecisions, newGenerationCreate} from "../redux/actions";
import Cities from "./cities";
import {useEffect} from "react";
import Routes from "./routes";

const Action = (props) => {
    useEffect( () => {
        const makeDecisions = async () => await props.makeDecisions(props.cities);
        makeDecisions()
    }, [])

    return (
            <div>
                {(props.decisions.length !== 0) ? <h1>Best distance: {props.decisions[0].distance}</h1> : null}
                <svg height={window.innerHeight - 5} width={window.innerWidth - 5}>
                    <Cities/>
                    <Routes/>
                </svg>
            </div>

        )
    }

    const mapStateToProps = (state) => {
        return (
            {
                cities: state.cities,
                data: state.data,
                decisions: state.decisions,
                lines: state.lines,
                iterations: state.iterations
            }
        )

    }
    export default connect(mapStateToProps, {makeDecisions, newGenerationCreate})(Action)