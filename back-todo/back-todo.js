$(function() {
	var items;
	var router;
	var itemView;
	var footer; 
	var inputView;
	
	var Todoitem = Backbone.Model.extend({
		defaults: {
			checked: false,
			name: ''
		}
	});

	var Items = Backbone.Collection.extend({
		model: Todoitem,
	});

	var InputView = Backbone.View.extend({
		el:'.inputContainer',

		initialize: function(){
			items = new Items();
			router = new Router();
			itemView = new ItemView();
			footer = new FooterTodo();
		},

		events:{
			'keypress mm-input': 'pressEnter',
			'click mm-button':'addTodoItem',
			'click #toggleCheck': 'toggleAll'	
		},
		
		toggleState: function(){
			var completeTodo = items.where({checked: true}).length;
			var listLength = items.models.length;

			if(completeTodo === listLength){
				$('#toggleCheck').attr('state','checked');
			}
			else if(completeTodo < listLength && completeTodo != 0){
				$('#toggleCheck').attr('state','partial');
			}
			else if(completeTodo === 0){
				$('#toggleCheck').attr('state','unchecked');
			}
		},

		toggleAll: function(e){
			var toggleBox = e.target.checked;
			
			items.each( function(model){
				model.set("checked", toggleBox);
			});
			router.navigate('#/all' , {trigger: true});
		},

		pressEnter: function(e){
			if(e.which==13){
				this.addTodoItem();
			}
		},

		addTodoItem: function(){
			var todoName = $('#todoItem');
		
			if( $.trim(todoName.val()).length > 0 ){
				items.add({name:todoName.val()});
				todoName.val("");
				router.navigate('#/all' , {trigger: true});
			}
			else{
				todoName.val("");
			}		
		}	
	});

	var ItemView = Backbone.View.extend({
		el:'.itemContainer',

		events: {
			'click mm-checkbox' : 'checkedItems',
			'click mm-icon' : 'deleteTodo',
			'dblclick #itemInfo': 'enableEdit',
			'keypress span': 'endEdit',
			'blur span':'saveEdit'
		},
		
		render: function(){
			var todos = new Items();
			var template = _.template($('#todo-list-template').html(),{items: items.models});
			this.$el.html(template);
			this.listenTo(todos, 'change', footer.render());
			this.listenTo(todos, 'change' , inputView.toggleState());
		},

		checkedItems: function(e){
			var chkid = e.target.dataset.id;
			var itemChecked = e.target.checked;

			items.each( function(model){
				if(model.cid == chkid){
					model.set("checked", itemChecked);
				}
			});

			router.navigate('#/all' , {trigger: true});

		},

		deleteTodo: function(e){
			var delId = e.target.dataset.id;
			delItem = items.get(delId);
			items.remove(delItem);
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
			var editItem = items.get(editId);
			var changedItem = e.target.innerText;
			editItem.set("name", changedItem);
			e.target.contentEditable="false";
			console.log('saved');	
			
			if($.trim(changedItem).length == 0 ){
				this.deleteTodo(e);
			}

		}
		
	});

	var FooterTodo = Backbone.View.extend({
		el:'.todoFooter',

		events: {
			'click mm-button' : 'clearItems'
		},
		
		render: function() {
			var completeTodo = items.where({checked: true});
			var activeTodo = items.where({checked: false});
			compItems = completeTodo.length;
			actItems = activeTodo.length;
			var template = _.template($('#todo-footer-template').html(),{checkedItems: compItems,remainingItems: actItems});
			this.$el.html(template);	
		},

		activeTodoItems: function(){
			var activeTodo = items.where({checked: false});
			var template = _.template($('#todo-list-template').html(),{items: activeTodo});
			$('.itemContainer').html(template);	
		},

		completedTodoItems: function(){
			var completeTodo = items.where({checked: true});
			var template = _.template($('#todo-list-template').html(),{items: completeTodo});
			$('.itemContainer').html(template);
		},

		clearItems: function(){
			var completeTodo = items.where({checked: true});
			items.remove(completeTodo);
			router.navigate('#/all' , {trigger: true});
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

	inputView = new InputView();

	router.on('route:home',function(){
		itemView.render();
	});

	router.on('route:activeItems',function(){
		footer.activeTodoItems();
	});

	router.on('route:completedItems',function(){
		footer.completedTodoItems();
	});

	Backbone.history.start();
});


