import {useState} from "react";
import {setData, generateCities, makeDecisions, closeForm} from "../redux/actions";
import {connect} from "react-redux";

const Form = (props) => {
    const [citiesNum, setCitiesNum] = useState(0);
    const [mutationPercent, setMutationPercent] = useState(0);
    const [iterationsNum, setIterationsNum] = useState(0);

    const onCitiesNumChange = (e) => {
        setCitiesNum(e.target.value)
    }

    const onMutationPercentChange = (e) => {
        setMutationPercent(e.target.value)
    }

    const onIterationsNumChange = (e) => {
        setIterationsNum(e.target.value)
    }

    const onFormSubmit = async (event) => {
        event.preventDefault();
        props.closeForm();
        props.setData({citiesNum, mutationPercent, iterationsNum});
        props.generateCities(citiesNum);
    }

    return (
        <div className="App">
            <h1>Please, enter algo data</h1>
            <form className={'form'} onSubmit={(event) => onFormSubmit(event)}>
                <div className="form__field">
                    <label htmlFor={'number-of-cities'}>Number of cities</label>
                    <input id={'number-of-cities'}
                           type={"number"}
                           value={citiesNum}
                           onChange={(event) => onCitiesNumChange(event)}
                    />
                </div>
                <div className="form__field">
                    <label htmlFor={'mutation-percent'}>Mutation percent</label>
                    <input id={'mutation-percent'}
                           type={"number"}
                           value={mutationPercent}
                           onChange={(event) => onMutationPercentChange(event)}
                    />
                </div>
                <div className="form__field">
                    <label htmlFor={'number-of-iterations'}>Number of iterations</label>
                    <input id={'number-of-iterations'}
                           type={'number'}
                           value={iterationsNum}
                           onChange={event => onIterationsNumChange(event)}
                    />
                </div>
                <button className={'form__button'} onClick={(event) => onFormSubmit(event)}>Submit</button>
            </form>
        </div>
    );
}

const mapStateToProps = state => {
    return{
        cities: state.cities
    }
}
export default connect(mapStateToProps, {setData, generateCities, makeDecisions, closeForm})(Form);