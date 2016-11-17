var socket;
if (typeof(io) != "undefined") {
    socket = io.connect(location.origin);
} else {
    // ioオブジェクトが存在しない時にエラーにならない設定
    socket = {
        emit: function() {},
        on: function() {}
    }
}

var roomID;
$(function() {
    // ルームID(1234)を作成
    roomID = 1234;

    // roomIDに入室
    socket.emit("pairingFromController", {
        "roomID": roomID
    });

    // ペアリングに成功
    socket.on("successPairing", function() {
        //
    });

    $("#submitButton").click(function(e) {
        //userの名前
        var username = $("#nameForm").val();
        // 初期化
        $("#nameForm").val('');
        var vals = [];
        //属性の値はここに入れる。

        var vals = [];
        //.valクラスの中の要素をvalsに入れる。
        $(".val").map(function(index, element) {
            vals.push(element.value);
        });

        //ユーザー一人を表すオブジェクト
        var user = {
            name: username,
            vals: vals
        }

        socket.emit("testChat", user);
        e.preventDefault();
        alert("送信完了しましたヨ")
    });


    $("#addVal").click(function(e) {
        //属性の入力欄を追加する。
        $("#vals").append('<label for="">属性：</label><input type="text" class="val" value="サバゲー"><br>');
    });


});