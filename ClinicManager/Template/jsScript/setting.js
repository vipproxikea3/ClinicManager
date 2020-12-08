let constant = {};

$(document).ready(function () {
    getExaminationFee();
    $('#examinationFee').on('input', checkNumber);
    document.getElementById('updateButton').addEventListener('click', setExaminationFee);
})

function getExaminationFee() {
    $.ajax({
        url: "/manager/getExaminationFee",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            constant = result;
            renderExaminationFee();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function renderExaminationFee() {
    $('#examinationFee').val(constant.Value);
}

function checkNumber() {
    let val = $('#examinationFee').val();
    let number = parseInt(val);

    if (isNaN(val.trim())) {
        $('#examinationFee').css('border','red 1px solid');
    } else if (number < 0) {
        $('#examinationFee').css('border','red 1px solid');
    } else {
        $('#examinationFee').css('border','#d1d3e2 1px solid');
    }
}

function setExaminationFee() {
    let val = $('#examinationFee').val();
    let number = parseInt(val);

    if (isNaN(val.trim())) {
        return;
    } else if (number < 0) {
        return;
    } else {
        let data = constant;
        data.Value = number;

        $.ajax({
            url: "/manager/setExaminationFee",
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                toastr.success('Thành công');
            },
            error: function (errormessage) {
                toastr.error('Thất bại');
            }
        });
    }
}