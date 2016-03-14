$(function () {

	$(document).keydown(function (e) {
		processKeyPress(event.which);
	});

	$(document).keyup(function (e) {
	    processKeyUp(event.which);
	});
	
	$('#buzzer').bind('ended', function(){
		ContinueAfterBuzz();
	});

	var k_Key_Cap = 75;
	var d_Key_Cap = 68;
	var k_Key = 107;
	var d_Key = 100;
	var kDown = false;
	var dDown = false;
	var keyArray = [k_Key, d_Key];
	var keyArrayCap = [k_Key_Cap, d_Key_Cap];
	var ratioThreshold = 0.8;
	
	var goodStrokeTimes = [];
	var badStrokeTimes = [];
	var k_StrokeTimes = [];
	var d_StrokeTimes = [];
	var subSessionData = [];
	var subStart;
	var subEnd;
	
	var k_Score = 0;
	var d_Score = 0;
	
	var pointKeystrokeThreshold = 50;
	var pointTotalThreshold = 50;
	var timerRunning = false;
	
    var modeEndMilliseconds = 300000;
	
	var ModeTimeoutId = 0;
	var startTime = 0;
	var endTime = 0;
	var startDT;
	var endDT;

	var currentBadKeyIndex = null;
	
	function EndSubSession() {
	    subEnd = Date.now();
	    subSessionData.push({
	        'startTime': subStart,
	        'endTime': subEnd,
	        'badKeyCode': String.fromCharCode(keyArray[currentBadKeyIndex]),
	        'goodTimes': goodStrokeTimes,
	        'badTimes': badStrokeTimes,
	        'percentStrokesGood': (goodStrokeTimes.length / (goodStrokeTimes.length + badStrokeTimes.length))
	    });
		console.log('SubSession data:');
		console.log(subSessionData);
		currentBadKeyIndex = null;
		if(subSessionData.length == 6 || LastThreeSubsKeyRatioCheck() ) {
			endSession();
		}
		else {
		    BeginSubSession((currentBadKeyIndex + 1) % 2);
		}
	}

	function LastThreeSubsKeyRatioCheck() {
		if (subSessionData.length < 3) {
			return false;
		}
		for(var i = 1; i < 4; i++) {
			if(subSessionData[subSessionData.length-i].percentStrokesGood < ratioThreshold ) {
				return false;
			}
		}
		return true;
	}
	
	function BeginSubSession(badIndex) {
	    subStart = Date.now();
	    currentBadKeyIndex = badIndex;
		goodStrokeTimes = [];
		badStrokeTimes = [];
		ModeTimeoutId = setTimeout(EndSubSession, modeEndMilliseconds);
		console.log('Begin SubSession: ' + String.fromCharCode(keyArray[currentBadKeyIndex]));
	}
	
	function flipCoin() {
		return Math.round(Math.random());
	}
	
	function processKeyPress(keyCode) {
	    if (keyCode == k_Key || keyCode == d_Key || keyCode == k_Key_Cap || keyCode == d_Key_Cap) {
			if(currentBadKeyIndex == null) {
			    BeginSubSession(flipCoin());
			    startTime = Date.now();
			    var currentdate = new Date();
			    startDT = currentdate.getDate() + "/"
                                + (currentdate.getMonth() + 1) + "/"
                                + currentdate.getFullYear() + " @ "
                                + currentdate.getHours() + ":"
                                + currentdate.getMinutes() + ":"
                                + currentdate.getSeconds();
			}
			if (keyCode == keyArray[currentBadKeyIndex] || keyCode == keyArrayCap[currentBadKeyIndex]) {
				handleBadKeyStroke();
			}
			else {
				handleGoodKeyStroke();
			}
		}
	}

	function processKeyUp(keyCode) {
	    if (keyCode == k_Key || keyCode == k_Key_Cap) {
	        kDown = false;
	    }
	    else if (keyCode == d_Key || keyCode == d_Key_Cap) {
	        dDown = false;
	    }
	}
	
	function handleGoodKeyStroke() {
	    var timeMark = Date.now();
	    if (currentBadKeyIndex == 0) {
	        if (dDown) {
	            return;
	        }
	        dDown = true;
	        d_StrokeTimes.push(timeMark);
	    }
	    else {
	        if (kDown) {
	            return;
	        }
	        kDown = true;
	        k_StrokeTimes.push(timeMark);
	    }
	    goodStrokeTimes.push(timeMark);
	}
	
	function handleBadKeyStroke() {
	    var timeMark = Date.now();
	    if (currentBadKeyIndex == 0) {
	        if (kDown) {
	            return;
	        }
	        kDown = true;
	        k_StrokeTimes.push(timeMark);
	    }
	    else {
	        if (dDown) {
	            return;
	        }
	        dDown = true;
	        d_StrokeTimes.push(timeMark);
	    }
	    badStrokeTimes.push(timeMark);
		$('#buzzer').trigger('play');
	}
	
	function ContinueAfterBuzz() {
	    //console.log('Triggered after buzz');
	    //k_Score = Math.floor(k_StrokeTimes.length / pointKeystrokeThreshold);
	    //d_Score = Math.floor(d_StrokeTimes.length / pointKeystrokeThreshold);
	    //$('#kScoreContainer').html(k_Score);
	    //$('#dScoreContainer').html(d_Score);
	}
	
	function endSession() {
		$(document).off("keydown");
		endTime = Date.now();
		var currentdate = new Date();
		endDT = currentdate.getDate() + "/"
                        + (currentdate.getMonth() + 1) + "/"
                        + currentdate.getFullYear() + " @ "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":"
                        + currentdate.getSeconds();

		var submitData =
            {
                "SessionType": 'Six',
                "startDateTime": startDT,
                "endDateTime": endDT,
                "startTime": startTime,
                "endTime": endTime,
                "k_StrokeTimes": k_StrokeTimes,
                "d_StrokeTimes": d_StrokeTimes,
                "SubSessions": subSessionData
            }

		$.ajax({
		    type: "POST",
		    url: "/Home/EmailData",
		    data: JSON.stringify(submitData),
		    contentType: "application/json",
		    dataType: "json",
		    success: function (data) { $('#messageArea').html('End session'); },
		    failure: function (errMsg) {
		        alert(errMsg);
		    }
		});
	}
	
});