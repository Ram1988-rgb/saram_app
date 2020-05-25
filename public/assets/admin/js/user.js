function getLocality(cityId){
    $.ajax({
        type: 'post',
        url: '/admin/setting/locality',
        data: {cityId:cityId},
        success: function (response) {
          $("#locality").html(response);
      }
    })
}