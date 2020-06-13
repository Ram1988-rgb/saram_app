function managemenu(){
  
    var BASEURL = ADMINSITEURL;
    
    $('.dd').nestable({ 
      
      dropCallback: function(details) {      
         var order = new Array();
         $("li[data-id='"+details.destId +"']").find('ol:first').children().each(function(index,elem) {
            order[index] = $(elem).attr('data-id');
         });
  
         if (order.length === 0){
          var rootOrder = new Array();
          $("#nestable > ol > li").each(function(index,elem) {
            rootOrder[index] = $(elem).attr('data-id');
          });
         }
  
         $.post(BASEURL+'category/reorder', 
          { source : details.sourceId, 
            destination: details.destId, 
            order:JSON.stringify(order),
            rootOrder:JSON.stringify(rootOrder)          
          }, 
          function(data) {          
            //console.log(data); 
          })
         .done(function() { 
            $( "#success-indicator" ).fadeIn(100).delay(1000).fadeOut();
         })
         .fail(function() {  })
         .always(function() {  });
       }
     });
       
     $('.dd').nestable('collapseAll');   
  }
  