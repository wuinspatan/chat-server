const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let username = '';
while (!username) {
  username = prompt('Enter your name:');
}

socket.emit('set username', username);

// 💬 Add single message to DOM
function addMessage({ name, message }) {
  const item = document.createElement('li');

  // 🔔 System message like "joined the chat"
  if (name === 'System') {
    item.classList.add('system-message');
    const bubble = document.createElement('div');
    bubble.classList.add('system-bubble');
    bubble.innerText = message;
    item.appendChild(bubble);
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    return;
  }

  // 💬 Normal chat message
  const isSelf = name === username;
  item.classList.add(isSelf ? 'message-right' : 'message-left');

  const avatar = document.createElement('div');
  avatar.classList.add('avatar');

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');
  bubble.innerText = message;

  if (isSelf) {
    item.appendChild(bubble);
    item.appendChild(avatar);
  } else {
    item.appendChild(avatar);
    item.appendChild(bubble);
  }

  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

// 🧾 Show past messages when joining
socket.on('chat history', (history) => {
  history.forEach(addMessage);
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', addMessage);