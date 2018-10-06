//Home icon click event
document.getElementById("HomeIcon").addEventListener('click', e => {

	console.log('Home clicked!');

	//fadeout all current stuff
	$(".MainStudentTab_Cont").fadeOut('fast');
	$(".MainTimeTableCont").fadeOut('fast');
	$(".MainVideoPlayer_Cont").fadeOut('fast');
	$(".MainLectureTab_Cont").fadeOut('fast');
	$(".MainExamTab_Cont").fadeOut('fast');

	$(".Blackboard_container").css('background-color', 'rgb(10,14,17)');
	$(".BlackBoard").css('background-color', 'rgb(10,14,17)');
	$(".NotificationOpenButton").css('background-color', 'rgb(10,14,17)');

	$("#ExclaimIcon").css('color', 'white');
	$("#SignoutIcon2").css('color', 'white');


	$(".BlackBoard_MainInfo").delay(200).fadeIn('slow');
	$(".BlackBoardName_Date_Cont").delay(200).fadeIn('slow');

});

//Exam icon click event
document.getElementById("ExamIcon").addEventListener('click', e => {

	console.log('Exam clicked!');

	//fadeout all current stuff
	$(".MainStudentTab_Cont").fadeOut('fast');
	$(".MainTimeTableCont").fadeOut('fast');
	$(".MainVideoPlayer_Cont").fadeOut('fast');
	$(".MainLectureTab_Cont").fadeOut('fast');

	//fadeout all current stuff
	$(".BlackBoard_MainInfo").fadeOut('fast');
	$(".BlackBoardName_Date_Cont").fadeOut('fast');

	$(".Blackboard_container").css('background-color', 'rgba(0,0,0,0)');
	$(".BlackBoard").css('background-color', 'rgba(0,0,0,0)');
	$(".NotificationOpenButton").css('background-color', 'rgba(0,0,0,0)');

	$("#ExclaimIcon").css('color', 'black');
	$("#SignoutIcon2").css('color', 'black');

	$(".MainExamTab_Cont").fadeIn('slow');

});

//Timetable icon click event
document.getElementById("TableIcon").addEventListener('click', e => {

	console.log('Timetable clicked!');

	$(".MainStudentTab_Cont").fadeOut('fast');
	$(".MainVideoPlayer_Cont").fadeOut('fast');
	$(".MainLectureTab_Cont").fadeOut('fast');
	$(".MainExamTab_Cont").fadeOut('fast');

	//fadeout all current stuff
	$(".BlackBoard_MainInfo").fadeOut('fast');
	$(".BlackBoardName_Date_Cont").fadeOut('fast');

	$(".Blackboard_container").css('background-color', 'rgba(0,0,0,0)');
	$(".BlackBoard").css('background-color', 'rgba(0,0,0,0)');
	$(".NotificationOpenButton").css('background-color', 'rgba(0,0,0,0)');

	$("#ExclaimIcon").css('color', 'black');
	$("#SignoutIcon2").css('color', 'black');

	$(".MainTimeTableCont").fadeIn('slow');


});

//open config options tab
document.getElementById("SetStreamsButtonID").addEventListener('click', e => {
	$('.StreamConfigOptions').fadeIn('slow');
});


//close config options tab
document.getElementById("StreamConfigCloseIcon").addEventListener('click', e => {

	$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
	$('.StreamConfigOptions').fadeOut('slow');

});




//Video icon click event
document.getElementById("VidIcon").addEventListener('click', e => {

	console.log('Video icon clicked!');

	$(".MainStudentTab_Cont").fadeOut('fast');
	$(".MainTimeTableCont").fadeOut('fast');
	$(".MainLectureTab_Cont").fadeOut('fast');
	$(".MainExamTab_Cont").fadeOut('fast');

	$(".Blackboard_container").css('background-color', 'rgb(0,0,0)');
	$(".BlackBoard").css('background-color', 'rgb(10,14,17)');
	$(".NotificationOpenButton").css('background-color', 'rgb(0,0,0)');

	//fadeout all current stuff
	$(".BlackBoard_MainInfo").fadeOut('fast');
	$(".BlackBoardName_Date_Cont").fadeOut('fast');

	$(".MainVideoPlayer_Cont").fadeIn('slow');


});

