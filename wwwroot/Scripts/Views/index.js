$(document).ready(function () {
    //check token null sẽ chuyển trang
    if (localStorage.getItem("access_token") === null) {
        window.location = "./login.html";
    }
    $.ajax({
        url: "http://localhost:51025/api/account/GetEmployee",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/json");
            // Mã xác thực api
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
            xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
        },
        method: "GET",
        success: function (data, textStatus, xhr) {
            if (data.success) {
                var emailConfirm = data.data.split(' ')[1];
                if (emailConfirm === "True") {
                    $('#set-info').text(data.data.split(' ')[0]);
                    setAvatar();
                }
                else {
                    setTimeout(function () { location.href = "/confirm-email.html"; }, 1500);
                }
            }
            else {
                //khi token sai
                $("#ajax_loader").css("display", "none");
                commonJS.showNotice("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại!");
                setTimeout(function () { location.href = "/Views/login.html"; }, 1500);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            // Lỗi khác
            $("#ajax_loader").css("display", "none");
            commonJS.showNotice("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại!");
            setTimeout(function () { location.href = "/Views/login.html"; }, 1500);
            console.log('Error in Operation');
        }
    });
    //Đăng xuất
    $('#btnLogout').click(function () {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("receipt");
        localStorage.removeItem("payment");
        localStorage.removeItem("status_user");
        localStorage.removeItem("selectReceipt");
        window.location = "/Views/login.html";
    });
});




function setAvatar () {
    $.fn.nameBadge = function (options) {
        var settings = $.extend({
            border: {
                color: '#ddd',
                width: 3
            },
            colors: ['#a3a948', '#edb92e', '#f85931', '#ce1836', '#009989'],
            text: '#fff',
            size: 72,
            margin: 5,
            middlename: true,
            uppercase: false
        }, options);
        return this.each(function () {
            var elementText = $(this).text();
            var initials = elementText.slice(0, 1).toUpperCase();
            //var initialLetters = elementText.match(settings.middlename ? /\b(\w)/g : /^\w|\b\w(?=\S+$)/g);
            //var initials = initialLetters.join('');
            $(".avatar-user").text(initials);
            $(".avatar-user").css({
                'color': getRandomColor("text"),
                'background-color': getRandomColor("background"),
                'border': settings.border.width + 'px solid ' + settings.border.color,
                'font-family': 'Arial, \'Helvetica Neue\', Helvetica, sans-serif',
                'font-size': 19 + 'px',
                'border-radius': settings.size + 'px',
                'width': 30 + 'px',
                'height': 30 + 'px',
                'line-height': 27 + 'px',
                'text-align': 'center',
                'text-transform': settings.uppercase ? 'uppercase' : '',
                'font-weight': 900
            });
        });
    };
    $('#set-info').nameBadge({
        border: {
            width: 0
        },
        margin: 15,
        size: 120
    });
}

function getRandomColor(type) {
    var lettersText = '01234567';
    var lettersBackground = '89ABCDEF';
    var color = "#";
    var i;
    if (type === "text") {
        for (i = 0; i < 6; i++) {
            color += lettersText[Math.floor(Math.random() * 8)];
        }
    } else {
        for (i = 0; i < 6; i++) {
            color += lettersBackground[Math.floor(Math.random() * 8)];
        }
    }
    
    return color;
}
