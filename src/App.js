import './App.scss';
import Form from "./components/form";
import Action from "./components/action";
import {connect} from "react-redux";
import {useState} from "react";

const App = (props) => {
    const [hadGenerationsGenerated, setGenerationGenerated] = useState(false);
    const makeAllGenerations = () => setGenerationGenerated(true)
    return(
        <div>
            {!props.isFormOpen && <Action hadGenerationsGenerated={hadGenerationsGenerated} makeAllGenerations={makeAllGenerations}/>}
            {props.isFormOpen && <Form/>}
        </div>

    )
}

const mapStateToProps = state => {
    return{
        isFormOpen: state.isFormOpen
    }
}
export default connect(mapStateToProps)(App);
