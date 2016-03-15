$(function () {

	$(document).keydown(function (e) {
		processKeyPress(e.which);
	});

	$(document).keyup(function (e) {
	    processKeyUp(e.which);
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
	
	var k_StrokeTimes = [];
	var d_StrokeTimes = [];
	
	var k_Score = 0;
	var d_Score = 0;
	
	var pointKeystrokeThreshold = 50;
	var pointTotalThreshold = 50;
	var timerRunning = false;
	
	var timerEndMilliseconds = 1200000;
	
	var timeoutId = 0;
	var startTime = 0;
	var endTime = 0;
	var startDT;
	var endDT;

	function processKeyPress(keyCode) {
		if(keyCode == k_Key || keyCode == k_Key_Cap) {
			return handleK();
		}
		if (keyCode == d_Key || keyCode == d_Key_Cap) {
			return handleD();
		}
		return;
	}

	function processKeyUp(keyCode) {
	    if (keyCode == k_Key || keyCode == k_Key_Cap) {
	        kDown = false;
	    }
	    else if (keyCode == d_Key || keyCode == d_Key_Cap) {
	        dDown = false;
	    }
	}
	
	function handleK() {
	    if (kDown) {
	        return;
	    }
	    kDown = true;
		runTimer();
		k_StrokeTimes.push(Date.now());
	    checkScores();
	}
	
	function ContinueAfterBuzz() {
		console.log('Triggered after buzz');
		d_Score = Math.floor(d_StrokeTimes.length / pointKeystrokeThreshold);
		$('#dScoreContainer').html( d_Score );
		checkScores();
	}
	
	function handleD() {
	    if (dDown) {
	        return;
	    }
	    dDown = true;
		runTimer();
		d_StrokeTimes.push(Date.now());
		$('#buzzer').trigger('play');
	}
	
	function checkScores() {
		if(d_Score + k_Score >= pointTotalThreshold) {
			endSession();
		}
	}
	
	function runTimer() {
		if(timerRunning) {
			return;
		}
		timeoutId = setTimeout(endSession, timerEndMilliseconds);
		timerRunning = true;
		startTime = Date.now();
		startTime = Date.now();
		var currentdate = new Date();
		startDT = currentdate.getDate() + "/"
                        + (currentdate.getMonth() + 1) + "/"
                        + currentdate.getFullYear() + " @ "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":"
                        + currentdate.getSeconds();
	}
	
	function endSession() {
		$(document).off("keydown");
		clearTimeout(timeoutId);
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
                "SessionType": 'Four',
                "startDateTime": startDT,
                "endDateTime": endDT,
                "startTime": startTime,
                "endTime": endTime,
                "k_StrokeTimes": k_StrokeTimes,
                "d_StrokeTimes": d_StrokeTimes
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