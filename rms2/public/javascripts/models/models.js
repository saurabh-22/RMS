window.Resume = Backbone.Model.extend({

    urlRoot: "/resumes/add",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.firstname = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a First Name"};
        };

        this.validators.lastname = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a Last Name"};
        };
        this.validators.emailaddress = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a Email Id"};
        };
        this.validators.mobile = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a Phone No"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};
        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },
    defaults: {
        _id: null,
        firstname: "",
        middlename: "",
        lastname: "",
        age:"",
        gender:"Male",
        emailaddress:"",
        exp:"",
        dob:"",
        status:"",
        comment:"",
        mobile:"",
        file:null,
        Date_of_interview:"",
        ext:""
        
    }


});

window.ResumesCollection = Backbone.Collection.extend({

    model: Resume,

    url: "/resumes/list"

});