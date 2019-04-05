$(document).ready(function () {
    var fakeData = [];
    for (var i = 0; i < 100; i++) {
        fakeData.push({
            PostedDate: '21/04/2018',
            RefDate: '21/04/2018',
            RefNo: 'UNC00013' + i,
            JournalMemo: 'Trả lương nhân viên tháng 4 năm 2018',
            RefTypeName: 'Chi tiền lương cho Nhân viên',
            TotalAmount: '245041092',
            AccountObjectName: 'Công ty TNHH Phú Thái',
            ReasonTypeName: 'Trả lương nhân viên',
            CashBookPostedDate: '21/04/2018',
            RefNoFiance: 'CT00001' + i,
            DepartmentName: 'Công ty Cổ Phần MISA',
        })
    }
    //$('#tblCustomerList').on('click', { scope: '#btnAdd' }, raeJS.btnAdd_OnClick().call());
    //raeJS.btnAdd_OnClick();
})

class ReceiptsAndExpensesJS {
    constructor() {
        this.RefType = null;
        this.initDetailForm();
        this.initEvents();
        this.loadData();
        this.me = this;
        this.editMode = null;
    };
    /*
     * Thiết lập form chi tiết
     */
    initDetailForm() {
        this.DetailForm = new FormPopup('#frmRAEDetail', 800, null, true, this);
    };

    initEvents() {
        $('#tblCustomerList').on('click', { scope: '#tbodyRAE tr' }, this.rowRAE_OnClick);
        $(document).on('dbclick', '#tbodyRAE tr', this.btnAdd_OnClick.bind(this));
        //$('#tblCustomerList').on('click', { scope: '#btnAdd' }, this.btnAdd_OnClick.bind(this));
        //$('#btnAdd').click(this.btnAdd_OnClick.bind(this));

        $('#btnAddReceipt').on('click', { refType: enumeration.RefType.Receipt }, this.btnAdd_OnClick.bind(this));
        $('#btnAddEx').on('click', { refType: enumeration.RefType.Expense }, this.btnAdd_OnClick.bind(this));
        $(document).on('click', '#btnSave', this.btnSave_OnClick.bind(this));
        $(document).on('click', '#btnSaveAdd', this.btnSaveAdd_OnClick.bind(this));
        $(document).on('click', '#btnCancel', this.btnCancel_OnClick.bind(this));
        $('#btnEdit').on('click', { refType: enumeration.RefType.Expense }, this.btnEdit_OnClick.bind(this));

    };

    /*
     * Thực hiện load dữ liệu màn hình danh sách.
     * Created by: NVMANH (22/01/2019)
     */
    loadData() {
        //Get data
        var fakeData = [];
        for (var i = 0; i < 100; i++) {
            fakeData.push({
                RefId: 1 + i,
                PostedDate: '21/04/2018',
                RefDate: '21/04/2018',
                RefNo: 'UNC00013' + i,
                RefType: 1,
                JournalMemo: 'Trả lương nhân viên tháng 4 năm 2018',
                RefTypeName: 'Chi tiền lương cho Nhân viên',
                TotalAmount: '245041092',
                AccountObjectName: 'Công ty TNHH Phú Thái',
                ReasonTypeName: 'Trả lương nhân viên',
                CashBookPostedDate: '21/04/2018',
                RefNoFiance: 'CT00001' + i,
                DepartmentName: 'Công ty Cổ Phần MISA',
            })
        }
        this.buildDataIntoTable(fakeData);
    };

    // Build dữ liệu lên bảng:
    buildDataIntoTable(data) {
        var table = $('#tbodyRAE');
        table.html('');
        // Lấy thông tin các cột dữ liệu:
        var column = $('#tblCustomerList .gridHeader th');
        var rowTemplate = [];
        var fieldData = [];
        rowTemplate.push('<tr class="{0}">');
        column.each(function (index, item) {
            fieldData.push($(item).attr('fieldData'));
        })
        data.forEach(function (item, index) {
            var htmlItem = [];
            htmlItem.push('<tr refid=' + item.RefId + ' class="{0}">'.format(index % 2 === 0 ? '' : 'row-highlight'));
            fieldData.forEach(function (valueField, indexField) {
                if (indexField === 0) {
                    htmlItem.push('<td class="no-border-left" >{0}</td>'.format(item[valueField]));
                } else {
                    htmlItem.push('<td>{0}</td>'.format(item[valueField]));
                }
            })
            htmlItem.push('</tr>');
            table.append(htmlItem.join(""));

        });

        // Chọn dòng đầu tiên:
        commonJS.setFirstRowSelected($('#tblCustomerList'))
    };


