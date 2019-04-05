var companyPartner = [];
$(document).ready(function () {
    dataResource.initData();
});
var dataResource = Object.create({
    companyPartner: [],
    initData: function () {
        $.ajax({
            url: "http://localhost:60235/api/accountobject/GetObjectByCompany",
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                // Mã xác thực api
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
                xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
            },
            async: true,
            method: "GET",
            success: function (data, textStatus, xhr) {
                $.each(data.data, function (key, value) {
                    companyPartner.push({
                        AccountObjectID: value.accountObjectID,
                        AccountObjectCode: "CT000" + (key + 1),
                        AccountObjectName: value.accountObjectName,
                        AccountObjectAddress: value.accountObjectAddress,
                        ContactName: "NV000" + (key + 1)
                    });
                });
                dataResource.AccountObject = companyPartner;
            },
            error: function (xhr, textStatus, errortdrown) {
                console.log("Thất bại khi gọi api GetObjectByCompany");
            }
        });
    },
    AccountObject: [],
    Reason: [{
        ReasonID: 1,
        RefType: 1,
        ReasonName: "Rút tiền gửi về nộp quỹ",
        RefJournalMemo: "Rút tiền gửi về nộp quỹ",
        EmployeeName: "Nguyễn Quang Tuấn"
    },
    {
        ReasonID: 2,
        RefType: 1,
        ReasonName: "Thu hoàn thuế GTGT",
        RefJournalMemo: "Thu hoàn thuế GTGT",
        EmployeeName: "Hoàng Phan Bảo Trung"
    },
    {
        ReasonID: 3,
        RefType: 1,
        ReasonName: "Thu hoàn ứng",
        RefJournalMemo: "Thu hoàn ứng sau khi quyết toán tạm ứng nhân viên",
        EmployeeName: "Trần Diễm Giang"
    },
    {
        ReasonID: 4,
        RefType: 1,
        ReasonName: "Thu khác",
        RefJournalMemo: "Thu khác",
        EmployeeName: "Nguyễn Thị Trang"
    },
    {
        ReasonID: 5,
        RefType: 2,
        ReasonName: "Tạm ứng cho nhân viên",
        RefJournalMemo: "Tạm ứng cho nhân viên",
        EmployeeName: "Nguyễn Quang Tuấn"
    },
    {
        ReasonID: 6,
        RefType: 2,
        ReasonName: "Gửi tiền vào ngân hàng",
        RefJournalMemo: "Gửi tiền vào ngân hàng",
        EmployeeName: "Hoàng Phan Bảo Trung"
    },
    {
        ReasonID: 7,
        RefType: 2,
        ReasonName: "Chi khác",
        RefJournalMemo: "Thu hoàn ứng sau khi quyết toán tạm ứng nhân viên",
        EmployeeName: "Chi khác"
    }
    ],
    ReportPeriod: [{
        ReportPeriodID: 1,
        ReportPeriodName: "Tháng này"
    },
    {
        ReportPeriodID: 2,
        ReportPeriodName: "Quý này"
    },
    {
        ReportPeriodID: 3,
        ReportPeriodName: "Năm nay"
    },
    {
        ReportPeriodID: 4,
        ReportPeriodName: "Năm trước"
    },
    {
        ReportPeriodID: 5,
        ReportPeriodName: "Quý trước"
    },
    {
        ReportPeriodID: 6,
        ReportPeriodName: "Tháng trước"
    }
    ],
    Department: [{
        DepartmentID: 1,
        DepartmentName: "Công ty cổ phần MISA chi nhánh Đà Nẵng"
    },
    {
        DepartmentID: 2,
        DepartmentName: "Công ty cổ phần MISA chi nhánh Buôn Ma Thuật"
    },
    {
        DepartmentID: 3,
        DepartmentName: "Công ty cổ phần MISA chi nhánh Hà Nội"
    },
    {
        DepartmentID: 4,
        DepartmentName: "Công ty cổ phần MISA chi nhánh TP. Hồ Chí Minh"
    },
    {
        DepartmentID: 5,
        DepartmentName: "Công ty cổ phần MISA chi nhánh Cần Thơ"
    }
    ],
    Currency: [{
        CurrencyID: 1,
        CurrencyName: "VNĐ"
    },
    {
        CurrencyID: 2,
        CurrencyName: "USD"
    },
    {
        CurrencyID: 3,
        CurrencyName: "CLP"
    }
    ]
});