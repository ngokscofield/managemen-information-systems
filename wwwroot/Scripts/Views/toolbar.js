
class ToolBarJS {
    constructor() {       
        this.initEvents();
    }

    /* *
     *  Các sự kiện được gọi
     *  Created by: VVKIET (28/02/2019)
     */
    initEvents() {
        $(document).on('click', '#nextPage', this.nextPageOne.bind(this));
        $(document).on('click', '#nextPageLast', this.nextPageLast.bind(this));
        $(document).on('click', '#previousPage', this.previousPageOne.bind(this));
        $(document).on('click', '#previousPageFirst', this.previousPageFirst.bind(this));
        $(document).on('click', '#arrow-combo-trigger', this.arrowComboTrigger.bind(this));
        $(document).on('click', '.record-select-item', this.itemValue.bind(this));
        $(document).on('keydown', '#currentPage', this.inputCurrentPage.bind(this));
    }

    /**
     * Thực hiện chuyển sang trang liền sau
     * Created by: VVKIET (28/02/2019)
     * */
    nextPageOne() {
        commonJS.showMask();
        var currentPage = $("#currentPage").val();
        var totalRecord = $("#inputTotalRecord").val();
        currentPage = +currentPage + 1;
        var totalPage = $("#totalPage").text();

        //Kiểm tra trang nếu vượt quá tổng số trang thì set về trang lớn nhất
        if (+currentPage > +totalPage) {
            currentPage = totalPage;
            $("#currentPage").val(currentPage);
        }
        if (currentPage < (totalPage + 1)) {
            $("#currentPage").val(currentPage); // Cập nhật số trang mới
            //this.paging(currentPage, totalRecord);
            getAllFilterElement(currentPage, totalRecord);
            this.displayRangeRecord(currentPage);
            if (currentPage.toString() === totalPage) {
                raeJS.previousPageAddClass();
                raeJS.nextPageRemoveClass();
            }
            else if (currentPage >= 1) {
                raeJS.previousPageAddClass();
                $('#nextPage').children('div').removeClass("tbar-item-disabled");
                $('#nextPageLast').children('div').removeClass("tbar-item-disabled");
            }
        }
    }

    /**
     * Thực hiện chuyển sang trang liền trước
     * Created by: VVKIET (28/02/2019)
     * */
    previousPageOne () {
        var currentPage = $("#currentPage").val();
        var totalRecord = $("#inputTotalRecord").val();
        if (+currentPage > 1) {
            currentPage = +currentPage - 1;
            $("#currentPage").val(currentPage); // Cập nhật số trang mới
            getAllFilterElement(currentPage, totalRecord);
            this.displayRangeRecord(currentPage);
        }
        if (currentPage === 1) {
            raeJS.previousPageRemoveClass();
            //$('#previousPage').off("click");
            //$('#previousPageFirst').off("click");
        }
        else {
            raeJS.nextPageAddClass();
        }
    }

    /**
     * Thực hiện chuyển sang trang cuối cùng
     * Created by: VVKIET (28/02/2019)
     * */
    nextPageLast () {
        commonJS.showMask();
        var totalRecord = $("#inputTotalRecord").val();
        var totalPage = $("#totalPage").text();
        var currentPage = +totalPage;
        getAllFilterElement(currentPage, totalRecord);
        this.displayRangeRecord(currentPage);
        $("#currentPage").val($("#totalPage").text());
        raeJS.previousPageAddClass();
        raeJS.nextPageRemoveClass();
    }

    /**
     * Thực hiện chuyển sang trang đầu tiên
     * Created by: VVKIET (28/02/2019)
     * */
    previousPageFirst () {
        if ($("#currentPage").val() > 1) {
            var totalRecord = $("#inputTotalRecord").val();
            getAllFilterElement(currentPage, totalRecord);
            this.displayRangeRecord(1);
            $("#currentPage").val("1");
            raeJS.previousPageRemoveClass();
            raeJS.nextPageAddClass();
        }
    }

    /**
     * Sự kiện chuyển trang dựa vào giá trị được nhập vào ô input (#currentPage)
     * @param {any} event Sự kiện truyền vào
     * Created by: VVKIET (28/02/2019)
     */
    inputCurrentPage (event) {
        if (event.keyCode === 13) {
            var currentPage = $("#currentPage").val();
            var totalRecord = $("#inputTotalRecord").val();
            var totalPage = $("#totalPage").text();
            // Kiểm tra trang nếu vượt quá tổng số trang thì set về trang lớn nhất
            if (+currentPage > +totalPage) {
                currentPage = totalPage;
                $("#currentPage").val(currentPage);
            }
            // Kiểm tra trang nếu vượt quá tổng số trang thì set về trang 1
            if (+currentPage < 1) {
                currentPage = 1;
                $("#currentPage").val(currentPage);
            }
            getAllFilterElement(currentPage, totalRecord);
            this.displayRangeRecord(currentPage);
        }
    }

    /**
     * Sự kiện click vào combotrigger
     * Created by: VVKIET (28/02/2019)
     * */
    arrowComboTrigger () {
        $("#numberRecordSelection").toggle();
    }

    /**
     * Sự kiện click vào itemValue
     * @param {any} sender Đối tượng truyền vào
     * Created by: VVKIET (28/02/2019)
     */
    itemValue(sender) {
        this.getTotalRecordOfPage($(sender.currentTarget).text());
        var currentPage = $("#currentPage").val();
        this.displayRangeRecord(currentPage);
    }

    /**
     * Hàm thực hiện việc hiển thị khoảng bản ghi trên trang hiện tại
     * @param {any} currentPage Số trang đang hiển thị
     * Created by: VVKIET(23/01/2019)
     */
    displayRangeRecord(currentPage) {
        var inputTotalRecord = $("#inputTotalRecord").val();
        var startRecord = +inputTotalRecord * (+currentPage - 1) + 1;
        var endRecord = +inputTotalRecord * +currentPage;
        if (endRecord > getTotalReceipt) {
            endRecord = getTotalReceipt;
        }
        $("#startRecord").text(startRecord);
        $("#endRecord").text(endRecord);
    }

    /**
     * Hàm thực hiện việc lấy bản ghi trên một trang
     * @param {any} total tổng bản ghi
     * Created by: VVKIET(23/01/2019)
     */
    getTotalRecordOfPage(total) {
        $("#inputTotalRecord").val(total);
        var totalRecord = $("#inputTotalRecord").val();
        var currentPage = $("#currentPage").val();
        $("#numberRecordSelection").toggle();
        getAllFilterElement(currentPage, totalRecord);
        $("#endRecord").text(totalRecord);
        var totalPage = Math.floor(+getTotalReceipt / +totalRecord) + 1;
        $("#totalRecord").text(getTotalReceipt);
        $("#totalPage").text(totalPage);
    }
}

var toolbar = new ToolBarJS();