

function getLocality(cityId,locality){
    $.ajax({
        type: 'post',
        url: '/admin/setting/locality',
        data: {cityId:cityId, locality:locality},
        success: function (response) {
          $("#locality").html(response);
      }
    })
}

function getSkillsDesign(category){
  if(!validate()){
    return false;
  }
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
          <input type="checkbox" name="skills" id="skills-${i}" value="${skills[i]._id}" >  ${skills[i].name}
          </div>`
        }
        $('.skills-data').html(sk);      
        var dg = '';
        for(let i=0;i<designaitor.length;i++){
          dg = dg+ `<div class="col-md-3">
          <input type="checkbox" name="skills" id="designaitor-${i}" value="${designaitor[i]._id}" >  ${designaitor[i].name}
          </div>`
        }
        $('.designaitor-data').html(dg)
      }
    }
  });
}

function getskillExp(catId,skill_id){
  $(".skillexp-select").html(`<select name="skills" id="skillexp" class="select2 form-control" multiple="multiple"">
  <option value="">Select</option>
</select>`)
  $.ajax({
    type: 'POST',
    url: '/admin/user/skill-exp',
    data: {id:catId},
    success: function (response) {
      if(response.success){
        let code =  (response.code.toLowerCase());
        response.code = code.charAt(0).toUpperCase() + code.slice(1)
        const skillexp = response.detail?response.detail:[];
        var dg = `<option value="">Select ${response.code}</option>`;
        
        for(let i=0;i<skillexp.length;i++){          
          let sel = "";
          if(skill_id && skill_id.indexOf(skillexp[i].name) >-1 ){
            sel = "selected = 'selected'";
          }
          dg = dg+ `<option value="${skillexp[i].name}" ${sel}>${skillexp[i].name}</option>`
        }
        console.log(dg);
        $('#skillexp').html(dg);
        $('#skillexplabel').html(response.code);
        $("#skillexp").select2()
      }
    }
  })
}

function getSubcategory(catId, subcat){
  $(".subcateogry-select").html(`<select name="subcategory" id="subcategory" class="select2 form-control" multiple="multiple"">
  <option value="">Select</option>
</select>`)
  $.ajax({
    type: 'POST',
    url: '/admin/user/subcategory',
    data: {id:catId},
    success: function (response) {
      if(response.success){   
        const subcategory = response.detail?response.detail:[];
        var dg = `<option value="">Select </option>`;
        
        for(let i=0;i<subcategory.length;i++){
          let sel ='';
          if(subcat && subcat.indexOf(subcategory[i]._id) >-1 ){
            sel = "selected = 'selected'";
          }
          dg = dg+ `<option value="${subcategory[i]._id}" ${sel}>${subcategory[i].name}</option>`
        }
        $('#subcategory').html(dg);
        $("#subcategory").select2()
      }
    }
  })
}
