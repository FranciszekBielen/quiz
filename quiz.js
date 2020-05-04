///////////////////*Variable*/////////////////
var questionList;
var step;
var answers;
var timeSpent;
var id;
var startTimeQuestion;
var startTime;
var nickName;
var jsonQuestions = "{\n    \"questions\": {\n        \"multiply\": [\n            \"4 * 4 = \",\n            \"6 * 9 = \"\n        ],\n        \n        \"divide\": [\n            \"9 / 3 = \",\n            \"16 / 4 = \"\n        ],\n        \n        \"subtraction\": [\n            \"16 - 4 = \",\n            \"18 - 5 = \"\n        ],\n        \n        \"addition\": [\n            \"4 + 4 = \",\n            \"6 + 10 = \"\n        ]\n    }\n}";
///////////////////*Interaces*////////////////
var standings = /** @class */ (function () {
    function standings(result, nickName, answers, quiz, timeSpent) {
        this.result = result;
        this.nickName = nickName;
        this.answers = answers;
        this.quiz = quiz;
        this.timeSpent = timeSpent;
    }
    return standings;
}());
///////////////*On load*/////////////////
function initializeQuestions() {
    var questions = JSON.parse(jsonQuestions);
    var arr = [];
    var qList = questions.questions;
    for (var a in qList) {
        arr = arr.concat(qList[a]);
    }
    questionList = arr;
    answers = new Array(arr.length);
    timeSpent = new Array(arr.length);
    for (var i = 0; i < answers.length; i++) {
        answers[i] = "";
        timeSpent[i] = 0;
    }
}
function loadQuestion(step) {
    var quiz = document.getElementById("quiz-question");
    quiz.innerHTML = questionList[step % questionList.length];
    startTimeQuestion = new Date().getTime();
    if (answers[step % questionList.length] != "") {
        var ansInput = document.querySelector("input[id=operation]");
        ansInput.value = answers[step % questionList.length];
    }
    allAns();
}
function startClock() {
    var start = new Date().getTime();
    startTime = start;
    var x = setInterval(function () {
        var now = new Date().getTime() - start;
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
    var ansInput = document.getElementById("operation");
    var ans = ansInput.value;
    timeSpent[step] += new Date().getTime() - startTimeQuestion;
    if (ans.length > 0) {
        answers[step] = ans;
    }
    ansInput.value = "";
}
function allAns() {
    var b = document.getElementById("end");
    for (var a in answers) {
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
function calculateTime(time) {
    var days = Math.floor(time / (1000 * 60 * 60 * 24));
    var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((time % (1000 * 60)) / (1000));
    return (days > 0 ? days + " dni " : "") + " "
        + (hours > 0 ? hours + " godzin " : "")
        + (minutes > 0 ? minutes + " minut " : "")
        + (seconds > 0 ? seconds + " sekund " : "");
}
///////////////////*End run*///////////////////////
function finishQuiz() {
    getAnswer();
    var finalTime = new Date().getTime() - startTime;
    var finalResult = new standings(finalTime, nickName, answers, questionList, timeSpent);
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
