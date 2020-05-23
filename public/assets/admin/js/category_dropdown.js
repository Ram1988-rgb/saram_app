$(document).ready(function(){


	var removeIndex;
$.ajax({
  type: "GET",
  url: "/admin/job/all_category",
  success: function(data){
   var myData=JSON.stringify(data)
   // console.log(data)
    $('#unique').empty();
    _createCategory(data,'unique')
  },error:function(err){
  //	console.log('err')
  	//console.log(err)
  }
});

var counter=0;
var uniqueID=undefined;
var string = $(".sepratedd").find("input").val();
var stringLength = $(".sepratedd").find("input").val().length;
var strArr = string.split(",");
function _createCategory(arr,unique){
	$.each(arr,function(key,val){
		counter++;
		//console.log(val.name)
		uniqueID=(uniqueID==undefined)?unique:uniqueID;
		var bool=false;
		$.each(strArr,function(inx,setVal){
			//console.log(setVal)
			if(setVal==val.id){
				bool=true;
			}
			//else{
				// console.log('dont match')
			// }
		})

		if(bool==true){

			$('body').find('#'+uniqueID).append("<li><span class=color id=counter"+val.id+">"+val.name+"</span></li>")
			$(".search-box").prepend("<span class=append-category><span id=counter"+val.id+" class=append-element>"+ val.name+"<span class=remove-element></span></span></span>");
		}else
		$('body').find('#'+uniqueID).append("<li><span id=counter"+val.id+">"+val.name+"</span></li>")
		//$('body').find('#'+uniqueID).append("<li><span id=counter"+val.id+">"+val.name+"</span></li>");
		if(val.category.length>0){
			$('body').find('#'+uniqueID).children('li:last-child').append('<ul id='+val.id+'></ul>');
			$('body').find('#'+uniqueID).children('li:last-child').prepend('<span class=collapse >');
			uniqueID=val.id;
			if(arr.length==$('#'+uniqueID).children().length){
			uniqueID=$('body').find('#'+uniqueID).parent().parent('ul').attr('id');
		}
			_createCategory(val.category,uniqueID);
		}
		if(arr.length==$('body').find('#'+uniqueID).children().length){
			uniqueID=$('body').find('#'+uniqueID).parent().parent('ul').attr('id');
		}
	})
	$("body").find("#unique").find('ul').addClass("sub-categories");
	$(".categories").find("span").not(".collapse").addClass("text");
	// $("li:has(ul)").prepend("");
}
// var matt=[];
// var mat=[];
var current;
var current2;
var colorClass=[];



//$("body").off("click");
$("body").off("click",".search-box").on("click",".search-box",function(event){

		event.stopPropagation()
		//alert($(event.target).attr('class'))
		if($(event.target).attr('class')=='search-box'){
			$(".input").focus()
		}
			if(($(event.target).attr('class')=='search-box')||($(event.target).attr('class').split(" ")[0]=='append-element')||($(event.target).attr('class')=='input')){
				//console.log("dsgdsgg")
				
			$(".categories").css("display") == "block"?$(".categories").slideUp():$(".categories").slideDown();
			
		//$(".categories").slideToggle("slow");
		$(".list").slideUp("slow");
		if($(".list").css("display")=="block"){
		if($(".list").slideUp("slow")){
			$(".categories").css("display","none");
		}
	 }}
	})

	$("body").click(function(event){
	$(".categories").slideUp("slow");
	if(($(event.target).prop("tagName")=='BODY')||($(event.target).attr('class')==$(".form").parent().attr('class'))){
			$(".categories").slideUp("slow");
	}
	//console.log(111111111)
$(".list").slideUp("slow");

})
		
	let status = true;
$("body").off("click",".expand,.collapse").on("click",".expand,.collapse",function(e){
//console.log(1)
    if(status){
    	status = false;
    }
    else return false;
    setTimeout(function(){
     status = true;
    },2000)

	if($(e.target).attr('class')=='collapse'){
		$(this).removeClass("collapse");
		$(this).addClass("expand");
	}
	else{
		$(this).removeClass("expand");
		$(this).addClass("collapse");
	}
	e.stopPropagation()
	//console.log($(e.target).parent("li").children("ul").css("display"))
	if($(e.target).parent("li").children("ul").css("display") == "block")
	$(e.target).parent("li").children("ul").slideUp("slow");
else
	$(e.target).parent("li").children("ul").slideDown("slow");

})
$("body").on("click",".remove-element",function(){
	var cross=$(this).parents(".append-element").text();
	$(this).parents(".append-category").remove()
	$(".text , .dropdown").each(function(){
		 if(cross == $(this).text()){
		 	$(this).removeClass("color")
		 }
	})
	sepratedId();
})

	$(".search-box input").keyup(function(event){
		event.stopPropagation();
		$(".categories").css("display","none")
		$(".list").slideDown()
	var list=[];
	var flag= true;
	 $(".dropdown").remove()
	  $(".unavailable").remove()
	// $(".dropdown").each(function(){
		// var i=0;
	 	// if($(this).attr("class").split(" ")[1] == colorClass.attr("class").split(" ")[0]){
//
	 	// if($(this).attr("class").split(" ")[2]=="color"){
	 		// console.log($(this).attr("class").split(" ")[2]=="color")
	 		// colorClass[i].addClass("color");
 	 		// i++;
	 	 // }
	 	// }
	// })
$(".text").each(function(){
	var string=$(this).text();
		string = string.replace(/\s/g, '');
		var thiss=$(this);
		var searchFlag=false;
	 if(string.match(new RegExp($(".search-box input").val(),'gi'))){
	 	//list.push($(this).text())
	 	//console.log(thiss.attr("id"))
	 		$.each($('.search-box').find('.append-element'),function(){
	 			if($(this).attr("id")==thiss.attr("id")){
	 				searchFlag=true;
	 			}
	 		})
	 		if(searchFlag){
	 			$(".list").append("<div class='dropdown color ' id="+$(this).attr("id")+">"+$(this).text()+"</div>");
	 		}else{
	 			$(".list").append("<div class='dropdown ' id="+$(this).attr("id")+">"+$(this).text()+"</div>");
	 		}
	 	flag = false;
	 }
 });
 if(flag) {
 	$(".list").append("<div class=unavailable>Category is not Available</div>")
 }
 if($(this).val()==""){
 	$(".categories").css("display","block")
 	 $(".dropdown").remove()
 }
 var i=0;
	});
	$("body").on("click",".categories li .text ",function(event){
	event.stopPropagation()
		var text=$(this).attr("id");
		colorClass.push($(this));
	 removeIndex=-1;
	if($(".append-element").length > 0){
	$(".append-element").each(function(key){
		if($(this).attr("id")==text){
			removeIndex=key;
		}
	})
	}
   if(removeIndex !=-1){
   	$(".append-element").eq(removeIndex).parents(".append-category").remove()
   	  $(this).removeClass("color");
   }
  else{
   $(this).addClass("color");
	$(".search-box").prepend("<span class=append-category><span class='append-element ' id="+$(this).attr("id")+">"+ $( this ).text() +"<span class=remove-element></span></span></span>");
	$('body').find('#unique').find('#'+$(this).attr("id")).addClass('color')
	}
	sepratedId();
})
$("body").on("click","#collapse0_2",function(){
		$(".categories").slideUp("slow");
	})
$("body").on("click",".dropdown",function(){

	var removeClasses=$(this).attr("id");
	var setText=$(this).text();
	// if(removeClasses != "color"){
	// $('body').find(".categories").find('span.'+$(this).attr("class").split(" ")[1]).removeClass('color');
	$('body').find('.search-box').find('#'+$(this).attr("id")).parent('.append-category').remove();
	// }
	if($(this).hasClass('color')){

		$('body').find('.search-box').find('#'+$(this).attr("id")).parent('.append-category').remove();
		$(this).removeClass('color');
		$('body').find(".categories").find('span#'+removeClasses).removeClass('color');
	}else{

		removeClasses=$(this).attr("id");

		$(".search-box").prepend("<span class=append-category><span id="+removeClasses+" class='append-element '>"+ setText+"<span class=remove-element></span></span></span>");
	   $(this).addClass('color')
	   $('body').find(".categories").find('span#'+removeClasses).addClass('color');
	}
	sepratedId();
})
function sepratedId(){
	$(".seprated input").val('')
	$(".append-category").each(function(){
			$(".seprated input").val(($(".seprated input").val()=='')?$(this).find(".append-element").attr("id").split("counter")[1]:$(this).find(".append-element").attr("id").split("counter")[1]+","+$(".seprated input").val());
	        console.log(typeof($(".seprated input").val()))
	        console.log(($(".seprated input").val()).split(','))
	})
	var seprate_id = $(".seprated input").val();	
	if(seprate_id.indexOf('5b9f5aba597989fc523ceb40')>-1){
		$(".school_book").show();
	}else{
		$(".school_book").hide();
	}
	getProduct();
}

})
