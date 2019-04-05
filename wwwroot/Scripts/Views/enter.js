$(document).ready(function () {
    document.addEventListener('keypress', function (event) {
        var key = event.which || event.keyCode;
        if (key === 13) {
            if ($("body").attr("id") === "body-login") {
                $('#login-submit').trigger("click");
            }
            else if ($("body").attr("id") === "body-register") {
                $('#register-submit').trigger("click");
            }
            else if ($("body").attr("id") === "body-update-company") {
                $('#update-information-company-submit').trigger("click");
            }
            else if ($("body").attr("id") === "body-confirm-email") {
                $('#submit-active').trigger("click");
            }
        }
    });
});