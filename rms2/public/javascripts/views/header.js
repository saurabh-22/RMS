window.HeaderView = Backbone.View.extend({

    initialize: function () {
    
        this.render();

    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },
    events:{
        
       "click .hide" : "logout"
    },

    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    },

    
   logout:function(e){
       
        var model = new User();
        // console.log(model);
        
        model.urlRoot = "/authentication/logout";
        // console.log(model.urlRoot);

        model.fetch( {
            cache:false,
            success: function (model) {
                // self.render();
                app.navigate("", {trigger: true});
                $('.header').html('');
                $('.footer').html('');
                alert('Logout Successfully');


                
            },
            error: function (res) {
                console.log(res);
                utils.showAlert('Error', 'An error occurred while trying to Logout', 'alert-error');
            },

        });
      
    }


});