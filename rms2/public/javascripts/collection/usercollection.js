window.UserCollection = Backbone.Collection.extend({

    model: User,

    url: "/authentication/userlist"

});