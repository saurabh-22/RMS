window.HomeView = Backbone.View.extend({


    events:{

       'click .submit':'searchHandler',
       'click .filter' :'filterHandler',
       'click .delete-many' : 'multipleDelete',
       'keyup .txt' : 'submitHandler'
       
    },


    initialize:function (page) {
      if(!this.headerView){
            this.headerView = new HeaderView();
            $('.header').html(this.headerView.el);
        }

         $(this.el).html(this.template());
        var p = page ? parseInt(page, 10) : 1;
        var candidateList = new ResumesCollection();
        candidateList.fetch({
            cache: false,
            success: function(data){
                // console.log(candidateList);
                $("#content").append(new ListView({model: candidateList, page: p}).el);
            },
            statusCode: {
              401: function() {

                  app.navigate("", {trigger: true});
                  alert("Unauthorized Access,Please Login");
              }
            }
        });
        if (!this.footerView) {
            this.footerView = new FooterView();
            $('.footer').html(this.footerView.el);
        }

    },

   

    submitHandler:function(e){
      if(e.keyCode == 13){ 
       var inputFields = this.$('.txt').val();
       app.navigate("resumes/search/"+inputFields, {trigger: true});
        this.$(".submit").click();
       }
     },

    searchHandler:function(e){

       var inputFields = this.$('.txt').val();
       app.navigate("resumes/search/"+inputFields, {trigger: true});

    },
    
    filterHandler:function(e) {

      var page = page;
      var obj = {};
      obj.startDate = $ ('.frm').val();
      obj.endDate = $('.to').val();
      obj.c_status = $('input:radio[name=a]:checked').val();
      var filter = $('input:radio[name=a]:checked').val();
     
      app.navigate("resumes/filterResumes/"+JSON.stringify(obj), {trigger: true});
     
    },

    multipleDelete: function(e) {

      var ids = [];
      $("input[name='checked-val']:checked").each(function() {
                      
          ids.push($(this).val());

        });
        var multidel = new ResumesCollection();
        multidel.url = "/resumes/delete/"+JSON.stringify(ids);
          multidel.fetch({
              cache:false,
              success: function (model) {
                  $(function(){

                   if ($("input[name='checked-val']:checked")) {
                      
                      $($("input[name='checked-val']:checked")).parents('tr').remove();

                   }else{
                      
                   }
                   
                  });
              },
              error: function (res) {
                console.log(res);
                utils.showAlert('Error', 'An error occurred while trying to delete the Selected Candidates', 'alert-error');
              }
          });
        return false;
    }

    
});