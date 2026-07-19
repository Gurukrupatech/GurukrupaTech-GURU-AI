// Configuration & State
let voiceReplyEnabled = true;
let currentLanguage = 'en-US';
let voiceSpeed = 1.0;
let isRecording = false;

// DOM Selectors
const voiceToggleBtn = document.getElementById('voice-toggle-btn');
const settingsBtn = document.getElementById('settings-btn');
const micBtn = document.getElementById('mic-btn');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const settingsModal = document.getElementById('settings-modal');
const closeModalX = document.getElementById('close-modal-x');
const closeModalBtn = document.getElementById('close-modal-btn');
const settingLang = document.getElementById('setting-lang');
const settingSpeed = document.getElementById('setting-speed');
const settingTheme = document.getElementById('setting-theme');

// System Welcome Greetings Map
const welcomeGreetings = {
    'en-US': "Hello Boss! 👋 Welcome back. I'm Swity AI, ready to assist you. What can I do for you today?",
    'hi-IN': "नमस्ते बॉस! 👋 आपका स्वागत है। मैं स्वीटी एआई (Swity AI) हूँ, आपकी सेवा में हाजिर। आज मैं आपके लिए क्या कर सकती हूँ?",
    'mr-IN': "हॅलो बॉस! 👋 तुमचे स्वागत आहे. मी स्वीटी एआय (Swity AI) आहे, तुमच्या सेवेसाठी सज्ज. आज मी तुमच्यासाठी काय करू शकते?"
};

// 1. Initialize App & Set Welcome Message
function initGreeting() {
    if (chatMessages) {
        chatMessages.innerHTML = ''; // Clear previous
        const greetingText = welcomeGreetings[currentLanguage];
        appendMessage(greetingText, 'ai');
        speakText(greetingText);
    }
}

// 2. Voice Toggle Feature
if (voiceToggleBtn) {
    voiceToggleBtn.addEventListener('click', () => {
        voiceReplyEnabled = !voiceReplyEnabled;
        if (voiceReplyEnabled) {
            voiceToggleBtn.innerText = '🔊';
            voiceToggleBtn.classList.remove('voice-off');
        } else {
            voiceToggleBtn.innerText = '🔇';
            voiceToggleBtn.classList.add('voice-off');
            window.speechSynthesis.cancel();
        }
    });
}

// 3. Settings Popup Logic
if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });
}

function closePopup() {
    if (settingsModal) settingsModal.classList.remove('active');
}
if (closeModalX) closeModalX.addEventListener('click', closePopup);
if (closeModalBtn) closeModalBtn.addEventListener('click', closePopup);
if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closePopup();
    });
}

// 4. Handle Config Settings Changes
if (settingLang) {
    settingLang.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        initGreeting(); // Change greeting instantly when language updates
    });
}
if (settingSpeed) {
    settingSpeed.addEventListener('change', (e) => {
        voiceSpeed = parseFloat(e.target.value);
    });
}
if (settingTheme) {
    settingTheme.addEventListener('change', (e) => {
        document.body.className = e.target.value;
    });
}

// 5. Text-to-Speech Engine
function speakText(text) {
    if (!voiceReplyEnabled) return;
    window.speechSynthesis.cancel();
    
    // Clean emojis for clean speech syntax
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLanguage;
    utterance.rate = voiceSpeed;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.includes(currentLanguage));
    if (match) utterance.voice = match;

    window.speechSynthesis.speak(utterance);
}

// Chrome fix for loading speech engines
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// 6. Speech Recognition (Mic Button)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => { isRecording = true; micBtn.classList.add('recording'); };
    recognition.onend = () => { isRecording = false; micBtn.classList.remove('recording'); };
    recognition.onerror = () => { isRecording = false; micBtn.classList.remove('recording'); };
    recognition.onresult = (event) => {
        userInput.value = event.results[0][0].transcript;
        handleSendMessage();
    };
}

if (micBtn) {
    micBtn.addEventListener('click', () => {
        if (!SpeechRecognition) {
            alert("Speech API not supported in this browser.");
            return;
        }
        if (isRecording) {
            recognition.stop();
        } else {
            recognition.lang = currentLanguage;
            recognition.start();
        }
    });
}

// 7. Message Engine Pipeline
function appendMessage(text, sender) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    setTimeout(() => {
        let reply = "";
        if (currentLanguage === 'hi-IN') {
            reply = "जी बॉस, मैंने आपकी बात समझ ली। बताइए और क्या सहायता करूँ?";
        } else if (currentLanguage === 'mr-IN') {
            reply = "होय बॉस, मला समजले. सांगा अजून काय मदत हवी आहे?";
        } else {
            reply = `Understood, Boss! I have processed: "${text}". What's next?`;
        }
        appendMessage(reply, 'ai');
        speakText(reply);
    }, 600);
}

if (sendBtn) sendBtn.addEventListener('click', handleSendMessage);
if (userInput) {
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
}

// Initial Bootup trigger
window.addEventListener('DOMContentLoaded', initGreeting);
