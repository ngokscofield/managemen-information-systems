var i = 0;
var baseJS = {
    clickReport: function () {
        +i++;
        if ($('.main-nav .menu-parent .wrap-menu-children').css('display') === 'none') {
            $('.main-nav .menu-parent .wrap-menu-children').slideToggle('slow');
            $('.rotate').css('transform', 'rotate(' + 180 * i + 'deg)');
        }
        else {
            $('.main-nav .menu-parent .wrap-menu-children').slideToggle('slow');
            $('.rotate').css('transform', 'rotate(' + 180 * i + 'deg)');
        }
    },
    clickRowNav: function () {
        $('.main-nav .menu-parent li a tr').removeClass('row-selected');
        $(this).addClass('row-selected');
    },
    showCashbookForm: function () {
        reportJS.beforeOpenDetail();
        reportJS.CashbookForm.Show();
    },
    clickAccept: function () {
        localStorage.setItem("FromDate", $('#txtFromDate').val());
        localStorage.setItem("ToDate", $('#txtToDate').val());
        window.location = "cashbook.html";
    },
    btnCancel: function () {
        reportJS.CashbookForm.Close();
    },
    /**
     * Chọn nọi dung trong Drop Menu
     * @param {any} e Sự kiện truyền sang
     * Created by: VVKIET(23/01/2019)
     */
    selectContentMenu: function (e) {
        if (e.target.parentElement.getAttribute("id") === "myDropdown") {
            $(e.target).parent().prev().text($(e.target).attr("mathSymbol"));
            getPositionFilter = 0;
            $(".dropdown-content").remove();
        }
        else if (e.target.className === "btn-select-filter") {
            var filterNow = $(e.target).offset().left + 25;
            $(".dropdown-content").remove();

            if (filterNow !== getPositionFilter) {
                var b = '<div id="myDropdown" class="dropdown-content">\
                    <a id="df" mathSymbol="∗">∗ : Mặc định</a>\
                    <a id="gt" mathSymbol=">">> : Lớn hơn</a>\
                    <a id="lt" mathSymbol="<">< : Nhỏ hơn</a>\
                    <a id="eq" mathSymbol="=">= : Bằng</a>\
                    </div>';
                $(e.target).after(b);
                document.getElementById("myDropdown").classList.toggle("show");
                getPositionFilter = filterNow;
            } else {
                getPositionFilter = 0;
            }
        }
        else {
            getPositionFilter = 0;
            $(".dropdown-content").remove();
        }
    }
};

$('.wrap-menu-children-report').children().first().on('click', baseJS.clickReport);
$('.main-nav .menu-parent li a tr').on('click', baseJS.clickRowNav);
$('#btn-param').on('click', baseJS.showCashbookForm);
//$('#btnAcceptParam').on('click', baseJS.clickAccept);
$('#btnCancelParam').on('click', baseJS.btnCancel);