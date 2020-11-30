let idHealthRecord;
let currentUrl;
let healthRecord = {};
let precription = [];
let dataOfTable = [];

getCurrentUrl();
getIdHealthRecord();
getHealthRecordByID(idHealthRecord);

function getHealthRecordByID(id) {
    $.ajax({
        url: "/community/getHealthRecordById/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            healthRecord = result;
            healthRecord.CreateAt = convertCSharpDateToDateObj(healthRecord.CreateAt);
            if (healthRecord.ReExaminationAt != null)
                healthRecord.ReExaminationAt = convertCSharpDateToDateObj(healthRecord.ReExaminationAt);
        },
        error: function (errormessage) {
            window.location.href = '/page_not_found';
        },
        complete: function() {
            renderHealthRecordInfo();
            getPrecription(idHealthRecord);
        }
    });
}

function getPrecription(id) {
    $.ajax({
        url: "/community/GetPrecriptionByIdHealthRecord/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            precription = result;
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function() {
            renderPrecription();
            console.log(precription);
        }
    });
}

function getCurrentUrl() {
    currentUrl = (window.location.href).trim();
    if (currentUrl[currentUrl.length - 1] == '/') {
        currentUrl = currentUrl.slice(0,-1);
    }
}

function getIdHealthRecord() {
    let res = currentUrl.split('/');
    let tmp = parseInt(res[res.length -1]);
    if (!Number.isInteger(tmp)) {
        window.location.href = '/page_not_found';
    } else {
        idHealthRecord = tmp;
    }
}

function renderHealthRecordInfo() {
    $('#idHealthRecord').html(healthRecord.IdHealthRecord);

    let createAt = healthRecord.CreateAt.d + '/' + healthRecord.CreateAt.m + '/' + healthRecord.CreateAt.y;
    $('#createAt').html(createAt);

    $('#createByUser_Name').html(healthRecord.CreateByUser_Name);

    $('#examinationFee').html(healthRecord.ExaminationFee);

    if (healthRecord.IsExamination) {
        $('#isExamination').html('<p class="p-2 badge badge-info">Tái khám</p>');
    } else {
        $('#isExamination').html('<p class="p-2 badge badge-success">Khám mới</p>');
    }

    if (healthRecord.UpdateByUser_Name == null) {
        $('#updateByUser_Name').html("Không xác định");
    } else {
        $('#updateByUser_Name').html(healthRecord.UpdateByUser_Name);
    }

    $('#patient_Name').html(healthRecord.Patient_Name);

    if (healthRecord.Status) {
        $('#status').html('<p class="p-2 badge badge-danger">Đang khám</p>');
    } else {
        $('#status').html('<p class="p-2 badge badge-success">Đã hoàn thành</p>');
    }

    if (healthRecord.Symptom == null) {
        $('#symptom').html('Không xác định');
    } else {
        $('#symptom').html(healthRecord.Symptom);
    }

    if (healthRecord.Diagnosis == null) {
        $('#diagnosis').html('Không xác định');
    } else {
        $('#diagnosis').html(healthRecord.Diagnosis);
    }

    if (healthRecord.ReExaminationAt == null) {
        $('#reExaminationAt').html('Không xác định');
    } else {
        let reExaminationAt = healthRecord.ReExaminationAt.d + '/' + healthRecord.ReExaminationAt.m + '/' + healthRecord.ReExaminationAt.y;
        $('#reExaminationAt').html(reExaminationAt);
    }
}

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push(item.MedicineName);
        itemTmp.push(item.Unit);
        itemTmp.push(item.Count);
        itemTmp.push(item.UserManual);

        output.push(itemTmp);
    }

    return output;
}

function renderPrecription() {
    dataOfTable = generateDataOfTable(precription);
    $('#dataTable').DataTable().destroy();
    $('#dataTable').DataTable({
        data: dataOfTable
    });
}

function convertCSharpDateToDateObj(tmp) {
    let dateStr = tmp.slice(6, -2);
    let date = new Date(parseInt(dateStr));
    let dateObj = {
        tick: dateStr,
        d: date.getDate(),
        m: date.getMonth() + 1,
        y: date.getFullYear()
    }
    return dateObj;
}