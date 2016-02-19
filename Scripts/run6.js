$(function () {

	$(document).keydown(function (e) {
		processKeyPress(event.which);
	});
	
	$('#buzzer').bind('ended', function(){
		ContinueAfterBuzz();
	});

	var k_Key = 75;
	var d_Key = 68;
	var keyArray = [k_Key, d_Key];
	var ratioThreshold = 0.8;
	
	var goodStrokeTimes = [];
	var badStrokeTimes = [];
	var subSessionData = [];
	
	var k_Score = 0;
	var d_Score = 0;
	
	var pointKeystrokeThreshold = 50;
	var pointTotalThreshold = 50;
	var timerRunning = false;
	
	var modeEndMilliseconds = 300000;
	
	var ModeTimeoutId = 0;
	
	var currentBadKeyIndex = null;
	
	function EndSubSession() {
		subSessionData.push({
			'badKeyCode': keyArray[currentBadKeyIndex],
			'goodTimes': goodStrokeTimes,
			'badTimes': badStrokeTimes,
			'percentStrokesGood': (goodStrokeTimes.length / (goodStrokeTimes.length + badStrokeTimes.length))
		});
		console.log('SubSession data:');
		console.log(subSessionData);
		currentBadKeyIndex = null;
		if(subSessionData.length == 6 || LastThreeSubsKeyRatioCheck() ) {
			EndSession();
		}
		else {
			BeginSubSession(flipCoin());
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
	
	function BeginSubSession(modeCode) {
		currentBadKeyIndex = modeCode;
		goodStrokeTimes = [];
		badStrokeTimes = [];
		ModeTimeoutId = setTimeout(EndSubSession, modeEndMilliseconds);
		console.log('Begin SubSession: ' + String.fromCharCode());
	}
	
	function flipCoin() {
		return Math.round(Math.random());
	}
	
	function processKeyPress(keyCode) {
		if(keyCode == k_Key || keyCode == d_Key) {
			if(currentBadKeyIndex == null) {
				BeginSubSession(flipCoin());
			}
			if(keyCode == keyArray[currentBadKeyIndex]) {
				handleBadKeyStroke();
			}
			else {
				handleGoodKeyStroke();
			}
		}
	}
	
	function handleGoodKeyStroke() {
		goodStrokeTimes.push(Date.now());
	}
	
	function handleBadKeyStroke() {
		$('#buzzer').trigger('play');
		badStrokeTimes.push(Date.now());
	}
	
	function ContinueAfterBuzz() {
		console.log('Triggered after buzz');
		if(Math.floor(badStrokeTimes.length % pointKeystrokeThreshold) == 0) {
			if(keyArray[currentBadKeyIndex] == k_Key) {
				k_Score++;
				$('#kScoreContainer').html( k_Score );
			}
			else {
				d_Score++;
				$('#dScoreContainer').html( d_Score );
			}
		}
	}
	
	function endSession() {
		$(document).off("keydown");

		var submitData =
            {
                "SessionType": 'Six',
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