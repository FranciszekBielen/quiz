///////////////////*Variable*/////////////////
var id;
var nickName;
var answers;
var time;
var timeSpent;
var quiz;
var correctAnswers;
var jsonAnswers = "{\n    \"questions\": {\n        \"multiply\": [\n            \"16\",\n            \"54\"\n        ],\n        \n        \"divide\": [\n            \"3\",\n            \"4\"\n        ],\n        \n        \"subtraction\": [\n            \"12\",\n            \"13\"\n        ],\n        \n        \"addition\": [\n            \"8\",\n            \"16\"\n        ]\n    }\n}";
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
function initializeAnswers() {
    var answers = JSON.parse(jsonAnswers);
    var arr = [];
    var qList = answers.questions;
    for (var a in qList) {
        arr = arr.concat(qList[a]);
    }
    correctAnswers = arr;
}
function display() {
    document.getElementById("standings").innerHTML = "Twój wynik to: " + time;
    var ul = document.createElement("ul");
    document.getElementById("buttonsField").appendChild(ul);
    for (var it in answers) {
        var li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += quiz[it];
        if (answers[it] != correctAnswers[it]) {
            li.innerHTML += correctAnswers[it] + " prawidłowa odpowiedź: " + correctAnswers[it] + " czas spędzony przy pytaniu: " + calculateTime(timeSpent[it] + 10000);
            li.setAttribute("style", "color: red; list-style-type: none");
        }
        else {
            li.innerHTML += correctAnswers[it] + " czas spędzony przy pytaniu: " + calculateTime(timeSpent[it]);
            li.setAttribute("style", "list-style-type: none");
        }
    }
}
function onStart() {
    id = sessionStorage.getItem("id");
    nickName = sessionStorage.getItem("nickName");
    var s = JSON.parse(sessionStorage.getItem(id));
    initializeAnswers();
    answers = s.answers;
    time = s.result / 1000;
    quiz = s.quiz;
    timeSpent = s.timeSpent;
    display();
}
////////////////*Utilities*////////////////////////
function calculateTime(time) {
    var days = Math.floor(time / (1000 * 60 * 60 * 24));
    var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((time % (1000 * 60)) / (1000));
    var resultTime = (days > 0 ? days + " dni " : "")
        + (hours > 0 ? hours + " godzin " : "")
        + (minutes > 0 ? minutes + " minut " : "")
        + (seconds > 0 ? seconds + " sekund " : "");
    if (resultTime.length == 0)
        return "0 sekund";
    return resultTime;
}
function compareArr(a, b) {
    return a[0] - b[0];
}
function addToScoreTable() {
    var arr = JSON.parse(localStorage.getItem("top"));
    if (arr == null || arr.length == 0) {
        var startingArr = new Array(10);
        for (var i = 1; i < 10; i++)
            startingArr[i] = [1000000000, ""];
        startingArr[0] = [time, nickName];
        localStorage.setItem("top", JSON.stringify(startingArr));
        return;
    }
    if (arr[arr.length - 1][0] >= time) {
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