    /*
     * Thực hiện trước khi mở form
     * Created by: NVMANH (22/01/2019)
     */
    beforeOpenDetail() {
        if (raeJS.editMode == 2) {
            // Thực hiện lấy dữ liệu:
            var dataMasterFake = {
                AccountObjectNumber: 4,
                AccountObjectCode: "CTBD",
                AccountObjectName: "Cục thuế quận Ba Đình",
                AccountObjectType: 2,
                Address: "Hoàng Cầu, Đống Đa, Hà Nội",
                ContactName: "Phạm Văn Thịnh",
                ReasonID: 1,
                RefType: 1,
                ReasonName: "Rút tiền gửi về nộp quỹ",
                Description: "Rút tiền gửi về nộp quỹ",
                EmployeeName: "Nguyễn Quang Tuấn",
                PostedDate: '21/04/2018',
                RefDate: '21/04/2018',
                RefNo: 'UNC00013',

            }
            // Bind thông tin dữ liệu master:
            var dataIndexs = $('input[dataindex]');
            if (dataIndexs && dataIndexs.length > 0) {
                $.each(dataIndexs, function (index, item) {
                    var dataIndex = $(item).attr('dataindex');
                    var dataType = $(item).attr('data-type');
                    if (dataType == 'Date') {
                        $(item).val('2017-12-12');
                    } else {
                        $(item).val(dataMasterFake[dataIndex]);
                    }
                });
            }
        // Bind thông tin dữ liệu detail:

        }

    };


    // Chọn 1 bản ghi trong danh sách:
    rowRAE_OnClick() {
        commonJS.showMask($('.frmCustomerDetail .rae-detail-box'));
        // Lấy Detail từ Service:
        var RAEDetail = [];
        var detail = {
            JournalMemo: "Trả lương cho nhân viên",
            CreditAmount: '3221',
            DebitAmount: 1112,
            TotalAmount: "1243.456.700",
            AccountObject: "223768569",
            AccountObjectName: "Công ty Cổ Phần MISA",
            DepartmentName: "Công ty Cổ Phần MISA",
            StatisCode: "",
        }
        for (var i = 0; i < 4; i++) {
            (function () {
                detail.CreditAmount += i;
                RAEDetail.push(detail);
            })(i)
        }

        // Buid dữ liệu Detail:
        var tbody = $('#tbodyRAEDetail');
        tbody.html('');

        // Lấy thông tin các cột dữ liệu:
        var column = $('table#tblRAEDetail .gridHeader th');
        var rowTemplate = [];
        var fieldData = [];
        rowTemplate.push('<tr class="{0}">');
        column.each(function (index, item) {
            fieldData.push($(item).attr('fieldData'));
        })
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
        }, 500)
    };

    detailFormOnBeforeOpen(args) {
        var refType = args[0].data.refType;
        this.RefType = refType;
        if (refType == enumeration.RefType.Receipt) {
            $("span.ui-dialog-title").text('Phiếu thu');
            $('.title-form-detail').text('Phiếu thu');
            $('#lblReason').text('Lý do thu');
            $('#lblEmployee').text('Nhân viên thu');
        } else {
            $("span.ui-dialog-title").text('Phiếu chi');
            $('.title-form-detail').text('Phiếu chi');
            $('#lblReason').text('Lý do chi');
            $('#lblEmployee').text('Nhân viên chi');
        }
    };
    /**
     * Thực hiện thêm mới
     */
    btnAdd_OnClick() {
        this.editMode = 1;
        this.detailFormOnBeforeOpen(arguments);
        this.DetailForm.Show();
    };

    btnEdit_OnClick() {
        this.editMode = 2;
        this.detailFormOnBeforeOpen(arguments);
        this.DetailForm.Show();
    };

    /**
     * Thực hiện CẤT:
     */
    btnSave_OnClick() {
        alert('btnSave_OnClick');
    };

    /* -------------------------------------------------------------------
     * Nhấn button Cất và thêm mới
     * Created by: NVMANH (20/05/2018)
     */
    btnSaveAdd_OnClick(event) {
        alert('btnSaveAdd_OnClick');
    };

    btnCancel_OnClick(event) {
        this.DetailForm.Close();
    };

    btnHelp_OnClick(event) {
        alert('btnHelp_OnClick');
    };

    accountObjectItem_OnSelect() {
        // Lấy thông tin đối tượng được chọn:
        var accountObjectCode = $(event.target).attr('item-value');
        var accounts = dataResource.AccountObject.filter(function (e) { return e.AccountObjectCode == accountObjectCode });
        debugger;
        if (accounts && accounts.length > 0) {
            var account = accounts[0];
            $('#txtAccountObjectName').val(account.AccountObjectName);
            $('#txtAccountObjectAddress').val(account.Address);
            $('#txtAccountDebit').val(account.AccountObjectNumber);
            $('#txtContactName').val(account.ContactName);
        }

    };
    reasonItem_OnSelect() {
        // Lấy thông tin đối tượng được chọn:
        var reasonId = $(event.target).attr('item-value');
        var reasons = dataResource.Reason.filter(function (e) { return e.ReasonID == reasonId });
        if (reasons && reasons.length > 0) {
            var reason = reasons[0];
            $('#txtReasonName').val(reason.ReasonName);
            $('#txtEmployeeName').val(reason.EmployeeName);
        }
    };
    beforeCloseDialog() {
        $('#frmRAEDetail input').val(null);
    }
}
var raeJS = new ReceiptsAndExpensesJS();

