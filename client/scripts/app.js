var app = {}

app.init = function() {
  this.rooms = {}
	this.server = 'http://127.0.0.1:3000/classes/chatterbox';
	this.$roomSelect = $('#roomSelect');
	this.$chats = $('#chats');
	this.$formMessage = $('#formMessage');
	this.fetch()
  // this.pollMessages()
};

app.send = function(message) {
	$.ajax({
		// This is the url you should use to communicate with the parse API server.
		url: this.server,
		type: 'POST',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function(data) {
			console.log('chatterbox: Message sent');
		},
		error: function(data) {
			// See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
			console.error('chatterbox: Failed to send message');
		}
	});
};

app.fetch = function(message) {
	$.ajax({
		// This is the url you should use to communicate with the parse API server.
		url: this.server,
		type: 'GET',
		data: JSON.stringify(message),
		contentType: 'application/json',
		success: function(data) {
      // on successful fetch(), delete all child divs of #chats
      app.clearMessages();
      // iterate through data from server
			_.each(data.results, function(item){
        // populate select dropdown element with rooms
        app.addRoom(item.roomname);

        // only add messages of currently selected room
        var currentRoom = app.$roomSelect.val(); 
        // app.addMessage(item.text );
        if (item.roomname === currentRoom) {
          app.addMessage(item.text, item.username)
        }
			})
		},
		error: function(data) {
			// See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
			console.error('chatterbox: Failed to receive message');
		}
	});
};

app.addRoom = function(name) {
  if( app.rooms[name] === undefined ) {
    app.$roomSelect.append($('<option></option>').attr("id", name).text(name));
    app.rooms[name] = 1;
  }
};

app.addMessage = function(message, user) {

	app.$chats.append($('<div></div>').text(user + ": " + message))
	
};

app.clearMessages = function() {
	this.$chats.empty()
}

app.pollMessages = function(data) {
  console.log("fetching...")
  setInterval(app.fetch, 5000)
}
