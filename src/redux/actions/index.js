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
    const cities = [] //створюємо пустий масив для запису туди об'єктів міст
    while (citiesNumber > 0) { //в циклі генеруємо координати міст відповідно до розміру екрана
        let x = (Math.random() * (window.innerWidth - 12)).toFixed(2);
        let y = (Math.random() * (window.innerHeight - 20)).toFixed(2);
        cities.push({x: x, y: y, cityNumber: citiesNumber}) //додаємо новий вище згенерований об'єкт міста в масив
        citiesNumber--;
    }
    return {
        type: GENERATE_CITIES,
        payload: cities
    }
}

const countDistance = (city1, city2) => { //метод для розрахунку відстані між містами
    return Math.sqrt(Math.pow((city2.x - city1.x), 2) + Math.pow((city2.y - city1.y), 2))
}

const makeDecision = (citiesArr) => {
    let decision = {cities: [], distance: 0} //початковий об'єкт рішеня
    let cities = [...citiesArr]; //скопійований масив міст
    while (cities.length > 0) {
        let randomIndex = Math.floor(Math.random() * (cities.length)) //генеруємо рандомний індекс в межах довжини масиву з містами
        if (!decision.cities.includes(cities[randomIndex]) || cities[randomIndex] !== undefined) { //якщо рішення ще не мітить це місто(тобто воно ще не було пройдене комівояжером), або елемент за цим рандомним індексом - не невизначений
            decision.cities.push(cities[randomIndex]) //додаємо місто за рандомним індексом в рішення
            cities.splice(randomIndex, 1) //видаляємо його з масиву міст
        }

    }

    for (let i = 0; i < decision.cities.length; i++) { //для всіх рашень
        if (i !== 0) { //якщо і не = 0
            decision.distance += countDistance(decision.cities[i], decision.cities[i - 1]) //рахуємо відстань між 2-ма містами
        }
    }
    decision.distance += countDistance(decision.cities[0], decision.cities[decision.cities.length - 1]) //додамо відстань, яка необхідна для повернення з кінцевої точки в початкову

    return decision
}

const makeDecisions = (cities) => {
    let decisions = []; //масив для об'єктів рішень

    for (let i = 0; i < 30; i++) { //генеруємо 30 рішень
        let currentCities = [...cities]; //копіюємо масив з містами
        let decision = makeDecision(currentCities); //генеруємо рішення
        decisions.push(decision); //додаємо його в масив рішень
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
    const sortedDecisions = decisions.sort(sortByDistance);  //сортуємо рішення за зростанням дистанції
    const firstParentIndex = Math.floor(Math.random() * (decisions.length - 1)); //генеруємо випадковий індекс для першого з батьків
    parents.push(sortedDecisions[firstParentIndex]);//додаємо першого з батьків в масив батьків

    if(firstParentIndex !== 0){ //якщо індекс першого з батьків не дорівнює 0, перевіряєо відстань до якого з сусідів в відсортованому масиві менша
        if (Math.abs(sortedDecisions[firstParentIndex].distance - sortedDecisions[firstParentIndex + 1].distance) < Math.abs(sortedDecisions[firstParentIndex].distance - sortedDecisions[firstParentIndex - 1].distance )) {
            parents.push(sortedDecisions[firstParentIndex + 1]);
            decisions.splice(decisions.findIndex(el => el === sortedDecisions[firstParentIndex + 1]), 1)

        } else {
            parents.push(sortedDecisions[firstParentIndex - 1])
            decisions.splice(decisions.findIndex(el => el === sortedDecisions[firstParentIndex -1]), 1)
        }
    } else{//якщо індекс = 0, просто додаємо наступний в масиві елемент
        parents.push(sortedDecisions[firstParentIndex + 1]);
        decisions.splice(decisions.findIndex(el => el === sortedDecisions[firstParentIndex + 1]), 1)
    }


    decisions.splice(decisions.findIndex(el => el === sortedDecisions[firstParentIndex]), 1) //видаляємо 1-го з батьків з масиву міст, з другим робимо аналогічно вище

    return parents
}

const generateChildren = (parents, citiesNum) => {
    let newCities = []; //масив для запису нових міст, отриманих в результаті схрещування
    const crosingowerIndex = Math.floor(Math.random() * (citiesNum - 1) + 1); //генеруємо індекс для кросинговеру
    let firstChild = parents[0].cities.slice(0, crosingowerIndex); //записумо в першого нащадка міста з першого предка до згенерованого індексу невключно
    for (let  i = crosingowerIndex; i < citiesNum; i++){ //починаючи з згенерованого індексу - записуємо елементи в першого нащадка вже з другого предка
        if(!firstChild.includes(parents[1].cities[i])){//якщо місто з другого предка не міститься в нащадку - записуємо його в нащадка
            firstChild.push(parents[1].cities[i])
        }else if(!firstChild.includes(parents[0].cities[i])) {//у випадку, якщо місто з 2-го предка вже міститься в нащадку, перевіряємо, чи міститься місто з тієї ж позиції першого предка в ньому і якщо ні - записуємо
            firstChild.push(parents[0].cities[i])
        }else{ //якщо вже містяться міста і з 1-го і 2-го предка - записуємо на місце нащадка нулл
            firstChild.push(null)
        }
    }
    for (let i = 0; i < citiesNum; i++){
        if(firstChild[i] === null){ //перевіряємо, якщо місто в рішення-нащадку = нулл
            for (let j = 0; j < firstChild.length; j++){ //проходимося по містах одного з батьків
                if(!firstChild.includes(parents[0].cities[j])){//записуємо на місце міста з значенням нулл перше міто яке ще не міститься в нащадку
                    firstChild[i] = parents[0].cities[j]
                }
            }
        }
    }
    newCities.push({ //додаємо нащадка в масив
        cities: firstChild,
        distance: calculate(firstChild) //рахуємо довжину шляху для цього нащадка
    })

    //аналогічно для 2-го нащадка, лише першу частину записуємо з 2-го предка, а другу - з 1-го
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

const calculate = (cities) =>  { //метод для обчислення загальної дистанції відповідно до маршруту
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
    const randomNumber = Math.floor(Math.random() * 101); //генеруємо рандомне число
    if(randomNumber < mutationPercent){ //у випадку, якщо згенероване число менше, ніж введений відсоток мутації
        //генеруємо 2 випадкові індеси в межах довжини переданого масиву міст(з мевного рішення)
        let randomIndex1 = Math.floor(Math.random() * (cities.length - 2) + 1)
        let randomIndex2 = Math.floor(Math.random() * (cities.length - 2) + 1)
        //записуємо відповідні елементи в проміжні зміння
        let el1 = cities[randomIndex1]
        let el2 = cities[randomIndex2]
        //обмінюємо елементи місцями
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