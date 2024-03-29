var exports = module.exports = {};

var results = [{"username":"Jono","message":"Do my bidding!"}]

module.exports.requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var isValidUrl = (request.url === "/classes/messages" || request.url === "/classes/room1" || request.url === "/classes/chatterbox")
  
  response.statusCode = 404;
  
  if (isValidUrl && request.method === "POST") {
    response.statusCode = 201;
  } else if (isValidUrl && (request.method === "GET" || request.method === "OPTIONS")){
    response.statusCode = 200;
  } else {
    response.statusCode = 404;
  }

  
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "application/json";

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  var tempStatCode = response.statusCode
  response.writeHead(tempStatCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.


  var responseBody = function(req){
    this.request = req
    // console.log(this.request._postData)
    var resp = {"results": results};
    if(this.request.method === "OPTIONS" && this.request.url === "/classes/chatterbox"){
// what to do?
      // console.log(headers)
      return headers
    } else if(this.request.method === "GET") {
      if(this.request.url === "/classes/messages" || this.request.url === "/classes/room1") {
        console.log("****results: ", results)
        return resp
      }
    } else if (this.request.method === "POST" && this.request._postData) {
      if(this.request.url === "/classes/messages") {
        results.push(JSON.parse(this.request._postData))
        resp["results"] = results
      }
      if(this.request.url === "/classes/room1") {
        results.push(this.request._postData)
        resp["results"] = results
      }
    }
    return resp
  }
  var responseBod = responseBody(request)
  var stringifiedResponseBody = JSON.stringify(responseBod);
  console.log("THIS IS THE RESPONSE.STATUSCODE!!", response.statusCode, "THIS IS THE resp OBJECT!!", stringifiedResponseBody)
  response.end(stringifiedResponseBody);
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "X-Parse-Application-Id, Origin, X-Requested-With, Content-Type, accept",
  "access-control-max-age": 10 // Seconds
};

