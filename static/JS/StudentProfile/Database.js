    
//Author: Ekram

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCBGF5jQfpK_yktdnUs8a80XPn0MLxSt9Y",
    authDomain: "edutech-2121.firebaseapp.com",
    databaseURL: "https://edutech-2121.firebaseio.com",
    projectId: "edutech-2121",
    storageBucket: "edutech-2121.appspot.com",
    messagingSenderId: "981500378332"
};

firebase.initializeApp(config);

var database = firebase.database();
var Current_UID;
var ownName;
var AcceptedClasses = [];
var PendingClasses = [];

//Fetch all relevant data for logged in user from our database using UID
//this is the main function which will fetch the data from backend and then call the functions to craft the data into various places
function FetchAllDataFromDatabase() {

    var ref = database.ref('USERS/' + Current_UID).once('value').then(function(snapshot) {

        //first remove the timetable if it exists and create it afresh
        if (document.getElementById('cdscheduleloading_ID')) {
            $('#cdscheduleloading_ID').remove();
        }

        CreateTimeTableHTML();

        tableData = snapshot.val();         //this is the full JSON from firebase database for this user
        ownName = tableData['UserName'];
        console.log(tableData);

        //set up the home tab
        SetHomeTabStuff(tableData);

        FadeOutLoadingFrame();  //loading frame was ON by default and hence make it fadeout after everything is loaded

    }).then(function() {
        FormatTimeTable();
        SetupTeacherTabEvents();
       // CreateTeacherBox('Physics', 'A LEVEL', 'Ramisa', ['Timing 1', 'Timing 2', 'Timing 3'], [1, 0, 5]);
    });

}







//this will remove all dependant data from the page and reload them from backend
function ReloadBackEndData() {

    //remove all inner streamboxes
    $('.StreamBox').remove();
    $('.SubjectDropDOWN').remove();
    $('.ADDTimingDropDOWN').remove();
    $('.single-event').remove();
    $('.BatchBox').remove();
    $('.StudentInfoCont').remove();
    $('.LectureLinksContainer').remove();
    $('.OneBatchExamCont').remove();

    //now recreate the streamboxes after fetching em all
    FetchAllDataFromDatabase();
}









//Add a realtime listener for state auth change
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log('Logged In..')
        Current_UID = firebaseUser.uid;
        FetchAllDataFromDatabase();

        $(".BlackBoard_MainInfo").fadeIn('slow');
        $(".BlackBoardName_Date_Cont").fadeIn('slow');

    } else {
        console.log('Not logged in..');
        //window.location.href = "http://www.edutechs.org";
        $(".BlackBoard_MainInfo").fadeIn('slow');
        $(".BlackBoardName_Date_Cont").fadeIn('slow');
    }
});


//FIREBASE STUFF END
