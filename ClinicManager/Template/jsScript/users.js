let users = [];
let dataOfTable = [];

$(document).ready(function () {
    getUsers();
});

function getUsers() {
    $.ajax({
        url: "/manager/getAccounts",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            users = result;
            for (let item of users) {
                item.DateOfBirth = convertCSharpDateToDateObj(item.DateOfBirth);
            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            renderUsers();
        }
    });
}

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push(item.IdUser);

        itemTmp.push('<a href="/manager/detail_user/' + item.IdUser + '">' + item.Name + '</a>')

        itemTmp.push(item.DateOfBirth.d + '/' + item.DateOfBirth.m + '/' + item.DateOfBirth.y);

        if (item.Gender) {
            itemTmp.push('Nữ');
        } else {
            itemTmp.push('Nam');
        }

        if (item.Role == 0) {
            itemTmp.push('Quản trị viên');
        } else if (item.Role == 1) {
            itemTmp.push('Bác sĩ');
        } else {
            itemTmp.push('Nhân viên tiếp nhận');
        }

        if (item.Role != 0) {
            if (item.isActive == true) {
                itemTmp.push('<button class="text-xs btn btn-success" onclick="return setStatus(' + item.IdUser + ')">Hoạt động</button>');
            } else {
                itemTmp.push('<button class="text-xs btn btn-danger" onclick="return setStatus(' + item.IdUser + ')">Vô hiệu</button>')
            }
        } else {
            itemTmp.push('');
        }

        itemTmp.push('<button class="text-xs btn btn-success" onclick="return getUserById(' + item.IdUser + ')">Cập nhật</button>');

        output.push(itemTmp);
    }

    return output;
}

function renderUsers() {
    dataOfTable = generateDataOfTable(users);
    $('#dataTable').DataTable().destroy();
    $('#dataTable').DataTable({
        data: dataOfTable
    });
}

function setStatus(id) {
    $.ajax({
        url: "/manager/setStatus/" + id,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            console.log(result)
        },
        error: function (errormessage) {
            alert('Thất bại');
        },
        complete: function () {
            getUsers();
        }
    });
}

function getUserById(id) {
    $('#myModal').modal('show');
    $('#updateButton').show();
    $('#addButton').hide();
    $('#identityCardNumber').prop('disabled',true);

    let user = users.find(item => item.IdUser == id);
    $('#idUser').val(user.IdUser);
    $('#name').val(user.Name);
    let d, m;
    if (user.DateOfBirth.d < 10) { d = "0" + user.DateOfBirth.d.toString(); } else { d = user.DateOfBirth.d; };
    if (user.DateOfBirth.m < 10) { m = "0" + user.DateOfBirth.m.toString(); } else { m = user.DateOfBirth.m; };
    $('#dateOfBirth').val(user.DateOfBirth.y + '-' + m + '-' + d);
    $('#identityCardNumber').val(user.IdentityCardNumber);
    $('#address').val(user.Address);
    $('#phone').val(user.Phone);
    if (user.Gender == true) {
        $('#genderFemale').prop('checked', true);
    } else {
        $('#genderMale').prop('checked', true);
    }

    if (user.Role == 1) {
        $('#roleDoctor').prop('checked', true);
    } else if (user.Role == 2) {
        $('#roleReceptionist').prop('checked', true);
    } else {
        $('#roleReceptionist').prop('checked', false);
        $('#roleDoctor').prop('checked', false);
    }
}

function setUser() {
    let user = users.find(item => item.IdUser == $('#idUser').val());

    user.Name = $('#name').val();
    user.DateOfBirth = $('#dateOfBirth').val();
    user.IdentityCardNumber = $('#identityCardNumber').val();
    user.Address = $('#address').val();
    user.Phone = $('#phone').val();
    if ($('#genderFemale').prop('checked')) {
        user.Gender = 1;
    } else {
        user.Gender = 0;
    }
    if ($('#roleDoctor').prop('checked')) {
        user.Role = 1;
    } else {
        user.Role = 2;
    }

    console.log(user);

    $.ajax({
        url: "/manager/setAccount",
        data: JSON.stringify(user),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            console.log(result)
        },
        error: function (errormessage) {
            alert('Thất bại');
        },
        complete: function () {
            getUsers();
            $('#myModal').modal('hide');
        }
    });

}

function clearTextBox() {
    $('#updateButton').hide();
    $('#addButton').show();
    $('#idUser').val("");
    $('#name').val("");
    $('#dateOfBirth').val("");
    $('#identityCardNumber').val("");
    $('#identityCardNumber').prop('disabled',false);
    $('#address').val("");
    $('#phone').val("");
    $('#genderMale').prop('checked', true);
    $('#roleReceptionist').prop('checked', true);
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