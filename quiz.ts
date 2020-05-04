///////////////////*Variable*/////////////////

let questionList: string[];
let step : number;
let answers: string[];
let timeSpent: number[];
let id: string;
let startTimeQuestion: number;
let startTime: number;
let nickName: string;

let jsonQuestions: string = `{
    "questions": {
        "multiply": [
            "4 * 4 = ",
            "6 * 9 = "
        ],
        
        "divide": [
            "9 / 3 = ",
            "16 / 4 = "
        ],
        
        "subtraction": [
            "16 - 4 = ",
            "18 - 5 = "
        ],
        
        "addition": [
            "4 + 4 = ",
            "6 + 10 = "
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
function initializeQuestions() {
    let questions : questionList = JSON.parse(jsonQuestions);
    let arr = [];

    let qList = questions.questions;

    for (let a in qList) {
        arr = arr.concat(qList[a]);
    }

    questionList = arr;
    answers = new Array(arr.length);
    timeSpent = new Array(arr.length);
    for (let i = 0; i < answers.length; i ++) {
        answers[i] = "";
        timeSpent[i] = 0;
    }
}

function loadQuestion(step) {
    let quiz = document.getElementById("quiz-question") as HTMLLabelElement;
    quiz.innerHTML = questionList[step % questionList.length];

    startTimeQuestion = new Date().getTime();

    if (answers[step % questionList.length] != "") {
        let ansInput = document.querySelector("input[id=operation]") as HTMLInputElement;

        ansInput.value = answers[step % questionList.length];
    }

    allAns();
}

function startClock() {
    let start = new Date().getTime();
    startTime = start;

    let x = setInterval(function() {
        let now = new Date().getTime() - start;
        document.getElementById("timer").innerHTML = calculateTime(now);
    }, 1000);

}

///////////////////*Start quiz*////////////////

function onStart() {
    id = sessionStorage.getItem("id");
    nickName = sessionStorage.getItem("nickName");
    initializeQuestions();
    step = 0;
    startClock();
    loadQuestion(0);
}

////////////////*Utilities*////////////////////////
function getAnswer() {
    let ansInput = document.getElementById("operation") as HTMLInputElement;
    let ans : string = ansInput.value;

    timeSpent[step] += new Date().getTime() - startTimeQuestion;

    if (ans.length > 0) {
        answers[step] = ans;
    }

    ansInput.value = "";
}


function allAns() {
    let b = document.getElementById("end") as HTMLButtonElement;

    for(let a in answers) {
        if (answers[a] == "") {
            b.disabled = true;
            return;
        }
    }
    b.disabled = false;
}

function goBack() {
    getAnswer();
    step = (step - 1) < 0 ? answers.length - 1 : step - 1;
    loadQuestion(step);
}

function goNext() {
    getAnswer();
    step = (step + 1) % answers.length;
    loadQuestion(step);
}



function calculateTime(time) : string {
    let days = Math.floor(time / (1000 * 60 * 60 * 24));
    let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds =  Math.floor((time % (1000 * 60)) / (1000));

    return (days > 0 ? days + " dni " : "")  + " "
        + (hours > 0 ? hours + " godzin " : "")
        + (minutes > 0 ? minutes + " minut " : "")
        + (seconds > 0 ? seconds + " sekund " : "");
}

///////////////////*End run*///////////////////////

function finishQuiz() {
    getAnswer();
    let finalTime =  new Date().getTime() - startTime;

    let finalResult = new standings(finalTime, nickName, answers, questionList, timeSpent);

    sessionStorage.setItem(id, JSON.stringify(finalResult));

    window.location.href = 'standings.html';
}


function goBackToMenu() {
    if (window.confirm("Czy na pewno chcesz przerwać quiz?")) {
        window.location.href = 'index.html';
    }
}
// ========================================

window.onload = onStart;
