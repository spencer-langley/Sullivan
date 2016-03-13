$(function () {

    $(document).keypress(function (e) {
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
	
	var k_StrokeTimes = [];
	var d_StrokeTimes = [];
	
	var k_Score = 0;
	var d_Score = 0;
	
	var pointKeystrokeThreshold = 50;
	var pointTotalThreshold = 50;
	var timerRunning = false;
	var dTimerRunning = false;
	
	var timerEndMilliseconds = 60000;
	var dOnlyEndMilliseconds = 30000;

	//var timerEndMilliseconds = 1200000;
	//var dOnlyEndMilliseconds = 180000;
	
	var timeoutId = 0;
	var dOnlyTimeoutId = 0;
	var startTime = 0;
	var endTime = 0;

	var kDown = false;
	var dDown = false;
	
	function processKeyPress(keyCode) {
	    if (keyCode == k_Key || keyCode == k_Key_Cap) {
			return handleK();
		}
	    if (keyCode == d_Key || keyCode == d_Key_Cap) {
			return handleD();
		}
		return;
	};

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
		clearTimeout(dOnlyTimeoutId);
		dTimerRunning = false;
		k_StrokeTimes.push(Date.now());
		console.log('K strokes: ' + k_StrokeTimes.length);
		$('#buzzer').trigger('play');
	}
	
	function ContinueAfterBuzz() {
	    console.log('Triggered after buzz');
	    k_Score = Math.floor(k_StrokeTimes.length / pointKeystrokeThreshold);
		$('#kScoreContainer').html( k_Score );
		checkScores();
	}
	
	function handleD() {
	    if (dDown) {
	        return;
	    }
	    dDown = true;
	    runTimer();
	    dOnlyCounter();
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
		    //complete: function (message) { $('#messageArea').html(message); }
		    success: function (data) { $('#messageArea').html('End session'); },
		    failure: function (errMsg) { alert(errMsg); }
		});

	}
	
});