let healthRecords = [];
let patients = [];
let patient;
let examinationFee;

$(document).ready(function () {
    getHealthRecord();
});

function getHealthRecord() {
    $.ajax({
        url: "/receptionist/getHealthRecordsToDay",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            healthRecords = result;
            healthRecords = healthRecords.map(function (item) {
                item.CreateAt = convertCSharpDateToDateObj(item.CreateAt);
                return item;
            })
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            renderTable();
            getExaminationFee();
        }
    });
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
        },
        complete: function () {
            renderExaminationFee();
            getPatients();
        }
    });
}

function getPatients() {
    $.ajax({
        url: "/community/getPatients",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            patients = result;
            patients = patients.map(function (item) {
                item.DateOfBirth = convertCSharpDateToDateObj(item.DateOfBirth);
                return item;
            });
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function renderTable() {
    dataTable = generateDataOfTable(healthRecords);
    $('#dataTable').DataTable().destroy();
    $('#dataTable').DataTable({
        data: dataTable
    });
}

function renderExaminationFee() {
    $('#examinationFee').html('Phí khám bệnh ' + examinationFee);
}

function clearTextBox() {
    patient = {};

    $('#identityCardNumber').prop('disabled', false);
    $('#name').prop('disabled', true);
    $('#dateOfBirth').prop('disabled', true);
    $('#genderMale').prop('disabled', true);
    $('#genderFemale').prop('disabled', true);
    $('#checkPatient').prop('disabled', false);
    $('#addButton').prop('disabled', true);

    $('#identityCardNumber').val("");
    $('#name').val("");
    $('#dateOfBirth').val("");
    $('#genderMale').prop('checked', true);
    $('#genderFemale').prop('checked', false);
}

function getPatientByIdentityCardNumber() {
    let identityCardNumber = $('#identityCardNumber').val().trim();
    if (identityCardNumber == "" || identityCardNumber == null) return;
    patient = patients.find(x => x.IdentityCardNumber == identityCardNumber);
    if (patient == null) {
        $('#identityCardNumber').prop('disabled', true);
        $('#checkPatient').prop('disabled', true);
        $('#name').prop('disabled', false);
        $('#dateOfBirth').prop('disabled', false);
        $('#genderMale').prop('disabled', false);
        $('#genderFemale').prop('disabled', false);
        $('#addButton').prop('disabled', false);
    } else {
        $('#identityCardNumber').prop('disabled', true);
        $('#checkPatient').prop('disabled', true);
        $('#name').prop('disabled', true);
        $('#dateOfBirth').prop('disabled', true);
        $('#genderMale').prop('disabled', true);
        $('#genderFemale').prop('disabled', true);

        $('#name').val(patient.Name);
        let d, m;
        if (patient.DateOfBirth.d < 10) { d = "0" + patient.DateOfBirth.d.toString(); } else { d = patient.DateOfBirth.d; };
        if (patient.DateOfBirth.m < 10) { m = "0" + patient.DateOfBirth.m.toString(); } else { m = patient.DateOfBirth.m; };
        $('#dateOfBirth').val(patient.DateOfBirth.y + '-' + m + '-' + d);
        if(patient.Gender) {
            $('#genderFemale').prop('checked',true);
            $('#genderMale').prop('checked',false);
        } else {
            $('#genderMale').prop('checked',true);
            $('#genderFemale').prop('checked',false);
        }
        $('#addButton').prop('disabled', false);
    }
}

function createHealthRecord() {
    if (patient == null) {
        patient = {};
        patient.IdentityCardNumber = $('#identityCardNumber').val();
        patient.Name = $('#name').val();
        patient.DateOfBirth = $('#dateOfBirth').val();
        if ($('#genderMale').prop('checked')) {
            patient.Gender = 0;
        } else {
            patient.Gender = 1;
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
                        url: "/receptionist/createPatient",
                        data: JSON.stringify(patient),
                        type: "POST",
                        contentType: "application/json;charset=UTF-8",
                        dataType: "json",
                        success: function (result) {
                            let healthRecord = {
                                CreateByUser: account.IdUser,
                                ExaminationFee: examinationFee,
                                IsReExamination: false,
                                IdPatient: result
                            }

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
                                },
                                complete: function() {
                                    $('#myModal').modal('hide');
                                    getHealthRecord();
                                }
                            });
                        },
                        error: function (errormessage) {
                            toastr.error('Thất bại');
                        }
                    });
                }
            });

    } else {
        let healthRecord = {
            CreateByUser: account.IdUser,
            ExaminationFee: examinationFee,
            IsReExamination: false,
            IdPatient: patient.IdPatient
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
                            toastr.success('Thành công');
                        },
                        error: function (errormessage) {
                            toastr.error('Thất bại');
                        },
                        complete: function() {
                            $('#myModal').modal('hide');
                            getHealthRecord();
                        }
                    });
                }
            });
    }
}

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

        let Patient = '<a href="/community/detail_patient/' + item.IdPatient + '">' + item.Patient_Name + '</a>';
        itemTmp.push(Patient);

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