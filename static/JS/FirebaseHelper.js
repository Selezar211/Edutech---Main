

function DeleteTableEntryByIndex(InputIndex, TableAddress){
	//this function will delete a table entry by the index value e.g 0,1,2
	//var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  dataMain);

	var ref = database.ref(TableAddress);

	var nonDeletedStreams = [];

	ref.once('value', ReceivedData, errData);

	//Functions for fetching data
	function ReceivedData(data){

		tableData = data.val();
		var arr = $.map(tableData, function(el) { return el; });


		for (var i = 0; i < arr.length; i++) {

			if (i!=parseInt(InputIndex)){
				console.log('copying non deleted streams..');
				nonDeletedStreams.push(arr[i]);
			}

		}
		console.log(nonDeletedStreams);
		DeleteStreamFromDatabase();
	}

	function errData(err){
		console.log('Error!');
		console.log(err);
	}

	function DeleteStreamFromDatabase(){

  		var database = firebase.database();
  		var ref = database.ref(TableAddress);
  		ref.remove();
  		console.log('timing has been removed');

  		JSONarray = {...nonDeletedStreams};

		var database = firebase.database();
		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  dataMain);

		ref.update(JSONarray);

	}   	
}


function DeleteTableEntryByKey(){
	//this function will delete a table entry by the key name itself
}

function InsertDataIntoTable(InputJSONdata, tableAddress){
	//this will insert the JSOn data into the tableAddress
	var ref = database.ref(tableAddress);

	ref.update(InputJSONdata);
}


function ReturnAsArrayChildOfTable(InputTableJSON){
	//this function will return as a child all the members of queried table as an array

	OutputArr = new Array();

	for(var k in InputTableJSON) OutputArr.push(k);

	return OutputArr
}



function CheckIfThisTableExists(tableAddress){
	//will return true if the given table exists and false if not

	var ExistsOrNot;

	var ref = database.ref(tableAddress);

	ref.once('value', ReceivedData, errData);

	//Functions for fetching data
	function ReceivedData(data){
		tableData = data.val();

		if (tableData){
			ExistsOrNot = true;
		}
		else {
			ExistsOrNot = false;
		}

	}

	function errData(err){
		console.log('Error!');
		console.log(err);
	}

	return ExistsOrNot

}