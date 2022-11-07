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
                <svg height={window.innerHeight} width={window.innerWidth}>
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
                lines: state.lines
            }
        )

    }
    export default connect(mapStateToProps, {makeDecisions, newGenerationCreate})(Action)