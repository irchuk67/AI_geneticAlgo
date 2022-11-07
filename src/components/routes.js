import React, {Component, useEffect} from "react";
import {connect} from "react-redux";
import {drawNewDecisions, newGenerationCreate, incrementIterationsNumber} from "../redux/actions";
import routes from "./routes";

class Routes extends Component{
    state = {
        routes: []
    }


    createNewGeneration = () => {
        if(this.props.iterations < this.props.data.iterationsNum - 1){
            this.props.newGenerationCreate(this.props.decisions, this.props.data.citiesNum, this.props.data.mutationPercent)
            this.props.incrementIterationsNumber();
        }
    }

    componentDidMount() {
        console.log(this.props.iterations < this.props.data.iterationsNum)
        if(this.props.iterations < this.props.data.iterationsNum){
            this.interval = setInterval( this.createNewGeneration , 1000 )
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.decisions !== this.props.decisions){
            if(this.props.decisions.length !== 0){
                this.props.drawNewDecisions(this.props.decisions);
            }
        }
        if(prevProps.routes !== this.props.routes){
           this.setState({routes : this.props.routes.map(route => route)})
        }

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return(
            <React.Fragment>
                {this.state.routes}
            </React.Fragment>
        )
    }



}

const mapStateToProps = (state) => {
    return {
        decisions: state.decisions,
        routes: state.routes,
        data: state.data,
        iterations: state.iterations
    }
}

export default connect(mapStateToProps, {drawNewDecisions, newGenerationCreate, incrementIterationsNumber})(Routes)