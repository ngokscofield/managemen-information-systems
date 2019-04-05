// Sự kiện đăng ký
$('#register-submit').click(function () {
    $('input').removeClass('required-border');
    $('input').parent().removeAttr('title');
    $('input').parent().removeClass('wrap-control');
    var name = $('#name').val();
    var email = $('#email').val();
    var phoneNumber = $('#phoneNumber').val();
    var password = $('#password').val();
    var confirmPassword = $('#confirmPassword').val();
    var emp = new Object();
    emp.FullName = name;
    emp.Email = email;
    emp.Phone = phoneNumber;
    emp.Password = password;
    emp.ConfirmPassword = confirmPassword;
    if (name.trim().length === 0 || email.trim().length === 0 || phoneNumber.trim().length === 0 || password.trim().length === 0 || confirmPassword.trim().length === 0) {
        $.each($('[inputregister="true"]'), function (index, item) {
            if (!item.value) {
                $(item).addClass('required-border');
                $(item).parent().attr('title', "Trường này không được để trống!");
                $(item).parent().addClass('wrap-control');
            }
        });
    } else if (password !== confirmPassword) {
        $('#confirmPassword').addClass('required-border');
        $('#confirmPassword').parent().attr('title', "Nhập lại mật khẩu không đúng!");
        $('#confirmPassword').parent().addClass('wrap-control');
    } else {
        commonJS.showMask();
        $.ajax({
            url: "http://localhost:51025/api/account/registerAsync",
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                // Mã xác thực api
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
            },
            method: "POST",
            data: JSON.stringify(emp),
            success: function (data, textStatus, xhr) {
                if (data.success) {
                    // lấy token 
                    localStorage.setItem("access_token", data.data);
                    setTimeout(function () { location.href = "./confirm-email.html"; }, 500);
                }
            },
            error: function (data, xhr, textStatus, errorThrown) {
                $('#boxValidationSummary div').remove();
                if (typeof data.responseJSON.count !== "undefined") {
                    for (var i = 0; i < data.responseJSON.count; i++) {
                        if (data.responseJSON.data[i].errors[0].errorMessage.search("DuplicateUserName") === 0) {
                            $('#email').addClass('required-border');
                            $('#boxValidationSummary').append('<div id="email-register-error">Email đã tồn tại!</div>');
                            $('#boxValidationSummary').css('display', 'block');
                            commonJS.hideMask();
                            return false;
                        }
                        else if (data.responseJSON.data[i].errors[0].errorMessage.search("Password") === 0) {
                            $('#password').addClass('required-border');
                            $('#confirmPassword').addClass('required-border');
                            $('#boxValidationSummary').append('<div id="password-register-error">Mật khẩu phải tối thiểu 6 ký tự và chứa ít nhất một ký tự (A-Z), (a-z), ký tự đặc biệt và chữ số!</div>');
                            $('#boxValidationSummary').css('display', 'block');
                            commonJS.hideMask();
                            return false;
                        }
                    }
                }
                else {
                    $.each(data.responseJSON, function (key, value) {
                        if (key === "Password") {
                            $('#password').addClass('required-border');
                            $('#confirmPassword').addClass('required-border');
                            $('#boxValidationSummary').append('<div id="password-register-error">Mật khẩu phải tối thiểu 6 ký tự và chứa ít nhất một ký tự (A-Z), (a-z), ký tự đặc biệt và chữ số!</div>');
                            $('#boxValidationSummary').css('display', 'block');
                        }
                        if (key === "Email") {
                            $('#email').addClass('required-border');
                            $('#boxValidationSummary').append('<div id="email-register-error">Email không đúng định dạng!</div>');
                            $('#boxValidationSummary').css('display', 'block');
                        }
                    });
                    commonJS.hideMask();
                    return false;
                }
            }
        });
    }
});
