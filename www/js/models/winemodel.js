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
        alert("create");
        this.db.transaction(

            function (tx) {
                var sql = "INSERT INTO "+table+" VALUES ("+model_atts.hash+",'"+model_atts.name+"','"+model_atts.description+"',"+$.now()+","+$.now()+")";
                tx.executeSql(sql, [], function (tx, results) {
                    var hash = model_atts.hash.replace(/['"]/g,'');
                    model.set({remote_id: hash});
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
                tx.executeSql('UPDATE funrun SET name="'+model.name+'",updated_at ='+$.now()+' WHERE remote_id="'+model.remote_id+'"',[], function (tx, results) {
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
                /*
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
                    tx.executeSql("INSERT INTO funrun VALUES ('"+row.remote_id+"','"+row.name+"','test',"+row.created_at+","+row.created_at+")");
                });
                
            */
                
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
        window.entries.fetch();
        
    }
});

window.Wine = Backbone.Model.extend({
	urlRoot: "http://coenraets.org/backbone-cellar/part1/api/wines",
	idAttribute: "remote_id",
    dao: WineDAO
});

window.WineCollection = Backbone.QueryCollection.extend({
	model: Wine,
	idAttribute: "remote_id",
	url: "http://coenraets.org/backbone-cellar/part1/api/wines",
    dao: WineDAO,
    
    comparator: function(model){
      return -model.get("created_at");
    } 
    
	
    
});

window.updated_entries = Backbone.QueryCollection.extend({
	model: Wine,
	idAttribute: "remote_id",
    dao: WineDAO,
    
    
    comparator: function(model){
      return -model.get("updated_at");
    }
    
	
    
});