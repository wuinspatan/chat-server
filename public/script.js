const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let username = '';
while (!username) {
  username = prompt('User name ? :');
}

socket.emit('set username', username);

function addMessage({ name, message, time }) {
  const item = document.createElement('li');
  const isSystem = name === 'System';
  const isSelf = name === username;

  item.classList.add(isSystem ? 'system-message' : isSelf ? 'message-right' : 'message-left');

  if (isSystem) {
    const bubble = document.createElement('div');
    bubble.classList.add('system-bubble');
    bubble.innerText = message;
    item.appendChild(bubble);
  } else {
    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.style.backgroundColor = stringToColor(name);

    const nameLabel = document.createElement('div');
    nameLabel.classList.add('username-label');
    nameLabel.innerText = name;

    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble');
    bubble.innerText = message;

    const timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');
    timestamp.innerText = formatTime(time || Date.now());

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.appendChild(nameLabel);
    messageContent.appendChild(bubble);
    messageContent.appendChild(timestamp);

    if (isSelf) {
      item.appendChild(messageContent);
      item.appendChild(avatar);
    } else {
      item.appendChild(avatar);
      item.appendChild(messageContent);
    }
  }

  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;

  if (!isSystem) playSound(isSelf ? 'send' : 'receive');
}

function formatTime(ts) {
  const date = new Date(ts);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

function playSound(type) {
  const audio = document.getElementById(type === 'send' ? 'sendSound' : 'receiveSound');
  if (audio) audio.play();
}

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${'00000'.substring(0, 6 - c.length)}${c}`;
}

socket.on('chat history', (history) => {
  history.forEach(addMessage);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', addMessage);