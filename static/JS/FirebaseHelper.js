

function DeleteTableEntryByIndex(InputIndex, TableAddress){
	//this function will delete a table entry by the index value e.g 0,1,2
	//var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  dataMain);

	var ref = database.ref(TableAddress);

	var nonDeletedStreams = [];

	const promise = ref.once('value', ReceivedData, errData).then(DeleteStreamFromDatabase);

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

	return promise 	
}


function InsertDataIntoTable(InputJSONdata, tableAddress){
	//this will insert the JSON data into the tableAddress
	var ref = database.ref(tableAddress);

	const promise = ref.update(InputJSONdata);

	return promise
}

function AlertIfEmptyInput(element_ID, alertText){
	lol = document.getElementById('StreamName_ID').value;

	if (!lol){
		alert(alertText);
	}
}


function ReturnAsArrayChildOfTable(InputTableJSON){
	//this function will return as a child all the members of queried table as an array

	OutputArr = new Array();

	for(var k in InputTableJSON) OutputArr.push(k);

	return OutputArr
}

function CheckIfElementExistsInArray(element, InputArr){

	var CheckBoolean = false;

	for (var i = 0; i < InputArr.length; i++) {

		if (element==InputArr[i]){
			CheckBoolean = true;
			break
		}
	}

	return CheckBoolean
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


function BoxAlert(AlertText){
	document.getElementById('AlertText_ID').innerHTML = AlertText;
	$('.BoxAlert').fadeIn('fast');
}


function getScheduleTimestamp(time) {
	//accepts hh:mm format - convert hh:mm to timestamp
	time = time.replace(/ /g,'');
	var timeArray = time.split(':');
	var timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
	return timeStamp;
}




