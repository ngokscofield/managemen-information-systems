$(document).ready(function () {
    $("#btnPrintReport").click(function () {
        //window.print();
        reportJS.reportReceipt();
    });
    //$('#btnViewReport').click(function () {
    //    reportJS.reportReceipt();
    //});
    //$('#btnClearReport').click(function () {
    //    location.reload();
    //});
});

var reportJS = Object.create({
    reportReceipt() {
        //string filterName, string filterValue, string filterType, string filterDatatype    
        var a = [{
            "DateStart": new Date($('#dateStart').val()).ddmmyyyy(),
            "DateEnd": new Date($('#dateEnd').val()).ddmmyyyy(),
            "TotalRecord": $('#totalRecord').val()
        }];
        commonJS.showMask();
        $.ajax({
            url: "https://localhost:60235/api/receipt/ReportReceipt",
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                // Mã xác thực api
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
                xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
            },
            data: JSON.stringify(a),
            method: "POST",
            success: function (data, textStatus, xhr) {
                var totalAmount = 0;
                $.each(data, function (key, value) {
                    $('#report-table').append('<tr>'
                        + '<td>' + new Date(value.postedDate).ddmmyyyy() + '</td >'
                        + '<td>' + new Date(value.refDate).ddmmyyyy() + '</td>'
                        + '<td>' + value.refNo + '</td>'
                        + '<td>0</td>'
                        + '<td>' + value.journalMemo + '</td>'
                        + '<td>' + value.totalAmount + '</td>'
                        + '<td>0</td>'
                        + '<td>0</td>'
                        + '<td>' + value.contactName + '</td>'
                        + '<td>' + value.refTypeName + '</td>'
                        + '<td>Không có gì</td>'
                        + '</tr>');
                    totalAmount += new Number(value.totalAmount);
                });
                $('#report-table').append('<tr id = "sum">'
                    + '<td colspan="5" class="bold-font">Tổng cộng:</td>'
                    + '<td class="bold-font">' + totalAmount + '</td>'
                    + '<td class="bold-font">0</td>'
                    + '<td class="bold-font">0</td>'
                    + '<td></td>'
                    + '<td></td>'
                    + '<td></td>'
                + '</tr>');
                

                commonJS.hideMask();
                window.print();
                //commonJS.showSuccessMsg("Thành công!");
            },
            error: function (xhr, textStatus, errortdrown) {
                commonJS.hideMask();
                commonJS.showSuccessMsg("Thất bại!");
            }
        });
    }
});