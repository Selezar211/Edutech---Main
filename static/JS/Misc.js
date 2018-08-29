function EncodeString(inputString) {

	outputstring = encodeURIComponent(inputString).replace(/\./g, '%2E');

	return outputstring
}


function DecodeString(inputString) {
	outputstring = decodeURIComponent(inputString);
	withoutDots = outputstring.replace('%2E', '.');

	return withoutDots
}