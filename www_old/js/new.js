db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);

function add_new_entry(atts,vals){
  db.transaction(
  function(tx) {
    //tx.executeSql('INSERT OR REPLACE INTO '+table+' (id,'+atts+') VALUES (,'+vals+')'); 
    tx.executeSql('INSERT INTO funrun ('+atts+') VALUES ('+vals+')'); 
   });
}

$(function(){
  $("#form").submit(function(e){
    var form = $(this);
    var inputs = form.find("input");
    var atts = [];
    var vals = [];

    inputs.each(function(){
      var input = $(this);
      
      if(input.attr("name")){
        atts.push(input.attr("name"));
        vals.push('"'+input.val()+'"');
      }
    });
    var hash = CryptoJS.MD5(device.uuid+$.now());
    atts.push("remote_id");
    vals.push('"'+hash+'"');
    add_new_entry(atts.toString(),vals.toString());
    e.preventDefault();
  })
})


