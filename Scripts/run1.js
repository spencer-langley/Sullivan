$(function () {

	$(document).keydown(function (e) {
		processKeyPress(event.which);
	});

	$(document).keyup(function (e) {
	    processKeyUp(event.which);
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
		k_StrokeTimes.push( Date.now() );
		
		if(Math.floor(k_StrokeTimes.length % pointKeystrokeThreshold) == 0) {
			k_Score++;
		}
		
		$('#kScoreContainer').html( k_Score );
		checkScores();
	}
	
	function handleD() {
	    runTimer();
	    if (dDown) {
	        return;
	    }
	    dDown = true;
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
		console.log('Setting timer for ' + timerEndMilliseconds/1000 + ' secs');
		timeoutId = setTimeout(endSession, timerEndMilliseconds);
		timerRunning = true;
		startTime = Date.now();
		var currentdate = new Date();
		startDT = currentdate.getDate() + "/"
                        + (currentdate.getMonth()+1)  + "/" 
                        + currentdate.getFullYear() + " @ "  
                        + currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
	}
	
	function endSession() {
	    console.log("Ending");
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
                "SessionType": 'One',
                "startDateTime": startDT,
                "endDateTime": endDT,
                "startTime": startTime,
                "endTime": endTime,
                "k_StrokeTimes": k_StrokeTimes,
                "d_StrokeTimes": d_StrokeTimes
            }

		console.log('Sending:');
		console.log(submitData);

		console.log('Stringified:');
		console.log(JSON.stringify(submitData));


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