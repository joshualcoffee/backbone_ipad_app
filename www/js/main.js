// Asynchronous template loader
window.templateLoader = {

    // Map of preloaded templates for the app
    templates:{},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. A build script should concatenate
    // all the template files in a single file.
    load:function (names, callback) {

        var self = this;

        var loadTemplate = function (index) {
            var name = names[index];
            console.log('loading template: ' + name);
            $.get('tpl/' + name + '.html', function (data) {
                self.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            }, 'text');
        };

        loadTemplate(0);
    },

    // Get template by name from map of preloaded templates
    get:function (name) {
        return this.templates[name];
    }

};



Backbone.View.prototype.close = function () {
    console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};

Backbone.sync = function (method, model, options) {

    var dao = new model.dao(window.db);
    var table = window.table;

    switch (method) {
        case "read":
            if (model.id)
                dao.find(model, function (data) {
                    options.success(data);
                },table);
            else
                dao.findAll(function (data) {
                    options.success(data);
                },table);
            break;
        case "create":
            dao.create(model, function (data) {
                options.success(data);
            },table);
            break;
        case "update":
            dao.update(model, function (data) {
                options.success(data);
            },table);
            break;
        case "delete":
            dao.destroy(model, function (data) {
                options.success(data);
            },table);
            break;
    }

};

window.startApp = function () {
    var self = this;
    console.log('open database');
    window.db = window.openDatabase("WineCellar", "1.0", "WineCellar Demo DB", 200000);

    window.table = "funrun";
    var wineDAO = new WineDAO(self.db,window.table);
    
    var tablesync = new serversync(db);
    tablesync.init();
    /*setInterval(function(){

        tablesync.init();
    },10000);
*/
    
    wineDAO.populate(function () {
        this.templateLoader.load(['wine-list', 'wine-details', 'wine-list-item', 'new','edit'], function () {
            self.app = new AppRouter();
            wineDAO.set_up_collections();
            Backbone.history.start();
        }, table);
    })
}