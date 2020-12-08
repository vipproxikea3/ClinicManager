let missCalls = [];
let dataTable = [];

$(document).ready(function () {
    getMissCalls();
    console.log('ready');
});

function getMissCalls() {
    $.ajax({
        url: "/home/getMissCalls",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            missCalls = [];
            missCalls = result;
            //missCalls = missCalls.filter(x => x.missCall == true);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            renderMissCalls();
        }
    });
}

function renderMissCalls() {
    dataTable = generateDataOfTable(missCalls);
    $('#dataTable').DataTable().destroy();
    $('#dataTable').DataTable({
        data: dataTable
    });
}

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push(item.IndexOfDay);
        itemTmp.push(item.Patient_Name);
        itemTmp.push('<button class="text-xs btn btn-primary" onclick="return setTheOrderbyId(' + item.IdHealthRecord + ')">Cập nhật</button>');

        output.push(itemTmp);
    }

    return output;
}

function setTheOrderbyId(id) {
    $.ajax({
        url: "/receptionist/setTheOrderById/" + id,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            console.log(result);
            toastr.success('Thành công');
            getMissCalls();
        },
        error: function (errormessage) {
            toastr.error('Thất bại');
        },
        complete: function () {
            console.log('success');
        }
    });
}