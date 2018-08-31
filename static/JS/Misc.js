function EncodeString(inputString) {

	outputstring = encodeURIComponent(inputString).replace(/\./g, '%2E');

	return outputstring
}


function DecodeString(inputString) {
	outputstring = decodeURIComponent(inputString);
	withoutDots = outputstring.replace('%2E', '.');

	return withoutDots
}

function FadeOutANDRemove(speed, element_) {

	$(element_).fadeOut(speed, function() {
		$(element_).remove();
	})
}

function BlurAnimate(blurElement) {

	tweenBlur(blurElement, 0, 30);
}



function UnBlurAnimate(unblurElement) {

	tweenUnBlur(unblurElement, 30, 0);
}



// Generic function to tween blur radius
function tweenBlur(ele, startRadius, endRadius) {

	$({
		blurRadius: startRadius
	}).animate({
		blurRadius: endRadius
	}, {
		duration: 500,
		easing: 'swing', // or "linear"
		// use jQuery UI or Easing plugin for more options
		step: function() {
			setBlur(ele, this.blurRadius);
		},
		complete: function() {
			// Final callback to set the target blur radius
			// jQuery might not reach the end value
			setBlur(ele, endRadius);
		}
	});
}

// Generic function to tween blur radius
function tweenUnBlur(ele, startRadius, endRadius) {

	$({
		blurRadius: startRadius
	}).animate({
		blurRadius: endRadius
	}, {
		duration: 500,
		easing: 'swing', // or "linear"
		// use jQuery UI or Easing plugin for more options
		step: function() {
			setBlur(ele, this.blurRadius);
		},
		complete: function() {
			// Final callback to set the target blur radius
			// jQuery might not reach the end value
			setBlur(ele, endRadius);

			$(ele).css({
				"-webkit-filter": "blur(0)",
				"filter": "blur(0)"
			});
		}
	});
}


function setBlur(ele, radius) {
	$(ele).css({
		"-webkit-filter": "blur(" + radius + "px)",
		"filter": "blur(" + radius + "px)"
	});
}

function MatchAndFindIndex(inputArr, inputToMatch) {

	index_ = null;

	for (var i = 0; i < inputArr.length; i++) {

		if (inputArr[i] == inputToMatch) {

			index_ = i;
			break;
		}

	}

	return index_
}

function DeleteTableEntryByIndex(InputIndex, TableAddress) {
	//this function will delete a table entry by the index value e.g 0,1,2
	//var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  dataMain);

	var ref = database.ref(TableAddress);

	var nonDeletedStreams = [];

	const promise = ref.once('value', ReceivedData, errData).then(DeleteStreamFromDatabase);

	//Functions for fetching data
	function ReceivedData(data) {

		tableData = data.val();
		var arr = $.map(tableData, function(el) {
			return el;
		});


		for (var i = 0; i < arr.length; i++) {

			if (i != parseInt(InputIndex)) {
				console.log('copying non deleted streams..');
				nonDeletedStreams.push(arr[i]);
			}

		}
		console.log(nonDeletedStreams);
	}

	function errData(err) {
		console.log('Error!');
		console.log(err);
	}

	function DeleteStreamFromDatabase() {

		var database = firebase.database();
		var ref = database.ref(TableAddress);
		ref.remove();
		console.log('timing has been removed');

		JSONarray = {...nonDeletedStreams
		};

		var database = firebase.database();
		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + dataMain);

		ref.update(JSONarray);

	}

	return promise
}


function InsertDataIntoTable(InputJSONdata, tableAddress) {
	//this will insert the JSON data into the tableAddress
	var ref = database.ref(tableAddress);

	const promise = ref.update(InputJSONdata);

	return promise
}

function AlertIfEmptyInput(element_ID, alertText) {
	lol = document.getElementById('StreamName_ID').value;

	if (!lol) {
		alert(alertText);
	}
}


function ReturnAsArrayChildOfTable(InputTableJSON) {
	//this function will return as a child all the members of queried table as an array

	OutputArr = new Array();

	for (var k in InputTableJSON) OutputArr.push(k);

	return OutputArr
}

function CheckIfElementExistsInArray(element, InputArr) {

	var CheckBoolean = false;

	for (var i = 0; i < InputArr.length; i++) {

		if (element == InputArr[i]) {
			CheckBoolean = true;
			break
		}
	}

	return CheckBoolean
}


function BoxAlert(AlertText) {
	document.getElementById('AlertText_ID').innerHTML = AlertText;
	$('.BoxAlert').fadeIn('fast');
}


function getScheduleTimestamp(time) {
	//accepts hh:mm format - convert hh:mm to timestamp
	time = time.replace(/ /g, '');
	var timeArray = time.split(':');
	var timeStamp = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
	return timeStamp;
}


function RewriteKeyName(oldName, newName, address) {

	var snapshotJSON;
	//now lets first access the firebase database and keep a copy of the stream to be changed
	var ref = database.ref(address + oldName);

	const promise = ref.once('value', ReceivedData, errData).then(function() {

		//now we will delete this stream
		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + oldName);
		ref.remove().then(function() {
			//now we need to reload the address with the new stream
			var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + newName);

			ref.update(snapshotJSON);

		});
	});

	function ReceivedData(data) {

		tableData = data.val();

		snapshotJSON = tableData;

	}

	function errData(err) {
		console.log('Error!');
		console.log(err);
	}
}