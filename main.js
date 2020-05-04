///////////////////*Start quiz*////////////////
function generateToken(min, max) {
    min = Math.ceil(min);
    max = Math.ceil(max);
    var token = Math.floor(Math.random() * (max - min) + min);
    if (localStorage.getItem(token.toString()) != null)
        return generateToken(min, max * max);
    else
        return token.toString();
}
function initialize(nickName) {
    var id = generateToken(1, 1000);
    sessionStorage.setItem("id", id);
    sessionStorage.setItem("nickName", nickName);
}
function startQuiz() {
    var nick = document.getElementById("nickName");
    if (nick.value.length == 0) {
        window.alert("Proszę podać nazwę użytkownika");
        return;
    }
    if (window.confirm("Czy chcesz zacząć quiz? Po zatwierdzeniu zacznie sie odliczanie czasu")) {
        initialize(nick.value);
        window.location.href = 'multiply.html';
    }
}
//////////////*Table with results*///////////
function showStandings() {
    var ul = document.createElement("ul");
    document.body.appendChild(ul);
    ul.setAttribute("style", "width: 300px; margin: auto; margin-top: 10px;");
    var results = JSON.parse(localStorage.getItem("top"));
    if (results == null) {
        var li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += "Brak wyników";
        return;
    }
    var place = 1;
    for (var i = 0; i < 10; i++) {
        if (results[i][1] != "") {
            var li = document.createElement('li');
            li.setAttribute("style", "list-style-type: none;border-color: purple;border-width: 2px;border-style: solid;");
            ul.appendChild(li);
            li.innerHTML += place + ". " + results[i][0] + " " + results[i][1];
            place++;
        }
    }
}
