 $(document).ready(function () {
    //check token null sẽ chuyển trang
    // if (localStorage.getItem("access_token") === null) { 
    //    window.location = "./login.html";
    //}
    //$("#ajax_loader").css("display", "block");
    //$.ajax({
    //    url: "https://localhost:51025/api/account/GetInfoCompany",
    //    beforeSend: function (xhrObj) {
    //        // Request headers
    //        xhrObj.setRequestHeader("Content-Type", "application/json");
    //        // Mã xác thực api
    //        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
    //        xhrObj.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
    //    },
    //    method: "GET",
    //    success: function (data, textStatus, xhr) {
    //        if (data.success) {
    //            $("#ajax_loader").css("display", "none");
    //            var com = data.data;
    //            $("#company-code").val(com.companyCode);
    //            $("#company-address").val(com.companyAddress);
    //            $("#tax-code").val(com.companyTaxCode);
    //            $("#tel").val(com.companyTel);
    //            $("#company-email").val(com.companyEmail);
    //            $("#bank-account").val(com.companyBankAccount);
    //        }
    //        else {
    //            window.location = "./login.html"; // nếu token sai
    //            console.log('Error in Operation');
    //        }
    //    },
    //    error: function (xhr, textStatus, errorThrown) {
    //        window.location = "./login.html";
    //        console.log('Error in Operation');
    //    }
    //});
    //Đăng xuất
    $('#logout').click(function () {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("receipt");
        localStorage.removeItem("payment");
        localStorage.removeItem("status_user");
    });
});

// Sự kiện cập nhật thông tin công ty
$('#btnUpdateCompany').click(function () {
    var companyName = $('#companyName').val();
    var companyPhoneNumber = $('#phoneNumberCompany').val();
    var companyStreet = $('#street').val();
    var companyCity = $('#city').val();
    var companyZipCode = $('#zipCode').val();
    var companyNation = $('#nation').val();

    var com = new Object();
    com.CompanyName = companyName;
    com.CompanyPhoneNumber = companyPhoneNumber;
    com.CompanyStreet = companyStreet;
    com.CompanyCity = companyCity;
    com.CompanyZipCode = companyZipCode;
    com.CompanyNation = companyNation;
    $("#ajax_loader").css("display", "block");
    if (companyName.trim().length === 0 || companyZipCode.trim().length === 0 || companyPhoneNumber.trim().length === 0 || companyNation.trim().length === 0 || companyCity.trim().length === 0 || companyStreet.trim().length === 0) {
        $("#ajax_loader").css("display", "none");
        //swal({
        //    position: 'center',
        //    type: 'error',
        //    title: 'Vui lòng nhập đầy đủ thông tin!',
        //    showConfirmButton: false,
        //    timer: 1500
        //});
    } else {
        $.ajax({
            url: "https://localhost:51025/api/account/UpdateCompany",
            method: "PUT",
            data: JSON.stringify(com),
            beforeSend: function (xhr) {
                // Request headers
                xhr.setRequestHeader("Content-Type", "application/json");
                // Mã xác thực api
                xhr.setRequestHeader("Ocp-Apim-Subscription-Key", "39775d00e9ee40e0927749039866ae63");
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
            },
            contentType: "application/json;charset=utf-8",
            success: function (data, textStatus, xhr) {
                $("#ajax_loader").css("display", "none");
                //swal({
                //    position: 'center',
                //    type: 'success',
                //    title: 'Cập nhật thành công!',
                //    showConfirmButton: false,
                //    timer: 1500
                //});
                setTimeout(function () { location.href = "../index.html"; }, 1500);
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#ajax_loader").css("display", "none");
                //swal({
                //    position: 'center',
                //    type: 'error',
                //    title: 'Cập nhật thất bại. Vui lòng nhập lại thông tin!',
                //    showConfirmButton: false,
                //    timer: 1500
                //});
                console.log('Error in Operation');
            }
        });
    }
});