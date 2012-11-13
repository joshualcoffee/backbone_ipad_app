window.WineDAO = function (db) {
    this.db = db;
         
};

_.extend(window.WineDAO.prototype, {
    
    findAll:function (callback,table) {
        this.db.transaction(
            function (tx) {

                var sql = "SELECT * FROM "+table+" ORDER BY name";
                tx.executeSql(sql, [], function (tx, results) {
                    var len = results.rows.length;
                    var wines = [];
                    for (var i = 0; i < len; i++) {
                        wines[i] = results.rows.item(i);
                    }
                    callback(wines);
                });
            },
            function (tx, error) {
                alert("Transaction Error: " + error);
            }
        );
    },

    create:function (model, callback, table) {
        var model_atts = model.toJSON();
        this.db.transaction(

            function (tx) {
                var sql = "INSERT INTO "+table+" VALUES ('"+model_atts.hash+"','"+model_atts.title+"','"+model_atts.description+"',"+$.now()+","+$.now()+")";
                tx.executeSql(sql, [], function (tx, results) {
                    model.set({remote_id: "'"+model_atts.hash+"'"});
                    callback(model.toJSON());
                });
            },
            function (tx, error) {
                alert("Transaction Error: " + error);
            }
        );

    },

    update:function (model, callback, table) {
        var model = model.toJSON();
        this.db.transaction(
            function (tx) {
                tx.executeSql('UPDATE funrun SET name="'+model.title+'",updated_at =DATETIME("now") WHERE remote_id="'+model.remote_id+'"',[], function (tx, results) {
                    var len = results.rows.length;
                    var entry = [];
                    for (var i = 0; i < len; i++) {
                        entry[i] = results.rows.item(i);
                    }
                    callback(entry);

                });
                //tx.executeSql("INSERT INTO "+table+" VALUES ('"+model.remote_id+"','"+model.title+"','"+model.description+"','"+model.created_at+"','"+model.updated_at+"',0)");
            },
            function (tx, error) {
                alert("Transaction Error: " + error);
            }
        );
    },

    destroy:function (model, callback) {
//        TODO: Implement
    },

    find:function (model, callback) {
//        TODO: Implement
    },

//  Populate Wine table with sample data
    populate:function (callback, table) {
        this.db.transaction(
            function (tx) {
                console.log('Dropping WINE table');
                
                tx.executeSql('DROP TABLE IF EXISTS funrun');
                var sql =
                    "CREATE TABLE IF NOT EXISTS funrun ( " +
                        "remote_id VARCHAR(50) NOT NULL PRIMARY KEY, " +
                        "name VARCHAR(50), " +
                        "description VARCHAR(50), " +
                        "created_at INTEGER  , " +
                        "updated_at INTEGER)" ;
                console.log('Creating WINE table');
                tx.executeSql(sql);
                console.log('Inserting wines');
                $.ajaxSetup({
                   async: false

                 });
                var rows = [];
                $.get('http://127.0.0.1:3000/entries.json', function(data) {
                  $.each(data,function(i,row){
                    rows.push(row);
                  });
                  
                });
                $.each(rows,function(i,row){

                    //alert("'"+row.remote_id+"','"+row.title+"','test','"+row.created_at+"','"+row.created_at+"'");
                    tx.executeSql("INSERT INTO funrun VALUES ('"+row.remote_id+"','"+row.title+"','test',"+row.created_at+","+row.created_at+")");
                });
                

                
            },

            function (tx, error) {
                console.log(error);
                alert('Transaction error ' + error.code);
            },
            function (tx) {
                callback();

            }
        );

    },

    set_up_collections:function(){
        window.entries = new WineCollection();
        window.entries.fetch({});
    }
});



window.AppRouter = Backbone.Router.extend({

    routes:{
        "":"list",
        "wines/:remote_id":"wineDetails",
        "newentry":"newEntry",
        "editentry/:remote_id":"editEntry"
    },

    list:function () {
        console.log("route: list ");
        var self = this;
        this.before(function () {
            window.entries.fetch();
            self.showView(new WineListView({model:window.entries}));
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
        console.log('details');
        var self = this;
        this.before(function () {
            var wine = window.entries;
            self.showView(new NewView({model:wine}));
        });
    },
    editEntry:function(id){
        console.log('edit entry');
        var self = this;
        this.before(function () {
            var wine = window.entries.where({remote_id:id})[0];
            var list = window.entries;
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

