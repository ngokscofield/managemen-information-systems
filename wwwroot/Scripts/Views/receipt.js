// Dùng để phân biệt giữa phiếu thu và phiếu chi
var refType = 0;
// Đếm số dòng của bảng detail
var setCountRow = 0;
// Lấy tổng số bản ghi của phiếu thu
var getTotalReceipt = 0;
// Id của một công ty
var companyId = "";
// Mảng chứa các thuộc tính của các ô filter
var arrayFilterModels = [];
// Kiểm tra phím Ctrl có đang được nhấn hay không
var isCtrl = false;
// Lấy vị trí của các ô filter trên header
var getPositionFilter = 0;


$(document).ready(function () {
    // Sự kiện phím Ctrl + F8 dùng để gọi đến sự kiện nút Lưu phiếu thu
    $("#frmRAEDetail").keydown(function (e) {
        if (e.which === 17) {
            isCtrl = true;
        }
        if (e.which === 119 && isCtrl) {
            $("#btnSave").trigger('click');
        }
    });

    // Sự kiện phím Delete dùng để gọi đến sự kiện nút Xóa
    $(window).keydown(function (e) {
        if (e.which === 46) {
            $("#btnDelete").trigger('click');
        }
    });

    // Sự kiện phím Insert dùng để gọi đến sự kiện nút Thêm phiếu thu
    $(window).keydown(function (e) {
        if (e.which === 45) {
            $("#btnAddReceipt").trigger('click');
        }
    });

    // Sự kiện phím F4 dùng để gọi đến sự kiện nút Nhân bản
    $(window).keydown(function (e) {
        if (e.which === 115) {
            $("#btnDuplicate").trigger('click');
        }
    });

    // Sự kiện phím Ctrl + F3 dùng để gọi đến sự kiện nút Sửa
    $(window).keydown(function (e) {
        if (e.which === 114) {
            $("#btnEdit").trigger('click');
        }
    });

    // Sự kiện phím Ctrl + F6 dùng để gọi đến sự kiện nút Nạp
    $(window).keydown(function (e) {
        if (e.which === 117) {
            $("#btnRefresh").trigger('click');
        }
    });

    // Sự kiện phím F2 dùng để gọi đến sự kiện nút Sửa nhanh
    $("#frmRAEDetail").keydown(function (e) {
        if (e.which === 113) {
            $("#btnEditReceipt").trigger('click');
        }
    });

    // Sự kiện phím mũi tên phải dùng để gọi đến next receipt
    $("#frmRAEDetail").keydown(function (e) {
        if (e.which === 39) {
            $("#btnNext").trigger('click');
        }
    });

    // Sự kiện phím mũi tên trái dùng để gọi đến prev receipt
    $("#frmRAEDetail").keydown(function (e) {
        if (e.which === 37) {
            $("#btnNext").trigger('click');
        }
    });

    // Chuyển định dạng string sang tiền ở ô input Tổng tiền
    $("#filterInputTotalAmount").focus(function () {
        $(this).keyup(function () {
            raeJS.inputTotalAmount_Onclick(this.id, this.value);
        });
    });

    // Sự kiện phím lên xuống để gọi hàm checkArrow
    $(document).on("keydown", raeJS.checkArrow);

    // Add giao diện lịch cho các ô input có kiểu ngày tháng năm
    $('[fieldname="RefPostedDate"]').datepicker({ dateFormat: "dd-mm-yy" });
    $('[fieldname="RefDate"]').datepicker({ dateFormat: "dd-mm-yy" });
    $('[fieldname="CashBookPostedDate"]').datepicker({ dateFormat: "dd-mm-yy" });

    // Sự kiện click chuột phải vào bảng (tbodyRAE)
    $("body").on("contextmenu", "#tbodyRAE tr", function (e) {
        $(this).trigger("click");
        $(this).siblings('.rowSelected').removeClass('rowSelected');
        this.classList.add('rowSelected');
        $("#contextMenu").css({
            display: "block",
            left: e.pageX,
            top: e.pageY
        });
        return false;
    });
    $('html').click(function () {
        $("#contextMenu").hide();
    });

    // Sự kiện cuộn bảng khi di chuyển đến dòng đầu tiền của bảng
    $('#frmRAEDetail .rae-detail-box').scroll(function (e) {
        $("#btnAddRowReceiptDetail").children().children().css("padding-left", $('#frmRAEDetail .rae-detail-box').scrollLeft() + 6 + "px");
    });

    
});

class ReceiptsAndExpensesJS {
    constructor() {
        this.RefType = null;
        this.initDetailForm();
        getTotalReceiptRecord();
        this.initEvents();
        this.loadData();
        this.me = this;
        this.editMode = null;
        this.refresh = false;
    }
    /* *
     * Thiết lập form chi tiết
     * Created by: NVMANH (22/01/2019)
     */
    initDetailForm() {
        this.DetailForm = new FormPopup('#frmRAEDetail', 800, null, true, this);
        this.CashbookForm = new FormPopup('#frmCashBook', 450, null, true, this);
    }


    /* *
     *  Các sự kiện được gọi
     *  Created by: NVMANH (22/01/2019)
     */
    initEvents() {
        $('#tblCustomerList').on('click', '#tbodyRAE tr', this.rowRAE_OnClick);
        //$('#tblCustomerList').on('click', { scope: '#tbodyRAE tr' }, this.rowRAE_OnClick); // 
        $('#tbodyRAE').on('dblclick', 'tr', this.btnEdit_OnClick.bind(this));
        //$('#tblCustomerList').on('dblclick', { scope: '#btnAdd' }, this.btnAdd_OnClick.bind(this));
        $('#btnAdd').click(this.btnAdd_OnClick.bind(this));
        $('.btnDelete').click(this.btnDelete_OnClick.bind(this));
        //$('#btnDelete').click(this.btnDelete_OnClick.bind(this));
        $('.btnDuplicate').click(this.btnDuplicate_OnClick.bind(this));
        //$('#btnDuplicate').click(this.btnDuplicate_OnClick.bind(this));
        //$('#btnAddReceipt').on('click', { refType: enumeration.RefType.Receipt }, this.btnAdd_OnClick.bind(this));
        $('.btnAddReceipt').on('click', { refType: enumeration.RefType.Receipt }, this.btnAdd_OnClick.bind(this));
        $('#btnAddEx').on('click', { refType: enumeration.RefType.Expense }, this.btnAdd_OnClick.bind(this));
        $(document).on('click', '#btnSave', this.btnSave_OnClick.bind(this));
        $(document).on('click', '#btnSaveAdd', this.btnSaveAdd_OnClick.bind(this));
        $(document).on('click', '#btnCancel', this.btnCancel_OnClick.bind(this));
        $(document).on('click', '.btnWriteLedger', this.btnWriteLedger_OnClick.bind(this));
        $(document).on('click', '.btnDeleteLedger', this.btnDeleteLedger_OnClick.bind(this));
        //$('#btnEdit').on('click', this.btnEdit_OnClick.bind(this)); //  { refType: enumeration.RefType.Expense }, 
        $('.btnEdit').on('click', this.btnEdit_OnClick.bind(this)); //  { refType: enumeration.RefType.Expense }, 
        $('#btnRefresh').click(this.btnRefresh_OnClick.bind(this));
        $('#btnNext').click(this.btnNext_OnClick.bind(this));
        $('#btnPrevious').click(this.btnPrevious_OnClick.bind(this));
        $('#tbarRefresh').click(this.btnBarRefresh_OnClick.bind(this));
        $('#btnAddRowReceiptDetail').click(this.btnAddRowReceiptDetail_OnClick.bind(this));
        $('#btnEditReceipt').click(this.btnEditReceipt_OnClick.bind(this));
        $('#btnRefreshReceipt').click(this.btnRefreshReceipt_OnClick.bind(this));
        $(document).on("click", ".DeleteRowDetail", this.btnDeleteRowReceiptDetail_OnClick.bind(this));
        $(document).on("click", "#tbodyRAEDetailDialog td", this.checkContentInput.bind(this));
        $(document).on("click", ".btn-customer-datepicker-icon", this.clickDatepicker.bind(event));
        //$(".gridPanel-header-item-filter").on("click", this.selectContentMenu.bind(this));
        $(document).on("click", this.selectContentMenu.bind(this));
        $(document).on('keydown', '[elementtype = "filterInput"]', this.inputFilterAll.bind(event));
    }

