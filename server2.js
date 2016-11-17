// サーバー構築
var http = require("http");
// fsモジュールの読み込み
var fs = require("fs");
// pathモジュールの読み込み
var path = require("path");
// socket.ioモジュールの読み込み
var socketIO = require("socket.io");




// httpサーバーを立てる
var server = http.createServer(requestListener);
// httpサーバーを起動する。
server.listen((process.env.PORT || 5000), function() {
    console.log((process.env.PORT || 5000) + "でサーバーが起動しました");
});

//初期値をセットする。
var nodes = [{
    label: "ID:0"
}, {
    label: "ID:1"
}, {
    label: "ID:2"
}, {
    label: "ID:3"
}, {
    label: "ID:4"
}, {
    label: "ID:5"
}, {
    label: "ID:6"
}, {
    label: "ID:7"
}, {
    label: "ID:8"
}, {
    label: "ID:9"
}, {
    label: "ID:10"
}, {
    label: "ID:11"
}, ];

var links = [{
    source: 0,
    target: 1
}, {
    source: 0,
    target: 2
}, {
    source: 0,
    target: 3
}, {
    source: 1,
    target: 2
}, {
    source: 3,
    target: 1
}, {
    source: 2,
    target: 3
}, {
    source: 4,
    target: 5
}, {
    source: 4,
    target: 6
}, {
    source: 4,
    target: 7
}, {
    source: 5,
    target: 6
}, {
    source: 7,
    target: 5
}, {
    source: 6,
    target: 7
}, {
    source: 8,
    target: 9
}, {
    source: 8,
    target: 10
}, {
    source: 8,
    target: 11
}, {
    source: 9,
    target: 10
}, {
    source: 11,
    target: 9
}, {
    source: 10,
    target: 11
}, ];


//初期値ここまで

/**
 * サーバーにリクエストがあった際に実行される関数
 */
function requestListener(request, response) {
    // リクエストがあったファイル
    var requestURL = request.url;
    // リクエストのあったファイルの拡張子を取得
    var extensionName = path.extname(requestURL);
    // ファイルの拡張子に応じてルーティング処理
    switch (extensionName) {
        case ".html":
            readFileHandler(requestURL, "text/html", false, response);
            break;
        case ".css":
            readFileHandler(requestURL, "text/css", false, response);
            break;
        case ".js":
        case ".ts":
            readFileHandler(requestURL, "text/javascript", false, response);
            break;
        case ".png":
            readFileHandler(requestURL, "image/png", true, response);
            break;
        case ".jpg":
            readFileHandler(requestURL, "image/jpeg", true, response);
            break;
        case ".gif":
            readFileHandler(requestURL, "image/gif", true, response);
            break;
        default:
            // どこにも該当しない場合は、index.htmlを読み込む
            readFileHandler("/index.html", "text/html", false, response);
            break;
    }
}

/**
 * ファイルの読み込み
 */
function readFileHandler(fileName, contentType, isBinary, response) {
    // エンコードの設定
    var encoding = !isBinary ? "utf8" : "binary";
    var filePath = __dirname + fileName;

    fs.exists(filePath, function(exits) {
        if (exits) {
            fs.readFile(filePath, { encoding: encoding }, function(error, data) {
                if (error) {
                    response.statusCode = 500;
                    response.end("Internal Server Error");
                } else {
                    response.statusCode = 200;
                    response.setHeader("Content-Type", contentType);
                    if (!isBinary) {
                        response.end(data);
                    } else {
                        response.end(data, "binary");
                    }
                }
            });
        } else {
            // ファイルが存在しない場合は400エラーを返す。
            response.statusCode = 400;
            response.end("400 Error");
        }
    });
}

// サーバーでSocket.IOを使える状態にする
var io = socketIO.listen(server);

//roomID。今回は一つに決定される。
var roomID = "";

// サーバーへのアクセスを監視。クライアントからのアクセスがあったらコールバックが実行
io.sockets.on("connection", function(socket) {
    // メイン画面からのpairingFromMainというデータを受信（メイン画面のペアリング）
    socket.on("pairingFromMain", function(data) {
        roomID = data.roomID;
        socket.join(roomID);
        socket.emit("successLoginPC");
    });
    // コントローラーからのpairingFromControllerというデータを受信（コントローラーのペアリングイベント）
    socket.on("pairingFromController", function(data) {
        roomID = data.roomID;
        socket.join(roomID);
        // ルームIDがroomIDのグループにsuccessPairingというデータを送信
        io.sockets.to(roomID).emit("successPairing");
    });
    //controllerからのデータを受信する。
    socket.on("testChat", function(data) {
        /**こんなのがデータに入ってます。
         * data = {
                name: username,
                vals: [
                    val1, val2, val3
                ]
            }   
         * 
         * 
         */

        //まずnodeを作成する。

        //ユーザーの名前のノード
        nodes.push({
            label: data.name
        });

        //属性のノードの数だけプッシュする。
        for (val of data.vals) {
            nodes.push({
                label: val
            });
        }

        //つぎにlinkを作成する。
        //これは今追加したユーザーのIDのnodeIDのはず。
        var thisUserNodeId = nodes.length - data.vals.length - 1;

        for (num in data.vals) {
            //numにはdata.valsの番目が入る。
            var thisValNodeId = Number(thisUserNodeId) + Number(num) + 1;

            links.push({
                source: thisUserNodeId,
                target: thisValNodeId
            });
        }


        console.log(nodes);
        console.log(links);
        //socket.to(roomID).broadcast.emit("resChat", data);
        var sendData = {
            "nodes": nodes,
            "links": links
        };
        socket.to(roomID).broadcast.emit("display-response", sendData);
    });

    //ここからやすにゃんが書いた
    socket.on("display-request", function(data) {

        //送信するデータを作成する。

        var sendData = {
            "nodes": nodes,
            "links": links
        };
        console.log(nodes);
        //"display-request"イベントが飛んできたら
        //"display-response"イベントでデータを飛ばす。
        socket.emit("display-response", sendData);

    });



});
// 接続エラー
io.sockets.on("connect_error", function(socket) {
    console.log("connect_error");
});
// 接続終了
io.sockets.on("disconnect", function(socket) {
    socket.emit("disconnectEvent");
    console.log("disconnecth");
});