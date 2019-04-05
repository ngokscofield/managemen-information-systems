$(document).ready(function () {
    $(document).click(commonJS.setHideOnClickOutSide);
    commonJS.setDatePicker();
    //$(document).on('click', 'table tbody tr', commonJS.rowTable_OnClick);
});

var commonJS = {
    showMask: function (sender) {
        if (sender) {
            sender.addClass('loading');
        } else {
            $('html').addClass('loading');
        }
    },
    hideMask: function (sender) {
        if (sender) {
            sender.removeClass('loading');
        } else {
            $('html').removeClass('loading');
        }
    },

    /* -------------------------------------
     * Hiển thị câu thông báo
     */
    showNotice: function (msg) {
        if (!$('body').find('#message-box').length) {
            var html = '<div id="message-box" title="MISA SME 2019">' + msg + '</div >';
            $('body').append(html);
        }
        $(function () {
            $("#message-box").dialog({
                modal: true,
                resizable: false,
                class: "bottom-dialogmessage",
                width: 350,
                buttons: {
                    "Đồng ý": function () {
                        $(this).dialog("close");
                        $("#message-box").remove();
                    }
                }
            });
            $('[class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"]').addClass('message-box-fix');
        });
    },

    /* -----------------------------------------
     * Hiển thị hộp thoại cảnh báo
     * Created by: NVMANH (03/03/2018)
     */
    showWarning: function (msg) {

    },
    /* -----------------------------------------
     * Hiển thị hộp thoại xác nhận xóa dữ liệu
     * Created by: NVMANH (03/03/2018)
     */
    showConfirm: function (msg, confirmCallBack) {
        if (!$('body').find('#message-box').length) {
            var html = '<div id="message-box"  title = "Cảnh báo!">' + msg +'</div >';
            $('body').append(html);
        }

        $(function () {
            $("#message-box").dialog({
                modal: true,
                resizable: false,
                class: "bottom-dialogmessage",
                width: 350,
                buttons: {
                    "Đồng ý": function () {
                        (function () {
                            var cached_function = confirmCallBack();
                            return function () {
                                $('#dialog-message').dialog("close");
                                var result = cached_function.apply(this, arguments); // use .apply() to call it
                                return result;
                            };
                        })();
                        $(this).dialog("close");
                        $("#message-box").remove();
                    },
                    "Hủy bỏ": function () {
                        $(this).dialog("close");
                        $("#message-box").remove();
                    }
                }
            });
            $('[class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"]').addClass('message-box-fix');
        });
    },

    /* -----------------------------------------
     * Hiển thị hộp thoại thông báo thành công
     * Created by: NVMANH (03/03/2018)
     */
    showSuccessMsg: function (msg) {
        $('body').append('<div class="msg-success" style="display:none; ">' + msg + '</div>');
        $('.msg-success').slideDown(1000);
        setTimeout(function () {
            $('.msg-success').slideUp(1000);
        }, 2000);
    },

    showErrorMsg: function (msg) {
        $('body').append('<div class="msg-error" style="display:none; ">' + msg + '</div>');
        $('.msg-error').slideDown(1000);
        setTimeout(function () {
            $('.msg-error').slideUp(1000);
        }, 2000);
    },

    /* --------------------------------------------
     * Chuyển các ký tự có dấu tiếng việc sang chữ không dấu
     * Created by: NVMANH (03/03/2018)
     */
    change_alias: function (alias) {
        var str = alias;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        str = str.replace(/ + /g, " ");
        str = str.trim();
        return str;
    },

    /* --------------------------------------------
     * Select vào dòng trong table dữ liệu
     * Created by: NVMANH (03/03/2018)
     */
    //rowTable_OnClick: function () {
    //    $(this).siblings('.rowSelected').removeClass('rowSelected');
    //    this.classList.add('rowSelected');
    //},

    /* --------------------------------------------
     * Select vào dòng đầu tiên trong bảng dữ liệu
     * Created by: NVMANH (03/03/2018)
     */
    setFirstRowSelected: function (table) {
        var tBodys = table[0].tBodies,
            firstRow = null;
        if (tBodys.length > 0) {
            var tBody = tBodys[0],
                rows = tBody.rows;
            firstRow = rows.length > 0 ? rows[0] : null;
        }
        if (firstRow) {
            $(firstRow).trigger('click');
            firstRow.classList.add('rowSelected');
        }

        //$('.rowSelected').trigger('click');
    },

    /* -------------------------------------------------------------------------------
     * Hiển thị cảnh báo khi validate dữ liệu trống (các trường yêu cầu bắt buộc nhập)
     * Created by: NVMANH (03/03/2018)
     */
    validateEmpty: function (sender) {
        var target = sender.target,
            idEmpty = target.id + '-empty';
        value = target.value,
            parent = $(this).parent(),
            currentThisWith = $(this).width();

        if (!value || value === '') {
            target.classList.add('validate-error');
            if (parent.find('.divError').length === 0) {
                parent.append('<div id="' + idEmpty + '" class="divError" title="Không được để trống trường này"></div>');
            }
        } else {
            target.classList.remove('validate-error');
            target.title = "";
            $('#' + idEmpty).remove();
        }
    },

    /* -------------------------------------------------------------------------------
     * Chỉ cho phép nhập các ký tự số
     * Created by: NVMANH (03/03/2018)
     */
    //isNumberKey: function (evt) {
    //    debugger
    //    var charCode = (evt.which) ? evt.which : event.keyCode;
    //    if (charCode === 59 || charCode === 46 || (charCode > 95 && charCode < 106))
    //        return true;
    //    if (charCode > 31 && (charCode < 48 || charCode > 57))
    //        return false;
    //    return true;
    //},
    isNumberKey: function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode === 59 || charCode === 46)
            return true;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    },

    /* --------------------------------------------
     * Ẩn hiện các box có thực hiện ẩn hiện khi nhấn click
     * Điều kiện là phải có class .hide-of-out-side
     * Created by: NVMANH (03/03/2018)
     */
    setHideOnClickOutSide: function () {
        //debugger        
        var target = event.target;
        if (!$(target).hasClass('hide-if-outside')) {
            $('.hide-if-outside').hide();
        }
    },

    setDatePicker: function () {
        $(".datepicker").datepicker({
            dateFormat: 'dd-mm-yy'
        });
    },
    triggerDatePicker_OnClick: function () {
        $(this.previousElementSibling).datepicker('show');
    }
};
var initCommon = {
    intMessageBoxClass: function () {

    }
};


