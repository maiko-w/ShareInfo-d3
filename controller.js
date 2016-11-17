var socket;
if (typeof(io) != "undefined") {
	socket = io.connect(location.origin);
} else {
	// ioオブジェクトが存在しない時にエラーにならない設定
	socket = {
		emit: function () {}, on: function () {}
	}
}

var roomID;
$(function () {
	// ルームID(1234)を作成
	roomID = 1234;

	// roomIDに入室
	socket.emit("pairingFromController", {
		"roomID": roomID
	});

	// ペアリングに成功
	socket.on("successPairing", function () {
		//
	});

	$("#submitButton").click(function(e){
 //user1
		var username = $("#nameForm").val();
					   // 初期化
					   $("#nameForm").val('');
		var val1 = $("#form1").val();
				   // 初期化
				   $("#form1").val('');
		var val2 = $("#form2").val();
				   // 初期化
				   $("#form2").val('');
		var val3 = $("#form3").val();
				   // 初期化
				   $("#form3").val('');

		 socket.emit("testChat", { value : username });
     socket.emit("testChat1", { value : val1 });
		 socket.emit("testChat2", { value : val2 });
		 socket.emit("testChat3", { value : val3 });
		 e.preventDefault();
		 });
 //user2
 $("#submitButton2").click(function(e){
		var username2 = $("#nameForm2").val();
			 					   // 初期化
			 					   $("#nameForm2").val('');
		var val4 = $("#form4").val();
			 				   // 初期化
			 				   $("#form4").val('');
		var val5 = $("#form5").val();
			 				   // 初期化
			 				   $("#form5").val('');
	  var val6 = $("#form6").val();
			 				   // 初期化
			 				   $("#form6").val('');

								 socket.emit("testChat0-2", { value : username2 });
								 socket.emit("testChat4", { value : val4 });
								 socket.emit("testChat5", { value : val5 });
								 socket.emit("testChat6", { value : val6 });
		e.preventDefault();
	  });
	$("#submitButton3").click(function(e){
	  var username3 = $("#nameForm3").val();
								 				 // 初期化
	　　　　	 				 $("#nameForm3").val('');
		 var val7 = $("#form7").val();
								 			 // 初期化
					 			 $("#form7").val('');
		 var val8 = $("#form8").val();
								 			 // 初期化
					 			 $("#form8").val('');
		 var val9 = $("#form9").val();
								 			 // 初期化
								 $("#form9").val('');
		// サーバーにtestChat:送信
		socket.emit("testChat0-3", { value : username3 });
		socket.emit("testChat7", { value : val7 });
		socket.emit("testChat8", { value : val8 });
		socket.emit("testChat9", { value : val9 });
		e.preventDefault();
	});


});
