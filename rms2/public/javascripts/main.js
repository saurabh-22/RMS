var AppRouter = Backbone.Router.extend({

    routes: {
        ""              	               : "login",
        "resumes"                          : "home",
        "resumes/"                          : "home",
        "resumes/page/:page"               : "list",
        "resumes/add"                      : "addResumes",
        "resumes/:id"                      : "updateResumes",
        "resumes/search/:term"             : "searchCandidate",
        "resumes/search/:term/page/:page"  : "searchCandidate",
        "resumes/filterResumes/:obj"       : "filterCandidate",
        "resumes/filterResumes/:obj/page/:page" : "filterCandidate",
        "authentication/login"             : "login",
        "authentication/signup"            : "signup"
       
    },


    initialize: function () {

    },
    

    home: function () {
        
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
         $('#content').html(new HomeView().el);

    },

	list: function(page) {
 
        var p = page ? parseInt(page, 10) : 1;
        var candidateList = new ResumesCollection();
        candidateList.fetch({
            cache: false,
            success: function(data){
                console.log(candidateList);
                $("#content").append(new ListView({model: candidateList, page: p}).el);
            },
            statusCode: {
              401: function() {

                  app.navigate("", {trigger: true});
              }
            }
        });
        
        
    },

    updateResumes: function (id) { 
        if (!this.headerView) {
            this.headerView = new HeaderView();
             $('.header').html(this.headerView.el);
        }
        var resume = new Resume();
        resume.urlRoot = "/resumes/"+id;
        resume.fetch({
            success: function(){

            $("#content").html(new ListItemDetailView({model: resume}).el);

        },
        statusCode: {
              401: function() {

                  app.navigate("", {trigger: true});
                  
              }
        }});

        if (!this.footerView) {
            this.footerView = new FooterView();
            $('.footer').html(this.footerView.el);
        }
    },

	addResumes: function() {
        if (!this.headerView) {
            this.headerView = new HeaderView();
             $('.header').html(this.headerView.el);
        }
       
        var resume = new Resume();
        console.log(resume);
        $('#content').html(new ListItemDetailView({model: resume}).el);

        if (!this.footerView) {
            this.footerView = new FooterView();
            $('.footer').html(this.footerView.el);
        }
        
	},

    searchCandidate: function(val,page){


        var candidateSearch = new ResumesCollection();
        candidateSearch.url = "/resumes/search/"+val;
        var p = page ? parseInt(page, 10) : 1;
        candidateSearch.fetch({
            cache: false,
            success: function(data){
            console.log(candidateSearch);
            $("#content").append(new ListView({model: candidateSearch,page:p,searchkey:val}).el);
            },
            statusCode: {
              401: function() {

                  app.navigate("", {trigger: true});
              }
            },
            error: function(){
                console.log('error');
        }});
            
    },

    filterCandidate : function(val,page){
        
         
        var obj = JSON.parse(val);
        var p = page ? parseInt(page, 10) : 1;
        var filterSearch = new ResumesCollection();

        if(obj.startDate == "" || obj.endDate==""){
            filterSearch.url = "/resumes/status/"+obj.c_status;
        }else
        filterSearch.url = "/resumes/filterResumes/"+JSON.stringify(obj);
        
        filterSearch.fetch({
            cache: false,
            success: function(data){
              console.log(filterSearch);
              $("#content").append(new ListView({model: filterSearch,page:p,searchkey:obj}).el);
            },
            error: function(){
                console.log('error');
            }
        });
            
    },

    login: function() {

        var user = new User();
        $('#content').html(new LoginView({model:user}).el);
         $('.header').html('');
         $('.footer').html('');
        
    },

    signup: function() {
        var user = new User();
        console.log(user);
        $('#content').html(new SignupView({model: user}).el);
       
    }
    
    

});

utils.loadTemplate(['HomeView', 'HeaderView', 'ListItemView', 'ListItemDetailView', 'LoginView','SignupView','FooterView' ], function() {
    app = new AppRouter();
    Backbone.history.start();
});