// State Variables
let voiceReplyEnabled = true;
let currentLanguage = 'en-US';
let voiceSpeed = 1.0;
let isRecording = false;

// DOM Elements
const voiceToggleBtn = document.getElementById('voice-toggle-btn');
const settingsBtn = document.getElementById('settings-btn');
const micBtn = document.getElementById('mic-btn');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

// Modal Elements
const settingsModal = document.getElementById('settings-modal');
const closeModalX = document.getElementById('close-modal-x');
const closeModalBtn = document.getElementById('close-modal-btn');
const settingLang = document.getElementById('setting-lang');
const settingSpeed = document.getElementById('setting-speed');
const settingTheme = document.getElementById('setting-theme');

// 1. Voice Reply Toggle Button Functionality
if (voiceToggleBtn) {
    voiceToggleBtn.addEventListener('click', () => {
        voiceReplyEnabled = !voiceReplyEnabled;
        if (voiceReplyEnabled) {
            voiceToggleBtn.innerText = '🔊';
            voiceToggleBtn.classList.remove('voice-off');
            voiceToggleBtn.classList.add('voice-on');
        } else {
            voiceToggleBtn.innerText = '🔇';
            voiceToggleBtn.classList.remove('voice-on');
            voiceToggleBtn.classList.add('voice-off');
            window.speechSynthesis.cancel(); // Stop talking immediately if turned off
        }
    });
}

// 2. Settings Popup Controls
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });
}

function closeModal() {
    if (settingsModal) {
        settingsModal.classList.remove('active');
    }
}

if (closeModalX) closeModalX.addEventListener('click', closeModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeModal();
        }
    });
}

// 3. Settings Dropdown Selectors
if (settingLang) {
    settingLang.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
    });
}

if (settingSpeed) {
    settingSpeed.addEventListener('change', (e) => {
        voiceSpeed = parseFloat(e.target.value);
    });
}

if (settingTheme) {
    settingTheme.addEventListener('change', (e) => {
        const chosenTheme = e.target.value;
        if (chosenTheme === 'dark-theme') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
    });
}

// 4. Text-to-Speech Engine (AI Speaks)
function speakText(text) {
    if (!voiceReplyEnabled) return;

    window.speechSynthesis.cancel(); // Stop any previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage;
    utterance.rate = voiceSpeed;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(voice => voice.lang.includes(currentLanguage));
    if (matchingVoice) {
        utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
}

// Fix for Chrome/Safari voice loading bugs
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// 5. Microphone Speech Recognition (Existing working feature)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isRecording = true;
        if (micBtn) micBtn.classList.add('recording');
    };

    recognition.onend = () => {
        isRecording = false;
        if (micBtn) micBtn.classList.remove('recording');
    };

    recognition.onerror = () => {
        isRecording = false;
        if (micBtn) micBtn.classList.remove('recording');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (userInput) {
            userInput.value = transcript;
            handleSendMessage();
        }
    };
}

if (micBtn) {
    micBtn.addEventListener('click', () => {
        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser.");
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

// 6. Messaging Pipeline & Layout Integration
function appendMessage(text, sender) {
    if (!chatMessages) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', `${sender}-message`);
    
    const textNode = document.createElement('p');
    textNode.innerText = text;
    msgDiv.appendChild(textNode);
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateMockAIResponse(userText) {
    if (currentLanguage.startsWith('hi')) {
        return "मैंने आपकी बात सुन ली है। मैं आपकी क्या मदद कर सकता हूँ?";
    } else if (currentLanguage.startsWith('mr')) {
        return "मी तुमचे ऐकले आहे. मी तुम्हाला कशी मदत करू शकतो?";
    } else {
        return `Processed your request: "${userText}". How else can I assist you?`;
    }
}

function handleSendMessage() {
    if (!userInput) return;
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    setTimeout(() => {
        const aiResponse = generateMockAIResponse(text);
        appendMessage(aiResponse, 'ai');
        speakText(aiResponse);
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
