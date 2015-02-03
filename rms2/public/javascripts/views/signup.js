window.SignupView = Backbone.View.extend({


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

    
    events: {
        "change"        : "change",
        "click .save-signup"   : "beforeSave",
        "click .delete" : "delete"
   
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

   beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.saveResumes();
        return false;
    },

    saveResumes: function () {
        var self = this;
        // console.log(this.model.urlRoot);
        self.model.urlRoot = "/authentication/signup"
             
        self.model.save(null, {
            success: function (model) {
                // self.render();
                alert('Login Details Saved successfully');
                app.navigate("", {trigger: true}); 
                utils.showAlert('Success!', 'Details saved successfully', 'alert-success');
            },
            error: function (res) {
                alert('User Exists, Please Try some other User Name');
                console.log(res);
                utils.showAlert('Error', 'An error occurred while trying to add this Candidate', 'alert-error');
            }
        });
    },


    delete: function () {
        this.model.urlRoot = "/authentication/"
        this.model.destroy({
            success: function () {
                alert('Admin deleted successfully');
                window.history.back();
            }
        });
        return false;
    }
    
});