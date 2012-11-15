window.serversync = function(db){
    this.db = db;
    self = this;
    if(typeof this.timestamp == 'undefined'){
        this.reset_timestamp();
    }
              

}

serversync.prototype = {
    init:function(){
      this.check_for_updates();
      this.check_server_new();
    },
    check_for_updates:function(){
      var collection = window.entries;
      var test = collection.query({
        $or:{
          updated_at:{$gt: self.timestamp},
          created_at:{$gt: self.timestamp}
        }
      });

      
    },
    check_server_updates:function(){

    },
    check_server_new:function(){

        $.get('http://127.0.0.1:3000/entries/updated/'+self.timestamp, function(data) {
          var collection = window.entries;
          $.each(data,function(i, row){

           collection.create({
             name: row.name,
             description: row.description,
             hash: '"'+row.remote_id+'"',
             updated_at: row.updated_at,
             created_at: row.created_at,
             update_flag: 0
           },{ 
          success: function(model, response){
           // MyApp.vent.trigger("add_entry", model);
          } 
          });
           self.reset_timestamp();
          });
          
        });
        
    },
    get_last_update:function(table){

    },
    reset_timestamp:function(){
        window.localStorage.setItem("last_sync", $.now());
        self.timestamp = window.localStorage.getItem("last_sync");
    },
    errorCB:function(err) {
        console.log("Error processing SQL: "+err.code);
    }
}

