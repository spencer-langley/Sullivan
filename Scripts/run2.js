$(function () {

	$(document).keydown(function (e) {
		processKeyPress(event.which);
	});
	
	$('#buzzer').bind('ended', function(){
		ContinueAfterBuzz();
	});

	var k_Key = 75;
	var d_Key = 68;
	
	var k_StrokeTimes = [];
	var d_StrokeTimes = [];
	
	var k_Score = 0;
	var d_Score = 0;
	
	var pointKeystrokeThreshold = 50;
	var pointTotalThreshold = 50;
	var timerRunning = false;
	var dTimerRunning = false;
	
	var timerEndMilliseconds = 1200000;
	var dOnlyEndMilliseconds = 180000;
	
	var timeoutId = 0;
	var dOnlyTimeoutId = 0;
	var startTime = 0;
	var endTime = 0;
	
	function processKeyPress(keyCode) {
		if(keyCode == k_Key) {
			return handleK();
		}
		if(keyCode == d_Key) {
			return handleD();
		}
		return;
	};
	
	function handleK() {
		runTimer();
		clearTimeout(dOnlyTimeoutId);
		dTimerRunning = false;
		k_StrokeTimes.push(Date.now());
		
		$('#buzzer').trigger('play');
	}
	
	function ContinueAfterBuzz() {
		console.log('Triggered after buzz');
		if(Math.floor(k_StrokeTimes.length % pointKeystrokeThreshold) == 0) {
			k_Score++;
		}
		
		$('#kScoreContainer').html( k_Score );
		checkScores();
	}
	
	function handleD() {
		runTimer();
		d_StrokeTimes.push(Date.now());
		
		if(Math.floor(d_StrokeTimes.length % pointKeystrokeThreshold) == 0) {
			d_Score++;
		}
		
		$('#dScoreContainer').html( d_Score );
		checkScores();
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
	}
	
	function dOnlyCounter() {
		if(dTimerRunning) {
			return;
		}
		dOnlyTimeoutId = setTimeout(endSession, dOnlyEndMilliseconds);
		dTimerRunning = true;
		startTime = Date.now();
	}
	
	function endSession() {
		$(document).off("keydown");
		clearTimeout(dOnlyTimeoutId);
		clearTimeout(timeoutId);
		endTime = Date.now();
		
		var submitData =
            {
                "SessionType": 'Two',
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