//Lecture icon click event
document.getElementById("Lecticn").addEventListener('click', e => {

	console.log('lecture clicked!');

	//fadeout all current stuff
	$(".BlackBoard_MainInfo").fadeOut('fast');
	$(".BlackBoardName_Date_Cont").fadeOut('fast');
	$(".MainVideoPlayer_Cont").fadeOut('fast');
	$(".MainStudentTab_Cont").fadeOut('fast');
	$(".MainExamTab_Cont").fadeOut('fast');

	$(".Blackboard_container").css('background-color', 'rgba(0,0,0,0)');
	$(".BlackBoard").css('background-color', 'rgba(0,0,0,0)');
	$(".NotificationOpenButton").css('background-color', 'rgba(0,0,0,0)');

	$("#ExclaimIcon").css('color', 'black');
	$("#SignoutIcon2").css('color', 'black');

	$(".MainLectureTab_Cont").fadeIn('slow');


});

//Teacher icon click event
document.getElementById("TeacherIcon").addEventListener('click', e => {

	console.log('teacher clicked!');

	//fadeout all current stuff
	$(".BlackBoard_MainInfo").fadeOut('fast');
	$(".BlackBoardName_Date_Cont").fadeOut('fast');
	$(".MainVideoPlayer_Cont").fadeOut('fast');
	$(".MainLectureTab_Cont").fadeOut('fast');
	$(".MainExamTab_Cont").fadeOut('fast');

	$(".Blackboard_container").css('background-color', 'rgba(0,0,0,0)');
	$(".BlackBoard").css('background-color', 'rgba(0,0,0,0)');
	$(".NotificationOpenButton").css('background-color', 'rgba(0,0,0,0)');

	$("#ExclaimIcon").css('color', 'black');
	$("#SignoutIcon2").css('color', 'black');

	$(".MainStudentTab_Cont").fadeIn('slow');


});


var IsNotificationTabOpen = false;
// Clicking the notification icon
document.getElementById("ExclaimIcon").addEventListener('click', e => {
	console.log('Notif cliked!');

	if (IsNotificationTabOpen) {
		CloseNotificationTab();
	} else {
		OpenNotificationTab();
	}
});


//Clicking the close notif tab
document.getElementById("CloseNotif").addEventListener('click', e => {
	CloseNotificationTab();
});


function OpenNotificationTab() {
	$(".Blackboard_container").css('width', '65%');
	$(".NotificationMainCont").css('width', '33%');
	$(".InnerNotifMain").fadeIn('fast');
	$(".NotificationBox_Cont").fadeIn('slow');
	IsNotificationTabOpen = true;
}

function CloseNotificationTab() {
	$(".NotificationBox_Cont").fadeOut('fast');
	$(".InnerNotifMain").fadeOut('fast');
	$(".Blackboard_container").css('width', '98%');
	$(".NotificationMainCont").css('width', '0%');
	IsNotificationTabOpen = false;
}


function FadeOutLoadingFrame() {
	$(".LoadingContainer").fadeOut('slow');
}

function FadeInLoadingFrame() {
	$(".LoadingContainer").fadeIn('fast');
}

//Clicking the close alert icon
document.getElementById("AlertCloseIcon").addEventListener('click', e => {
	$('.BoxAlert').fadeOut('fast');
});


//Log out event trigger
document.getElementById("SignoutIcon2").addEventListener('click', e => {

    console.log('Logout cliked!');
    const auth = firebase.auth();

    //logout
    const promise = auth.signOut().then(function () {
        //send to front page
        console.log('Successfully logged out..');

    }, function (err) {
        console.log(err.code);
    });


});




//main jquery run time functions
$(document).ready(function() {

	$("#SignoutIcon2").hover(function() {
		$(".SignOutText").css("display", "block");
	}, function() {
		$(".SignOutText").css("display", "none");
	});

	$("#ExclaimIcon").hover(function() {
		$(".NotificationText").css("display", "block");
	}, function() {
		$(".NotificationText").css("display", "none");
	});

});