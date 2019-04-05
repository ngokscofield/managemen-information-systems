// Lấy vị trí của các ô filter trên header
var getPositionFilter = 0;

$(document).ready(function () {
    $('.txtFromDate').datepicker({ dateFormat: "dd-mm-yy" }).datepicker();
    $('.txtToDate').datepicker({ dateFormat: "dd-mm-yy" }).datepicker();
});

class ReportsJS {
    constructor() {
        //this.RefType = null;
        this.initForms(); //Thiết lập form
        this.initEvents(); //Khởi tạo event
        // this.loadReportData(); //Load dữ liệu
        //this.editMode = null;
    }
    /*
     * Thiết lập các form
     */
    initForms() {
        //this.DetailForm = new FormPopup('#frmRAEDetail', 800, null, true, this);
        this.CashbookForm = new FormPopup('#frmCashBook', 450, null, true, this);
    }

    initEvents() {
        $(document).on("click", ".btn-customer-datepicker-icon", this.clickDatepicker.bind(event));
        $(document).on("change", ".txtFromDate", this.setFromDate.bind(this));
        $(document).on("change", ".txtToDate", this.setToDate.bind(this));
        $(document).on("click", baseJS.selectContentMenu.bind(this));
        //$(document).on("click", "#btnPrintReport", reportJS.reportReceipt.bind(this));
        $(document).on("click", "#btnLoadReport", this.reportReceipt.bind(this));
        $(document).on("click", "#btnAcceptParam", this.saveFilter.bind(this));
        $(document).on("click", "#btnExportReport", this.exportExcel.bind(this));
        $(document).on("click", "#btnPrintReport", this.printPdf.bind(this));
        $(document).on("click", "#btnCancelReport", this.cancelReport.bind(this));
    }

    /**
     * Show ra lịch khi click vào ô input kiểu date
     * @param {any} event 
     * Created by: VVKIET(23/01/2019)
     * */
    clickDatepicker(event) {
        $(event.currentTarget).siblings().first().focus();
    }

    /**
     * Thực hiện lấy thông tin đối tượng (Department)
     * Created by: VVKIET(23/01/2019)
     */
    departmentItem_OnSelect() {
        // Lấy thông tin đối tượng được chọn:
        var departmentId = $(event.target).attr('item-value');
        var departments = dataResource.Department.filter(function (e) {
            return e.DepartmentID === Number(departmentId);
        });
        if (departments && departments.length > 0) {
            var department = departments[0];
            $('#txtDepartmentNameCashBook').val(department.DepartmentName);
        }
        // focus vào ô tiếp theo
        $('[item-value]').on({
            keydown: function (e) {
                if (e.keyCode === 13) {
                    $('#txtReportPeriodName').focus();
                }
            }
        });
    }


    /**
     * Thực hiện lấy thông tin đối tượng (ReportPeriod)
     * Created by: VVKIET(23/01/2019)
     */
    reportPeriodItem_OnSelect() {
        // Lấy thông tin đối tượng được chọn:
        var reportPeriodId = $(event.target).attr('item-value');
        var reports = dataResource.ReportPeriod.filter(function (e) {
            return e.ReportPeriodID === Number(reportPeriodId);
        });
        if (reports && reports.length > 0) {
            var report = reports[0];
            $('.txtReportPeriodName').val(report.ReportPeriodName);
        }
        // focus vào ô tiếp theo
        $('[item-value]').on({
            keydown: function (e) {
                if (e.keyCode === 13) {
                    $('#frmFromDate').focus();
                }
            }
        });
    }

    /**
     * Thực hiện lấy thông tin đối tượng (Currency)
     * Created by: VVKIET(23/01/2019)
     */
    currencyItem_OnSelect() {
        // Lấy thông tin đối tượng được chọn:
        var currencyId = $(event.target).attr('item-value');
        var currencys = dataResource.Currency.filter(function (e) {
            return e.CurrencyID === Number(currencyId);
        });
        if (currencys && currencys.length > 0) {
            var currency = currencys[0];
            $('#txtCurrencyName').val(currency.CurrencyName);
        }
        // focus vào ô tiếp theo
        //$('[item-value]').on({
        //    keydown: function (e) {
        //        if (e.keyCode === 13) {
        //            $('#btnAcceptParam').focus();
        //        }
        //    }
        //});
    }

