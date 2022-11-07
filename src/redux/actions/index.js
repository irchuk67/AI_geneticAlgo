import {
    ADD_NEW_ITERATION,
    ADD_NEW_LINES,
    CLOSE_FORM, DRAW_CITIES, DRAW_ROUTES,
    GENERATE_CITIES,
    GENERATE_NEW_GENERATION,
    MAKE_DECISIONS,
    OPEN_FORM,
    SET_DATA
} from "../types";
import City from "../../components/city";
import React from "react";

const setData = (data) => {
    return {
        type: SET_DATA,
        payload: data
    }
}

const generateCities = (citiesNumber) => {
    const cities = []
    while (citiesNumber > 0) {
        let x = (Math.random() * (window.innerWidth - 12)).toFixed(2);
        let y = (Math.random() * (window.innerHeight - 20)).toFixed(2);
        cities.push({x: x, y: y, cityNumber: citiesNumber})
        citiesNumber--;
    }
    return {
        type: GENERATE_CITIES,
        payload: cities
    }
}

const countDistance = (city1, city2) => {
    return Math.sqrt(Math.pow((city2.x - city1.x), 2) + Math.pow((city2.y - city1.y), 2))
}

const makeDecision = (citiesArr) => {
    let decision = {cities: [], distance: 0}
    let cities = [...citiesArr];
    while (cities.length > 0) {
        let randomIndex = Math.floor(Math.random() * (cities.length))
        if (!decision.cities.includes(cities[randomIndex]) || cities[randomIndex] !== undefined) {
            decision.cities.push(cities[randomIndex])
            cities.splice(randomIndex, 1)
        }

    }

    for (let i = 0; i < decision.cities.length; i++) {
        if (i !== 0) {
            decision.distance += countDistance(decision.cities[i], decision.cities[i - 1])
        }
    }
    decision.distance += countDistance(decision.cities[0], decision.cities[decision.cities.length - 1])

    return decision
}

const makeDecisions = (cities) => {
    let decisions = [];

    for (let i = 0; i < 30; i++) {
        let currentCities = [...cities];
        let decision = makeDecision(currentCities);
        decisions.push(decision);
    }
    return {
        type: MAKE_DECISIONS,
        payload: decisions
    }
}

const sortByDistance = (x, y) => {
    if (x.distance > y.distance) return 1;
    if (x.distance < y.distance) return -1;
    else return 0;
}

const selectParents = (decisions) => {
    let parents = [];
    const sortedDecisions = decisions.sort(sortByDistance);
    const firstParentIndex = Math.floor(Math.random() * (decisions.length - 1));
    parents.push(sortedDecisions[firstParentIndex]);

    if(firstParentIndex !== 0){
        if (Math.abs(sortedDecisions[firstParentIndex].distance - sortedDecisions[firstParentIndex + 1].distance) < Math.abs(sortedDecisions[firstParentIndex].distance - sortedDecisions[firstParentIndex - 1].distance )) {
            parents.push(sortedDecisions[firstParentIndex + 1]);
            decisions.splice(decisions.findIndex(el => el === sortedDecisions[firstParentIndex + 1]), 1)

        } else {
            parents.push(sortedDecisions[firstParentIndex - 1])
            decisions.splice(decisions.findIndex(el => el === sortedDecisions[firstParentIndex -1]), 1)
        }
    } else{
        parents.push(sortedDecisions[firstParentIndex + 1]);
        decisions.splice(decisions.findIndex(el => el === sortedDecisions[firstParentIndex + 1]), 1)
    }


    decisions.splice(decisions.findIndex(el => el === sortedDecisions[firstParentIndex]), 1)

    return parents
}