jQuery.fn.removeAllAttributes = function () {
    return this.each(function () {
        var attributes = $.map(this.attributes, function (item) {
            return item.name;
        });
        var img = $(this);
        $.each(attributes, function (i, item) {
            img.removeAttr(item);
        });
    });
};

/* --------------------------------------------
 * Phương thức định dạng string
 * Created by: NVMANH (03/03/2018)
 */
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

/* Định dạng hiển thị tiền tệ */
if (!Number.prototype.formatMoney) {
    Number.prototype.formatMoney = function () {
        return this.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    };
}

/* So sánh 2 object */
if (!Object.compare) {
    Object.compare = function (obj1, obj2) {
        var isDifferent = false;
        for (var property in obj1) {
            if (obj1[property] !== obj2[property]) {
                isDifferent = true;
                break;
            }
        }
        return isDifferent;
    };
}
/* Định dạng ngày tháng năm */
if (!Date.prototype.ddmmyyyy) {
    Date.prototype.ddmmyyyy = function () {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();

        return [(dd > 9 ? '' : '0') + dd + '-',
        (mm > 9 ? '' : '0') + mm + '-',
        this.getFullYear()
        ].join('');
    };
}

/* Định dạng năm tháng ngày */
if (!Date.prototype.yyyymmdd) {
    Date.prototype.yyyymmdd = function () {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();

        return [
            this.getFullYear() +'-',
            (mm > 9 ? '' : '0') + mm + '-',
            (dd > 9 ? '' : '0') + dd
        ].join('');
    };
}




