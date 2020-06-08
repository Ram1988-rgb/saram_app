
  $(document).ready(function(){
 //adminrole
   $('#role_tbl').DataTable({
        "processing": true,
    	"serverSide": true,
    	"ordering": true,
      "sDom": 'Rfrtlip',
                  "columnDefs": [ {
                      "targets": 'no-sort',
                      "orderable": false,
                } ],
        "ajax": {
        	url: ADMINSITEURL+'role/all_role/',
        	type: "POST"
        }
   	});

   //administrator
   $('#administrator_tbl').DataTable({
        "processing": true,
      "serverSide": true,
      "ordering": true,
      "sDom": 'Rfrtlip',
                  "columnDefs": [ {
                      "targets": 'no-sort',
                      "orderable": false,
                } ],
        "ajax": {
          url: ADMINSITEURL+'administrator/all_administrator/',
          data:{"name":$("#pname").val(),
                "email":$("#pemail").val(),
                "username":$("#user_name").val(),
                "role":$("#prole").val(),
                "status":$("#pstatus").val(),
                "block":$("#pblock").val()
              },
          type: "POST"
        }
    });

   //channel
   $('#consumer_tbl').DataTable({
      "processing": true,
      "serverSide": true,
      "ordering": true,
      "searching": false,
      "sDom": 'Rfrtlip',
                  "columnDefs": [ {
                      "targets": 'no-sort',
                      "orderable": false,
                } ],
        "ajax": {
          url: ADMINSITEURL+'consumer/all/',
          type: "POST"
        }
    });
  

    $('#user_tbl').DataTable({
    //alert($("#last_id").val());
      "processing": true,
      "serverSide": true,
      "ordering": true,
      "sDom": 'Rfrtlip',
                  "columnDefs": [ {
                      "targets": 'no-sort',
                      "orderable": false,
                } ],
        "ajax": {
          url: ADMINSITEURL+'user/all/',
          type: "POST",          
        }
    });
    
     $('#job_tbl').DataTable({
      "processing": true,
      "serverSide": true,
      "searching": false,
      "ordering": true,      
      "sDom": 'Rfrtlip',
                  "columnDefs": [ {
                      "targets": 'no-sort',
                      "orderable": false,
                } ],
        "ajax": {
          url: ADMINSITEURL+'job/all/',
          data:{
            "name":$("#name").val(),
            'user_id':$("#user_id").val(),
            "status":$("#status").val(),
          },
          type: "POST",          
        }
    });


    $('#staticpages_tbl').DataTable({
      "processing": true,
      "serverSide": true,
      "searching": false,
      "ordering": true,      
      "sDom": 'Rfrtlip',
                  "columnDefs": [ {
                      "targets": 'no-sort',
                      "orderable": false,
                } ],
        "ajax": {
          url: ADMINSITEURL+'staticpages/all/',
          data:{
            "name":$("#name").val(),
            "status":$("#status").val(),
          },
          type: "POST",          
        }
    });

    $('#userjobs_tbl').DataTable({
      "processing": true,
      "serverSide": true,
      "searching": false,
      "ordering": true,
      "sDom": 'Rfrtlip',
                  "columnDefs": [ {
                      "targets": 'no-sort',
                      "orderable": false,
                } ],
        "ajax": {
          url: ADMINSITEURL+'userjobs/all/',
          data:{
            'user_id':$("#user_id").val(),
            "status":$("#status").val()
          },
          type: "POST",          
        }
    });

    $('#vendorRequestTable').DataTable({
        "processing": true,
          "serverSide": true,
          "order": [[ 5, "desc" ]],
          "columns": [
            { "name": "checkboxes","orderable": false  },
            { "name": "name" },
            { "name": "email" },
            { "name": "mobile" },
            { "name": "vendor.organisation" },
            { "name": "vendor.request_date" },
            { "name": "action","orderable": false },

          ],
        "ajax": {
          url : ADMINSITEURL+'vendor/request',
          type : "POST"
        }
    });

    $('#vendorListTable').DataTable({
      "processing": true,
        "serverSide": true,
        "order": [[ 5, "desc" ]],
        "columns": [
          { "name": "checkboxes","orderable": false  },
          { "name": "name" },
          { "name": "email" },
          { "name": "mobile" },
          { "name": "vendor.organisation" },
          { "name": "vendor.request_date" },
          { "name": "action","orderable": false },

        ],
      "ajax": {
        url : ADMINSITEURL+'vendor/list',
        type : "POST"
      }
  });
    

    $('#managepage_tbl').DataTable({
      "processing": true,
      "serverSide": true,
      "searching":true,
      "lengthChange":true,
      "sDom": 'Rfrtlip',
      "ordering": true,
        "columnDefs": [ {
          "targets": 'no-sort',
          "orderable": false,

    } ],
        "ajax": {
          url: ADMINSITEURL+'managepage/all_pages',
          type: "POST"
        }
    });

 });




 

