$(document).ready(function () {
    // Gán username vào tên đăng nhập
    //if (localStorage.getItem("user_name") !== "undefined") {
    //    $('#email-login').val(localStorage.getItem("user_name"));
    //}
    //else {
    //    $('#email-login').val("");
    //}
});

// Sự kiện đăng nhập
$('#login-submit').click(function () {
    var email = $('#email-login').val();
    var password = $('#password-login').val();
    var emp = new Object();
    emp.Email = email;
    emp.Password = password;
    if (email.trim().length === 0 || password.trim().length === 0) {
        $.each($('[class="enter riTextBox riEnabled text-field-custom-cls text-required"]'), function (index, item) {
            if (!item.value) {
                $(item).addClass('required-border');
                $('#boxValidationSummary').text("Tên đăng nhập hoặc mật khẩu không đúng!");
                $('#boxValidationSummary').css('display', 'block');
            }
        });
    } else {
        commonJS.showMask();
        $.ajax({
            url: "http://localhost:51025/api/account/login",
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                // Mã xác thực api
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
            },
            method: "POST",
            data: JSON.stringify(emp),
            success: function (data, textStatus, xhr) {
                //localStorage.setItem("check_update_company", data.checkUpdateConpany);
                localStorage.setItem("status_user", "True"); // Lưu status_user = true tại local storage nếu người dùng có tài khoản ở DB nhưng chưa kích hoạt email
                localStorage.setItem("access_token", data.data); // Lấy token // edit pvduong 14:57 16/02/2019
                // Gán username vào tên đăng nhập
                if (localStorage.getItem("user_name") !== "undefined") {
                    $('#email-login').val(localStorage.getItem("user_name"));
                }
                else {
                    $('#email-login').val("");
                }
                if (data.success) {
                    localStorage.setItem("companyId", data.companyID);
                    if (data.checkUpdateConpany)
                        window.location = "./receipt.html";
                    else
                        window.location = "./company.html";
                }
                else {
                    $("#ajax_loader").css("display", "none");
                    setTimeout(function () { location.href = "./confirm-email.html"; }, 500);
                }
                commonJS.hideMask();
            },
            error: function (data, xhr, textStatus, errorThrown) {
                if (data.responseJSON.message === "Email không đúng!" || data.responseJSON.message === "Password không đúng!") {
                    $('#boxValidationSummary div').remove();
                    $('#boxValidationSummary').append('<div id="login-error">Tên đăng nhập hoặc mật khẩu không đúng!</div>');
                    $('#boxValidationSummary').css('display', 'block');
                    $('#password-login').val('');
                }
                else {
                    $(this).addClass('required-border');
                    // Xử lí lỗi định dạng email
                    if ($('#email-login-error').text() === "") {
                        $('#boxValidationSummary div').remove();
                        $('#boxValidationSummary').append('<div id="login-error">Email đăng nhập không đúng định dạng hoặc mật khẩu ngắn hơn 1!</div>');
                        $('#boxValidationSummary').css('display', 'block');
                        $('#password-login').val('');
                    }
                }
                localStorage.removeItem("status_user");
                commonJS.hideMask();
            }
        });
    }
});