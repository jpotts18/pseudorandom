function handleRequest(e,r){r.end("It works!"+e.url)}var http=require("http");const PORT=3001;var server=http.createServer(handleRequest);server.listen(PORT,function(){console.log("server listening",PORT)});