    setFromDate(sender) {
        $(".txtFromDate").val($(sender.currentTarget).val());
    }

    setToDate(sender) {
        $(".txtToDate").val($(sender.currentTarget).val());
    }

    beforeOpenDetail() {
        $('#txtDepartmentNameCashBook').val();
        $('#txtReportPeriodName').val($('.txtReportPeriodName').val());
        $('#frmFromDate').val($('.txtFromDate').val());
        $('#frmToDate').val($('.txtToDate').val());
        $('#txtCurrencyName').val();
    }

    saveFilter() {
        var a = new Object();
        a.DepartmentNameCashBook = "a";
        a.ReportPeriodName = "a";
        a.CurrencyName = "a";

        //a.DepartmentNameCashBook = $("#txtDepartmentNameCashBook").val();
        //a.ReportPeriodName = $(".txtReportPeriodName").val();
        a.FromDate = $(".txtFromDate").val();
        a.ToDate = $(".txtToDate").val();
        //a.CurrencyName = $("#txtCurrencyName").val();
        localStorage.setItem("reportFilter", JSON.stringify(a));
        this.CashbookForm.Close();
    }
    
    reportReceipt() {
        //string filterName, string filterValue, string filterType, string filterDatatype 
        var b = localStorage.getItem("reportFilter");
        commonJS.showMask();
        $.ajax({
            url: "https://localhost:44366/api/receipt/ReportReceipt",
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                // Mã xác thực api
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
                xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
            },
            contentType: "application/json; charset=utf-8",
            //data: JSON.stringify(a),
            data: b,
            method: "POST",
            success: function (data, textStatus, xhr) {
                var totalAmount = 0;
                //$.each(data, function (key, value) {
                //    $('#report-table').append('<tr>'
                //        + '<td class="date">' + new Date(value.postedDate).ddmmyyyy() + '</td >'
                //        + '<td class="date">' + new Date(value.refDate).ddmmyyyy() + '</td>'
                //        + '<td>' + value.refNo + '</td>'
                //        + '<td>0</td>'
                //        + '<td>' + value.journalMemo + '</td>'
                //        + '<td class="totalAmount">' + new Number(value.totalAmount).formatMoney() + '</td>'
                //        + '<td class="totalAmount">0</td>'
                //        + '<td class="totalAmount">0</td>'
                //        + '<td>' + value.contactName + '</td>'
                //        + '<td>' + value.refTypeName + '</td>'
                //        + '<td>Không có gì</td>'
                //        + '</tr>');
                //    totalAmount += new Number(value.totalAmount);
                //});
                reportJS.buildDataIntoTable(data.data);
                //this.buildDataIntoTable(data);
                $('#report-table').append('<tr id = "sum">'
                    + '<td colspan="5" class="bold-font">Tổng cộng:</td>'
                    + '<td class="bold-font totalAmount">' + totalAmount.formatMoney() + '</td>'
                    + '<td class="bold-font totalAmount">0</td>'
                    + '<td class="bold-font totalAmount">0</td>'
                    + '<td></td>'
                    + '<td></td>'
                    + '<td></td>'
                    + '</tr>');


                commonJS.hideMask();
                //window.print();
                //commonJS.showSuccessMsg("Thành công!");
            },
            error: function (xhr, textStatus, errortdrown) {
                commonJS.hideMask();
                commonJS.showSuccessMsg("Thất bại!");
            }
        });
    }

    buildDataIntoTable(data) {
        var table = $('#tbodyReportRAE');
        table.html('');
        table.append('<tr>'
            + '<th></th>'
            + '<th></th>'
            + '<th></th>'
            + '<th></th>'
            + '<th>Số tồn đầu kỳ</th>'
            + '<th></th>'
            + '<th></th>'
            + '<th class="totalAmount">0</th>'
            + '<th class="totalAmount">0</th>'
            + '<th class="totalAmount" id="sumSurvival">10.000.000.000</th>'
            + '<th></th>'
            + '</tr>');
        // Lấy thông tin các cột dữ liệu:
        var column = $('#tblReportList .gridHeader th');
        var rowTemplate = [];
        var fieldData = [];
        rowTemplate.push('<tr class="{0}">');
        var columnId = '#column-header-';
        column.each(function (index, item) {
            // xử lý trường hợp tên Propery bị lowerCase ký tự đầu khi nhận dữ liệu json trả về
            var itemFieldData = $(columnId + (index + 1)).attr('fieldData');
            itemFieldData = itemFieldData.charAt(0).toLocaleLowerCase() + itemFieldData.substr(1);
            fieldData.push(itemFieldData);
        });
        data.forEach(function (item, index) {
            item["receiptDetail"].forEach(function (valueDetail, indexDetail) {
                var htmlItem = [];
                var sum = new Number("10000000000");
                htmlItem.push('<tr>');
                fieldData.forEach(function (valueField, indexField) {
                    var value = item[valueField];
                    if (valueField === "account" || valueField === "accountReciprocal") {
                        value = "111";
                        htmlItem.push('<td class="">{0}</td>'.format(value ? value : ''));
                    }
                    else if (valueField === "postedDate" || valueField === "refDate") {          // Hàm định dạng ngày tháng năm
                        value = new Date(item[valueField]).ddmmyyyy();
                        htmlItem.push('<td class="date">{0}</td>'.format(value ? value : ''));
                    }
                    else if (valueField === "numberArises") {
                        // Không làm gì 
                    }
                    else if (valueField === "journalMemo") {
                        value = item["receiptDetail"][indexDetail][valueField];
                        htmlItem.push('<td class="">{0}</td>'.format(value ? value : ''));
                    }
                    else if (valueField === "creditAmount" || valueField === "debitAmount") {
                        if (valueField === "creditAmount") {
                            sum += +item["receiptDetail"][indexDetail][valueField];
                        } else {
                            sum -= item["receiptDetail"][indexDetail][valueField];
                        }
                        value = item["receiptDetail"][indexDetail][valueField].formatMoney();
                        htmlItem.push('<td class="totalAmount">{0}</td>'.format(value ? value : ''));
                    }
                    else if (valueField === "numbersSurvival") {
                        htmlItem.push('<td class="totalAmount">{0}</td>'.format(sum ? sum.formatMoney() : ''));
                    }
                    else {
                        if (indexField === 0) {
                            htmlItem.push('<td class="no-border-left">{0}</td>'.format(value ? value : ''));
                        } else {
                            htmlItem.push('<td class="">{0}</td>'.format(value ? value : ''));
                        }
                    }
                });
                htmlItem.push('</tr>');
                table.append(htmlItem.join(""));
            });
        });
    }
     
    exportExcel(e) {
        //var table = document.getElementById("tblReportList");
        //var html = table.outerHTML;
        //var html = $('.cls-gridPanel').html();
        //var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url 
        //debugger
        //$("#btnExportReport").attr("href", url);
        //$("#btnExportReport").attr("download", "export.xls"); // Choose the file name
        //return false;
        //window.open('data:application/vnd.ms-excel,' + $('.cls-gridPanel').html());
        //$('#tblReportList').table2excel();
    }
    
    printPdf() {
        window.location = "report.html";
    }

    cancelReport() {
        window.location = "receipt.html";
    }
    /*
     * Thực hiện load tổng số bản ghi
     * Created by: HNGIAP
     */
    //getTotalReportRecord() {
    //    var reportParam = {
    //        fromDate: new Date(new Date("12/12/2020".split("/")[1] + "/" + "12/12/2020".split("/")[0] + "/" + "12/12/2020".split("/")[2]).yyyymmdd()),
    //        toDate: new Date(new Date("22/12/2020".split("/")[1] + "/" + "22/12/2020".split("/")[0] + "/" + "22/12/2020".split("/")[2]).yyyymmdd()),
    //        currencyID: "VNĐ",
    //        companyID: "ff7084c7-cac8-412a-b851-b75727db97ab"
    //    };
    //    var listFilter = []
    //    // var filterModels = this.getListFilterConditional();

    //    $.ajax({
    //        url: MISA.URLConfig.reportURL + "GeneralLedger/GetTotalRecordAsync",
    //        method: "GET",
    //        dataType: "json",
    //        contentType: "application/json;charset=utf-8",
    //        // beforeSend: function (xhrObj) {
    //        //     xhrObj.setRequestHeader("Content-Type", "application/json");
    //        //     xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
    //        // },
    //        headers: {
    //            "reportParamEncoded": encodeURI(JSON.stringify(reportParam)),
    //            "listFilterEncoded": encodeURI(JSON.stringify(listFilter))
    //        },
    //        success: function (data, textStatus, xhr) {
    //            debugger
    //            if (data.success === true) {
    //                $('#totalRecord').text(data.data);
    //            }
    //            // if (data.code != null && data.code == 401) {
    //            //     window.location = "./login.html"
    //            // }
    //            // $('#totalRecord').text(data);
    //            // var pageSize = $("#inputTotalRecord").val();
    //            // totalPages = data % pageSize == 0 ? data / pageSize : (Math.floor(data / pageSize) + 1);
    //            // $('#totalPage').text(totalPages);
    //        },
    //        error: function (xhr, textStatus, errorThrown) {
    //            console.log('Đã có lỗi xảy ra, vui lòng thử lại sau');
    //            console.log("error: " + errorThrown);
    //            debugger
    //        }
    //    })

    //};

    ///*
    //* Thực hiện lấy danh sách filter
    //* Created by: DVCONG
    //*/
    //getListFilterConditional() {
    //    debugger
    //    //string filterName, string filterValue, string filterType, string filterDatatype
    //    var column = $('#tblCustomerList #filterElement th div div input');
    //    var fieldName = [];
    //    column.each(function (index, item) {
    //        var itemFieldName = $(item).attr('fieldname');
    //        fieldName.push(itemFieldName);
    //    });


    //    var filterModels = [];
    //    var filterType;
    //    var filterValue;
    //    var fieldSelect;
    //    // fill giá trị các trường filter vào 

    //    fieldName.forEach(function (fieldName, indexField) {
    //        filterValue = $('[fieldname = "' + fieldName + '"]').val();
    //        fieldSelect = "#f" + fieldName;
    //        // Chuyển định dạng các trường là ngày tháng năm
    //        if (fieldName == "PostedDate" || fieldName === "RefDate" || fieldName == "CashBookPostedDate") {
    //            if (filterValue) {
    //                var splitDate = filterValue.split("/");
    //                var newDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
    //                filterValue = new Date(newDate).yyyymmdd();
    //                filterType = $(fieldSelect).val();
    //            }

    //        } else if (fieldName === "TotalAmount") {
    //            if (filterValue) {
    //                filterValue = splitAmount($('[fieldname = "' + fieldName + '"]').val());
    //                filterType = $(fieldSelect).val();
    //            }
    //        } else {
    //            //$fieldSelect = "#f" + fieldName;
    //            filterValue = $('[fieldname = "' + fieldName + '"]').val();
    //            filterType = $(fieldSelect).val();
    //        }
    //        if (filterValue && fieldName !== "ReasonTypeName") {
    //            filterModels.push({
    //                "FieldName": fieldName,
    //                "Value": filterValue,
    //                "DataType": "",
    //                "FilterType": filterType
    //            });
    //        }
    //    });
    //    return filterModels;

    //}

    //loadReportData() {
    //    var reportParam = {
    //        fromDate: new Date(new Date("12/02/2020".split("/")[1] + "/" + "12/02/2020".split("/")[0] + "/" + "12/02/2020".split("/")[2]).yyyymmdd()),
    //        toDate: new Date(new Date("22/12/2020".split("/")[1] + "/" + "22/12/2020".split("/")[0] + "/" + "22/12/2020".split("/")[2]).yyyymmdd()),
    //        currencyID: "VNĐ",
    //        companyID: "ff7084c7-cac8-412a-b851-b75727db97ab"
    //    };
    //    var pagingParam = {
    //        pageNumber: 1,
    //        pageSize: 100
    //    };
    //    var listFilter = [
    //        {
    //            FieldName: "a",
    //            Value: "b",
    //            FilterType: "c",
    //            DataType: "e"
    //        },
    //        {
    //            FieldName: "a",
    //            Value: "b",
    //            FilterType: "c",
    //            DataType: "e"
    //        },
    //        {
    //            FieldName: "a",
    //            Value: "b",
    //            FilterType: "c",
    //            DataType: "e"
    //        }
    //    ]
    //    $.ajax({
    //        url: MISA.URLConfig.reportURL + "GeneralLedger/GetReportGeneralLedgersAsync",
    //        method: "GET",
    //        headers: {
    //            "reportParamEncoded": encodeURI(JSON.stringify(reportParam)),
    //            "pagingParamEncoded": encodeURI(JSON.stringify(pagingParam)),
    //            "listFilterEncoded": encodeURI(JSON.stringify(listFilter))
    //        },
    //        //dataType: "json",
    //        contentType: "application/json;charset=utf-8",
    //        success: function (data, textStatus, xhr) {
    //            debugger
    //        },
    //        error: function (xhr, textStatus, errorThrown) {
    //            debugger
    //        }
    //    })
    //}

    ////Các sự kiện nút trên form popup cashbook

    //btnParam_OnClick() {
    //    reportJS.CashbookForm.Show();
    //}

    //btnCancelParam_OnClick() {
    //    reportJS.btnClearParam_OnClick();
    //    reportJS.CashbookForm.Close();
    //}

    //btnAcceptParam_OnClick() {
    //    var reportParam = {
    //        FromDate: $('#txtFromDate').val(),
    //        ToDate: $('#txtToDate').val(),
    //        CurrencyTD: "VNĐ", //$('#txtParamCurrencyID').val()
    //        CompanyID: "ff7084c7-cac8-412a-b851-b75727db97ab"
    //    }
    //    localStorage.setItem('reportParam', JSON.stringify(reportParam));
    //    reportJS.CashbookForm.Close();
    //}

    //btnClearParam_OnClick() {
    //    $("#txtParamDepartmentName").val("");
    //    $("#txtAccountingPeriod").val("");
    //    $("#txtFromDate").val("");
    //    $("#txtToDate").val("");
    //    $("#txtParamCurrencyID").val("");
    //}

    //// Sự kiện click in
    //btnPrint_OnClick() {
    //    var row = "";
    //    var data = new Array();
    //    var dataToBind = new Array();
    //    var table = $('#tbodyRAE');
    //    var l = table[0].rows.length;
    //    for (var i = 0; i < l; i++) {

    //        for (var j = 0; j < table[0].rows[i].cells.length; j++) {
    //            row += table[0].rows[i].cells[j].innerHTML;
    //            row += ",";
    //            data[i] = new Array();
    //            data[i].push(row);
    //        }
    //    }
    //    console.log(data[0]);
    //}
}
var reportJS = new ReportsJS();
// var reportJS = Object.create({
//     printPreview: function () {
//         var printWindow = window.open('', '', 'fullscreen=yes');
//         printWindow.document.write('<!DOCTYPE html>');
//         printWindow.document.write('<head>\
//         <meta charset="utf-8" />\
//         <title>Sổ quỹ tiền mặt</title>\
//         <link href="../CSS/Views/report-template.css" rel="stylesheet"/>\
//     </head>');
//         printWindow.document.write('<body onload="printReport()">');
//         printWindow.document.write('<div id="rp-wrapper">');
//         printWindow.document.write('<div id="header">\
//         <div id="header-left">\
//             <b>Công ty Cổ phần MISA</b><br>\
//             Tầng 9 TechnoSoft, ngõ 15 Duy Tân\
//         </div>\
//         <div id="header-right">\
//             <div id="templateID">Mẫu số S07b-DN</div>\
//             <div id="description">\
//                 <span>(Ban hành theo thông tư số 13/12/2016 TT-BTC</span><br>\
//                 <span>Ngày 26-10-2011 của bộ tài chính)</span>\
//             </div>\
//         </div>\
//     </div>')
//         printWindow.document.write('</div>')
//         printWindow.document.write('<script>\
//         function printReport() {\
//           window.print();\
//           window.close();\
//         }\
//         </script>');
//         printWindow.document.write('</body>')

//         printWindow.document.close();
//         printWindow.focus();
//     }
// })

/**
 * Thực hiện chuyển tiền sang chuỗi
 * @param {any} totalAmount Số tiền nhập vào
 * @returns {any} Số tiền sau khi covert
 * Created by: VVKIET(23/01/2019)
 */
function converCurrencyToString(totalAmount) {
    var totalAmounts = totalAmount.split(".");
    totalAmount = "";
    $.each(totalAmounts, function (key, value) {
        totalAmount += value;
    });
    return totalAmount;
}