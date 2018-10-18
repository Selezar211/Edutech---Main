//attach event to clicking on each student in student tab
function AttachEventToEachStudentClick() {

    //for accepting pending students
    $(".fa-user-check").click(function () {
        console.log('clicked user pending accept!');

        FadeInLoadingFrame();

        //delete this entry from the table
        UID = String($(this).attr("data-UID"));

        Address = String($(this).attr("data-address"));

        studentName_ = String($(this).attr("data-name"));

        TotalSeats = parseInt($(this).attr("data-totalseats"));

        FilledSeats = parseInt($(this).attr("data-fillseats"));

        //get subject, grade and batchname
        splitString = Address.split('/');
        grade = splitString[0];
        subject = splitString[1];
        batchName = splitString[3];

        //now first check to see if the batch is filled, if it is then do nothing, otherwise add in this dude
        if (FilledSeats < TotalSeats) {
            //add in this dude
            //access the firebase database and remove this entry

            var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'PendingStudents/' + UID);

            ref.remove().then(function () {

                //now need to put this in the accepted box
                var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'AcceptedStudents/' + UID);

                var data = {
                    StudentName: EncodeString(studentName_)
                }

                ref.update(data).then(function () {
                    //now need to increment the seat filled by 1
                    var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address);

                    newFilledSeats = FilledSeats + 1;

                    var data = {
                        FilledSeats: newFilledSeats
                    }

                    ref.update(data).then(ReloadBackEndData).then(function () {
                        BoxAlert('User accepted successfully!');
                        FadeOutLoadingFrame();
                    }).then(function(){
                        //now we need to access this students database and write these entries in his/her user class

                        var ref = database.ref('USERS/' + UID + '/UserClass/');

                        var data = {};

                        data[Current_UID + grade + subject] = {};

                        data[Current_UID + grade + subject]  = {
                            'TeacherName': ownName,
                            'TeacherUID': Current_UID,
                            'Subject': subject,
                            'Grade': grade
                        }

                        ref.push(data);

                    });

                });

            });
        } else {

            BoxAlert('Cannot add to full Batch!');

        }

        return false;
    });


    //for dismissing pending students
    $(".fa-user-times").click(function () {
        console.log('clicked user dismiss!');
        FadeInLoadingFrame();

        //delete this entry from the table
        UID = String($(this).attr("data-UID"));

        Address = String($(this).attr("data-address"));

        //access the firebase database and remove this entry

        var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'PendingStudents/' + UID);

        ref.remove().then(ReloadBackEndData).then(function () {
            BoxAlert('User dismissed successfully!');
            FadeOutLoadingFrame();
        });

        return false;
    });

    //for dismissing pending students in bulk
    $(".DismissAll").click(function () {
        console.log('clicked user dismiss in bulk!');
        FadeInLoadingFrame();

        //delete this entry from the table
        UID = String($(this).attr("data-UID"));

        Address = String($(this).attr("data-address"));

        //access the firebase database and remove this entry

        var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'PendingStudents/');

        ref.remove().then(ReloadBackEndData).then(function () {
            BoxAlert('All pending dismissed successfully!');
            FadeOutLoadingFrame();
        });

        return false;
    });

    //for deleting accepted students
    $(".fa-user-minus").click(function () {
        console.log('clicked user delete!');
        FadeInLoadingFrame();

        //delete this entry from the table
        UID = String($(this).attr("data-UID"));

        Address = String($(this).attr("data-address"));

        studentName_ = String($(this).attr("data-name"));

        TotalSeats = parseInt($(this).attr("data-totalseats"));

        FilledSeats = parseInt($(this).attr("data-fillseats"));

        //access the firebase database and remove this entry

        var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'AcceptedStudents/' + UID);

        ref.remove().then(function () {
            //now need to decrease filled seats by 1
            var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address);

            newFilledSeats = FilledSeats - 1;

            var data = {
                FilledSeats: newFilledSeats
            }

            ref.update(data).then(ReloadBackEndData).then(function () {
                BoxAlert('User deleted successfully!');
                FadeOutLoadingFrame();
            });

        });

        return false;
    });


    //for clicking on the send message button in accpeted heading
    $(".MessageIcon").click(function () {
        console.log('MessageIcon Clicked');

        streamName = String($(this).attr("data-streamName"));
        subject = String($(this).attr("data-subject"));
        grade = String($(this).attr("data-grade"));

        //now need to create the message batch box
        BlurAnimate('.MainContent');
        //$('.MainContent').css('-webkit-filter', 'blur(30px');
        CreateMessageBox(streamName, subject, grade);

        //now need to attach click events to send message and cancel message buttons
        //for clicking cancel message
        $(".CancelMessage").click(function () {
            console.log('clicked message cancel!');
            UnBlurAnimate('.MainContent');
            //$('.MainContent').css('-webkit-filter', 'blur(0px');
            $('.MessageBatchBox').fadeOut('fast', function () {
                $('.MessageBatchBox').remove();
            })
            return false;
        });

        //for clicking send message
        $(".SendMessage").click(function () {
            console.log('clicked message send!');

            Address = String($(this).attr("data-address"));

            ActualMessage = document.getElementById('SendMessageInput_ID').value;

            //now insert this into firebase database
            var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'GlobalMessage/');

            var d = new Date();
            d.toUTCString();

            var data = {
                [d]: EncodeString(ActualMessage)
            }

            ref.update(data).then(function () {
                UnBlurAnimate('.MainContent');
                //$('.MainContent').css('-webkit-filter', 'blur(0px');
                BoxAlert('Message Sent');
                $('.MessageBatchBox').fadeOut('fast', function () {
                    $('.MessageBatchBox').remove();
                })
            });

            return false;
        });


        return false;
    });

    //for clicking on roll call
    $(".RollCallIcon").click(function () {
        console.log('clicked roll call icon!');

        FadeInLoadingFrame();

        streamName = String($(this).attr("data-streamName"));

        subject = String($(this).attr("data-subject"));

        grade = String($(this).attr("data-grade"));

        address = grade + '/' + subject + '/Streams/' + streamName + '/';

        studentNamesArr = [];
        studentUIDArr = [];

        //first we need to access the database and pull the names of accepted students and UID
        var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + 'AcceptedStudents/');

        ref.once('value', ReceivedData, errData).then(function () {

            //now that we have have the student names and UID array we can craft the roll call box..

            CreateRollCallBox(studentNamesArr, studentUIDArr, streamName, subject, grade);

            //now need to attach click events to submit and cancel roll calls
            //for clicking cancel roll call
            $(".CancelRollCall").click(function () {

                FadeOutANDRemove('fast', '.RollCallCont');
                UnBlurAnimate('.MainContent');
                //$('.MainContent').css('-webkit-filter', 'blur(0px');
                return false;
            });

            //for clicking submit roll call
            $(".SubmitRollCall").click(function () {

                FadeInLoadingFrame();

                console.log('Submit roll call clicked!');

                address = String($(this).attr("data-address"));

                //first get all the checked boxes
                var CheckBox_CHECKED = $('.RollCall_CBOX:checked').map(function () {
                    return $(this).val();
                }).get();

                //then get all the unchecked box
                var CheckBox_UNCHECKED = $('.RollCall_CBOX:not(:checked)').map(function () {
                    return $(this).val();
                }).get();

                console.log(CheckBox_CHECKED);
                console.log(CheckBox_UNCHECKED);

                //now insert this into class attendance tab
                today = new Date().toISOString().slice(0, 10);

                for (var i = 0; i < CheckBox_CHECKED.length; i++) {
                    //loop through and update each students roll call for present
                    var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + 'AcceptedStudents/' + String(CheckBox_CHECKED[i]) + '/ClassAttendance/');

                    var data = {
                        [today]: 'Present'
                    }

                    ref.update(data);

                }


                for (var i = 0; i < CheckBox_UNCHECKED.length; i++) {
                    //loop through and update each students roll call for present
                    var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + 'AcceptedStudents/' + String(CheckBox_UNCHECKED[i]) + '/ClassAttendance/');

                    var data = {
                        [today]: 'Absent'
                    }

                    ref.update(data);
                }

                FadeOutANDRemove('fast', '.RollCallCont');
                UnBlurAnimate('.MainContent');
                //$('.MainContent').css('-webkit-filter', 'blur(0px');
                FadeOutLoadingFrame();
                BoxAlert('Roll calls updated: ' + String(today));

                return false;
            });

            FadeOutLoadingFrame();
        });


        function ReceivedData(data) {
            tableData = data.val();

            BlurAnimate('.MainContent');
            //$('.MainContent').css('-webkit-filter', 'blur(30px');

            //now we can loop through them and fill the student name and UID arrays
            var key;
            for (key in tableData) {
                CurrentStudentUID = key;

                CurrentStudentName = tableData[key]['StudentName'];

                studentNamesArr.push(CurrentStudentName);
                studentUIDArr.push(CurrentStudentUID);
            }

        }

        function errData(err) {
            console.log('Error!');
            console.log(err);
        }


        return false;
    });

    //for clicking on each student in accepted row
    $(".OneStudentLine").click(function (e) {
        console.log('clicked user one student line!');
        FadeInLoadingFrame();

        UID = String($(this).attr("data-uid"));

        Address = String($(this).attr("data-address"));
        streamName = String($(this).attr("data-streamName"));
        grade = String($(this).attr("data-grade"));
        subject = String($(this).attr("data-subject"));
        studentname = String($(this).attr("data-studentName"));

        today = new Date().toISOString().slice(0, 10);
        currentYear = today.split('-')[0];
        MonthsArr = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


        //access the firebase database and extract all the necessary info
        //first we gotta get the roll call arrays from the firebase database
        var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'AcceptedStudents/' + UID + '/').once('value').then(function (snapshot) {
            var myData = snapshot.val();

            console.log(myData);

            rollCallDateArray_ = [];
            rollCallAttendanceArr_ = [];

            TutionMothYearArray = [];
            TutionPaidDayArray = [];

            //separate the obtained json into the three parts - rollcall, tution, exam

            //get the roll call stuff
            ClassAttendanceJSON = myData['ClassAttendance'];

            //now we can loop through them and fill the roll call date and attendance arrays
            var key; //where key is each data in the table
            for (key in ClassAttendanceJSON) {
                CurrentDate = key;

                CurrentAttendance = ClassAttendanceJSON[key];

                rollCallDateArray_.push(CurrentDate);
                rollCallAttendanceArr_.push(CurrentAttendance);
            }

            //get the tution paid stuff
            TutionPaidJSON = myData['TutionPaid'];

            //now we can loop through the dates of tution paid and insert them into the respective arrays
            var key; //where key is each year.month in the table 201805 and value is day
            for (key in TutionPaidJSON) {
                MonthYear = key;

                Day_ = TutionPaidJSON[key];

                TutionMothYearArray.push(MonthYear);
                TutionPaidDayArray.push(Day_);
            }

            //if needed to reverse the date and month arrays
            newTutionMothYearArray = TutionMothYearArray.reverse();
            newTutionPaidDayArray = TutionPaidDayArray.reverse();


            //now that we have our all input arrays we can call the function to craft them
            //first we need to find the pending month based on the last paid month and add 1 to it
            //if a last paid month exists then make the current one the next one of last paid
            if (newTutionMothYearArray[0]) {
                LastPaidMonthIndex = parseInt(newTutionMothYearArray[0].substring(4, 6));
                monthArrIndex = LastPaidMonthIndex - 1;

                //but make sure to reset it back to 0 if we get 11 i.e december and also increase year by 1
                if (monthArrIndex == 11) {
                    PendingMonth = MonthsArr[0];
                    currentYear = parseInt(currentYear) + 1;

                } else {
                    PendingMonth = MonthsArr[monthArrIndex + 1];
                }

                PendingMonthYear = PendingMonth + ' ' + currentYear;
            }
            //otherwise just set the pending month to the actual current month
            else {
                //set pending month to current month
                now_ = new Date().toISOString().slice(0, 10);
                thisYear = now_.split('-')[0];
                thisMonth = MonthsArr[parseInt(now_.split('-')[1]) - 1];
                PendingMonthYear = thisMonth + ' ' + thisYear;
            }

            FadeOutLoadingFrame();
            BlurAnimate('.MainContent');

            CreateStudentInfoBox(rollCallDateArray_, rollCallAttendanceArr_, studentname, UID, streamName, subject, grade, PendingMonthYear, newTutionMothYearArray, newTutionPaidDayArray);

            //now attach click events to this newly made student info box
            $("#StudentInfoContCloseIcon").click(function () {
                FadeOutANDRemove('fast', '.StudentInfoCont');
                UnBlurAnimate('.MainContent');
                return false;
            });

            $(".TutionAcceptButton").click(function () {
                //accept the tution and update the database
                FadeInLoadingFrame();

                now_ = new Date().toISOString().slice(0, 10);

                UID = String($(this).attr("data-uid"));

                Address = String($(this).attr("data-address"));

                studentName = String($(this).attr("data-studentname"));

                //crafted value needs to be of the form 201809 or year.month without the dot

                innerValue = String($(this).attr("data-value"));

                //inner value is of the form Jul 2018 e.g

                year_ = innerValue.split(' ')[1];

                findIndexMonth = parseInt(MatchAndFindIndex(MonthsArr, innerValue.split(' ')[0])) + 1;

                formattedFindIndexMonth = (findIndexMonth).toLocaleString('en-US', {
                    minimumIntegerDigits: 2,
                    useGrouping: false
                });

                craftedValue = String(year_) + String(formattedFindIndexMonth);

                var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'AcceptedStudents/' + UID + '/TutionPaid/');

                var data = {
                    [craftedValue]: now_
                };

                ref.update(data).then(ReloadBackEndData).then(function () {
                    BoxAlert('Payment Month: ' + innerValue + ' accepted for ' + String(studentName));
                    UnBlurAnimate('.MainContent');
                    FadeOutLoadingFrame();
                })

                return false;
            });

            //attach events to deleting last paid entry
            $(".fa-eraser").click(function () {

                FadeInLoadingFrame();

                UID = String($(this).attr("data-uid"));

                Address = String($(this).attr("data-address"));

                studentName = String($(this).attr("data-studentname"));

                key_ = String($(this).attr("data-value"));

                var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'AcceptedStudents/' + UID + '/TutionPaid/' + String(key_) + '/');

                ref.remove().then(ReloadBackEndData).then(function () {
                    BoxAlert('Last Paid Month deleted for ' + String(studentName));
                    UnBlurAnimate('.MainContent');
                    FadeOutLoadingFrame();
                });

                return false;
            });

            //attach event to flip the attendance of clicked on entry
            $(".fa-exchange-alt").click(function () {

                FadeInLoadingFrame();

                UID = String($(this).attr("data-uid"));

                Address = String($(this).attr("data-address"));

                key_ = String($(this).attr("data-key"));

                studentName = String($(this).attr("data-studentname"));

                currentAttendance = String($(this).attr("data-current"));

                finalVal = '';

                var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'AcceptedStudents/' + UID + '/ClassAttendance/');

                if (currentAttendance == 'Present') {

                    finalVal = 'Absent';
                } else if (currentAttendance == 'Absent') {
                    finalVal = 'Present';
                } else {
                    console.log('Problem in flipping present or absent!')
                }

                var data = {
                    [key_]: finalVal
                };

                ref.update(data).then(ReloadBackEndData).then(function () {
                    BoxAlert('Date: ' + key_ + ' flipped to ' + finalVal + ' for ' + studentName);
                    UnBlurAnimate('.MainContent');
                    FadeOutLoadingFrame();
                });

                return false;
            });

            //clicking on plot bar chart of roll calls
            $(".PlotRollCallHistogram").click(function () {

                createCanvasChartJS();
                BarChartRollCallJS('.OneAttendanceEntryCont', '.OneAttendanceEntry');

                //attach close event for this
                $("#CloseChart").click(function () {
                    $('.MegaCanvasCont').fadeOut('slow', function () {
                        $('.MegaCanvasCont').remove();
                    });
                    return false;
                });

                return false;
            });

            //clicking on plot line chart of roll calls
            $(".PlotRollCallGraph").click(function () {

                createCanvasChartJS();
                LineChartRollCallJS('.OneAttendanceEntryCont', '.OneAttendanceEntry');

                //attach close event for this
                $("#CloseChart").click(function () {
                    $('.MegaCanvasCont').fadeOut('slow', function () {
                        $('.MegaCanvasCont').remove();
                    });
                    return false;
                });

                return false;
            });

        });

        return false;
    });

    //shortcut tution accept button
    $(".ShortcutTutionAccept").click(function () {
        console.log('Shortcut button clicked!');
        //accept the tution and update the database
        FadeInLoadingFrame();

        now_ = new Date().toISOString().slice(0, 10);

        UID = String($(this).attr("data-uid"));

        Address = String($(this).attr("data-address"));

        studentName = String($(this).attr("data-studentname"));

        //crafted value needs to be of the form 201809 or year.month without the dot

        innerValue = String($(this).attr("data-value"));

        //inner value is of the form Jul 2018 e.g

        year_ = innerValue.split(' ')[1];

        findIndexMonth = parseInt(MatchAndFindIndex(MonthsArr, innerValue.split(' ')[0])) + 1;

        formattedFindIndexMonth = (findIndexMonth).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });

        craftedValue = String(year_) + String(formattedFindIndexMonth);

        var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'AcceptedStudents/' + UID + '/TutionPaid/');

        var data = {
            [craftedValue]: now_
        };

        ref.update(data).then(ReloadBackEndData).then(function () {
            BoxAlert('Payment Month: ' + innerValue + ' accepted for ' + String(studentName));
            UnBlurAnimate('.MainContent');
            FadeOutLoadingFrame();
        })

        return false;
    });

}

