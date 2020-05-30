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

function getSkillsDesign(category){
  $.ajax({
    type: 'POST',
    url: '/admin/category/get-skills-design',
    data: {catId:$("#save_data").val()},
    success: function (response) {
      if(response){
        const detail = response.data;
        const skills = detail.skills;
        const designaitor = detail.design;
        var sk = '';
        for(let i=0;i<skills.length;i++){
          sk = sk+ `<div class="col-md-3">
          <input type="checkbox" name="skills" id="skills-${i}" value="${skills[i].id}" >  ${skills[i].name}
          </div>`
        }
        $('.skills-data').html(sk);      
        var dg = '';
        for(let i=0;i<designaitor.length;i++){
          dg = dg+ `<div class="col-md-3">
          <input type="checkbox" name="skills" id="designaitor-${i}" value="${designaitor[i].id}" >  ${designaitor[i].name}
          </div>`
        }
        $('.designaitor-data').html(dg)
      }
    }
  });
}
