Polymer('mm-todo-list', {
	publish:{
		todoItemsAll:[],
		checked: null,
		width:{ value: 600, reflect : true },
		height: 420,
		todoItemsRemaining:0,
		todoItemsCompleted:0,
		itemHeight: 27,
		totitems: 0, 
		type: "all"
	},

	computed: {
		items: "itemFilter(todoItemsAll, type, todoItemsAll.length)"
	},
	
	newItemHandler: function(changes) {
		this.todoItemsRemaining = this.remainingItems(this.todoItemsAll).length;
	},

	createItem: function() {
		var input = this.$.newItem.value;

		if(input.trim().length > 0) {
			this.totalItems++;
			this.todoItemsAll.push({id:this.totalItems,item:input});
			this.$.newItem.clearInput();
			this.type = "all";
		}
		else{
			this.$.newItem.clearInput();
		}

		this.async(function(){
			this.editFooter();
		});
	},

	addClicked: function(e) {
		this.createItem();
	},

	pressEnter: function(e) {
		if (e.which === 13) {
			this.createItem();
		}
	},

	delItem: function(e) {
		var delid = e.target.dataset.id, 
		arr = this.todoItemsAll, 
		i = arr.length;

		while (i--) {
			if(arr[i].id == delid) {
				arr.splice(i,1);
			}
		}

		this.async(function(){
			this.editFooter();
		});
	},

	remainingItems: function(itemList) {
		return itemList.filter(function(item) {
			return item.checked
		})
	},

	allCheck: function(e) {
		var arr = this.todoItemsAll, 
		i = arr.length;

		if(this.checked === true) {
			while (i--) {
				this.todoItemsAll[i].checked = true;
			}
				
			this.todoItemsRemaining = 0;
			this.todoItemsCompleted = this.todoItemsAll.length;
		}

		if(this.checked === false) {
			while (i--) {
				this.todoItemsAll[i].checked = false;
			}

			this.todoItemsRemaining = this.todoItemsAll.length;
			this.todoItemsCompleted = 0 ; 
		}
		this.type="all";
	},

	editable: function(e) {
		e.target.contentEditable="true";
	},

	endEdit: function(e) {
		if (e.which === 13) {
			this.saveEdit(e);
		}
	},

	saveEdit: function(e){
		var editId = e.target.dataset.id;
		var i = this.todoItemsAll.length;
		var changedItem = e.target.innerHTML;

		while(i--){
			if( this.todoItemsAll[i].id == editId){
				this.todoItemsAll[i].item = changedItem;
			}
		}

		e.target.contentEditable = "false";
		console.log("saved!!");

		if(changedItem.length == 0 ){
			this.deleteItem(e);
		}
	},

	editFooter: function(e) {
		var itemsChecked = this.remainingItems(this.todoItemsAll).length,
		totalCount = this.todoItemsAll.length;
		this.todoItemsRemaining = totalCount - itemsChecked;
		this.todoItemsCompleted = itemsChecked;
		
		if (itemsChecked === totalCount) {
			 this.$.toggleCheck.checked = true;
		}
		else if (itemsChecked < totalCount && itemsChecked >0 ) {
			 this.$.toggleCheck.state="partial";
		}
		else if (itemsChecked === 0 ) {
			this.$.toggleCheck.checked= false;
		}
		else if ( totalCount === 0 ) {
			this.$.toggleCheck.checked = true;
		}
	},

	itemFilter: function(items, type) {
		switch (type) {
			case "all":
				return items;
			case "completed":
				return items.filter(function(item) { return item.checked });
			case "active":
				return items.filter(function(item) { return !item.checked });
		}
	},

	showAll: function() {
		event.preventDefault(); 
		this.type = "all";
	},

	showUnchecked: function() {
		event.preventDefault(); 
		this.type = "";
		this.async(function(){
			this.type = "active";
		}); 	
	},
	
	showCompleted: function() {
		event.preventDefault(); 
		this.type = "";
		this.async(function(){
			this.type = "completed";
		});	
	},

	clearCompleted: function() {
		var i = this.todoItemsAll.length;

		while(i--) {		
			if(this.todoItemsAll[i].checked) {
				this.todoItemsAll.splice(i,1);
			}
		}

		this.editFooter();
		this.type = "all";
	}
});
