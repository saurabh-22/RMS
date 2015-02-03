window.ListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var resumes = this.model.models;
        var len = resumes.length;
        var startPos = (this.options.page - 1) * 10;
        var endPos = Math.min(startPos + 10, len);
        var searchkey;
        var url;
             
        if(typeof(this.options.searchkey) === 'object'){
            url = "#resumes/filterResumes/"+JSON.stringify(this.options.searchkey);
        }
        else if(typeof(this.options.searchkey) === 'string'){
            
            url = "#resumes/search/"+this.options.searchkey;
        } 
        else
            url = "#resumes";
        
        $(this.el).html('<tbody id="table-data"></tbody>');
        $('#table-data').html('');
        for (var i = startPos; i < endPos; i++) {
            $('#table-data').append(new ListItemView({model: resumes[i]}).render().el);
        }
        
        if($('.pagination').length<=0){
            $(this.el).append(new Paginator({model: this.model, page: this.options.page,searchkey:url}).render().el);
        }else{
            $('.pagination').remove();
            $(this.el).append(new Paginator({model: this.model, page: this.options.page,searchkey:url}).render().el);
        }

        return this;
    }
});


window.ListItemView = Backbone.View.extend({

    tagName: "tr",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});