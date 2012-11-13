
    // Wait for PhoneGap to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);
    db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    // Populate the database 
    //
    
    function populateDB(tx) {
       //tx.executeSql('DROP TABLE IF EXISTS funrun');
        db.transaction(
        function(tx) {
          tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='funrun'", this.txErrorHandler,
            function(tx, results) {
                if (results.rows.length == 1) {
                    console.log('Using existing Employee table in local SQLite database');
                    db.transaction(successCB, errorCB);
                }
                else
                {
                  tx.executeSql("CREATE TABLE IF NOT EXISTS funrun(title,description, updated_at,created_at, update_flag, remote_id VARCHAR NOT NULL PRIMARY KEY)");
                  db.transaction(addRows, errorCB);
                }
            });  
          }         
        )
        
    }

    // Query the database
    //
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM funrun', [], querySuccess, errorCB);
    }

    function addRows(tx){
        $.ajaxSetup({
           async: false

         });
        $.get('http://127.0.0.1:3000/entries.json', function(data) {
          $.each(data,function(i,row){
            tx.executeSql('INSERT OR REPLACE  INTO funrun (title, description, updated_at,created_at, update_flag, remote_id) VALUES ("'+row.title+'","'+row.description+'","'+row.updated_at+'","'+row.created_at+'", 0, "'+row.remote_id+'")');
          });
          db.transaction(successCB, errorCB);
        });
    }
    // Query the success callback
    //
    function querySuccess(tx, results) {
        
        var len = results.rows.length;
        $(".data").empty();
        for (var i=0; i<len; i++){
            //alert("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).title);
            $(".data").append("<p> "+results.rows.item(i).title+" "+results.rows.item(i).description+" "+results.rows.item(i).created_at+" "+results.rows.item(i).remote_id+"</p>");
        }
    }

    // Transaction error callback
    //
    function errorCB(err) {
        console.log("Error processing SQL: "+err.code);
    }

    // Transaction success callback
    //
    function successCB() {
        db.transaction(queryDB, errorCB);
    }

    // PhoneGap is ready
    //
    function onDeviceReady() {
        db.transaction(populateDB, errorCB);
        
    }

    // update 
    function last_update(callback){
      
      db.transaction(
              function(tx) {
                  var sql = "SELECT MAX(updated_at) as lastSync FROM funrun";
                  tx.executeSql(sql, this.txErrorHandler,
                      function(tx, results) {
                          var lastSync = results.rows.item(0).lastSync;
                          alert(lastSync);
                          check_for_changes(lastSync);
                      }
                  );
              }
          );

    }

    function check_for_changes(callback){
      $.ajaxSetup({
         async: false

       });
      $.get('http://127.0.0.1:3000/entries/updated/'+callback, function(data) {
        db.transaction(
        function(tx) {
          tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='funrun'", this.txErrorHandler,
            function(tx, results) {
              $.each(data,function(i,row){
                tx.executeSql('INSERT OR REPLACE INTO funrun (title, description, updated_at, update_flag, remote_id) VALUES ('+row.id+',"'+row.title+'","'+row.description+'","'+row.updated_at+'", 0, "'+row.remote_id+'")');
              });
              db.transaction(successCB, errorCB);
            });  
          }         
        )
      });


    }


    function get_local_changes(tx){
      tx.executeSql('SELECT * FROM funrun WHERE created_at IS  NULL', [], sync_local, errorCB);
    }

    function sync_local(tx,results){
        var len = results.rows.length;
        var json_data = [];
        for (var i=0; i<len; i++){
            var data = new Object();
            data.title = results.rows.item(i).title;
            data.description = results.rows.item(i).description;
            data.remote_id = results.rows.item(i).remote_id;

            json_data.push(JSON.stringify(data));
            
            tx.executeSql('UPDATE funrun SET created_at = DATETIME("now") WHERE remote_id="'+results.rows.item(i).remote_id+'"');
        }
        
        alert(json_data);
          $.post('http://127.0.0.1:3000/entries', {entries:json_data}, function(data){  
        });

        

        

    }




    $(".update").click(function(){
        db.transaction(get_local_changes, errorCB);
        last_update();
    })