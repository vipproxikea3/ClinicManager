let idPatient;
let currentUrl;
let patient = {};
let healthRecords = [];
let dataOfTable = [];

getCurrentUrl();
getIdPatient();
getPatientById(idPatient);

function getPatientById(id) {
    $.ajax({
        url: "/community/getPatientById/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            patient = result;
            patient.CreateAt = convertCSharpDateToDateObj(patient.CreateAt);
            patient.DateOfBirth = convertCSharpDateToDateObj(patient.DateOfBirth);
        },
        error: function (errormessage) {
            window.location.href = '/page_not_found';
        },
        complete: function() {
            renderPatientInfo();
            getHealthRecordsByIdPatient(idPatient);
        }
    });
}

function getHealthRecordsByIdPatient(id) {
    $.ajax({
        url: "/community/getHealthRecordsByIdPatient/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            healthRecords = result;
            healthRecords = healthRecords.map(function(item) {
                item.CreateAt = convertCSharpDateToDateObj(item.CreateAt);
                return item;
            })
        },
        error: function (errormessage) {
            window.location.href = '/page_not_found';
        },
        complete: function() {
            renderHealthRecords();
        }
    });
}

function getCurrentUrl() {
    currentUrl = (window.location.href).trim();
    if (currentUrl[currentUrl.length - 1] == '/') {
        currentUrl = currentUrl.slice(0,-1);
    }
}

function getIdPatient() {
    let res = currentUrl.split('/');
    let tmp = parseInt(res[res.length -1]);
    if (!Number.isInteger(tmp)) {
        window.location.href = '/page_not_found';
    } else {
        idPatient = tmp;
    }
}

function renderPatientInfo() {
    $('#nameTitle').html(patient.Name);

    $('#name').html(patient.Name);

    $('#idPatient').html(patient.IdPatient);

    $('#identityCardNumber').html(patient.IdentityCardNumber);

    let dateOfBirth = patient.DateOfBirth.d + '/' + patient.DateOfBirth.m + '/' + patient.DateOfBirth.y;
    $('#dateOfBirth').html(dateOfBirth);

    if (patient.Gender) {
        $('#gender').html('Nữ');
    } else {
        $('#gender').html('Nam');
    }

    $('#countHealthRecords').html(patient.CountHealthRecords);

    $('#totalFee').html(patient.TotalFee);
}

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push(item.IdHealthRecord);

        let createAt = item.CreateAt.d + '/' + item.CreateAt.m + '/' + item.CreateAt.y;
        itemTmp.push(createAt);

        let createByUser = '<a href="/manager/detail_user/' + item.CreateByUser + '">' + item.CreateByUser_Name + '</a>';
        itemTmp.push(createByUser);

        if (item.UpdateByUser == null) {
            itemTmp.push("");
        } else {
            let updateByUser = '<a href="/manager/detail_user/' + item.UpdateByUser + '">' + item.UpdateByUser_Name + '</a>';
            itemTmp.push(updateByUser);
        }

        let Patient = '<a href="/community/detail_patient/' + item.IdPatient + '">' + item.Patient_Name + '</a>';
        itemTmp.push(Patient);

        if (item.Diagnosis == null) {
            itemTmp.push("");
        } else {
            itemTmp.push(item.Diagnosis);
        }

        itemTmp.push(item.ExaminationFee);

        if (item.Status) {
            let status = '<span href="#" class="p-2 badge badge-primary">Đang khám</span>';
            itemTmp.push(status);
        } else {
            let status = '<a href="/community/detail_health_record/' + item.IdHealthRecord + '" class="p-2 badge badge-success">Hoàn thành</a></td>';
            itemTmp.push(status);
        }

        output.push(itemTmp);
    }

    return output;
}

function renderHealthRecords() {
    dataOfTable = generateDataOfTable(healthRecords);
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