window.ListItemDetailView = Backbone.View.extend({


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
        "change input[type=file]" : "uploadResume",
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "delete"
   
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
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
            if($('#cand_id').val() == ""){
                this.model.urlRoot = "/resumes/add"
            }else{
                self.model.urlRoot = "/resumes/"
             }
        self.model.save(null, {
            success: function (model) {

                app.navigate("resumes", {trigger: true});
                alert('Candidate Details Saved successfully');
                utils.showAlert('Success!', 'Details saved successfully', 'alert-success');
            },
            statusCode: {
              401: function() {

                  app.navigate("", {trigger: true});
                  alert("Unauthorized Access,Please Login Again");
              }
            },
            error: function (res) {
                console.log(res);
                utils.showAlert('Error', 'An error occurred while trying to add this Candidate', 'alert-error');
            }
        });
    },


    delete: function () {
        this.model.urlRoot = "/resumes/"
        this.model.destroy({
            success: function () {
                alert('Candidate Details deleted successfully');
                window.history.back();
            },
            statusCode: {
              401: function() {

                  app.navigate("", {trigger: true});
              }
            }
        });
        return false;
    },

    uploadResume:function(event){
        console.log(event.target.files);        
         var ext = event.target.files[0].name.lastIndexOf('.');
         ext = event.target.files[0].name.substring(ext);

         var file = event.currentTarget.files[0];
        
        if( ext == '.doc' || ext == '.docx' || ext == '.pdf'){
            var reader = new FileReader();
            reader.onload = function (e) {
                docfile = {
                        name : event.target.files[0].name, file : e.target.result, ext: ext
                    },
              this.model.set({ 
                file: docfile // file name is part of the data
              });
            }.bind(this)
            reader.onerror = function () {
              console.log("error", arguments)
            }
                 reader.readAsDataURL(file);
            }
            else{
                alert("File Type Should be docx or pdf and less than 2 MB")
            }
    }

    
});