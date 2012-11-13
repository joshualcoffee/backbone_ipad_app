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