//attach event to lecture clicks()
function AttachEventToLectureClick() {

    $(".LectureLink").click(function () {

        PDF_LINK = String($(this).attr("data-main"));

        window.open(PDF_LINK);

        return false

    });

    //click on edit lecture link
    $('.fa-pencil-ruler').click(function () {
        console.log('Edit lecture link clicked!');

        BlurAnimate('.MainContent');

        IndexNum = String($(this).attr("data-index"));
        Address = String($(this).attr("data-address"));

        subject = String($(this).attr("data-subject"));
        grade = String($(this).attr("data-grade"));

        LectureName = String($(this).attr("data-name"));
        LectureURL = String($(this).attr("data-url"));

        CreateResourceEditBox(subject, grade, Address, LectureName, LectureURL, IndexNum);

        $('.EditResourceCancel').click(function () {
            FadeOutANDRemove('fast', '.EditSingleResource');
            UnBlurAnimate('.MainContent');

        });

        $('.EditResourceSubmit').click(function () {
            console.log('Submit new resource!');

            FadeInLoadingFrame();

            Address = String($(this).attr("data-address"));

            IndexNum = String($(this).attr("data-index"));

            prevName = String($(this).attr("data-name"));

            prevURL = String($(this).attr("data-url"));

            //first get the inputs
            newResourceName = document.getElementById('NewResourceNameEdit_ID').value;
            newResourceURL = document.getElementById('NewResourceURLEdit_ID').value;

            if (newResourceName == '') {
                console.log('reset to prevname');
                newResourceName = prevName;
            }

            if (newResourceURL == '') {
                console.log('reset to prevurl');
                newResourceURL = prevURL;
            }


            //get into firebase and update it with this new data
            encodedname = EncodeString(newResourceName)
            encodedURL = EncodeString(newResourceURL);

            var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'Resources/' + String(IndexNum));

            //delete the previous entry
            ref.remove().then(function () {

                //now enter this data
                var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'Resources/' + String(IndexNum));

                data = {
                    [encodedname]: encodedURL
                }

                ref.update(data).then(ReloadBackEndData).then(function () {
                    FadeOutLoadingFrame();
                    FadeOutANDRemove('fast', '.EditSingleResource');
                    UnBlurAnimate('.MainContent');
                    BoxAlert('Resource ' + String(newResourceName) + ' Edited');
                })

            })

        });

        return false;
    });

    $('.fa-calendar-times').click(function () {
        console.log('delete lecture link clciked!');

        FadeInLoadingFrame();
        BlurAnimate('.MainContent');

        IndexNum = String($(this).attr("data-index"));
        Address = String($(this).attr("data-address"));

        var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'Resources/' + String(IndexNum) + '/');

        ref.remove().then(ReloadBackEndData).then(function () {
            FadeOutLoadingFrame();
            UnBlurAnimate('.MainContent');
            BoxAlert('Lecture resource deleted');
        })

        return false;
    });


    //for clicking add new resource
    $(".AddResource").click(function () {
        console.log('add resource clicked!');

        subject_ = String($(this).attr("data-subject"));

        grade_ = String($(this).attr("data-grade"));

        address_ = String($(this).attr("data-address"));

        maxindex_ = String($(this).attr("data-maxindex"));

        CreateResourceAddBox(subject_, grade_, address_, maxindex_);
        BlurAnimate('.MainContent');

        //now bind the inner elements events here of add resource box
        $('.AddResourceCancel').click(function () {
            FadeOutANDRemove('fast', '.ResourceAddBox');
            UnBlurAnimate('.MainContent');

        });
        $('.AddResourceSubmit').click(function () {
            console.log('Submit new resource!');

            FadeInLoadingFrame();

            Address = String($(this).attr("data-address"));

            MaxIndex = parseInt($(this).attr("data-maxindex"));

            //first get the inputs
            newResourceName = document.getElementById('ResourceName_ID').value;
            newResourceURL = document.getElementById('ResourceURL_ID').value;

            if ((newResourceName == '') || (newResourceURL == '')) {
                BoxAlert('Empty fields cannot be accepted..');
            } else {

                //get into firebase and update it with this new data
                encodedname = EncodeString(newResourceName)
                encodedURL = EncodeString(newResourceURL);

                var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + Address + 'Resources/' + String(MaxIndex + 1));

                data = {
                    [encodedname]: encodedURL
                }

                ref.update(data).then(ReloadBackEndData).then(function () {
                    FadeOutLoadingFrame();
                    FadeOutANDRemove('fast', '.ResourceAddBox');
                    UnBlurAnimate('.MainContent');
                    BoxAlert('New Resource ' + String(newResourceName) + ' Added');
                })

            }

        });
        return false;
    });

}