    /* *
     * Thực hiện vẽ bảng
     * @param {any} data Dữ liệu trả về từ server
     * Created by: VVKIET (23/01/2019)
     */
    buildDataIntoTable(data) {
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
            htmlItem.push('<tr refid=' + item.objectID + ' is-posted-finance="' + item.isPostedFinance + '" class="{0}">'.format(index % 2 === 0 ? '' : 'row-highlight' ));
            fieldData.forEach(function (valueField, indexField) {
                var value = item[valueField];

                if (valueField === "totalAmount") {                                                                                 // Hàm định dạng kiểu tiền tệ
                    value = item[valueField].formatMoney();
                    htmlItem.push('<td class="totalAmount">{0}</td>'.format(value ? value : ''));
                }
                else if (valueField === "refPostedDate" || valueField === "refDate" || valueField === "cashBookPostedDate") {          // Hàm định dạng ngày tháng năm
                    value = new Date(item[valueField]).ddmmyyyy();
                    htmlItem.push('<td class="date">{0}</td>'.format(value ? value : ''));
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
        // Chọn dòng đầu tiên:
        commonJS.setFirstRowSelected($('#tblCustomerList'));
        commonJS.hideMask();
    }

    /* *
     * Thực hiện load dữ liệu màn hình danh sách.
     * Created by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     */
    loadData() {
        //var me = this;
        // Gọi Service lấy dữ liệu:
        // Lấy số trang
        commonJS.showMask();
        var page = $("#currentPage").val();
        var totalRecord = $("#inputTotalRecord").val();
        $('[fieldname = "RefPostedDate"]').removeClass("required-border");
        $.ajax({
            url: "http://localhost:60235/api/Receipt/GetReceiptByCompany",
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
                raeJS.buildDataIntoTable(data.data);  // Đổ dữ diệu ra
            },
            error: function (xhr, textStatus, errortdrown) {
                console.log("Có lỗi xảy ra khi gọi GetReceiptByCompany");
            }
        });
        $(".rowSelected").focus();
    }

    /* *
     * Thực hiện trước khi mở form
     * Created by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     */
    beforeOpenDetail() {
        $(document).off("keydown", this.checkArrow);
        if (raeJS.editMode === 1) {
            var dataIndexs = $('input[dataindex]');
            $('#btnEditReceipt').attr('disabled', 'disabled');
            $('#btnEditReceipt').addClass('disable-hover');
            $('#btnEditReceipt').removeClass('backgroud-button-white');
            $('.btn-customer-icon-16.icon-btnEdit').css('opacity', '0.5');
            $('#btnPrevious').attr('disabled', 'disabled');
            $('#btnPrevious').addClass('disable-hover');
            $('#btnPrevious').removeClass('backgroud-button-white');
            $('.btn-customer-icon-16.btn-customer-previous-icon').css('opacity', '0.5');
            $('#btnNext').attr('disabled', 'disabled');
            $('#btnNext').addClass('disable-hover');
            $('#btnNext').removeClass('backgroud-button-white');
            $('.btn-customer-icon-16.btn-customer-next-icon').css('opacity', '0.5');
            $('#btnSave').removeAttr('disabled');
            $('#btnSave').addClass('backgroud-button-white');
            $('#btnSave').removeClass('disable-hover');
            $('.btn-customer-icon-16.btn-customer-save-icon').css('opacity', '1');
            $('#btnSaveAdd').removeAttr('disabled');
            $('#btnSaveAdd').addClass('backgroud-button-white');
            $('#btnSaveAdd').removeClass('disable-hover');
            $('.btn-customer-icon-16.btn-customer-saveadd-icon').css('opacity', '1');
            $('#btnRefreshReceipt').attr('disabled');
            $('#btnRefreshReceipt').addClass('disable-hover');
            $('#btnRefreshReceipt').removeClass('backgroud-button-white');
            $('.btn-customer-icon-16.icon-refresh').css('opacity', '0.5');
            $('[inputInfo="true1"]').removeAttr('disabled');
            $('[inputInfo="true2"]').removeAttr('disabled');
            $('[inputrefDetailDescription="true"]').removeAttr('disabled');
            $('[tdrefDetailDescription="true"]').addClass('border-hover-detail');
            $('#txtAccountObjectCode').focus();
            $('[class="combobox-arrow-select trigger-loadData"]').removeAttr('hidden');
            $("#btnAddRowReceiptDetail").removeAttr('hidden');
            $('#btnDeleteLedgerDetail').hide();


            if (dataIndexs && dataIndexs.length > 0) {
                $.each(dataIndexs, function (index, item) {
                    var dataIndex = $(item).attr('dataindex');
                    var dataType = $(item).attr('data-type');
                    // Xử lý trường hợp tên Propery bị lowerCase ký tự đầu khi nhận dữ liệu json trả về
                    dataIndex = dataIndex.charAt(0).toLocaleLowerCase() + dataIndex.substr(1);
                    if (dataType === 'Date') {
                        var dateValue = new Date($.now());
                        $(item).val(dateValue.yyyymmdd());
                    }
                });
            }
        }
        else if (raeJS.editMode === 2) {
            var RAEDetail = [];
            var rowSelecteds = $('#tbodyRAE .rowSelected');
            var refId;
            if (rowSelecteds && rowSelecteds.length > 0) {
                refId = rowSelecteds.attr('refid');
            }

            //raeJS.showMask();            
            commonJS.showMask();
            $.ajax({
                url: "http://localhost:60235/api/receipt/GetReceiptById",
                async: false,
                beforeSend: function (xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    // Mã xác thực api
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4b254658088e442fb082c489acb53023");
                    xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
                },
                method: "GET",
                headers: {
                    id: refId
                },
                success: function (data, textStatus, xhr) {
                    // Bind thông tin dữ liệu master:
                    //dbl = +dbl + 1;
                    var dataIndexs = $('input[dataindex]');
                    if (dataIndexs && dataIndexs.length > 0) {
                        $.each(dataIndexs, function (index, item) {
                            var dataIndex = $(item).attr('dataindex');
                            var dataType = $(item).attr('data-type');
                            // Xử lý trường hợp tên Propery bị lowerCase ký tự đầu khi nhận dữ liệu json trả về
                            dataIndex = dataIndex.charAt(0).toLocaleLowerCase() + dataIndex.substr(1);
                            if (dataType === 'Date') {
                                var dateValue = new Date(data.data[0][dataIndex]);
                                $(item).val(dateValue.ddmmyyyy());
                            } else {
                                $(item).val(data.data[0][dataIndex]);
                            }
                        });
                    }

                    var receiptDetail = data.data;
                    $.each(receiptDetail, function (key, value) {
                        RAEDetail.push(value);
                        //value.accountObjectName = data.receipt[0].accountObjectName;
                        //value.accountObjectCode = data.receipt[0].accountObjectCode;
                    });
                    var tbody = $('#tbodyRAEDetailDialog');
                    var column = $('table#tblDetail .gridHeader th');

                    if (raeJS.refresh === false) {
                        // ẩn các button không đc hiện khi nhấn form sửa
                        if ($(rowSelecteds).attr('is-posted-finance') === "true") {
                            $('#btnWriteLedgerDetail').hide();
                            $('#btnDeleteLedgerDetail').show();
                        }
                        else {
                            $('#btnWriteLedgerDetail').show();
                            $('#btnDeleteLedgerDetail').hide();
                        }

                        $('#btnEditReceipt').removeAttr('disabled');
                        $('#btnEditReceipt').addClass('backgroud-button-white');
                        $('#btnEditReceipt').removeClass('disable-hover');
                        $('.btn-customer-icon-16.icon-btnEdit').css('opacity', '1');
                        $('#btnPrevious').removeAttr('disabled');
                        $('#btnPrevious').addClass('backgroud-button-white');
                        $('#btnPrevious').removeClass('disable-hover');
                        $('.btn-customer-icon-16.btn-customer-previous-icon').css('opacity', '1');
                        $('#btnNext').removeAttr('disabled');
                        $('#btnNext').addClass('backgroud-button-white');
                        $('#btnNext').removeClass('disable-hover');
                        $('.btn-customer-icon-16.btn-customer-next-icon').css('opacity', '1');
                        $('#btnSave').attr('disabled', 'disabled');
                        $('#btnSave').addClass('disable-hover');
                        $('#btnSave').removeClass('backgroud-button-white');
                        $('.btn-customer-icon-16.btn-customer-save-icon').css('opacity', '0.5');
                        $('#btnSaveAdd').attr('disabled', 'disabled');
                        $('#btnSaveAdd').addClass('disable-hover');
                        $('#btnSaveAdd').removeClass('backgroud-button-white');
                        $('.btn-customer-icon-16.btn-customer-saveadd-icon').css('opacity', '0.5');
                        $('#btnRefreshReceipt').attr('disabled', 'disabled');
                        $('#btnRefreshReceipt').addClass('disable-hover');
                        $('#btnRefreshReceipt').removeClass('backgroud-button-white');
                        $('.btn-customer-icon-16.icon-refresh').css('opacity', '0.5');
                        $('[class="combobox-arrow-select trigger-loadData"]').attr('hidden', "hidden");
                        $("#btnAddRowReceiptDetail").attr('hidden', 'hidden');
                        $('[inputInfo="true1"]').attr('disabled', "disabled");
                        $('[inputInfo="true2"]').attr('disabled', "disabled");
                    }
                    buildDataIntoTableDetail(RAEDetail, tbody, column);

                    commonJS.hideMask();
                },
                error: function (xhr, textStatus, errortdrown) {
                    console.log("Có lỗi xảy ra khi gọi GetId");
                }
            });
        }
    }

    /* *
     * Chọn một bản ghi trong danh sách
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     */
    rowRAE_OnClick() {
        if (!$(this).hasClass('rowSelected')) {
            $("#tbodyRAEDetail tr").remove();
            var RAEDetail = [];
            var time;
            $(this).siblings('.rowSelected').removeClass('rowSelected');
            this.classList.add('rowSelected');
            if ($(this).attr('is-posted-finance') === "true") {
                $('.btnWriteLedger').addClass('disabled-button');
                $('.btnDeleteLedger').removeClass('disabled-button');
            }
            else {
                $('.btnWriteLedger').removeClass('disabled-button');
                $('.btnDeleteLedger').addClass('disabled-button');
            }
            var refId = $('.rowSelected').attr('refid');
            commonJS.showMask($('.frmCustomerDetail .rae-detail-box'));
            $.ajax({
                url: "http://localhost:60235/api/receipt/GetReceiptById",
                beforeSend: function (xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    // Mã xác thực api
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4b254658088e442fb082c489acb53023");
                    xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
                },
                method: "GET",
                async: false,
                headers: {
                    id: refId
                },
                success: function (data, textStatus, xhr) {
                    // Bind thông tin dữ liệu master:
                    //dl = +dl + 1;
                    //var receiptDetail = data.data;
                    //$.each(receiptDetail, function (key, value) {
                    //    RAEDetail.push(value);
                        //value.accountObjectName = data.accountObjectName;
                        //value.accountObjectCode = data.accountObjectCode;
                    //});
                    //time = 50 * receiptDetail.length;
                    //setTimeout(function () {
                        commonJS.hideMask($('.frmCustomerDetail .rae-detail-box'));
                    //}, time);
                    // Bind thông tin dữ liệu detail:

                    if (data.refTypeName === "Phiếu thu") {
                        refType = 1;
                    } else {
                        refType = 2;
                    }

                    var tbody = $('#tbodyRAEDetail');
                    var column = $('table#tblRAEDetail .gridHeader th');
                    buildDataIntoTableDetail(data.data, tbody, column);
                    //console.log("API called when choose a row: " + dl);
                },

                error: function (xhr, textStatus, errortdrown) {
                    console.log("Có lỗi xảy ra khi gọi GetId");
                }
            });
            //var tbody = $('#tbodyRAEDetail');
            //var column = $('table#tblRAEDetail .gridHeader th');
            //setTimeout(function () {
            //    buildDataIntoTableDetail(data.data, tbody, column);
            //}, 0);
        }
    }

    /**
     * Chọn phiếu thu hoặc phiếu chi
     * @param {any} args Tham số truyền vào bất kì
     * @param {any} refType Tham số dùng để phân biệt giữa phiếu chi và phiếu thu
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     */
    detailFormOnBeforeOpen(args, refType) {
        if (args.length > 0 && args[0].data) {
            refType = args[0].data.refType;
            this.RefType = refType ? refType : 1;
        }
        if (refType && refType === enumeration.RefType.Receipt) {
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
    }

    /**
     * Thực hiện thêm mới
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     */
    btnAdd_OnClick() {
        this.editMode = 1;
        this.detailFormOnBeforeOpen(arguments);
        this.DetailForm.Show();
        $('#txtPostedDate').datepicker({ dateFormat: "dd-mm-yy" }).datepicker("setDate", new Date());
        $('#txtRefDate').datepicker({ dateFormat: "dd-mm-yy" }).datepicker("setDate", new Date());
    }

    /**
     * Thực hiện sửa
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     * */
    btnEdit_OnClick() {
        this.editMode = 2;
        // Editer vvkiet 17:26 25/01/2019
        //$('#btnSaveAdd').css("display", "none");
        this.RefType = refType;
        this.detailFormOnBeforeOpen(arguments, raeJS.RefType);
        this.DetailForm.Show();
    }

    /**
     * Thực hiện xóa
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     * */
    btnDelete_OnClick() {
        commonJS.showConfirm("Bạn có muốn xóa chứng từ này không?", this.deleteReceipt);
    }

    /**
     * Thực hiện nhân bản
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     * */
    btnDuplicate_OnClick() {
        this.editMode = 2;
        this.RefType = refType;
        this.detailFormOnBeforeOpen(arguments, raeJS.RefType);
        this.DetailForm.Show();
        $("#btnEditReceipt").trigger("click");
        $('[disabled="disabled"]').removeAttr("disabled");
        $('#btnPrevious').attr('disabled', 'disabled');
        $('#btnPrevious').addClass('disable-hover');
        $('#btnPrevious').removeClass('backgroud-button-white');
        $('.btn-customer-icon-16.btn-customer-previous-icon').css('opacity', '0.5');
        $('#btnNext').attr('disabled', 'disabled');
        $('#btnNext').addClass('disable-hover');
        $('#btnNext').removeClass('backgroud-button-white');
        $('.btn-customer-icon-16.btn-customer-next-icon').css('opacity', '0.5');

        $('#btnEditReceipt').attr('disabled', 'disabled');
        $('#btnEditReceipt').removeClass('backgroud-button-white');
        $('#btnEditReceipt').attr('disable-hover');
        $('.btn-customer-icon-16.icon-btnEdit').css('opacity', '0.5');
        $('#btnRefreshReceipt').attr('disabled', 'disabled');
        $('#btnRefreshReceipt').addClass('disable-hover');
        $('#btnRefreshReceipt').removeClass('backgroud-button-white');
        $('.btn-customer-icon-16.icon-refresh').css('opacity', '0.5');
        $('[tabindex="5"]').focus();
        $('[class="combobox-arrow-select trigger-loadData"]').removeAttr('hidden');
        $('#txtRefNo').val("");
        $('#txtPostedDate').datepicker({ dateFormat: "dd-mm-yy" }).datepicker("setDate", new Date());
        $('#txtRefDate').datepicker({ dateFormat: "dd-mm-yy" }).datepicker("setDate", new Date());
        this.editMode = 1;
    }

    /**
     * Thực hiện chọn receipt liền trước
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     * */
    btnPrevious_OnClick() {
        if ($(".rowSelected").prev().length !== 0) {
            this.DetailForm.Close();
            $(".rowSelected").prev().trigger("click");
            raeJS.selectRow($(".rowSelected"));
            $(".rowSelected").trigger("dblclick");

        } else {
            this.DetailForm.Close();
            $("#previousPage").trigger("click");
            $(".rowSelected").trigger("dblclick");
            raeJS.selectRow($("#tbodyRAE").children().last());
        }
    }

    /**
     * Thực hiện chọn receipt liền sau
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     * */
    btnNext_OnClick() {
        if ($(".rowSelected").next().length !== 0) {
            this.DetailForm.Close();
            $(".rowSelected").next().trigger("click");
            raeJS.selectRow($(".rowSelected"));
            $(".rowSelected").trigger("dblclick");
        } else {
            this.DetailForm.Close();
            $("#nextPage").trigger("click");
            $(".rowSelected").trigger("dblclick");
            $('.cls-gridPanel').scrollTop(0);
        }
    }

    /**
     * Thực hiện chọn cất và thêm
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     * */
    btnSaveAdd_OnClick() {
        this.editMode = 1;
        var receipt = new Object();
        receipt.CompanyId = localStorage.getItem("companyId");
        //receipt.CompanyId = "91bf9aaf-7411-4577-ab29-f1ca01f451f2";
        receipt.PostedDate = new Date($.now());
        receipt.RefDate = new Date($.now());
        receipt.RefID = $("#txtRefNo").val();
        //receipt.JournalMemo = $("#txtReasonName").val(); // loại lý do thu/chi
        receipt.JournalMemo = $("#txtJournalMemo").val(); // lý do thu của phiếu
        receipt.TotalAmount = $("#txtTotalAmount").val();
        receipt.AccountObjectName = $("#txtAccountObjectName").val();
        receipt.RefReasonTypeName = $("#txtReason").val(); // loại lý do thu/chi
        receipt.CashBookPostedDate = new Date($.now());
        receipt.RefTypeName = "Phiếu thu"; // loại chứng từ
        receipt.RefNoFiance = $("#txtRefNo").val();
        //receipt.DepartmentName = $("#txtDepartmentName").val(); //chi nhánh
        receipt.DepartmentName = "Công ty cổ phần MISA chi nhánh Đà Nẵng"; //chi nhánh
        receipt.ModifiedDate = new Date($.now());
        receipt.ContactName = $("#txtContactName").val();
        receipt.Address = $("#txtAccountObjectAddress").val();
        receipt.AccountObjectCode = $("#txtAccountObjectCode").val();
        receipt.EmployeeName = $("#txtEmployeeName").val();

        if (raeJS.editMode === 1) { // editMode = 1 : trường hợp thêm bản ghi
            // Tổng số tiền
            receipt.TotalAmount = 0;

            // Xóa receipt detail
            delete receipt.receiptDetail;
            receipt.receiptDetail;

            // Lấy số dòng của bảng detail
            var lengthRowReceiptDetail = $("#tbodyRAEDetailDialog tr.tbodyRAEDetailDialog");

            // Tạo lại detail
            receipt.receiptDetail = [];
            $.each(lengthRowReceiptDetail, function (k, v) {
                receipt.receiptDetail.push({
                    "refDetailDescription": $("#refDetailDescription" + (k + 1)).val(),
                    "creditAmount": converCurrencyToString($("#creditAmount" + (k + 1)).val()),
                    "debitAmount": converCurrencyToString($("#debitAmount" + (k + 1)).val()),
                    "totalAmount": converCurrencyToString($("#totalAmount" + (k + 1)).val()),
                    "accountObject": $("#accountObject" + (k + 1)).val(),
                    "accountObjectName": $("#accountObjectName" + (k + 1)).val(),
                    "departmentName": $("#departmentName" + (k + 1)).val(),
                    "statisCode": $("#statisCode" + (k + 1)).val()
                });

                receipt.TotalAmount += Number(receipt.receiptDetail[k].totalAmount);
            });
            //if (checkProperties($('.text-required'))) {
            //    raeJS.showMask();
            //    $.ajax({
            //        url: "https://localhost:60235/api/receipt/CreateReceipt",
            //        beforeSend: function (xhrObj) {
            //            // Request headers
            //            xhrObj.setRequestHeader("Content-Type", "application/json");
            //            // Mã xác thực api
            //            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
            //            xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
            //        },
            //        data: JSON.stringify(receipt),
            //        method: "POST",
            //        async: false,
            //        success: function (data, textStatus, xhr) {
            //            raeJS.hideMask();
            //            raeJS.loadData();
            //            raeJS.beforeCloseDialog();
            //            raeJS.beforeOpenDetail();
            //            getTotalReceipt = +$("#totalRecord").text() + 1;
            //            $("#totalRecord").text(getTotalReceipt);
            //            console.log("Thành công!");
            //        },
            //        error: function (xhr, textStatus, errortdrown) {
            //            console.log("Sai rồi!");
            //        }
            //    });
            //}
            //else {
            //    commonJS.showNotice("Bạn chưa nhập đủ thông tin!");
            //}
        }
    }

    /**
     * Thực hiện chọn cất
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     * */
    btnSave_OnClick() {
        var receipt = new Object();
        receipt.CompanyID = localStorage.getItem("companyId");
        receipt.PostedDate = new Date($.now());
        receipt.RefDate = new Date($.now());
        receipt.RefID = $("#txtRefNo").val();
        receipt.RefJournalMemo = $("#txtJournalMemo").val(); // lý do thu của phiếu
        receipt.TotalAmount = $("#txtTotalAmount").val();
        receipt.AccountObjectName = $("#txtAccountObjectName").val();
        receipt.RefReasonTypeName = $("#txtReason").val(); // loại lý do thu/chi
        receipt.CashBookPostedDate = new Date($.now());
        receipt.RefTypeName = "Phiếu thu"; // loại chứng từ
        receipt.RefNoFiance = $("#txtRefNo").val();
        receipt.ModifiedDate = new Date($.now());
        receipt.ContactName = $("#txtContactName").val();
        receipt.AccountObjectAddress = $("#txtAccountObjectAddress").val();
        receipt.AccountObjectCode = $("#txtAccountObjectCode").val();
        receipt.EmployeeName = $("#txtEmployeeName").val();
        receipt.AccountObjectID = $("#txtAccountObjectCode").attr("accountobjectid");
        debugger

        if (raeJS.editMode === 1) { // editMode = 1 : trường hợp thêm bản ghi
            // Tổng số tiền
            receipt.TotalAmount = 0;

            // Xóa receipt detail
            delete receipt.receiptDetail;
            receipt.receiptDetail;

            // Lấy số dòng của bảng detail
            var lengthRowReceiptDetail = $("#tbodyRAEDetailDialog tr.tbodyRAEDetailDialog");

            // Tạo lại detail
            receipt.ReceiptDetails = [];
            $.each(lengthRowReceiptDetail, function (k, v) {
                receipt.ReceiptDetails.push({
                    //"refObjectID": receipt.objectID,
                    "refDetailDescription": $("#refDetailDescription" + (k + 1)).val(),
                    "refDetailAmount": converCurrencyToString($("#totalAmount" + (k + 1)).val()),
                    "refDetailDebitAccount": $("#creditAmount" + (k + 1)).val(),
                    "refDetailAccountAvailable": $("#debitAmount" + (k + 1)).val()
                });
                receipt.TotalAmount += Number(receipt.ReceiptDetails[k].refDetailAmount);
            });
            if (checkProperties($('.text-required'))) {
                $.ajax({
                    url: "http://localhost:60235/api/receipt/CreateReceipt",
                    beforeSend: function (xhrObj) {
                        // Request headers
                        xhrObj.setRequestHeader("Content-Type", "application/json");
                        // Mã xác thực api
                        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
                        xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
                    },
                    data: JSON.stringify(receipt),
                    method: "POST",
                    success: function (data, textStatus, xhr) {
                        raeJS.DetailForm.Close();
                        raeJS.loadData();
                        getTotalReceipt = +$("#totalRecord").text() + 1;
                        $("#totalRecord").text(getTotalReceipt);
                        //$('#btnWriteLedger').trigger("click");
                        commonJS.showSuccessMsg("Tạo phiếu thu thành công!");
                    },
                    error: function (xhr, textStatus, errortdrown) {
                        commonJS.showErrorMsg("Tạo phiếu thu thất bại!");
                    }
                });
            } else {
                commonJS.showNotice("Bạn chưa nhập đủ thông tin!");
            }
        }
        else {
            //receipt.CompanyId = JSON.parse(localStorage.getItem("receipt"))[0].companyId;
            receipt.objectID = $('.rowSelected').attr('refid');
            // Xóa receipt detail
            delete receipt.receiptDetail;
            receipt.receiptDetail;

            // Lấy số dòng của bảng detail
            lengthRowReceiptDetail = $("#tbodyRAEDetailDialog tr.tbodyRAEDetailDialog");
            // Tạo lại detail
            receipt.ReceiptDetails = [];
            $.each(lengthRowReceiptDetail, function (k, v) {
                receipt.ReceiptDetails.push({
                    "objectID": $(this).attr("refdetailid"),
                    "refDetailDescription": $("#refDetailDescription" + (k + 1)).val()
                });
            });
            //var isValid = checkRequired($('.checkRequired'));
            //if (isValid) {
            // Gọi API để thực hiện việc update dữ liệu
            raeJS.DetailForm.Close();
            commonJS.showMask();
            $.ajax({
                url: "http://localhost:60235/api/receipt/UpdateReceiptById",
                beforeSend: function (xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                    // Mã xác thực api
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
                    xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
                },
                data: JSON.stringify(receipt),
                method: "PUT",
                success: function (data, textStatus, xhr) {
                    commonJS.showSuccessMsg(data.message);
                    raeJS.loadData();
                },
                error: function (xhr, textStatus, errortdrown) {
                    commonJS.showErrorMsg(data.message);
                }
            });
            //}
        }


    }

    /**
     * Thực hiện chọn đóng form
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     * */
    btnCancel_OnClick() {
        $('#btnEditReceipt').removeAttr('disabled');
        $('#btnEditReceipt').addClass('backgroud-button-white');
        $('.btn-customer-icon-16.icon-btnEdit').css('opacity', '1');
        $('#btnSave').attr('disabled', 'disabled');
        $('#btnSave').removeClass('backgroud-button-white');
        $('.btn-customer-icon-16.btn-customer-save-icon').css('opacity', '0.5');
        $('#btnSaveAdd').attr('disabled', 'disabled');
        $('#btnSaveAdd').removeClass('backgroud-button-white');
        $('.btn-customer-icon-16.btn-customer-saveadd-icon').css('opacity', '0.5');
        $('#btnRefreshReceipt').attr('disabled', 'disabled');
        $('#btnRefreshReceipt').removeClass('backgroud-button-white');
        $('.btn-customer-icon-16.icon-refresh').css('opacity', '0.5');
        $('[inputInfo="true2"]').attr('disabled', 'disabled');
        $('[inputrefDetailDescription="true"]').attr('disabled', 'disabled');
        $('[tdrefDetailDescription="true"]').removeClass('border-hover-detail');
        $('#txtAccountObjectName').focus();
        $('[class="text-required required-border"]').removeClass('required-border');
        $('[class="cls-wrapControl-combobox combobox border-red"]').removeClass('border-red');
        this.DetailForm.Close();

    }

    /**
     * Thực hiện chọn trợ giúp
     * Create by: NVMANH (22/01/2019)
     * Edited by: VVKIET(23/01/2019)
     * */
    btnHelp_OnClick() {
        alert('btnHelp_OnClick');
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
     * Thực hiện chọn 1 dòng trong danh sách
     * @param {any} newRow Dòng mới
     * @param {any} keyCode Phím thực hiện
     * Created by: VVKIET(23/01/2019)
     */
    selectRow(newRow, keyCode) {
        newRow = $(newRow);
        // Thoát ra nếu không có hàng nào mới
        if (newRow.length === 0) {
            if (keyCode === 38)
                $('.cls-gridPanel').scrollTop(0);
            return;
        }
        // Bỏ chọn dòng trước đó
        var oldRow = $('.rowSelected');
        oldRow.removeClass('rowSelected');

        // Chọn một dòng mới
        newRow.addClass('rowSelected');

        var rowTop = newRow.position().top;
        var rowBottom = rowTop + newRow.height();
        var $table = $('.cls-gridPanel');
        var tableHeight = $table.height();
        var currentScroll = $table.scrollTop();

        if (rowTop < 0) {
            // Cuộn lên trên
            //console.log(currentScroll + rowTop);
            $('.cls-gridPanel').scrollTop(currentScroll + rowTop);
        }
        else if (rowBottom > tableHeight) {
            // Cuộn xuống dưới
            var scrollAmount = rowBottom - tableHeight + 17;
            $('.cls-gridPanel').scrollTop(currentScroll + scrollAmount);
        }
    }

    /**
     * Thực hiện lấy thông tin đối tượng (Account Object)
     * Created by: VVKIET(23/01/2019)
     */
    accountObjectItem_OnSelect() {
        // Lấy thông tin đối tượng được chọn
        var accountObjectCode = $(event.target).attr('item-value');
        var accounts = dataResource.AccountObject.filter(function (e) { return e.AccountObjectCode === accountObjectCode; });
        if (accounts && accounts.length > 0) {
            var account = accounts[0];
            $('#txtAccountObjectCode').attr('accountObjectID', account.AccountObjectID);
            $('#txtAccountObjectName').val(account.AccountObjectName);
            $('#txtAccountObjectAddress').val(account.AccountObjectAddress);
            $('#txtAccountDebit').val(account.AccountObjectNumber);
            $('#txtContactName').val(account.ContactName);
            $('#txtAccountObjectCode').val(account.AccountObjectCode);
        }
        // focus vào ô tiếp theo
        $('[item-value]').on({
            keydown: function (e) {
                if (e.keyCode === 13) {
                    $('#txtReason').focus();
                }
            }
        });

    }

     /**
     * Thực hiện lấy thông tin đối tượng (Reson)
     * Created by: VVKIET(23/01/2019)
     */
    reasonItem_OnSelect() {
        // Lấy thông tin đối tượng được chọn:
        var reasonId = $(event.target).attr('item-value');
        var reasons = dataResource.Reason.filter(function (e) {
            return e.ReasonID === Number(reasonId);
        });
        if (reasons && reasons.length > 0) {
            var reason = reasons[0];
            $('#txtJournalMemo').val(reason.RefJournalMemo);
            $('#txtEmployeeName').val(reason.EmployeeName);
            $('#txtReason').val(reason.ReasonName);
        }
        // focus vào ô tiếp theo
        $('[item-value]').on({
            keydown: function (e) {
                if (e.keyCode === 13) {
                    $('#txtRefNo').focus();
                }
            }
        });
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
                    $('#txtRefNo').focus();
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
        var reportPeriods = dataResource.ReportPeriod.filter(function (e) {
            return e.ReportPeriodID === Number(reportPeriodId);
        });
        if (reportPeriods && reportPeriods.length > 0) {
            var reportPeriod = reportPeriods[0];
            $('#txtReportPeriodName').val(reportPeriod.ReportPeriodName);
        }
        // focus vào ô tiếp theo
        $('[item-value]').on({
            keydown: function (e) {
                if (e.keyCode === 13) {
                    $('#txtRefNo').focus();
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
            $('#txtCurrencyName').val(department.CurrencyName);
        }
    }



     /**
     * Thực hiện xóa dữ liệu khi đóng detail
     * Created by: VVKIET(23/01/2019)
     */
    beforeCloseDialog() {
        $('#frmRAEDetail input').val(null);
        $('.tbodyRAEDetailDialog').remove();
        setCountRow = 0;
        $('[class="text-required required-border"]').removeClass('required-border');
        $('[class="cls-wrapControl-combobox combobox border-red"]').removeClass('border-red');
    }

     /**
     * Thực hiện tải lại dữ liệu nhưng không load lại trang
     * Created by: VVKIET(23/01/2019)
     */
    btnRefresh_OnClick() {
        commonJS.showMask();
        $('[elementtype = "filterInput"]').val("");
        $('.btn-select-filter').text("∗");
        $('#currentPage').val(1);
        $('#inputTotalRecord').val(100);
        if ($('#numberRecordSelection').css('display') !== 'none') {
            $('#numberRecordSelection').toggle(); // thu lại combo box 25 50 100.
        }
        this.loadData();
        //setTimeout(function () {
        //    commonJS.hideMask();
        //}, 100);
    }

    /**
     * Thực hiện tải lại dữ liệu của trang hiện tại nhưng không load lại trang
     * Created by: VVKIET(23/01/2019)
     */
    btnBarRefresh_OnClick() {
        $('[elementtype = "filterInput"]').val("");
        var currentPage = $('#currentPage').val();
        var inputTotalRecord = $('#inputTotalRecord').val();
        getAllFilterElement(currentPage, inputTotalRecord);
        //raeJS.loadData();
    }

    /**
     * Thực hiện kiểm tra dữ liệu ở ô input
     * Created by: VVKIET(23/01/2019)
     */
    checkContentInput() {
        var addtrPosition = $('#btnAddRowReceiptDetail').position().top + $('#btnAddRowReceiptDetail').height() + 27;
        var $table = $('#frmRAEDetail .rae-detail-box');
        var tableHeight = $table.height();
        var currentScroll = $table.scrollTop();
        if (addtrPosition > tableHeight) {
            var scrollAmount = addtrPosition - tableHeight + 27;
            $('#frmRAEDetail .rae-detail-box').scrollTop(currentScroll + scrollAmount);
        }
    }

    /**
     * Thực hiện thêm mới một dòng detail
     * Created by: VVKIET(23/01/2019)
     */
    btnAddRowReceiptDetail_OnClick() {
        setCountRow++;
        $('[fielddata="DeleteRowDetail"]').show();
        var rowNow = '<tr class="tbodyRAEDetailDialog">\
                        <th style="text-align:center"><span class="toolbar-item-icon icon-btnDelete DeleteRowDetail" id="DeleteRowDetail' + setCountRow + '" style="cursor: pointer;"></span></th>\
                        <td class="border-hover-detail" ><input class="inputRAEDetailDialog" id="refDetailDescription' + setCountRow + '" autocomplete="off"/></td>\
                        <td class="border-hover-detail" ><input class="inputRAEDetailDialog" id="creditAmount' + setCountRow + '" autocomplete="off" onkeypress="return commonJS.isNumberKey(event)"/></td>\
                        <td class="border-hover-detail" ><input class="inputRAEDetailDialog" id="debitAmount' + setCountRow + '" autocomplete="off" onkeypress="return commonJS.isNumberKey(event)"/></td>\
                        <td class="border-hover-detail" ><input class="inputRAEDetailDialog totalAmount" id="totalAmount' + setCountRow + '" autocomplete="off"/></td>\
                        <td class="border-hover-detail" ><input class="inputRAEDetailDialog" id="accountObject' + setCountRow + '" autocomplete="off"/></td>\
                        <td class="border-hover-detail" ><input class="inputRAEDetailDialog" id="accountObjectName' + setCountRow + '" autocomplete="off"/></td>\
                        <td class="border-hover-detail" ><input class="inputRAEDetailDialog" id="departmentName' + setCountRow + '" autocomplete="off"/></td>\
                        <td class="border-hover-detail" ><input class="inputRAEDetailDialog" id="statisCode' + setCountRow + '" autocomplete="off"/></td>\
                        </tr>';
        $("#btnAddRowReceiptDetail").before(rowNow);
        $("#refDetailDescription" + setCountRow).focus();

        // Gọi lại function focus để lấy id
        $("#tbodyRAEDetailDialog tr td input").focus(function () {
            if ($(this).attr('class').split(" ")[1] === "totalAmount") {
                $(this).keyup(function () {
                    raeJS.inputTotalAmount_Onclick(this.id, this.value);
                });
            }
        });

    }

    /**
     * Thực hiện xóa dòng detail
     * @param {any} sender Đối tượng gửi
     * Created by: VVKIET(23/01/2019)
     */
    btnDeleteRowReceiptDetail_OnClick(sender) {
        var posRow = sender.currentTarget.parentElement;
        posRow.parentElement.remove();
        $("#btnAddRowReceiptDetail").removeAttr("hidden");
    }

    /**
     * Thực hiện định dạng tiền ở ô input kiểu totalAmount
     * @param {any} inputId Id của ô input
     * @param {any} totalAmount Giá trị của ô input
     * Created by: VVKIET(23/01/2019)
     */
    inputTotalAmount_Onclick(inputId, totalAmount) {
        totalAmount = converCurrencyToString(totalAmount);
        if (totalAmount !== "") {
            totalAmount = Number(totalAmount).formatMoney();
        }
        $("#" + inputId).val(totalAmount);
    }

    /**
     * Thực hiện sửa nhanh
     * Created by: VVKIET(23/01/2019)
     */
    btnEditReceipt_OnClick() {
        $('#btnEditReceipt').attr('disabled', 'disabled');
        $('#btnEditReceipt').removeClass('backgroud-button-white');
        $('#btnEditReceipt').addClass('disable-hover');
        $('.btn-customer-icon-16.icon-btnEdit').css('opacity', '0.5');
        $('#btnSave').removeAttr('disabled');
        $('#btnSave').addClass('backgroud-button-white');
        $('#btnSave').removeClass('disable-hover');
        $('.btn-customer-icon-16.btn-customer-save-icon').css('opacity', '1');
        $('#btnSaveAdd').removeAttr('disabled');
        $('#btnSaveAdd').addClass('backgroud-button-white');
        $('#btnSaveAdd').removeClass('disable-hover');
        $('.btn-customer-icon-16.btn-customer-saveadd-icon').css('opacity', '1');
        $('#btnRefreshReceipt').removeAttr('disabled');
        $('#btnRefreshReceipt').addClass('backgroud-button-white');
        $('#btnRefreshReceipt').removeClass('disable-hover');
        $('.btn-customer-icon-16.icon-refresh').css('opacity', '1');
        $('[inputInfo="true2"]').removeAttr('disabled');
        $('[inputrefDetailDescription="true"]').removeAttr('disabled');
        $('[tdrefDetailDescription="true"]').addClass('border-hover-detail');
        $('#txtAccountObjectName').focus();
    }

    /**
     * Thực hiện nạp lại
     * Created by: VVKIET(23/01/2019)
     */
    btnRefreshReceipt_OnClick() {
        raeJS.refresh = true;
        $('#txtAccountObjectName').focus();
        raeJS.beforeOpenDetail();
        $('[inputrefDetailDescription="true"]').removeAttr('disabled');
    }

    /**
     * Thực hiện disabled phím previous trang
     * Created by: VVKIET(23/01/2019)
     */
    previousPageRemoveClass() {
        $('#previousPage').children('div').addClass("tbar-item-disabled");
        $('#previousPageFirst').children('div').addClass("tbar-item-disabled");
        $('#previousPage').removeClass("tbar-item-control-active");
        $('#previousPageFirst').removeClass("tbar-item-control-active");
    }

    /**
     * Thực hiện active phím previous trang
     * Created by: VVKIET(23/01/2019)
     */
    previousPageAddClass() {
        $('#previousPage').children('div').removeClass("tbar-item-disabled");
        $('#previousPageFirst').children('div').removeClass("tbar-item-disabled");
        $('#previousPage').addClass("tbar-item-control-active");
        $('#previousPageFirst').addClass("tbar-item-control-active");
    }

    /**
     * Thực hiện disabled phím next trang
     * Created by: VVKIET(23/01/2019)
     */
    nextPageRemoveClass() {
        $('#nextPage').children('div').addClass("tbar-item-disabled");
        $('#nextPageLast').children('div').addClass("tbar-item-disabled");
        $('#nextPage').removeClass("tbar-item-control-active");
        $('#nextPageLast').removeClass("tbar-item-control-active");
    }

    /**
     * Thực hiện disabled phím next trang
     * Created by: VVKIET(23/01/2019)
     */
    nextPageAddClass() {
        $('#nextPage').children('div').removeClass("tbar-item-disabled");
        $('#nextPageLast').children('div').removeClass("tbar-item-disabled");
        $('#nextPage').addClass("tbar-item-control-active");
        $('#nextPageLast').addClass("tbar-item-control-active");
    }

    /**
     * Chọn nọi dung trong Drop Menu
     * @param {any} e Sự kiện truyền sang
     * Created by: VVKIET(23/01/2019)
     */
    selectContentMenu(e) {
        if (e.target.parentElement.getAttribute("id") === "myDropdown") {
            $(e.target).parent().prev().text($(e.target).attr("mathSymbol"));
            getPositionFilter = 0;
            $(".dropdown-content").remove();
        }
        else if (e.target.className === "btn-select-filter") {
            var filterNow = $(e.target).offset().left;
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

    /**
     * Thực hiện kiểm tra các mũi tên
     * @returns {any} flase or true
     * Created by: VVKIET(23/01/2019)
     */
    checkArrow() {
        var currentRow = $('.rowSelected');

        switch (event.keyCode) {
            //Mũi tên xuống     
            case 40:
                $(".rowSelected").next().trigger("click");
                raeJS.selectRow(currentRow.next(), event.keyCode);
                return false;
            //Mũi tên lên
            case 38:
                $(".rowSelected").prev().trigger("click");
                raeJS.selectRow(currentRow.prev(), event.keyCode);
                return false;
            //case 39:
            //    $("#nextPage").trigger("click");
            //    return false;
            //case 37:
            //    $("#previousPage").trigger("click");
            //    return false;
        }
    }

    /**
     * Bắt sự kiện lọc các ô input Filter
     * @param {any} e Sự kiện nhấn phím Enter
     */
    inputFilterAll(e) {
        $("#currentPage").val("1");
        var page = $("#currentPage").val();
        var totalRecord = $("#inputTotalRecord").val();

        if (e.keyCode === 13) {
            // Bắt phím enter
            if ($(this).val() !== "") {
                getAllFilterElement(page, totalRecord);
            }
        }
    }

    /**
    * Thực hiện xóa receipt
    * Created by: VVKIET(23/01/2019)
    */
    deleteReceipt() {
        var refId = $('.rowSelected').attr('refid');
        var totalRecord = $("#inputTotalRecord").val();
        var currentPage = $("#currentPage").val();
        $.ajax({
            url: "http://localhost:60235/api/receipt/deleteReceiptById",
            async: true,
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                // Mã xác thực api
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4b254658088e442fb082c489acb53023");
                xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
            },
            method: "DELETE",
            headers: {
                id: refId
            },
            success: function (data, textStatus, xhr) {
                // Bind thông tin dữ liệu master:
                raeJS.loadData();
                //getAllFilterElement(currentPage, totalRecord);
                getTotalReceipt = +$("#totalRecord").text() - 1;
                $("#totalRecord").text(getTotalReceipt);
                commonJS.showSuccessMsg("Xóa phiếu thu thành công!");
            },
            error: function (xhr, textStatus, errortdrown) {
                console.log("Lỗi khi xóa phiếu thu");
            }
        });
    }


    btnWriteLedger_OnClick() {
        var rowSelecteds = $('#tbodyRAE .rowSelected');
        rowSelecteds.attr('is-posted-finance', 'true');
        $('.btnWriteLedger').addClass('disabled-button');
        $('.btnDeleteLedger').removeClass('disabled-button');
        $('#btnWriteLedgerDetail').hide();
        $('#btnDeleteLedgerDetail').show();
        var refId;
        if (rowSelecteds && rowSelecteds.length > 0) {
            refId = rowSelecteds.attr('refid');
        }
        $.ajax({
            url: "http://localhost:60235/api/receipt/PostGeneralLedger",
            async: true,
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                // Mã xác thực api
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4b254658088e442fb082c489acb53023");
                xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
            },
            headers: {
                objectID: refId
            },
            method: "POST",
            success: function (textStatus, xhr) {
                console.log("Ghi phiếu thu vào DB báo cáo thành công!");
            },
            error: function (xhr, textStatus, errortdrown) {
                console.log("Ghi phiếu thu vào DB báo cáo thất bại!");
            }
        });
        commonJS.hideMask(); 
        
    }


    btnDeleteLedger_OnClick() {
        var rowSelecteds = $('#tbodyRAE .rowSelected');
        rowSelecteds.attr('is-posted-finance', 'false');
        $('.btnWriteLedger').removeClass('disabled-button');
        $('.btnDeleteLedger').addClass('disabled-button');
        $('#btnWriteLedgerDetail').show();
        $('#btnDeleteLedgerDetail').hide();
        var refId;
        if (rowSelecteds && rowSelecteds.length > 0) {
            refId = rowSelecteds.attr('refid');
        }
        $.ajax({
            url: "http://localhost:60235/api/receipt/DeleteGeneralLedger",
            async: true,
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                // Mã xác thực api
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4b254658088e442fb082c489acb53023");
                xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
            },
            headers: {
                objectID: refId
            },
            method: "POST",
            success: function (data, textStatus, xhr) {
                console.log("Xóa phiếu thu khỏi DB báo cáo thành công!");
                //commonJS.hideMask();
            },
            error: function (xhr, textStatus, errortdrown) {
                console.log("Xóa phiếu thu khỏi DB báo cáo thất bại!");
            }
        });
    }
}

var raeJS = new ReceiptsAndExpensesJS();


/**
* Thực hiện tạo bảng detail
* @param {any} RAEDetail Đối tượng detail
* @param {any} tbody Đối tượng tbody
* @param {any} column Đối tượng cột
* Created by: VVKIET(23/01/2019)
*/
function buildDataIntoTableDetail(RAEDetail, tbody, column) {
    var idTbody = tbody.attr('id');
    $('.' + idTbody).remove();
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
        htmlItem.push('<tr refDetailId = "' + item.objectID1 + '" class="' + idTbody + '">'.format(index % 2 === 0 ? '' : 'row-highlight'));
        if (idTbody === "tbodyRAEDetail") {
            fieldData.forEach(function (valueField, indexField) {
                var value = item[valueField];
                if (indexField === 4) {
                    value = item[valueField];
                    htmlItem.push('<td>{0}</td>'.format(value ? value : ''));
                }
                else if (valueField === "refDetailAmount") {
                    value = item[valueField];
                    htmlItem.push('<td class="totalAmount">{0}</td>'.format(value.formatMoney() ? value.formatMoney() : '0'));
                }
                else {
                    if (indexField === 0) {
                        htmlItem.push('<td class="no-border-left" >{0}</td>'.format(value ? value : ''));
                    } else {
                        htmlItem.push('<td>{0}</td>'.format(value ? value : ''));
                    }
                }
            });
            htmlItem.push('</tr>');
            tbody.append(htmlItem.join(""));
        }
        else {
            setCountRow++;
            $('[fielddata="DeleteRowDetail"]').hide();
            fieldData.forEach(function (valueField, indexField) {
                var value = item[valueField];
                // kiểm tra nếu là refDetailDescription thì ko disabled
                // line 808 806 802 add disabled= "disabled"
                // edit by pbduong 16:41 30/01/2019
                //
                if (indexField === 5) {// accountObjectCode
                    htmlItem.push('<td tdrefDetailDescription="true" ><input disabled = "disabled" class="inputRAEDetailDialog" id="accountObjectCode' + setCountRow + '" value="' + $("#txtAccountObjectCode").val() + '"></td>');
                }
                else if (valueField === "deleteRowDetail") {
                    $(this).hide();
                }
                else if (valueField === "refDetailDescription") {
                    htmlItem.push('<td tdrefDetailDescription="true" ><input inputrefDetailDescription="true" disabled = "disabled" class="inputRAEDetailDialog" id="' + valueField + setCountRow + '" value="{0}"></td>'.format(value ? value : ''));
                }
                else {
                    if (valueField === "refDetailAmount") {
                        value = item[valueField].formatMoney();
                        htmlItem.push('<td><input disabled = "disabled" class="inputRAEDetailDialog totalAmount" id="' + valueField + setCountRow + '" value="{0}"></td>'.format(value ? value : ''));
                    }
                    else if (indexField === 0) {
                        htmlItem.push('<td class="no-border-left"><input disabled = "disabled" class="inputRAEDetailDialog" id="' + valueField + setCountRow + '" value="{0}"></td>'.format(value ? value : ''));
                    }
                    else {
                        htmlItem.push('<td><input disabled = "disabled" class="inputRAEDetailDialog" id="' + valueField + setCountRow + '" value="{0}"></td>'.format(value ? value : ''));
                    }
                }

            });
            htmlItem.push('</tr>');
            $("#tbodyRAEDetailDialog").append(htmlItem.join(""));
        }
    });

}

function getArrayFilterModels() {
    var column = $('#tblCustomerList #filterElement th div div input');
    var fieldName = [];
    column.each(function (index, item) {
        var itemFieldName = $(item).attr('fieldname');
        fieldName.push(itemFieldName);
    });
    arrayFilterModels = [];
    fieldName.forEach(function (valueField, indexField) {
        var inputField = $('[fieldname = "' + valueField + '"]');
        var filterValue = inputField.val();
        var filterType = inputField.parent().parent().children()[0].text;
        if (valueField === "TotalAmount") {
            filterValue = converCurrencyToString(filterValue);
        }
        switch (filterType) {
            case ">": {
                filterType = "1";
                break;
            }
            case "<": {
                filterType = "-1";
                break;
            }
            case "=": {
                filterType = "0";
                break;
            }
            default: {
                break;
            }
        }
        if (filterValue && (filterType !== "∗")) {
            arrayFilterModels.push({ "filterName": valueField, "filterValue": filterValue, "filterType": filterType, "filterDatatype": "" });
        }
    });
    return arrayFilterModels;
}

/**
 * Hàm lấy tất cả giá trị trên các ô Filter
 * Chuyển đổi định dạng dd/mm/yyyy sang yyyy/mm/dd
 * @param {any} page Số trang
 * @param {any} totalRecord Tổng số bản ghi
 * @param {any} arrayFilterModels Tổng số bản ghi
 * Created by: VVKIET(23/01/2019)
 */
function getAllFilterElement(page, totalRecord) {
    var arrayFilterModels = getArrayFilterModels();
    //string filterName, string filterValue, string filterType, string filterDatatype  
    commonJS.showMask();
    $.ajax({
        url: "http://localhost:60235/api/receipt/FilterReceiptCompany",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/json");
            // Mã xác thực api
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
            xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
        },
        data: JSON.stringify(arrayFilterModels),
        headers: {
            page: page,
            totalRecord: totalRecord
        },
        method: "POST",
        success: function (data, textStatus, xhr) {
            getTotalReceiptRecord();
            raeJS.buildDataIntoTable(data);  // Đổ dữ diệu ra
            commonJS.hideMask();
        },
        error: function (xhr, textStatus, errortdrown) {
            console.log("Thất bại");
        }
    });
}

function getTotalReceiptRecord() {
    //string filterName, string filterValue, string filterType, string filterDatatype    
    var arrayFilterModels = getArrayFilterModels();
    commonJS.showMask();
    //$.ajax({
    //    url: "http://localhost:60235/api/receipt/GetTotalReceiptRecord",
    //    beforeSend: function (xhrObj) {
    //        // Request headers
    //        xhrObj.setRequestHeader("Content-Type", "application/json");
    //        // Mã xác thực api
    //        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
    //        xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
    //    },
    //    data: JSON.stringify(arrayFilterModels),
    //    headers: {
    //        page: page,
    //        totalRecord: totalRecord
    //    },
    //    method: "POST",
    //    success: function (data, textStatus, xhr) {
    //        raeJS.buildDataIntoTable(data);  // Đổ dữ diệu ra
    //        commonJS.hideMask();
    //    },
    //    error: function (xhr, textStatus, errortdrown) {
    //        console.log("Thất bại");
    //    }
    //});
    // Gọi ajax để lấy về tổng số bản ghi của một công ty
    $.ajax({
        url: "http://localhost:60235/api/receipt/GetTotalReceiptRecord",
        async: true,
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/json");
            // Mã xác thực api
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
            xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
        },
        data: JSON.stringify(arrayFilterModels),
        method: "POST",
        success: function (data, textStatus, xhr) {
            // Lấy tổng số bản ghi trong data trả về
            getTotalReceipt = data.data;
            var totalRecordPage = $("#inputTotalRecord").val();
            var totalPage = +getTotalReceipt / +totalRecordPage;
            var totalPageRound = totalPage % 2 === 0 ? (totalPage) : (Math.floor(totalPage)+1);

            $("#totalRecord").text(getTotalReceipt);
            $("#totalPage").text(totalPageRound);
            if (totalPageRound > 1) {
                raeJS.nextPageAddClass();
            }
        },
        error: function (xhr, textStatus, errortdrown) {

        }
    });
}


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

/**
 * Kiểm tra thuộc tính
 * @param {any} obj Kiểm tra đối tượng
 * @returns {any} Số tiền sau khi covert
 * Created by: VVKIET(23/01/2019)
 */
function checkProperties(obj) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].value === "")
            return false;
    }
    return true;
}


/**
* Phân trang
* @param {any} page Số trang
* @param {any} totalRecord Tổng số bản ghi
* Created by: VVKIET(23/01/2019)
*/
//function paging(page, totalRecord) {
//    $.ajax({
//        url: "http://localhost:60235/api/receipt/GetReceiptByCompany",
//        beforeSend: function (xhrObj) {
//            // Request headers
//            xhrObj.setRequestHeader("Content-Type", "application/json");
//            //Mã xác thực api
//            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4b254658088e442fb082c489acb53023");
//            xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
//        },
//        async: false,
//        method: "GET",
//        headers: {
//            page: page,
//            totalRecord: totalRecord
//        },
//        success: function (data, textStatus, xhr) {
//            raeJS.buildDataIntoTable(data);
//        },
//        error: function (xhr, textStatus, errortdrown) {
//        }
//    });
//}




