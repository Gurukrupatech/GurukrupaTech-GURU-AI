document.addEventListener("DOMContentLoaded", () => {
    const inputForm = document.getElementById("chatInputForm");
    const userInput = document.getElementById("chatUserInput");
    const chatDisplayBox = document.getElementById("chatDisplayBox");
    const voiceBtn = document.getElementById("voiceCommandBtn");

    let isRecording = false;
    let recognition = null;

    // Chat Controller Transmit System
    inputForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text) return;

        // 1. Render User Message Packet Bubble
        appendMessage(text, "user");
        userInput.value = "";

        // 2. Trigger Smart Simulated AI Response Pipeline Engine
        setTimeout(() => {
            generateAIResponse(text);
        }, 1000);
    });

    function appendMessage(text, sender) {
        const msgRow = document.createElement("div");
        msgRow.className = sender === "user" ? "user-msg-row" : "ai-msg-row";

        const avatarMarkup = sender === "user" 
            ? `<div class="mini-avatar"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="User"></div>`
            : `<div class="mini-avatar"><img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100" alt="Swity"></div>`;

        msgRow.innerHTML = `
            ${avatarMarkup}
            <div class="msg-bubble-content">
                <p>${escapeHTML(text)}</p>
            </div>
        `;

        chatDisplayBox.appendChild(msgRow);
        chatDisplayBox.scrollTop = chatDisplayBox.scrollHeight;
    }

    function generateAIResponse(query) {
        const lowerText = query.toLowerCase();
        let reply = "Command analyzed by Swity matrix core module system. Processing normal.";

        if (lowerText.includes("marathi") || lowerText.includes("मराठी") || lowerText.includes("कशी आहेस")) {
            reply = "मी एकदम आनंदात आहे, बॉस! GurukrupaTech च्या सायबर हबमध्ये तुमचे स्वागत आहे. आज आपण काय काम करणार आहोत?";
        } else if (lowerText.includes("hindi") || lowerText.includes("हिंदी") || lowerText.includes("तुम कौन हो")) {
            reply = "नमस्ते बॉस! मैं स्विती हूँ, आपकी पर्सनल AI असिस्टेंट। मैं आपके सारे काम चुटकियों में संभाल सकती हूँ।";
        } else if (lowerText.includes("hello") || lowerText.includes("hi")) {
            reply = "Hello Boss! Ready to process neural commands. What is our objective today?";
        }

        appendMessage(reply, "ai");
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }

    // Webkit speech integration layer architecture module 
    if ('webkitSpeechRecognition' in window || 'speechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.speechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            isRecording = true;
            voiceBtn.classList.add("active");
            userInput.placeholder = "Listening...";
        };

        recognition.onerror = () => { stopVoicePipeline(); };
        recognition.onend = () => { stopVoicePipeline(); };

        recognition.onresult = (event) => {
            userInput.value = event.results[0][0].transcript;
        };

        voiceBtn.addEventListener("click", () => {
            if (!isRecording) {
                recognition.start();
            } else {
                recognition.stop();
            }
        });
    }

    function stopVoicePipeline() {
        isRecording = false;
        voiceBtn.classList.remove("active");
        userInput.placeholder = "Type your message here...";
    }
});
