// Global State Variables
let currentLanguage = 'en-US';
let isVoiceEnabled = true;
let isRecognitionActive = false;
let recognition = null;
let synth = window.speechSynthesis;
let currentUtterance = null;

// DOM Elements
const userInput = document.getElementById('userInput');
const chatBody = document.getElementById('chatBody');
const micBtn = document.getElementById('micBtn');
const voiceToggle = document.getElementById('voiceToggle');
const settingsPanel = document.getElementById('settingsPanel');
const avatarWrapper = document.getElementById('avatarWrapper');
const visualizer = document.getElementById('visualizer');
const btcVal = document.getElementById('btcVal');
const niftyVal = document.getElementById('niftyVal');

// Initialize Event Listeners & Dummy Data Updates
document.addEventListener('DOMContentLoaded', () => {
    if (userInput) {
        userInput.addEventListener('keydown', checkEnter);
    }
    initSpeechRecognition();
    startLiveUpdates();
    sendWelcomeMessage();
});

// 1. Welcome Reply
function sendWelcomeMessage() {
    let welcomeText = "Welcome back, Boss. I'm Swity, always ready to help you.";
    appendMessageBubble(welcomeText, 'ai');
    executeTextToSpeech(welcomeText);
}

// 2. Chat Input and Sending Mechanics
function processUserMessage() {
    if (!userInput) return;
    const message = userInput.value.trim();
    if (message === "") return;

    appendMessageBubble(message, 'user');
    userInput.value = "";

    setTimeout(() => {
        const reply = generateEngineReply(message);
        appendMessageBubble(reply, 'ai');
        executeTextToSpeech(reply);
    }, 800);
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        processUserMessage();
    }
}

function appendMessageBubble(text, sender) {
    if (!chatBody) return;
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender}-message`;
    bubble.style.margin = '10px';
    bubble.style.padding = '10px';
    bubble.style.borderRadius = '8px';
    bubble.style.maxWidth = '75%';
    
    if (sender === 'user') {
        bubble.style.backgroundColor = '#d1e7dd';
        bubble.style.marginLeft = 'auto';
    } else {
        bubble.style.backgroundColor = '#e2e3e5';
        bubble.style.marginRight = 'auto';
    }
    
    bubble.innerText = text;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// 3. AI Reply Generation Engine
function generateEngineReply(message) {
    const lowerMessage = message.toLowerCase();
    
    if (currentLanguage === 'hi-IN') {
        if (lowerMessage.includes('hello') || lowerMessage.includes('नमस्ते')) {
            return "नमस्ते बॉस, मैं स्विटी हूँ। मैं आपकी क्या मदद कर सकती हूँ?";
        }
        return "जी बॉस, मैंने समझ लिया। मैं इस पर काम कर रही हूँ।";
    } else if (currentLanguage === 'mr-IN') {
        if (lowerMessage.includes('hello') || lowerMessage.includes('नमस्कार')) {
            return "नमस्कार बॉस, मी स्विटी आहे. मी तुम्हाला काय मदत करू शकते?";
        }
        return "होय बॉस, मला समजले. मी यावर काम करत आहे.";
    } else {
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello Boss! Swity here. How can I assist you today?";
        }
        if (lowerMessage.includes('name')) {
            return "My name is Swity, Boss.";
        }
        return "I processed your request, Boss. Let me know if you need anything else.";
    }
}

// 4. Text-To-Speech & Avatar Speaking Animation Triggers
function executeTextToSpeech(text) {
    if (!isVoiceEnabled || !synth) return;

    synth.cancel();

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = currentLanguage;

    const voices = synth.getVoices();
    const femaleVoice = voices.find(voice => 
        voice.lang.startsWith(currentLanguage.split('-')[0]) && 
        (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('zira') || voice.name.toLowerCase().includes('google'))
    );

    if (femaleVoice) {
        currentUtterance.voice = femaleVoice;
    }

    currentUtterance.onstart = () => {
        triggerAvatarSpeaking(true);
    };

    currentUtterance.onend = () => {
        triggerAvatarSpeaking(false);
    };

    currentUtterance.onerror = () => {
        triggerAvatarSpeaking(false);
    };

    synth.speak(currentUtterance);
}

function triggerAvatarSpeaking(isSpeaking) {
    if (!avatarWrapper) return;
    if (isSpeaking) {
        avatarWrapper.classList.add('speaking');
        if (visualizer) visualizer.style.display = 'flex';
    } else {
        avatarWrapper.classList.remove('speaking');
        if (visualizer) visualizer.style.display = 'none';
    }
}

// 5. Speech Recognition
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        if (micBtn) micBtn.style.display = 'none';
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isRecognitionActive = true;
        if (micBtn) micBtn.style.backgroundColor = '#ff4d4d';
    };

    recognition.onresult = (event) => {
        const resultText = event.results[0][0].transcript;
        if (userInput) {
            userInput.value = resultText;
            processUserMessage();
        }
    };

    recognition.onerror = () => {
        isRecognitionActive = false;
        if (micBtn) micBtn.style.backgroundColor = '';
    };

    recognition.onend = () => {
        isRecognitionActive = false;
        if (micBtn) micBtn.style.backgroundColor = '';
    };
}

function startSpeechRecognition() {
    if (!recognition) return;
    if (isRecognitionActive) {
        recognition.stop();
    } else {
        recognition.lang = currentLanguage;
        recognition.start();
    }
}

if (micBtn) {
    micBtn.addEventListener('click', startSpeechRecognition);
}

// 6. Feature Controls
function toggleVoiceOutput() {
    isVoiceEnabled = !isVoiceEnabled;
    if (!isVoiceEnabled && synth) {
        synth.cancel();
        triggerAvatarSpeaking(false);
    }
    if (voiceToggle) {
        voiceToggle.innerText = isVoiceEnabled ? "Voice: ON" : "Voice: OFF";
    }
}

function toggleSettings() {
    if (!settingsPanel) return;
    settingsPanel.style.display = (settingsPanel.style.display === 'none' || settingsPanel.style.display === '') ? 'block' : 'none';
}

function setLanguage(langCode) {
    if (langCode === 'en') currentLanguage = 'en-US';
    if (langCode === 'hi') currentLanguage = 'hi-IN';
    if (langCode === 'mr') currentLanguage = 'mr-IN';
}

// 7. Utility Controls
function clearChat() {
    if (chatBody) {
        chatBody.innerHTML = '';
        sendWelcomeMessage();
    }
}

function downloadChat() {
    if (!chatBody) return;
    const messages = [];
    const bubbles = chatBody.querySelectorAll('.message-bubble');
    bubbles.forEach(bubble => {
        const type = bubble.classList.contains('user-message') ? 'User: ' : 'Swity: ';
        messages.push(type + bubble.innerText);
    });

    const blob = new Blob([messages.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'swity_chat_history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// 8. Live BTC and Nifty Updates
function startLiveUpdates() {
    setInterval(() => {
        if (btcVal) {
            const randomBTC = (60000 + Math.random() * 5000).toFixed(2);
            btcVal.innerText = `$${randomBTC}`;
        }
        if (niftyVal) {
            const randomNifty = (22000 + Math.random() * 500).toFixed(2);
            niftyVal.innerText = `${randomNifty}`;
        }
    }, 3000);
}
