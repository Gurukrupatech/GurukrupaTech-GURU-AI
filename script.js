document.addEventListener('DOMContentLoaded', () => {

  // DOM Elements
  const avatarContainer = document.getElementById('avatar-container');
  const chatMessages = document.getElementById('chat-messages');
  const chatContainer = document.getElementById('chat-container');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const initialTime = document.getElementById('initial-time');

  // Controls
  const topMicBtn = document.getElementById('top-mic-btn');
  const bottomMicBtn = document.getElementById('bottom-mic-btn');
  const topVoiceBtn = document.getElementById('top-voice-btn');
  const bottomVoiceBtn = document.getElementById('bottom-voice-btn');
  const headerSettingsBtn = document.getElementById('header-settings-btn');
  const bottomSettingsBtn = document.getElementById('bottom-settings-btn');

  // Modal Settings Elements
  const settingsModal = document.getElementById('settings-modal');
  const closeSettings = document.getElementById('close-settings');
  const languageSelect = document.getElementById('language-select');
  const speechRateInput = document.getElementById('speech-rate');
  const autoVoiceToggle = document.getElementById('auto-voice-toggle');

  // App State
  let isListening = false;
  let isSpeaking = false;
  let autoVoiceEnabled = true;
  let currentLanguage = 'en-US';
  let speechRate = 1.0;
  let recognition = null;
  let synth = window.speechSynthesis;

  if (initialTime) {
    initialTime.textContent = getCurrentTime();
  }

  // Web Speech API Initialization
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isListening = true;
      updateMicUI(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
      handleSendMessage();
    };

    recognition.onerror = () => stopListening();
    recognition.onend = () => stopListening();
  }

  sendBtn.addEventListener('click', handleSendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });

  const toggleMic = () => {
    if (!recognition) {
      alert('Speech Recognition is not supported on this browser.');
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      if (isSpeaking) stopSpeaking();
      recognition.lang = currentLanguage;
      recognition.start();
    }
  };

  topMicBtn.addEventListener('click', toggleMic);
  bottomMicBtn.addEventListener('click', toggleMic);

  const handleVoiceToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const botMessages = document.querySelectorAll('.bot-message .message-content p');
      if (botMessages.length > 0) {
        const lastMsg = botMessages[botMessages.length - 1].textContent;
        speakText(lastMsg);
      }
    }
  };

  topVoiceBtn.addEventListener('click', handleVoiceToggle);
  bottomVoiceBtn.addEventListener('click', handleVoiceToggle);

  const openSettings = () => settingsModal.classList.add('active');
  const closeSettingsModal = () => settingsModal.classList.remove('active');

  headerSettingsBtn.addEventListener('click', openSettings);
  bottomSettingsBtn.addEventListener('click', openSettings);
  closeSettings.addEventListener('click', closeSettingsModal);
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettingsModal();
  });

  languageSelect.addEventListener('change', (e) => { currentLanguage = e.target.value; });
  speechRateInput.addEventListener('change', (e) => { speechRate = parseFloat(e.target.value); });
  autoVoiceToggle.addEventListener('change', (e) => { autoVoiceEnabled = e.target.checked; });

  function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    const typingId = appendTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator(typingId);
      const responseText = generateBotResponse(text);
      appendMessage(responseText, 'bot');

      if (autoVoiceEnabled) {
        speakText(responseText);
      }
    }, 1200);
  }

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', `${sender}-message`);

    const time = getCurrentTime();

    if (sender === 'bot') {
      msgDiv.innerHTML = `
        <div class="message-avatar">
          <img src="swity-avatar.png" alt="Swity">
        </div>
        <div class="message-content">
          <p>${escapeHTML(text)}</p>
          <span class="timestamp">${time}</span>
        </div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="message-content">
          <p>${escapeHTML(text)}</p>
          <span class="timestamp">${time}</span>
        </div>
      `;
    }

    chatMessages.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function appendTypingIndicator() {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-message');
    typingDiv.id = id;
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <img src="swity-avatar.png" alt="Swity">
      </div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function generateBotResponse(input) {
  const query = input.toLowerCase();

  if (query.includes('hello') || query.includes('hi') || query.includes('namaste')) {
    return `Hello Boss! 👋

I'm Swity AI by GURUKRUPATECH.

Your intelligent AI companion for Trading, Coding, Technology, Learning, Creativity, and Smart Solutions.

How may I assist you today?`;
  } else if (query.includes('who are you') || query.includes('kaun ho')) {
    return "Main Swity hoon, GURUKRUPATECH aur TRADER SHIV ki AI Assistant.";
  } else if (query.includes('time') || query.includes('samay')) {
    return `Abhi ka samay ${getCurrentTime()} hai.`;
  } else {
    return "Hello Boss! I'm Swity AI by GurukrupaTech. Your intelligent AI companion for Trading, Coding, Technology, Learning, Creativity, and Smart Solutions. How may I assist you today?";
  }
}

  function speakText(text) {
    if (!synth) return;
    if (synth.speaking) synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage;
    utterance.rate = speechRate;

    utterance.onstart = () => {
      isSpeaking = true;
      avatarContainer.classList.add('speaking');
      updateVoiceUI(true);
    };

    utterance.onend = () => stopSpeaking();
    utterance.onerror = () => stopSpeaking();

    synth.speak(utterance);
  }

  function stopSpeaking() {
    if (synth && synth.speaking) synth.cancel();
    isSpeaking = false;
    avatarContainer.classList.remove('speaking');
    updateVoiceUI(false);
  }

  function stopListening() {
    isListening = false;
    updateMicUI(false);
  }

  function updateMicUI(active) {
    if (active) {
      topMicBtn.classList.add('active');
      bottomMicBtn.classList.add('active');
    } else {
      topMicBtn.classList.remove('active');
      bottomMicBtn.classList.remove('active');
    }
  }

  function updateVoiceUI(active) {
    if (active) {
      topVoiceBtn.classList.add('active');
      bottomVoiceBtn.classList.add('active');
    } else {
      topVoiceBtn.classList.remove('active');
      bottomVoiceBtn.classList.remove('active');
    }
  }

  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

});
