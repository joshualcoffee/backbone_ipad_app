



window.AppRouter = Backbone.Router.extend({

    routes:{
        "":"list",
        "page/:page":"list",
        "wines/:remote_id":"wineDetails",
        "newentry":"newEntry",
        "editentry/:remote_id":"editEntry"
    },

    list:function (page) {
        console.log("route: list ");
        var self = this;
        this.page =   typeof page !== 'undefined' ? page : 1;
        this.before(function () {
            self.showView(new WineListView({model:window.entries, page:self.page}));
        });
    },

    wineDetails:function (id) {
        console.log('details');
        var self = this;
        this.before(function () {
            var wine = window.entries.where({remote_id:id})[0];
            self.showView(new WineView({model:wine}));
        });
    },
    newEntry:function(){
        var self = this;
        this.before(function () {
            self.showView(new NewView({model:window.entries}));
        });
    },
    editEntry:function(id){
        console.log('edit entry');
        var self = this;
        this.before(function () {
            var wine = window.entries.where({remote_id:id})[0];
            self.showView(new EditView({model:wine}));
        });
    },

    showView:function (view) {
        console.log('showView: ' + view);
        if (this.currentView)
            this.currentView.close();
        $('body').html(view.render().el);
        this.currentView = view;
        return view;
    },

    before:function (callback) {
        
        callback();
        
    }

});

