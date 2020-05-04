///////////////////*Variable*/////////////////
let id: string;
let nickName: string;
let answers: string[];
let time: number;
let timeSpent: number[];
let quiz: string[];
let correctAnswers: string[];

let jsonAnswers: string = `{
    "questions": {
        "multiply": [
            "16",
            "54"
        ],
        
        "divide": [
            "3",
            "4"
        ],
        
        "subtraction": [
            "12",
            "13"
        ],
        
        "addition": [
            "8",
            "16"
        ]
    }
}`;

///////////////////*Interaces*////////////////
class standings {
    result: number;
    nickName: string;
    answers: string[];
    timeSpent: number[];
    quiz: string[];

    constructor(result, nickName, answers, quiz, timeSpent) {
        this.result = result;
        this.nickName = nickName;
        this.answers = answers;
        this.quiz = quiz;
        this.timeSpent = timeSpent;
    }
}

interface Question {
    Q: string[];
}

interface questionList {
    questions: Question[];
}

///////////////*On load*/////////////////

function initializeAnswers() {
    let answers : questionList = JSON.parse(jsonAnswers);
    let arr = [];

    let qList = answers.questions;

    for (let a in qList) {
        arr = arr.concat(qList[a]);
    }

    correctAnswers = arr;
}

function display() {
    document.getElementById("standings").innerHTML = "Twój wynik to: " + time;

    let ul = document.createElement("ul");
    document.getElementById("buttonsField").appendChild(ul);

    for (let it in answers) {
        let li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML += quiz[it];

        if (answers[it] != correctAnswers[it]) {
            li.innerHTML += correctAnswers[it] + " prawidłowa odpowiedź: " + correctAnswers[it]  + " czas spędzony przy pytaniu: "+ calculateTime(timeSpent[it] + 10000);
            li.setAttribute("style", "color: red; list-style-type: none");
        } else {
            li.innerHTML += correctAnswers[it]  + " czas spędzony przy pytaniu: "+ calculateTime(timeSpent[it]);
            li.setAttribute("style", "list-style-type: none");
        }

    }
}

function onStart() {
    id = sessionStorage.getItem("id");
    nickName = sessionStorage.getItem("nickName");
    let s : standings = JSON.parse(sessionStorage.getItem(id));

    initializeAnswers();

    answers = s.answers;
    time = s.result / 1000;
    quiz = s.quiz;
    timeSpent = s.timeSpent;

    display();
}

////////////////*Utilities*////////////////////////
function calculateTime(time) : string {
    let days = Math.floor(time / (1000 * 60 * 60 * 24));
    let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds =  Math.floor((time % (1000 * 60)) / (1000));

    let resultTime = (days > 0 ? days + " dni " : "")
        + (hours > 0 ? hours + " godzin " : "")
        + (minutes > 0 ? minutes + " minut " : "")
        + (seconds > 0 ? seconds + " sekund " : "");

    if (resultTime.length == 0) return "0 sekund";

    return resultTime;
}


function compareArr(a, b) {
    return a[0] - b[0];
}

function addToScoreTable() {
    let arr = JSON.parse(localStorage.getItem("top"));


    if (arr == null || arr.length == 0) {
        let startingArr = new Array(10);
        for (let i = 1; i < 10; i ++) startingArr[i] = [1000000000, ""];
        startingArr[0] = [time, nickName];

        localStorage.setItem("top", JSON.stringify(startingArr));
        return;
    }

    if(arr[arr.length - 1][0] >= time) {
        arr[arr.length - 1][0] = time;
        arr[arr.length - 1][1] = nickName;
        arr.sort(compareArr);
        localStorage.setItem("top", JSON.stringify(arr));
    }
}

/////////////////////*Save*/////////////////////

function save() {
    localStorage.setItem(id, JSON.stringify(new standings(time, nickName, [], [], [])));
    addToScoreTable();
    window.location.href = 'index.html';
}

function saveExtend() {
    localStorage.setItem(id, sessionStorage.getItem("id"));
    addToScoreTable();
    window.location.href = 'index.html';
}

//=====================================>

window.onload = onStart;