let dataSet = [];
let dataTable = [];
let thisDate, thisMonth, thisYear;
let totalHealthRecords, yearHealthRecords, monthHealthRecords, dateHealthRecords;

$(document).ready(function () {
    renderThisDate();
    getData();
});

function getThisDate() {
    let d = Date.now();
    d = new Date(d);
    thisDate = d.getDate();
    thisMonth = d.getMonth() + 1;
    thisYear = d.getFullYear();
}

function renderThisDate() {
    getThisDate();
    $('#thisYear').html('Năm ' + thisYear);
    $('#thisMonth').html('Tháng ' + thisMonth);
    $('#thisDate').html('Ngày ' + thisDate + '/' + thisMonth + '/' + thisYear);
}

function getData() {
    $.ajax({
        url: "/community/getHealthRecords",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            for (let item of result) {
                let obj = {};

                // CreateAt
                let createAt = convertCSharpDateToDateObj(item.CreateAt);
                obj.CreateAt = createAt;

                // CreateByUser
                obj.CreateByUser = item.CreateByUser;

                // CreateByUser_Name
                obj.CreateByUser_Name = item.CreateByUser_Name;

                // Diagnosis
                obj.Diagnosis = item.Diagnosis;

                // ExaminationFee
                obj.ExaminationFee = item.ExaminationFee;

                // IdHealthRecord
                obj.IdHealthRecord = item.IdHealthRecord;

                // IdPatient
                obj.IdPatient = item.IdPatient;

                // PatientName
                obj.Patient_Name = item.Patient_Name;

                // IndexOfDay
                obj.IndexOfDay = item.IndexOfDay;

                // IsReExamination
                obj.IsReExamination = item.IsReExamination;

                // Status
                obj.Status = item.Status;

                // Symptom
                obj.Symptom = item.Symptom;

                // UpdateByUser
                obj.UpdateByUser = item.UpdateByUser;

                // UpdateByUser_Name
                obj.UpdateByUser_Name = item.UpdateByUser_Name;

                // missCall
                obj.missCall = item.missCall;

                dataSet.push(obj);
            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            if ($('#filterToday').prop('checked')) {
                renderTableToDay();
            } else {
                renderTable();
            }
            renderCountHealthRecords();
        }
    });
};

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push(item.IdHealthRecord);

        let createAt = item.CreateAt.d + '/' + item.CreateAt.m + '/' + item.CreateAt.y;
        itemTmp.push(createAt);

        itemTmp.push(item.IndexOfDay);

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

function renderTable() {
    dataTable = generateDataOfTable(dataSet);
    $('#HealthRecordsTable').DataTable().destroy();
    $('#HealthRecordsTable').DataTable({
        data: dataTable
    });
}

function renderTableToDay() {
    dataTable = generateDataOfTable(dataSet.filter(item => item.CreateAt.d == thisDate && item.CreateAt.m == thisMonth && item.CreateAt.y == thisYear));
    $('#HealthRecordsTable').DataTable().destroy();
    $('#HealthRecordsTable').DataTable({
        data: dataTable
    });
}

function renderCountHealthRecords() {
    totalHealthRecords = dataSet.length;
    yearHealthRecords = dataSet.filter(item => item.CreateAt.y == thisYear).length;
    monthHealthRecords = dataSet.filter(item => item.CreateAt.y == thisYear && item.CreateAt.m == thisMonth).length;
    dateHealthRecords = dataSet.filter(item => item.CreateAt.y == thisYear && item.CreateAt.m == thisMonth && item.CreateAt.d == thisDate).length;

    $('#totalHealthRecords').html(totalHealthRecords);
    $('#yearHealthRecords').html(yearHealthRecords);
    $('#monthHealthRecords').html(monthHealthRecords);
    $('#dateHealthRecords').html(dateHealthRecords);
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