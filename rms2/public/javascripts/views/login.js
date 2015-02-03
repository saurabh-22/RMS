window.LoginView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        
         if(this.model)
         $(this.el).html(this.template(this.model.toJSON()));
         else
         $(this.el).html(this.template());

        return this;
    },

    events:{
       "change": "change",
       "click .submit":"beforelogin"
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        console.log(change);
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

     beforelogin: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.login();
        return false;
    },

    login:function(e){
       
        var self = this;
        
        self.model.urlRoot = "/authentication/login"


        self.model.save(null, {
            success: function (model) {
                
                // alert('Login Successfully');
                $(".loginpage").fadeOut();
                app.navigate("resumes", {trigger: true});
            },
            error: function (res) {
                console.log('res');
                alert('Incorrect User Name or Password. Please Try again.');
                utils.showAlert('Error', 'An error occurred while trying to Login', 'alert-error');
            }
        });
      
    }
    

});