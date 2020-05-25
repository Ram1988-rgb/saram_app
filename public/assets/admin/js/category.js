$(document).ready(function () {
  get_all_category();
  $(document).on("click", ".menu_link", function () {
    var category = $(this).attr('id');
    var res = category.split("_");
    var cat_id = res[1];
    $('#cat_id').val(cat_id);
    $.ajax({
      type: 'get',
      url: '/admin/category/get-category/'+cat_id,
      data: {},
      success: function (response) {        
        const detail = response.data;
        $('#cat_form').attr('action', '/admin/category/edit/'+cat_id);
        $('#code').attr('data-validation-url', '/admin/category/check-code?cat_id='+cat_id);
        $("#cat_id").val(detail._id);
        $(".cat-id-data").val(detail._id);
        $("#name").val(detail.name);
        $("#code").val(detail.code);
        $("#description").val(detail.description);
        $("#cat-title").html(detail.name);
        $("#skill-button").show();
        $("#design-button").show();
        const designaitors = response.designaitors?response.designaitors:[];
        const skills = response.skills?response.skills:[];
        
         manageDesignaitor(designaitors);        
         manageSkills(skills);
         
        
      }
    })
  })

  $('#skill-form').submit(function(event) {
    event.preventDefault();
    $.ajax({
      type: 'post',
      url: '/admin/category/save-skills',
      data: $(this).serialize(),
      success: function (response) { 
        alert("Skills has been added/updates successfully");
        $("#skills-close").trigger('click')
      }
    })
  })

  $('#designaitor-form').submit(function(event) {
    event.preventDefault();
    $.ajax({
      type: 'post',
      url: '/admin/category/save-designaitor',
      data: $(this).serialize(),
      success: function (response) { 
        alert("Designaitors has been added/updates successfully");
        $("#designaitor-close").trigger('click')
      }
    })
  })

  //subroot
  $('#sub-root').click(function () {   
    $('#cat_form').attr('action', '/admin/category/add');
    $('#code').attr('data-validation-url', '/admin/category/check-code');
    $("#name").val('');
    $("#code").val('');
    $("#skill-button").hide();
    $("#design-button").hide();
    $("#description").val('');
  });

  $('#delete-root').click(function () {
    var id = $("#cat_id").val();
    swal({
      title: "Are you sure?",
      text: "all its subcontact will also delete ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      closeOnConfirm: false,
      closeOnCancel: false
    }, function (isConfirm) {
      if (isConfirm) {
        var post_url = ADMINSITEURL + "category/delete/" + id;
        $.ajax({
          type: 'POST',
          url: post_url,
          data: {},
          success: function (response) {
            if (response) {
              get_all_category();
              $('#cat_form').attr('action', '/admin/category/add');              
              $("#cat_id").val(0);              
              swal("Deleted!", "Your Data has been deleted.", "success");
              location.reload(3000);
            }
          }
        });
      } else {
        swal("Cancelled", "Your data is safe :)", "error");
      }
    });
  });
  

})

function manageDesignaitor(designaitors){
  var fieldHTML = `<div>
    <input type="text" name="designaitor_add" value="" placeholder="Designaitor"/>  
</div>`
  if(designaitors.length>0){
     fieldHTML = '';
    for(let i=0;i<designaitors.length;i++){
    fieldHTML = fieldHTML+`<div>
      <input type="text" name="designaitor[${designaitors[i]._id}]" value="${designaitors[i].name}" placeholder="Skill"/>
      <a href="javascript:void(0);" class="remove_button" onclick="deleteDiv(this)">
        <img src="/assets/admin/images/remove-icon.png"/>
      </a>
    </div>`; 
    }
  }
  $('.field_wrapper_designaitor').html(fieldHTML)
}

function manageSkills(skills){
  var fieldHTML = `<div>
  <input type="text" name="skills_add" value="" placeholder="Skills"/>  
  </div>`
  if(skills.length>0){
    var fieldHTML = '';
    for(let i=0;i<skills.length;i++){
      fieldHTML = fieldHTML+= `<div>
        <input type="text" name="skills[${skills[i]._id}]" value="${skills[i].name}" placeholder="Skill"/>
        <a href="javascript:void(0);" class="remove_button" onclick="deleteDiv(this)">
          <img src="/assets/admin/images/remove-icon.png"/>
        </a>
      </div>`; 
    }
  }
  $('.field_wrapper').html(fieldHTML)
}

function addSkills(cldiv){
  var fieldHTML = `<div>
    <input type="text" name="skills_add" value="" placeholder="Skill"/>
    <a href="javascript:void(0);" class="remove_button" onclick="deleteDiv(this)">
      <img src="/assets/admin/images/remove-icon.png"/>
    </a>
  </div>`; 
  $("."+cldiv).append(fieldHTML);
}





function deleteDiv(str){
  $(str).parent('div').remove();
}

function addDesignaitor(cldiv){
  var fieldHTML = `<div>
    <input type="text" name="designaitor_add[]" value="" placeholder="Designaitor"/>
    <a href="javascript:void(0);" class="remove_button" onclick="deleteDiv(this)">
      <img src="/assets/admin/images/remove-icon.png"/>
    </a>
  </div>`; 
  $("."+cldiv).append(fieldHTML);
}





function get_all_category() {
    var post_url = "/admin/all-category";
    $.ajax({
      type: 'get',
      url: post_url,
      data: {},
      success: function (response) {
        $("#skill-button").hide();
        $("#design-button").hide();
        var res = buildMenu(response.data, null, '');
        console.log(res)
        $("#nestable").html(res);
        managemenu();
    }
  })
}

var buildMenu = function (res, $parentid, data) {
  // console.log(res);
  var $result = '';
  $.each(res, function (key, $item) {
    if ($item.cat_id == $parentid) {
      var menu_name = $item.name ? $item.name : "no data";
      var child = $item.child ? $item.child : "0";
      $result += "<li class='dd-item nested-list-item' data-order='$item.order' data-id='" + $item._id + "'' id='" + $item._id + "'>";
      $result += "<div class='dd-handle nested-list-handle'>";
      $result += "<span class='fa fa-folder'></span>";
      $result += "</div>";
      $result += "<div class='nested-list-content'><span id='cat_" + $item._id + "' class='menu_link' >" + menu_name + "("+child+")</span></div>";
      $result += "<div class='pull-right'>";

      /*$result += "<a href='javascript:;' class='edit_toggle' rel='"+$item.id+"'>Edit</a> |";
      $result += "<a href='javascript:;' class='delete_toggle' rel='$item.id'>Delete</a>"*/
      $result += "</div>";
      $result += buildMenu(res, $item._id, data);
      $result += "</li>";

    }
  });
  if ($result) {
    $result = $result.replace(/undefined/g, '');
    return "<ol id='top_ol' class=\"dd-list\">\n" + $result + "</ol>";

  }
};

