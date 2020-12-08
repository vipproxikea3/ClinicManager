let healthRecordsHaveReExamination = [];
let dataTable = [];
let thisDate, thisMonth, thisYear;
let totalReExaminations, yearReExaminations, monthReExaminations, dateReExaminations;
let examinationFee;

$(document).ready(function async () {
    renderThisDate();
    getHealthRecordsHaveReExamination();
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

function getExaminationFee() {
    $.ajax({
        url: "/manager/getExaminationFee",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            examinationFee = result.Value;
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function getHealthRecordsHaveReExamination() {
    $.ajax({
        url: "/receptionist/getHealthRecordsHaveReExamination",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            healthRecordsHaveReExamination = result;
            for (let item of healthRecordsHaveReExamination) {
                item.CreateAt = convertCSharpDateToDateObj(item.CreateAt);
                item.ReExaminationAt = convertCSharpDateToDateObj(item.ReExaminationAt);
            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            if ($('#filterToday').prop('checked')) {
                renderHealthRecordsHaveReExaminationToDay();
            } else {
                renderHealthRecordsHaveReExamination();
            }
            getExaminationFee();
            renderCountReExaminations();
        }
    });
}

function renderHealthRecordsHaveReExamination() {
    dataTable = generateDataOfTable(healthRecordsHaveReExamination);
    $('#dataTable').DataTable().destroy();
    $('#dataTable').DataTable({
        data: dataTable
    });
}

function renderHealthRecordsHaveReExaminationToDay() {
    dataTable = generateDataOfTable(healthRecordsHaveReExamination.filter(item => item.ReExaminationAt.d == thisDate && item.ReExaminationAt.m == thisMonth && item.ReExaminationAt.y == thisYear));
    $('#dataTable').DataTable().destroy();
    $('#dataTable').DataTable({
        data: dataTable
    });
}

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push('<a href="/community/detail_health_record/' + item.IdHealthRecord + '">' + item.IdHealthRecord + '</a>');

        itemTmp.push('<a href="/community/detail_patient/' + item.IdPatient + '">' + item.Patient_Name + '</a>');

        itemTmp.push('<a href="/manager/detail_user/' + item.UpdateByUser + '">' + item.UpdateByUser_Name + '</a>');

        itemTmp.push(item.Diagnosis);

        itemTmp.push(item.CreateAt.d + '/' + item.CreateAt.m + '/' + item.CreateAt.y);

        itemTmp.push(item.ReExaminationAt.d + '/' + item.ReExaminationAt.m + '/' + item.ReExaminationAt.y);

        itemTmp.push('<div class="btn-group" role="group"><button class="text-xs btn btn-primary" onclick="return getReExamination(' + item.IdHealthRecord + ')">Đổi lịch hẹn</button><button class="text-xs btn btn-primary" onclick="return createHealthRecord(' + item.IdPatient + ')">Tạo phiếu khám</button></div>');

        output.push(itemTmp);
    }

    return output;
}

function renderCountReExaminations() {
    totalReExaminations = healthRecordsHaveReExamination.length;
    yearReExaminations = healthRecordsHaveReExamination.filter(item => item.ReExaminationAt.y == thisYear).length;
    monthReExaminations = healthRecordsHaveReExamination.filter(item => item.ReExaminationAt.y == thisYear && item.ReExaminationAt.m == thisMonth).length;
    dateReExaminations = healthRecordsHaveReExamination.filter(item => item.ReExaminationAt.y == thisYear && item.ReExaminationAt.m == thisMonth && item.ReExaminationAt.d == thisDate).length;

    $('#totalReExaminations').html(totalReExaminations);
    $('#yearReExaminations').html(yearReExaminations);
    $('#monthReExaminations').html(monthReExaminations);
    $('#dateReExaminations').html(dateReExaminations);
}

function getReExamination(id) {
    $('#myModal').modal('show');
    let healthRecord = healthRecordsHaveReExamination.find(x => x.IdHealthRecord == id);

    $('#idHealthRecord').val(healthRecord.IdHealthRecord);
    $('#name').val(healthRecord.Patient_Name);
    let d, m;
    if (healthRecord.ReExaminationAt.d < 10) { d = "0" + healthRecord.ReExaminationAt.d.toString(); } else { d = healthRecord.ReExaminationAt.d; };
    if (healthRecord.ReExaminationAt.m < 10) { m = "0" + healthRecord.ReExaminationAt.m.toString(); } else { m = healthRecord.ReExaminationAt.m; };
    $('#reExaminaitonAt').val(healthRecord.ReExaminationAt.y + '-' + m + '-' + d);

    let date = new Date(Date.now());
    if (date.getDate() < 10) { d = "0" + date.getDate().toString(); } else { d = date.getDate(); };
    if (date.getMonth() < 9) { m = "0" + (date.getMonth() + 1).toString(); } else { m = date.getMonth() + 1; };
    $('#newReExaminationAt').val(date.getFullYear() + '-' + m + '-' + d);
}

function setReExamination() {

    let reExamination = {
        IdHealthRecord: $('#idHealthRecord').val(),
        ReExaminationAt: $('#newReExaminationAt').val()
    }

    $.ajax({
        url: "/receptionist/setReExamination",
        data: JSON.stringify(reExamination),
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            console.log(result);
            toastr.success('Thành công');
        },
        error: function (errormessage) {
            toastr.error('Thất bại');
        },
        complete: function () {
            $('#myModal').modal('hide');
            getHealthRecordsHaveReExamination();
        }
    });
}

function createHealthRecord(id) {

    let healthRecord = {
        CreateByUser: account.IdUser,
        ExaminationFee: examinationFee,
        IsReExamination: true,
        IdPatient: id
    }

    swal({
        title: "Bạn đã chắc chắn chưa?",
        text: "Phí khám bệnh là " + examinationFee + ", hãy chắc chắn bạn đã thu phí rồi.",
        icon: "warning",
        buttons: true,
        dangerMode: true
    })
        .then((result) => {
            if (result) {

                $.ajax({
                    url: "/receptionist/createHealthRecord",
                    data: JSON.stringify(healthRecord),
                    type: "POST",
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    success: function (result) {
                        console.log(result);
                        toastr.success('Thành công');
                    },
                    error: function (errormessage) {
                        toastr.error('Thất bại');
                    }
                });
            } else {
                toastr.error('Thất bại');
            }
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