//attach event to new batch options page on timetable tab
function AttachEventToAddStreamOptions() {

    //Clicking the create new stream buttom tab
    $("#CreateNewStream_ID").click(function () {

        FadeInLoadingFrame();

        console.log('Add new stream clicked!');

        //first get all the input values nicely

        var e = document.getElementById("StreamSubjectSelect_ID");
        var ChosenSubject = e.options[e.selectedIndex].value; //e.g O LEVEL/Physics

        var ChosenStreamName = document.getElementById('StreamName_ID').value;

        var ChosenStreamColor = document.getElementById('StreamColor_ID').value;
        var ChosenStreamTotalSeats = document.getElementById('StreamTotalSeat_ID').value;

        CreateNewStream(ChosenSubject, ChosenStreamName, ChosenStreamColor, ChosenStreamTotalSeats);

        return false;
    });

    //Clicking the add new stream timing buttom tab
    $("#AddNewTiming_ID").click(function () {

        FadeInLoadingFrame();

        console.log('Add new timing clicked!');

        //first get all the input values nicely

        var e = document.getElementById("StreamNameSelectADDBOX_ID");
        var ChosenStreamAddress = e.options[e.selectedIndex].value; //e.g O LEVEL/Physics

        var e = document.getElementById("StreamDaySelect_ID");
        var ChosenDay = e.options[e.selectedIndex].value;

        var e = document.getElementById("StreamStartTime_ID");
        var ChosenStartTime = e.options[e.selectedIndex].value;

        var e = document.getElementById("StreamEndTime_ID");
        var ChosenEndTime = e.options[e.selectedIndex].value;

        CreateNewTiming(ChosenStreamAddress, ChosenDay, ChosenStartTime, ChosenEndTime);

        return false;
    });

    //attached delete events from the firebase database for each stream to be deleted when clicked
    $(".fa-trash-alt").click(function () {

        FadeInLoadingFrame();
        dataMain = String($(this).attr("data-main"));
        dataIndex = parseInt($(this).attr("data-main2"));

        console.log(dataMain);
        console.log(dataIndex);

        var tableToDeleteFromAddress = 'USERS/' + Current_UID + '/UserClass/' + dataMain;

        DeleteTableEntryByIndex(dataIndex, tableToDeleteFromAddress).then(ReloadBackEndData).then(function () {
            BoxAlert('Timing deleted successfully!');
        });

        return false;
    });

    //attached delete events from the firebase database for a full stream to be deleted when clicked
    $(".fa-trash").click(function () {

        BlurAnimate('.StreamConfigOptions');
        //$('.StreamConfigOptions').css('-webkit-filter', 'blur(5px)');

        dataMain = String($(this).attr("data-main"));

        CraftPopUpCheckBox('Are you sure? This will delete the entire stream with its database of students and everything.', dataMain);

        //click events for yes and no
        $("#YesButton_ID").click(function () {

            FadeInLoadingFrame();

            $('#StreamConfigOptions_ID')

            dataMain = String($(this).attr("data-main"));

            var tableToDeleteFromAddress = 'USERS/' + Current_UID + '/UserClass/' + dataMain;

            var ref = database.ref(tableToDeleteFromAddress);

            const promise = ref.remove();

            promise.then(ReloadBackEndData).then(function () {
                BoxAlert('Batch deleted successfully!');
                UnBlurAnimate('.StreamConfigOptions');
                //$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
                $('.DoubleCheckBox').remove();
                FadeOutLoadingFrame();
            });

            return false;
        });

        $("#NoButton_ID").click(function () {
            UnBlurAnimate('.StreamConfigOptions');
            $('.DoubleCheckBox').remove();

            return false;
        });

        return false;
    });

    //attached edit events from the firebase database for each stream to be edited when clicked
    $(".fa-edit").click(function () {

        dataMain = String($(this).attr("data-main"));
        dataIndex = $(this).attr("data-main2");

        dataItself = $(this).attr("data-itself");

        arr = dataItself.split(' ');

        day = arr[0];
        sTime = arr[1];
        eTime = arr[3];

        //blur the background
        BlurAnimate('.StreamConfigOptions');
        //$('.StreamConfigOptions').css('-webkit-filter', 'blur(5px)');

        //show and create the edit tab with datamain and datamain2 data embedded
        CraftEditOneStream(dataMain, dataIndex);

        //set the default values to the ones chosen before
        $('#InputChildDaySelect_ID').val(day);
        $('#InputChildStartTimeSelect_ID').val(sTime);
        $('#InputChildEndTimeSelect_ID').val(eTime);

        //click events for cancel and yes edit
        $(".CancelEdit").click(function () {
            //remove the editone stream window
            UnBlurAnimate('.StreamConfigOptions');
            //$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
            $('.EditOneStream').remove();

            return false;
        });


        $(".YesEdit").click(function () {
            //edit one stream
            FadeInLoadingFrame();

            //first get the data
            dataMain = String($(this).attr("data-main"));
            dataIndex = $(this).attr("data-main2");

            var e = document.getElementById("InputChildDaySelect_ID");
            var ChosenDay = e.options[e.selectedIndex].value;

            var e = document.getElementById("InputChildStartTimeSelect_ID");
            var ChosenStartTime = e.options[e.selectedIndex].value;

            var e = document.getElementById("InputChildEndTimeSelect_ID");
            var ChosenEndTime = e.options[e.selectedIndex].value;


            //now lets access the firebase database and input the above data
            newTiming = ChosenDay + ' ' + ChosenStartTime + ' - ' + ChosenEndTime;
            var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + dataMain);

            var data = {
                [dataIndex]: newTiming
            }

            const promise = ref.update(data);

            promise.then(ReloadBackEndData).then(function () {
                BoxAlert('Timing has been changed successfully!');
                $('.EditOneStream').remove();
                UnBlurAnimate('.StreamConfigOptions');
                //$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
                FadeOutLoadingFrame();
            });

            return false;
        });

        return false;
    });

    //attached edit events from the firebase database for each stream to be edited when clicked
    $(".fa-pencil-alt").click(function () {

        console.log('Edit button clicked!');

        address = String($(this).attr("data-main"));
        streamName = $(this).attr("data-main2");
        streamVacancy = $(this).attr("data-main3").split('/')[1];
        streamColor = $(this).attr("data-main4");

        //blur the background
        BlurAnimate('.StreamConfigOptions');
        //$('.StreamConfigOptions').css('-webkit-filter', 'blur(5px)');

        //show and create the edit tab with datamain and datamain2 data embedded
        CraftEditFullStream(address, streamName, streamColor, streamVacancy);

        //setup click event if cancel is clicked
        $(".NoFullEdit").click(function () {
            //remove the editone stream window
            UnBlurAnimate('.StreamConfigOptions');
            //$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
            $('.EditFullStream').remove();

            return false;
        });

        //setup click eevnt if clicked yes on editing this full stream
        $(".YesFullEdit").click(function () {
            //edit full stream
            FadeInLoadingFrame();

            var snapshotJSON;

            //first get the data
            address = String($(this).attr("data-main"));
            streamName = $(this).attr("data-main2");

            var newName = document.getElementById("NewName_ID").value;
            var newColor = document.getElementById("NewColor_ID").value;
            var newSeats = document.getElementById("NewSeats_ID").value;

            if (newName == '') {
                newName = streamName;
            }

            //now lets first access the firebase database and keep a copy of the stream to be changed
            var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + streamName);

            const promise = ref.once('value', ReceivedData, errData).then(function () {

                //now we will delete this stream
                var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + streamName);
                ref.remove().then(function () {
                    //now we need to reload the address with the new stream
                    var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + newName);

                    ref.update(snapshotJSON).then(ReloadBackEndData).then(function () {
                        BoxAlert('Stream has been edited successfully!');
                        $('.EditFullStream').remove();
                        UnBlurAnimate('.StreamConfigOptions');
                        //$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
                        FadeOutLoadingFrame();
                    });
                });

            });


            function ReceivedData(data) {

                tableData = data.val();

                //we need to change the color of the stream and seat cacpacity of tableData here
                if (newSeats != '') {
                    tableData['TotalSeats'] = newSeats;
                }

                if (newColor != '') {
                    tableData['StreamColor'] = newColor;
                }

                snapshotJSON = tableData;

            }

            function errData(err) {
                console.log('Error!');
                console.log(err);
            }

            return false;
        });

        return false;
    });


}

