// Lấy số trang
var page = $("#currentPage").val();
var totalRecord = $("#inputTotalRecord").val();
$("#ajax_loader").css("display", "block");
$.ajax({
    url: "https://localhost:51025/api/payment/GetPaymentByCompany",
    beforeSend: function (xhrObj) {
        // Request headers
        xhrObj.setRequestHeader("Content-Type", "application/json");
        // Mã xác thực api
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4b254658088e442fb082c489acb53023");
        xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
    },
    method: "GET",
    headers: {
        page: page,
        totalRecord: totalRecord
    },
    success: function (data, textStatus, xhr) {
        // Lưu data(List danh sách các payment) vào localStorage
        localStorage.setItem('payment', JSON.stringify(data));
        $.each(data, function (key, value) {
            raeJS.buildDataIntoTable(data);  // Đổ dữ diệu ra
        });
        $("#ajax_loader").css("display", "none");
        $('#tblCustomerList').on('click', '#tbodyRAE tr', raeJS.rowRAE_OnClick);
        $('#tblCustomerList').on('dblclick', '#tbodyRAE tr', raeJS.btnAdd_OnClick);
        $('#btnAdd').click(raeJS.btnAdd_OnClick);
        $('#btnEdit').click(raeJS.btnAdd_OnClick);
        $('#btnDelete').click(raeJS.btnDelete_OnClick);
    },
    error: function (xhr, textStatus, errortdrown) {
    }
});

