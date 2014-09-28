Polymer('mm-todo-list', {

	publish:{
		todoItemsVisible:[],
		todoItemsAll:[],
		checked: null,
		width:{value:600 , reflect :true},
		height:420,
		todoItemsRemaining:0,
		todoItemsCompleted:0,
		itemHeight:27,
		totitems:0 


	},

	ready: function() {

		this.itemObserver = new ArrayObserver(this.todoItemsVisible);
		this.itemObserver.open(this.newItemHandler.bind(this));


	},
	

	newItemHandler: function(changes) {
		this.todoItemsRemaining = this.remainingItems(this.todoItemsVisible).length;
	},

	createItem: function() {
	var input =this.$.newItem.value;
		if (input == "" || input == " ") {

			return false; 
		}
		this.totitems++;
		this.todoItemsAll.push({id:this.totitems,item:input});
		this.todoItemsVisible = this.todoItemsAll ;
		this.$.newItem.clearInput();
		this.editFooter();
	},

	addClicked: function(e) {

			this.createItem();

	},
	pressEnter: function (e) {

			if(e.which==13) {
				this.createItem();
			}

	},

	delItem: function(e) {


		
		var delid= e.target.dataset.id;
		var arr=this.todoItemsVisible;
		var arr2=this.todoItemsAll;
		var i = arr.length;
		
		while(i--) {
			if(arr[i].id == delid) {
				arr.splice(i,1);
			}
		 
		}
		var j = arr2.length;
		while(j--) {
			if(arr2[j].id == delid) {
					arr2.splice(j,1);
			}
			 
		}


		this.editFooter();
			
	},

	remainingItems: function(itemList) {
		return itemList.filter(function(item) {
			return item.checked
		})
	},

	

	allCheck: function (e) {

		var listLength = this.todoItemsVisible.length;
		var arr=this.todoItemsVisible;
		var i = arr.length;

		if(this.checked==true) {
			while(i--){
			this.todoItemsVisible[i].checked= true;
			}
				
			this.todoItemsRemaining = 0;
			this.todoItemsCompleted = this.todoItemsVisible.length;


		}
		if(this.checked==false) {

			while(i--) {
			this.todoItemsVisible[i].checked= false;
			}
			this.todoItemsRemaining = this.todoItemsVisible.length;
			this.todoItemsCompleted = 0 ; 
						
		}
		
	},

	editable: function(e) {

		e.target.contentEditable="true";
		$('.mainContainer span').blur(function(e){
			this.endEdit

		});	
	},

	endEdit:function(e) {
		
		var keyy = e.which; 
		if(keyy==13) {

			var whtevr = e.target.dataset.id;
			whtevr=whtevr-1;
			this.todoItemsVisible[whtevr].item=e.target.innerHTML;
			e.target.contentEditable="false";

		}
		this.todoItemsAll = this.todoItemsVisible;

	},

	editFooter:function(e) {

		
		var itemsChecked = this.remainingItems(this.todoItemsAll).length;
		var totalCount = this.todoItemsAll.length;
		this.todoItemsRemaining = totalCount - itemsChecked;
		this.todoItemsCompleted = itemsChecked;
		var chk = this.todoItemsRemaining;


	 	if(itemsChecked == totalCount) {
			 this.$.toggleCheck.checked = true;
	 	}
		else if (itemsChecked < totalCount && itemsChecked >0 ) {
			 this.$.toggleCheck.state="partial";
		}
		else if(itemsChecked == 0 ) {
			this.$.toggleCheck.checked= false;
			 
		}
		else if( totalCount == 0 ) {
			this.$.toggleCheck.checked = true;

		}
		
	},


	 showAll:function() {


		event.preventDefault(); 
   		this.todoItemsVisible = this.todoItemsAll;

	},

	showUnchecked:function() {

		event.preventDefault();  
		this.todoItemsVisible = this.todoItemsAll;
		function showunCheck(item) {
			return !item.checked;

		}
		this.todoItemsVisible = this.todoItemsVisible.filter(showunCheck);

	},

   

	showCompleted: function() {
		event.preventDefault(); 
		this.todoItemsVisible = this.todoItemsAll;
		var i = this.todoItemsVisible.length;
		function showCheck(item) {
			return item.checked;
		}
	

		this.todoItemsVisible = this.todoItemsVisible.filter(showCheck);

		
	},

	clearCompleted: function() {
		 function afterClear(item) {
	 	 		return !item.checked;


	 	 }

	 	 var i = this.todoItemsAll.length;
	 	while(i--) {		

	 	 	if(this.todoItemsAll[i].checked) {
	 	 				
	 	 		this.todoItemsAll.splice(i,1);

	 	 	}
	 	 }
	 	 this.todoItemsVisible = this.todoItemsAll;
	 	 this.todoItemsCompleted = 0;
	 	 this.async(function() {

	 	 	 this.todoItemsRemaining = this.todoItemsAll.length;

			
		});
	 	this.editFooter();
	}

});







