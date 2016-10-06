var server = io.connect();

/*server.on('connect', function() {
  var flag = false;
  while (!flag) {
    nickname = prompt("Please enter your nickname:");
    if (nickname !== null && nickname !== "") {
      flag = true;
    }
  }
  // console.log("a user connected");
  loginPage();
  // server.emit('join', nickname);
});*/

server.on('chat message', function(msg) {
  $('#messages').append(('<li><p id="name">' + msg.name +'</p><p id="date">' 
    + msg.date + '</p><br><p id="msg">' + msg.msg +'</p></li>'));
  $('#messages').animate({ scrollTop: $('#messages li:last-child').offset().top + 'px'}, 1);
});


var dateFormat = function(date) {
  var day = date.getDate();
  day = day < 10 ? "0" + day : day;
  var month = date.getMonth();
  month = month < 10 ? "0" + month : month;
  var year = date.getFullYear();
  var hour = date.getHours();
  hour = hour < 10 ? "0" + hour : hour;
  var minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;

  if (hour > 12) {
    hour -= 12;
    hour = hour < 10 ? "0" + hour : hour;
    date = month + "." + day + "." + year + " " 
      + hour + ":" + minutes + " PM";
  } else {
    date = month + "." + day + "." + year + " " 
      + hour + ":" + minutes + " AM";
  }

  return date;
}

// $('#send_button').text("POST");

function loginPage() {
  $('#login').show();
  $('#logout').hide();
  $('#chatroom').hide();
  $('#nickname').val('');
}

function chatPage() {
  $('#login').hide();
  $('#logout').show();
  $('#chatroom').show();
}

function login() {
  chatPage();
  var nickname = $('#nickname').val();
  $('#username').text("Hi, " + nickname + "!");
  server.emit('join', $('#nickname').val());
}

function logout() {
  loginPage();
}


function chatMessage() {
  var msg = $('#chat_input').val();
  $('#chat_input').val('');
  var date = dateFormat(new Date());
  server.emit('chat message', {msg: msg, date: date});
}

/*$('#chat_form').submit(function(){
  var msg = $('#chat_input').val();
  $('#chat_input').val('');
  var date = dateFormat(new Date());
  server.emit('chat message', {msg: msg, date: date});
  return false;
});*/