var id = "";
var raeJS = Object.create({
    // Form chi tiết:
    dialogDetail: $("#frmRAEDetail").dialog({
        autoOpen: false,
        width: 800,
        modal: true,
        buttons: {
            // Thêm một payment
            "Cất": function () {
                var createPayment = new Object();
                createPayment.CompanyId = JSON.parse(localStorage.getItem("payment"))[0].companyId;
                createPayment.PostedDate = $("#postedDate").val();
                createPayment.RefDate = $("#refDate").val();
                createPayment.RefNo = $("#refNo").val();
                createPayment.JournalMemo = $("#journalMemo").val();
                createPayment.TotalAmount = $("#totalAmount").val();
                createPayment.AccountObjectName = $("#accountObjectName").val();
                createPayment.ReasonTypeName = $("#reasonTypeName").val();
                createPayment.CashBookPostedDate = $("#cashBookPostedDate").val();
                createPayment.RefTypeName = $("#refTypeName").val();
                createPayment.RefNoFiance = $("#refNo").val();
                createPayment.DepartmentName = $("#departmentName").val();
                $.ajax({
                    url: "https://localhost:51025/api/payment/Create",
                    beforeSend: function (xhrObj) {
                        // Request headers
                        xhrObj.setRequestHeader("Content-Type", "application/json");
                        // Mã xác thực api
                        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4b254658088e442fb082c489acb53023");
                        xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
                    },
                    data: JSON.stringify(createPayment),
                    method: "POST",
                    success: function (data, textStatus, xhr) {
                        $("#ajax_loader").css("display", "none");
                        alert("Thành công!");
                        window.location = "./receipt.html";
                        raeJS.dialogDetail.dialog("close");
                    },
                    error: function (xhr, textStatus, errortdrown) {
                        alert("Thất bại!");
                    }
                });
            },
            "Hủy bỏ": function () {
                raeJS.dialogDetail.dialog("close");
            }
        },
        //open: function () {
            // Thực hiện binding các thông tin:
            //var fakeData = {
                //PostedDate: '21/04/2018',
                //RefDate: '21/04/2018',
                //RefNo: vvkiet
                //JournalMemo: 'Trả lương nhân viên tháng 4 năm 2018',
                //RefTypeName: 'Chi tiền lương cho Nhân viên',
                //TotalAmount: '245041092',
                //AccountObjectName: 'Công ty TNHH Phú Thái',
                //ReasonTypeName: 'Trả lương nhân viên',
                //CashBookPostedDate: '21/04/2018',
                //RefNoFiance: 'CT00001' + i,
                //DepartmentName: 'Công ty Cổ Phần MISA',
            //};
            //var detail = {
            //    JournalMemo: "Trả lương cho nhân viên",
            //    CreditAmount: '3221',
            //    DebitAmount: 1112,
            //    TotalAmount: "1243.456.700",
            //    AccountObject: "223768569",
            //    AccountObjectName: "Công ty Cổ Phần MISA",
            //    DepartmentName: "Công ty Cổ Phần MISA",
            //    StatisCode: ""
            //};

        //},
        close: function () {
            raeJS.dialogDetail.dialog("close");
        }
    }),

    //Load dữ liệu
    loadData: function () {
        // Gọi Service lấy dữ liệu trả về:

        // Build dữ liệu lên table (fakeData sẽ là dữ liệu thật lấy từ Service trả về - kiểu mảng):
        raeJS.buildDataIntoTable(fakeData);
    },

    // Build dữ liệu lên bảng:
    buildDataIntoTable: function (data) {
        var table = $('#tbodyRAE');
        table.html('');
        // Lấy thông tin các cột dữ liệu:
        var column = $('#tblCustomerList .gridHeader th');
        var rowTemplate = [];
        var fieldData = [];
        rowTemplate.push('<tr class="{0}">');
        column.each(function (index, item) {
            // xử lý trường hợp tên Propery bị lowerCase ký tự đầu khi nhận dữ liệu json trả về
            var itemFieldData = $(item).attr('fieldData');
            itemFieldData = itemFieldData.charAt(0).toLocaleLowerCase() + itemFieldData.substr(1);
            fieldData.push(itemFieldData);
        });
        data.forEach(function (item, index) {
            var htmlItem = [];
            htmlItem.push('<tr class="{0}">'.format(index % 2 === 0 ? '' : 'row-highlight'));
            fieldData.forEach(function (valueField, indexField) {
                if (indexField === 0) {
                    htmlItem.push('<td class="' + item.id + ' no-border-left">{0}</td>'.format(item[valueField]));
                } else {
                    htmlItem.push('<td class="' + item.id + '">{0}</td>'.format(item[valueField]));
                }
            });
            htmlItem.push('</tr>');
            table.append(htmlItem.join(""));
        });
    },

    // Chọn 1 bản ghi trong danh sách:
    rowRAE_OnClick: function (e) {
        commonJS.showMask($('.frmCustomerDetail .rae-detail-box'));
        //Lấy Detail từ LocalStorage "payment":
        var RAEDetail = [];
        //lấy company_id
        id = e.target.className.split(" ")[0];
        $('tr').removeClass('rowSelected');
        $(this).addClass("rowSelected");
        var payment = JSON.parse(localStorage.getItem("payment"));
        $.each(payment, function (key, value) {
            if (id === value.id) {
                var accountObjectName = value.accountObjectName;
                var departmentName = value.departmentName;
                $.each(value.paymentDetail, function (key, value) {
                    RAEDetail.push(value);
                    value.accountObjectName = accountObjectName;
                    value.departmentName = departmentName;
                });

            }
        });

        // Buid dữ liệu Detail:
        var tbody = $('#tbodyRAEDetail');
        tbody.html('');

        // Lấy thông tin các cột dữ liệu:
        var column = $('table#tblRAEDetail .gridHeader th');
        var rowTemplate = [];
        var fieldData = [];
        rowTemplate.push('<tr class="{0}">');
        column.each(function (index, item) {
            // xử lý trường hợp tên Propery bị lowerCase ký tự đầu khi nhận dữ liệu json trả về
            var itemFieldData = $(item).attr('fieldData');
            itemFieldData = itemFieldData.charAt(0).toLocaleLowerCase() + itemFieldData.substr(1);
            fieldData.push(itemFieldData);
        });
        RAEDetail.forEach(function (item, index) {
            var htmlItem = [];
            htmlItem.push('<tr class="{0}">'.format(index % 2 === 0 ? '' : 'row-highlight'));
            fieldData.forEach(function (valueField, indexField) {
                if (indexField === 0) {
                    htmlItem.push('<td class="no-border-left" >{0}</td>'.format(item[valueField]));
                } else {
                    htmlItem.push('<td>{0}</td>'.format(item[valueField]));
                }
            });
            htmlItem.push('</tr>');
            tbody.append(htmlItem.join(""));
        });
        setTimeout(function () {
            commonJS.hideMask($('.frmCustomerDetail .rae-detail-box'));
        }, 500);
    },

    // Nhấn Button thêm:
    btnAdd_OnClick: function () {
        raeJS.dialogDetail.dialog('open');
    },

    btnDelete_OnClick: function () {
        $.ajax({
            url: "https://localhost:51025/api/payment/Delete/" + id,
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                // Mã xác thực api
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4b254658088e442fb082c489acb53023");
                xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
            },
            //data: JSON.stringify(createPayment),
            method: "DELETE",
            success: function (data, textStatus, xhr) {
                $("#ajax_loader").css("display", "none");
                alert("Xóa thành công!");
                window.location = "./payment.html";
            },
            error: function (xhr, textStatus, errortdrown) {
                alert("Xóa thất bại!");
            }
        });
    }
});

