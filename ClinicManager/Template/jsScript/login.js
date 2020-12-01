let username, password;
let myAccount = {};

$(document).ready(function () {
    localStorage.removeItem("userToken");
    document.getElementById("loginButton").addEventListener("click", login);
});

function login() {
    getLoginInfo();
    $.ajax({
        url: "/login/login",
        data: { username: username, password: password },
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            myAccount = result;
            myAccount.TimeLogin = Date.now();
            delete myAccount.Password;
            setAccount(myAccount);
            window.location.href = "/home";
        },
        error: function (errormessage) {
            loginFail();
        }
    });
}

function getLoginInfo() {
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
}

function loginFail() {
    document.getElementById('username').style.border = "red 1px solid";
    document.getElementById('password').style.border = "red 1px solid";
}

function setAccount(acc) {
    let userTokenJson = JSON.stringify(acc);
    localStorage.setItem("userToken",userTokenJson);
}

