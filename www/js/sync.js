window.serversync = function(db){
    this.db = db;
    window.localStorage.setItem("last_sync", $.now());
    this.timestamp = window.localStorage.getItem("last_sync");
    window.wineList = new WineCollection();
    
    self = this;
              

}

serversync.prototype = {
    init:function(callback){
      window.wineList.fetch({success:function(){
        self.check_for_updates(window.wineList);
      }});
    },
    check_for_updates:function(collection){
      var test = collection.query({updated_at:{$gt: self.timestamp}});
      alert(test);
    },
    check_new_entries:function(){
    },
    check_server_updates:function(){

    },
    check_server_new:function(){

    },
    get_last_update:function(table){

      

      
      

       
    },
    errorCB:function(err) {
        console.log("Error processing SQL: "+err.code);
    }
}