const generateChildren = (parents, citiesNum) => {
    let newCities = [];
    const crosingowerIndex = Math.floor(Math.random() * (citiesNum - 1) + 1);
    let firstChild = parents[0].cities.slice(0, crosingowerIndex);
    for (let  i = crosingowerIndex; i < citiesNum; i++){
        if(!firstChild.includes(parents[1].cities[i])){
            firstChild.push(parents[1].cities[i])
        }else if(!firstChild.includes(parents[0].cities[i])) {
            firstChild.push(parents[0].cities[i])
        }else{
            firstChild.push(null)
        }
    }
    for (let i = 0; i < citiesNum; i++){
        if(firstChild[i] === null){
            for (let j = 0; j < firstChild.length; j++){
                if(!firstChild.includes(parents[0].cities[j])){
                    firstChild[i] = parents[0].cities[j]
                }
            }
        }
    }
    newCities.push({
        cities: firstChild,
        distance: calculate(firstChild)
    })

    let secondChild = parents[1].cities.slice(0, crosingowerIndex);
    for (let  i = crosingowerIndex; i < citiesNum; i++){
        if(!secondChild.includes(parents[0].cities[i])){
            secondChild.push(parents[0].cities[i])
        }else if(!secondChild.includes(parents[0].cities[i])) {
            secondChild.push(parents[0].cities[i])
        }else{
            secondChild.push(null)
        }
    }
    for (let i = 0; i < citiesNum; i++){
        if(secondChild[i] === null){
            for (let j = 0; j < citiesNum; j++){
                if(!secondChild.includes(parents[0].cities[j])){
                    secondChild[i] = parents[0].cities[j]
                }
            }
        }
    }
    newCities.push({
        cities: secondChild,
        distance: calculate(secondChild)
    })
    return newCities
}

const calculate = (cities) =>  {
    let dist = 0;
    for (let i = 0; i < cities.length; i++) {
        if (i !== 0) {
            dist += countDistance(cities[i], cities[i - 1])
        }
    }
    dist += countDistance(cities[0], cities[cities.length - 1])
    return dist
}

const mutate = (cities, mutationPercent) => {
    const randomNumber = Math.floor(Math.random() * 101);
    if(randomNumber < mutationPercent){
        let randomIndex1 = Math.floor(Math.random() * (cities.length - 2) + 1)
        let randomIndex2 = Math.floor(Math.random() * (cities.length - 2) + 1)
        let el1 = cities[randomIndex1]
        let el2 = cities[randomIndex2]
        cities[randomIndex2] = el1;
        cities[randomIndex2] = el2;
    }
}

const newGenerationCreate = (decisions, citiesNum, mutationPercent) => {
    let children = [];
    while(decisions.length > 0){
        if(decisions.length === 0){
        }
        let parents = selectParents(decisions);
        let newGeneration = generateChildren(parents, citiesNum);
        children = [...children, ...newGeneration]
    }
    children.forEach(child => mutate(child.cities, mutationPercent))
    return {
        type: GENERATE_NEW_GENERATION,
        payload: children
    }
}

const drawNewDecisions = (decisions, currentIterNumber, iterNumber) => {
    let lines = [];
    if(decisions.length !== 0){
        const decisionsSorted = decisions.sort(sortByDistance);
        let cities = decisionsSorted[0].cities;
        let color = '';
        let width = .5;
        for (let i = 0; i < 6; i++) {
            color += Math.floor(Math.random() * 10)
        }

        if(iterNumber - 1 === currentIterNumber){
            color = 'FF0000FF';
            width = 2
            console.log('Result of counting')
        }

        let prevCity = [...cities].shift();
        cities.push(prevCity)

        lines = cities.map(city => {
            if(iterNumber - 1 === currentIterNumber){
                console.log(city.cityNumber)
            }
            let line;
            if (prevCity !== {}) {
                line = <line x1={prevCity.x}
                             y1={prevCity.y}
                             x2={city.x}
                             y2={city.y} style={{stroke: `#${color}`, strokeWidth: width}}
                             key={Math.random()}
                />
            }
            prevCity = city
            return line
        })

    }
    return{
        type: DRAW_ROUTES,
        payload: lines
    }
}

const openForm = () => {
    return{
        type: OPEN_FORM,
        payload: true
    }
}

const closeForm = () => {
    return{
        type: CLOSE_FORM,
        payload: false
    }
}

const drawCities = (cities) => {
    let dots = cities.map(city => {
        return (
            <City city={city}
                  key={city.cityNumber}
            />
        )
    })
    return{
        type: DRAW_CITIES,
        payload: dots
    }
}

const incrementIterationsNumber = () => {
    return{
        type: ADD_NEW_ITERATION,
        payload: 1
    }
}

export {drawCities, setData, generateCities, makeDecisions, openForm, closeForm, newGenerationCreate, drawNewDecisions, incrementIterationsNumber}