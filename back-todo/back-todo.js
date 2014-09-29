var itemChecked = false;
Backbone.View.prototype.event_aggregator = _.extend({}, Backbone.Events);

var Todoitem = Backbone.Model.extend({
	defaults: {
		checked: false,
		name: ''
	}
});

var todoitem = new Todoitem();

var Items = Backbone.Collection.extend({
	model: Todoitem,
});

var items = new Items();

var ItemList = Backbone.View.extend({

	el:'.mainContainer',

	initialize: function(){
		this.event_aggregator.bind("toggleState", this.toggleState);
	},

	render: function(){
		var todoName = $('#todoItem').val();
		var template = _.template($('#todo-list-template').html(),{items: items.models});
		$('#itemContainer').html(template);
		this.toggleState();
		footer.render();
	},

	events:{

		'click mm-checkbox' : 'checkedItems',
		'click mm-icon' : 'deleteTodo',
		'keypress mm-input': 'pressEnter',
		'click mm-button':'addTodoItem',
		'click #toggleCheck': 'toggleAll',
		'dblclick #itemInfo': 'enableEdit',
		'keypress span': 'endEdit',
		'blur span':'saveEdit'
	},

	activeTodoItems: function(){
		var activeTodo = _.filter(items.models,function(model){return !model.attributes.checked});
		var template = _.template($('#todo-list-template').html(),{items: activeTodo});
		$('#itemContainer').html(template);	
	},

	completedTodoItems: function(){
		var completeTodo = _.filter(items.models,function(model){return model.attributes.checked});
		var template = _.template($('#todo-list-template').html(),{items: completeTodo});
		$('#itemContainer').html(template);
	},

	checkedItems: function(e){
		var chkid = e.target.dataset.id;
		itemChecked = e.target.checked;

		if(itemChecked){
			var i = items.length;
			while(i--){
					if(items.models[i].cid == chkid){
						items.models[i].set('checked' , itemChecked);
					}
			}
		}
		else{
			var i = items.length;
			while(i--){
					if(items.models[i].cid == chkid){
						items.models[i].set('checked' ,itemChecked);
					}
			}
		}

		footer.render();
		itemList.render();
		router.navigate('#/all' , {trigger: true});	
	},

	toggleState: function(){
		var completeTodo = _.filter(items.models,function(model){return model.attributes.checked}).length;
		var listLength = items.models.length;

		if(completeTodo === listLength){
			$('#toggleCheck').attr('state','checked');
		}
		else if(completeTodo < listLength && completeTodo != 0){
			$('#toggleCheck').attr('state','partial');
		}
		else if(completeTodo == 0){
			$('#toggleCheck').attr('state','unchecked');
		}
	},

	toggleAll: function(e){
		var completeTodo = _.filter(items.models,function(model){return model.attributes.checked});
		var i = items.models.length;
		var toggleBox = e.target.checked;

		if(toggleBox){
			while(i--){
				items.models[i].set('checked', true);
			}	
		}
		else{
			var i = items.models.length;
			while(i--){
				items.models[i].set('checked', false);
			}
		}

		itemList.render();
		footer.render();
	},

	pressEnter: function(e){
		if(e.which==13){
			this.addTodoItem();
		}
	},

	addTodoItem: function(){
		var todoName = $('#todoItem');
		if (todoName.val() == "" || todoName.val() == " ") {
			return false; 
		}

		items.add({name:todoName.val()});
		itemList.render();
		footer.render();
		this.toggleState();
		todoName.val("");
		router.navigate('#/all' , {trigger: true});
	},

	enableEdit: function(e){
		e.target.contentEditable="true";
	},

	endEdit: function(e){
		if(e.which === 13){
			this.saveEdit(e);
		}	
	},
	saveEdit: function(e){
		var editId = e.target.dataset.id;
		var i = items.length;
			while(i--){
				if(items.models[i].cid == editId){
				items.models[i].attributes.name = e.target.innerHTML;
				}
			}
		e.target.contentEditable="false";
		console.log('saved');	
	},

	deleteTodo: function(e){
		var delId = e.target.dataset.id;
		var i = items.length;
		while(i--){
			if(items.models[i].cid == delId){
				items.remove(items.at(i));	
			}
		}
		footer.render();
		this.toggleState();
		router.navigate('#/all' , {trigger: true});	
	}
});

var FooterTodo = Backbone.View.extend({

	el:'.todoFooter',

	events: {
		'click mm-button' : 'clearItems'
	},
	
	render: function() {
		var completeTodo = _.filter(items.models,function(model){return model.attributes.checked});
		var activeTodo = _.filter(items.models,function(model){return !model.attributes.checked});
		compItems = completeTodo.length;
		actItems = activeTodo.length;
		var template = _.template($('#todo-footer-template').html(),{checkedItems: compItems,remainingItems: actItems});
		this.$el.html(template);	
	},

	clearItems: function(){
		var completeTodo = _.filter(items.models,function(model){return model.attributes.checked});
		items.remove(completeTodo);
		footer.render();
		router.navigate('#/all' , {trigger: true});
		this.event_aggregator.trigger("toggleState");
	}
});

var Router = Backbone.Router.extend({
	routes: {
		'' : 'home',
		'active': 'activeItems',
		'completed': 'completedItems',
		'all': 'home'
	}
});

var itemList = new ItemList();
var footer = new FooterTodo();
var router = new Router();

router.on('route:home',function(){
	itemList.render();
	footer.render();
});

router.on('route:activeItems',function(){
	itemList.activeTodoItems();
});

router.on('route:completedItems',function(){
	itemList.completedTodoItems();
});

Backbone.history.start();


