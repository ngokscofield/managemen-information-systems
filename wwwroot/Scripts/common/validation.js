$(document).ready(function () {
    $('.text-required').on('blur focusout', validationJS.requiredValidation);
});

var validationJS = Object.create({
    requiredValidation: function (sender, e) {
        // Kiểm tra đang ở form đăng nhập hay form đăng ký
        $('#login-error').remove();
        var idForm = $(this).parents()[3].getAttribute('id');
        var idError = $(this).attr('id') + '-error';
        if (idForm === 'formLogin') {
            if (!$(this).val()) {
                $(this).addClass('required-border');
                if ($('#' + idError).text() === "") {
                    $('#boxValidationSummary').append('<div id="' + idError + '">' + $(this).parent().prev().text() + ' không được để trống!</div>');
                    $('#boxValidationSummary').css('display', 'block');
                    return false;
                }

            } else {
                $(this).removeClass('required-border');
                $('#' + idError).remove();
                //$('#login-error').remove();
                return true;
            }
        }
        if (idForm === 'formRegister') {
            if (!$(this).val()) {
                $(this).addClass('required-border');
                return false;
            }
            else {
                $(this).removeClass('required-border');
                //$('#' + idError).remove();
                //$('#login-error').remove();
                return true;
            }
        }
    }
});