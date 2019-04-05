$(document).ready(function () {
    $("#ajax_loader").css("display", "block");
    //check status_user null sẽ chuyển trang
    if (localStorage.getItem("status_user") === null && localStorage.getItem("access_token")===null) {
        window.location = "./login.html";
    }

    // Kiểm tra code xác nhận
    $('[abc="code"]').keyup(function () {
        $(this).next(function () {
            $(this).focus();
        });
    });

    $($('[abc="code"]')).keyup(function (event) {
        if ($(this).next().length !== 0) {
            if ($(this).next()[0].value === "") {
                $(this).next().focus();
            }
        }
    });
});
// Sự kiện nhập code xác nhận
$('#submit-active').click(function () {
    var code = new Object();
    code.CodeConfirm = $('#code1').val() + $('#code2').val() + $('#code3').val() + $('#code4').val();
    $("#ajax_loader").css("display", "block");
    $.ajax({
        url: "http://localhost:51025/api/account/ConfirmEmailAsync",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/json");
            // Mã xác thực api
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
            xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
        },
        method: "PUT",
        data: JSON.stringify(code),
        success: function (data, textStatus, xhr) {
            // Lấy username và lưu vào localStorage   
            localStorage.setItem("user_name", data.message);
            // lấy token 
            localStorage.setItem("access_token", data.data);
            if (data.success) {
                setTimeout(function () { location.href = "./login.html"; }, 500);
            }
            else {
                setTimeout(function () { location.href = "../index.html"; }, 500);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $.each($('[type="text"]'), function (index, item) {
                $(item).addClass('required-border');
                $(item).parent().attr('title', "Mã xác nhận không đúng!");
                $(item).parent().addClass('wrap-control');
            });
            console.log('Error in Operation');
        }
    });
});