//attach event to exam tab
function AttachEventToExamTab(){

    //clicking on delete on any one of the exams in live
    $(".deleteLiveExam").click(function(){

        FadeInLoadingFrame();

        subject = String($(this).attr("data-subject"));
        grade = String($(this).attr("data-grade"));
        examName = String($(this).attr("data-examName"));

        fullAddress = 'USERS/' + Current_UID + '/UserClass/' + grade + '/' + subject + '/Exams/Live/' + examName

        var ref = database.ref(fullAddress);

        ref.remove().then(function(){
            ReloadBackEndData();
            BoxAlert(`${examName} has been deleted!`);
            FadeOutLoadingFrame();
        })

        return false;
    });

    //clicking on add new exam
    $(".addNewExam").click(function () {

        subject = String($(this).attr("data-subject"));
        grade = String($(this).attr("data-grade"));

        createAddNewExamCont(subject, grade);

        //now add events for inside the addnewExamCont

        //clicking on cancel on add new exam cont
        $(".cancelNewExam").click(function(){
            FadeOutANDRemove('fast', '.addNewExamCont');
        });

        $(".addQuestionButton").click(function(){

            subject = String($(this).attr("data-subject"));
            grade = String($(this).attr("data-grade"));

            examName = $('#examName_ID').val();
            examDate = $('#examDate_ID').val();
            startingTime = $('#startTime_ID').find(":selected").text();
            timeLimit = $("#timeLimit_ID").val();

            questionName = $("#quesName_ID").val();
            question = $("#quesContent_ID").val();
            option1 = $("#opt1_id").val();
            option2 = $("#opt2_id").val();
            option3 = $("#opt3_id").val();
            option4 = $("#opt4_id").val();

            correct = $("#correctAnswerSelect_ID").find(":selected").text();

            //carry out check to see if any fields are empty and reject if it is
            if (((examName || examDate || startingTime || timeLimit || questionName || question || option1 || option2 || option3 || option4 || correct) == null ) || ((examName || examDate || startingTime || timeLimit || questionName || question || option1 || option2 || option3 || option4 || correct) == '' )) {
                BoxAlert('Null Fields cannot be accepted!')
            }
            //first we need to add the question then we need to load everything from backend
            else {

                fullAddress = 'USERS/' + Current_UID + '/UserClass/' + grade + '/' + subject + '/Exams/Live/' + examName

                var ref = database.ref(fullAddress);

                data = { 'QuestionName' : questionName,
                            'Question' : question,
                            'Option 1' : option1,
                            'Option 2' : option2,
                            'Option 3' : option3,
                            'Option 4' : option4,
                            'Correct' : correct,
                            'Date' : examDate,
                            'timeGiven' : timeLimit,
                            'startTime': startingTime
                }

                ref.push(data).then(function(){
                    //after writing data successfully now read it back and reload it
                    //first remove all existing questions
                    $('.OneQuestionBox').remove();
                    fullAddress = 'USERS/' + Current_UID + '/UserClass/' + grade + '/' + subject + '/Exams/Live/' + examName

                    var ref = database.ref(fullAddress).once('value').then(function (snapshot) {
                
                        fullJSON = snapshot.val();
                
                        //now loop through this JSON and create each question
                        let key;
                        let i = 1;
                        for (key in fullJSON){

                            _quesName = fullJSON[key]['QuestionName'];
                            _question = fullJSON[key]['Question'];
                            _opt1 = fullJSON[key]['Option 1'];
                            _opt2 = fullJSON[key]['Option 2'];
                            _opt3 = fullJSON[key]['Option 3'];
                            _opt4 = fullJSON[key]['Option 4'];
                            _correct = fullJSON[key]['Correct'];

                            //now create a question with all these data
                            CreateOneQuestion(String(i), _quesName, _question, _opt1, _opt2, _opt3, _opt4, _correct);

                            i = i + 1;
                        }
                
                    });

                })
            }

        });

    });

}

function SetupAllIntervalEvents(){
    
}