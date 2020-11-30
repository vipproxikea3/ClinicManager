let queues = [];
let dataTableOfQueues = [];
let missCalls = [];
let dataTableOfMissCalls = [];

$(document).ready(function () {
    getQueues();
    setInterval(function () {
        getQueues();
    }, 10000);
});

function getQueues() {
    $.ajax({
        url: "/home/getQueues",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            queues = result;
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            renderQueues();
            getMissCalls();
        }
    });
}

function getMissCalls() {
    $.ajax({
        url: "/home/getMissCalls",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            missCalls = result;
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            renderMissCalls();
        }
    });
}

function renderQueues() {
    dataTableOfQueues = generateDataOfTable(queues);
    $('#queueTable').DataTable().destroy();
    $('#queueTable').DataTable({
        data: dataTableOfQueues
    });
}

function renderMissCalls() {
    dataTableOfMissCalls = generateDataOfTable(missCalls);
    $('#missCallTable').DataTable().destroy();
    $('#missCallTable').DataTable({
        data: dataTableOfMissCalls
    });
}

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push(item.IndexOfDay);
        itemTmp.push(item.Patient_Name);

        output.push(itemTmp);
    }

    return output;
}