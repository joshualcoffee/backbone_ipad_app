window.WineListView = Backbone.View.extend({

    initialize: function(options) {
        var tpl = window.templateLoader;
        this.template = _.template(tpl.get('wine-list'));
        _.bindAll(this, "render");

        MyApp.vent.on("add_entry", this.add);
        this.model.bind("change", this.render, this);
        this.model.bind("reset", this.render, this);
        

    },
    reset:function(){
        alert("reset")
    },

    render: function(eventName) {
        console.log('list render');
        $(this.el).html(this.template());
        var ul = $('ul', $(this.el));
        var collection = this.model;

        var collection = collection.query({},{limit:3, page:this.options.page, pager:this.render_page});
		_.each(collection, function(wine) {
           ul.append(new WineListItemView({model: wine}).render().el);
		}, this);

        return this;

         
    },
    render_page:function(total_pages, results){
        
    },
    add:function(entry){
      //$(this.el).html(this.template());
        var ul = $('ul');
        ul.prepend(new WineListItemView({model: entry}).render().el);
        return this;
    },

    
});

window.WineListItemView = Backbone.View.extend({

	tagName: "li",

    initialize: function() {
        var tpl = window.templateLoader;
        this.template = _.template(tpl.get('wine-list-item'));
		this.model.bind("change", this.render, this);
		this.model.bind("destroy", this.close, this);
    },

    render: function(eventName) {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
    }

});