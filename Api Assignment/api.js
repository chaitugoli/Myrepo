 Polymer("ajax-test", {
	url:'http://challenge.mediamath.com/api/agencies'+'?api_token=dd88982667b3ec6896d6a3a50d80efa3faea6923',
	urladv:'http://challenge.mediamath.com/api/advertisers'+'?api_token=dd88982667b3ec6896d6a3a50d80efa3faea6923',
	urlcam:'http://challenge.mediamath.com/api/campaigns'+'?api_token=dd88982667b3ec6896d6a3a50d80efa3faea6923',
	text1:'',
	urlObject:[],
	advObject:[],
	camObject:[],
	agencies:[],
	advertisers:[],
	campaigns:[],
	advNames:[],
	campNames:[],
	changedCampNames:[],
	agencySelected:'',
	agencyID:'',
	advId:'',
	campStatus:'',

	
	agenId: function(){
		var i = this.agencies.length;
		while(i--){
			if(this.agencies[i].name == this.agencySelected){
				this.agencyID = this.agencies[i]._id;
			}
		}  
		
	},

	changeStatus: function(e){
			console.log(e);
				var i = this.campNames.length;
				while(i--){
					if(this.campNames[i]._id == e.target.dataset.id){
						if(e.target.value == "active"){
							this.campNames[i].status = true;  
						}  
						else if(e.target.value == "inactive"){
						this.campNames[i].status= false;
					} 
					}
					
					
				}
	},
	
	getValue: function(){
		return "active";
		console.log("active");
	},

 	getAdv: function(){
		this.agenId();
		this.$.a2.exec();
		this.$.advList.placeholder="advertisers Names";
		this.advNames = [];
		var i = this.advertisers.length;
		while(i--){
			if(this.advertisers[i].agency_id == this.agencyID){
				this.advNames.push({name:this.advertisers[i].name ,id:this.advertisers[i]._id});
				console.log(this.advertisers[i].name);
				
			}
		}

		 
	},
	
	getAdvId: function() {
		 
		var i = this.advNames.length
		while(i--){
			if(this.advNames[i].name == this.$.advList.value){
				 this.advId = this.advNames[i].id;
			}
		}
		
	},

	
	
	getCamp:function(){
		this.getAdvId();
		this.campNames = [];

		if(this.$.advList.value==""){
				return false
		}	 
		var i= this.campaigns.length;
		while(i-- ){
			if(this.advId == this.campaigns[i].advertiser_id){
				this.changeDate(i);
			 this.campNames.push(this.campaigns[i]); 
						 
						 
			}
						 						 
				}

		console.log(this.campNames);
		this.toggleCheck();
		
		this.$.gridTable.hidden = false;
		this.getStatus();
		this.async(function(){
				$('#startDatePicker::shadow #input').attr("type","date");
				$('#endDatePicker::shadow #input').attr("type","date");
		});
		
	},
	getStatus: function(e) {

		var i = this.campNames.length;
		while(i--){
		if(this.campNames[i].status){
			this.campNames[i].campStatus ="active";
		}
		else if(!this.campNames[i].status){
			this.campNames[i].campStatus ="inactive";
		}
	}
		},


	changeDate: function(i){
			var sDate = new Date(this.campaigns[i].start_date);
			var sMonth = (0+(sDate.getMonth()+1).toString()).substr(-2) ;
			var sDay = (0+sDate.getDate().toString()).substr(-2);
			var sD = sDate.getFullYear()+"-"+sMonth+"-"+sDay; 
			// this.campNames.push({startDate: sD});

		 	this.campaigns[i].startDate = sD;
			var eDate = new Date(this.campaigns[i].end_date);
			var eMonth = (0+(eDate.getMonth()+1).toString()).substr(-2);
			var eDay = (0+eDate.getDate().toString()).substr(-2);
			var eD = eDate.getFullYear()+"-"+eMonth+"-"+eDay
			this.campaigns[i].endDate = eD;
			 //this.campNames.push({endDate: eD});
	},

	toggleCheck: function(){
			var campLength = this.campNames.length;
			var campChecked = this.campNames.filter(function(cam){return cam.checked}).length;

	if (campChecked === campLength) {
			 this.$.toggleAllCheck.checked = true;
	}
	else if (campChecked < campLength && campChecked >0 ) {
			 this.$.toggleAllCheck.state="partial";
	}
	else if (campChecked === 0 ) {
			this.$.toggleAllCheck.checked= false;
	}
	else if ( campLength === 0 ) {
			this.$.toggleAllCheck.checked = true;
	}
	},

	checkAll: function() {
			var i = this.campNames.length;

	if(this.$.toggleAllCheck.checked === true) {
			while (i--) {
					this.campNames[i].checked = true;
			}
	}

	if(this.$.toggleAllCheck.checked === false) {
			while (i--) {
					this.campNames[i].checked = false;
			}
	}

	},

	responseChanged: function(_old, _new) {

		this.urlObject = this.response;
		this.agencies = this.urlObject.agencies;
			
	},
	
	responseAdvChanged: function(_old, _new){

		this.advObject = this.responseAdv;
		this.advertisers = this.advObject.advertisers;
	},
	
	responseCamChanged: function(_old, _new){
		this.camObject = this.responseCam;
		this.campaigns = this.camObject.campaigns;
	},

	saveCampaign: function() {

				this.changedCampNames =[];
		
			var i = this.campNames.length;
			if(this.$.toggleAllCheck.state==="unchecked"){
				alert("please select the Campaigns you want to save!! ");
			}
			while(i--){
				if(this.campNames[i].checked){
					this.campID=this.campNames[i]._id;
					this.updateCamp(i); 
					console.log(this.campNames);
					a = document.createElement("mm-ajax");
					a.setAttribute("url","http://challenge.mediamath.com/api/campaigns/"+this.campID+"?api_token=dd88982667b3ec6896d6a3a50d80efa3faea6923");
					a.setAttribute("method","POST");
					a.body = this.campNames[i];
					a.exec();  
					alert(this.campNames[i].name+"  is Saved!!!");
	
				}

			}
			


	},

	checkChange: function(masterCamp) {
		var masterCamp = this.camObject.campaigns;
		var i = this.changedCampNames.length;
			while(i--){
				 if(masterCamp[i].budget==this.changedCampNames[i].budget && masterCamp[i].name==this.changedCampNames[i].name && masterCamp[i].end_date==this.changedCampNames[i].end_date && masterCamp[i].start_date==this.changedCampNames[i].start_date){
							console.log("No change");
				 }
				 else {
					 console.log(this.campNames[i] , "Changed Campaign");
				 }
			}
	},

	updateCamp: function(i){
			var newSdate = new Date(this.campNames[i].startDate).toISOString();
			var newEdate = new Date(this.campNames[i].endDate).toISOString();
			this.campNames[i].start_date = newSdate;
			this.campNames[i].end_date = newEdate;
	}

});
