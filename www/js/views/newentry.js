window.NewView = Backbone.View.extend({

    initialize: function(options) {
    var tpl = window.templateLoader;
    this.template = _.template(tpl.get('new'));
    },

    events: {
      "submit #newentryform":  "save"
    },

    render: function(eventName) {
    console.log('render');
    
    $(this.el).html(this.template());
    return this;
    },

    save:function(event){
      var hash = CryptoJS.MD5(device.uuid+$.now());
      this.model.create({
        name: this.$(".name").val(),
        description: "hello",
        hash: '"'+hash+'"',
        updated_at: $.now(),
        created_at: $.now()
      },{ 
        success: function(model){
          MyApp.vent.trigger("add_entry", model);
          app.navigate('', true);
        } 
      });

      event.preventDefault();
    }

});

window.EditView = Backbone.View.extend({

    initialize: function() {
    var tpl = window.templateLoader;
    this.idAttribute = 'remote_id';
    this.template = _.template(tpl.get('edit'));
    this.model.bind("reset", this.render, this);
    
    },
    
    events: {
      "submit #editentryform":  "edit"
    },

    render: function(eventName) {
    console.log('render');
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
    },

    edit:function(){

      this.model.set({
        name: this.$(".name").val(),
        description: this.model.get("description"),
        updated_at: "now",
        created_at: "now",
        update_flag: 1
      });

      this.model.save( {}, { error: this.trigger('error'), 
        success: function(){
          app.navigate('', true);
        } 
      });


      event.preventDefault();
    }

});