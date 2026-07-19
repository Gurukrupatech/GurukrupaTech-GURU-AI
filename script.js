document.addEventListener("DOMContentLoaded", () => {
    // Pipeline Configuration Matrix Architecture
    const DOM = {
        appLoader: document.getElementById("appLoader"),
        menuBtn: document.getElementById("menuBtn"),
        closeSidebarBtn: document.getElementById("closeSidebarBtn"),
        sidebar: document.getElementById("sidebar"),
        chatWindow: document.getElementById("chatWindow"),
        inputForm: document.getElementById("inputForm"),
        userInput: document.getElementById("userInput"),
        voiceBtn: document.getElementById("voiceBtn"),
        voiceIcon: document.getElementById("voiceIcon"),
        fileUpload: document.getElementById("fileUpload"),
        imageUpload: document.getElementById("imageUpload"),
        filePreviewBar: document.getElementById("filePreviewBar"),
        previewFileName: document.getElementById("previewFileName"),
        removeFileBtn: document.getElementById("removeFileBtn"),
        clearChatBtn: document.getElementById("clearChatBtn"),
        newChatBtn: document.getElementById("newChatBtn"),
        chatHistoryList: document.getElementById("chatHistoryList"),
        settingsBtn: document.getElementById("settingsBtn"),
        settingsModal: document.getElementById("settingsModal"),
        closeModalBtn: document.getElementById("closeModalBtn")
    };

    // Global Memory Cache Matrix State
    let processingState = {
        isRecording: false,
        attachedFile: null,
        attachedImageType: null,
        attachedImageSrc: null,
        recognitionPipeline: null
    };

    // System Startup Sequence Animation Mask
    setTimeout(() => {
        DOM.appLoader.style.opacity = "0";
        setTimeout(() => DOM.appLoader.classList.add("id-hidden"), 600);
    }, 2000);

    // Dynamic Element Sizing Autogrow Subroutine
    DOM.userInput.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight - 16) + "px";
    });

    // Device Responsive Overlay Toggle Subroutines
    DOM.menuBtn.addEventListener("click", () => DOM.sidebar.classList.add("open"));
    DOM.closeSidebarBtn.addEventListener("click", () => DOM.sidebar.classList.remove("open"));

    // Modal Configuration Interface Hooks
    DOM.settingsBtn.addEventListener("click", () => DOM.settingsModal.classList.remove("id-hidden"));
    DOM.closeModalBtn.addEventListener("click", () => DOM.settingsModal.classList.add("id-hidden"));
    window.addEventListener("click", (e) => {
        if (e.target === DOM.settingsModal) DOM.settingsModal.classList.add("id-hidden");
    });

    // Media and Document File Pipeline Assets Integrator
    DOM.fileUpload.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            processingState.attachedFile = e.target.files[0];
            processingState.attachedImageType = "document";
            DOM.previewFileName.textContent = processingState.attachedFile.name;
            DOM.filePreviewBar.classList.remove("id-hidden");
        }
    });

    DOM.imageUpload.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            processingState.attachedFile = file;
            processingState.attachedImageType = "image";
            
            const reader = new FileReader();
            reader.onload = (event) => {
                processingState.attachedImageSrc = event.target.result;
                DOM.previewFileName.textContent = `Image: ${file.name}`;
                DOM.filePreviewBar.classList.remove("id-hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    DOM.removeFileBtn.addEventListener("click", () => {
        clearAttachmentPipeline();
    });

    function clearAttachmentPipeline() {
        processingState.attachedFile = null;
        processingState.attachedImageType = null;
        processingState.attachedImageSrc = null;
        DOM.fileUpload.value = "";
        DOM.imageUpload.value = "";
        DOM.filePreviewBar.classList.add("id-hidden");
    }

    // Terminal Screen Flush Pipeline
    DOM.clearChatBtn.addEventListener("click", () => {
        DOM.chatWindow.innerHTML = "";
        renderSystemGreeting();
    });

    // History & Sessions Allocation Subroutines
    DOM.newChatBtn.addEventListener("click", () => {
        DOM.chatWindow.innerHTML = "";
        renderSystemGreeting();
        
        const timestamp = Date.now();
        const li = document.createElement("li");
        li.className = "history-item active";
        li.setAttribute("data-id", timestamp);
        li.innerHTML = `
            <i class="fa-regular fa-message"></i>
            <span class="history-text">Sync-Session-${Math.floor(Math.random() * 900 + 100)}</span>
            <button class="delete-history-btn"><i class="fa-solid fa-trash-can"></i></button>
        `;
        
        document.querySelectorAll(".history-item").forEach(item => item.classList.remove("active"));
        DOM.chatHistoryList.prepend(li);
        attachHistoryClickListeners();
        if(window.innerWidth <= 992) DOM.sidebar.classList.remove("open");
    });

    function attachHistoryClickListeners() {
        document.querySelectorAll(".history-item").forEach(item => {
            item.onclick = function(e) {
                if (e.target.closest(".delete-history-btn")) {
                    this.remove();
                    return;
                }
                document.querySelectorAll(".history-item").forEach(i => i.classList.remove("active"));
                this.classList.add("active");
                if(window.innerWidth <= 992) DOM.sidebar.classList.remove("open");
            };
        });
    }
    attachHistoryClickListeners();

    // Default System Greeting View Render Engine
    function renderSystemGreeting() {
        const greetingHTML = `
            <div class="message ai-message system-init">
                <div class="message-avatar">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=256&h=256" alt="Swity AI">
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        <p class="greeting-text">Hello Boss! 👋 Welcome back to GurukrupaTech. I'm Swity, your personal AI Assistant.</p>
                        <p>System fully operational. Ready to deploy solutions in English, Marathi (मराठी), and Hindi (हिंदी). How can I assist your workflow today?</p>
                    </div>
                    <span class="message-time">Just Now</span>
                </div>
            </div>
        `;
        DOM.chatWindow.insertAdjacentHTML("beforeend", greetingHTML);
    }

    // Command Transmit Form Processor Subroutine
    DOM.inputForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = DOM.userInput.value.trim();
        if (!text && !processingState.attachedFile) return;

        // Render User Transmission Packet
        renderUserMessage(text, processingState.attachedImageType, processingState.attachedImageSrc);
        
        // Reset Inputs Immediately
        DOM.userInput.value = "";
        DOM.userInput.style.height = "auto";
        
        // Clear attachments array
        const capturedType = processingState.attachedImageType;
        const capturedFile = processingState.attachedFile;
        clearAttachmentPipeline();

        // Trigger AI Mock Response Sequence Processing Engine
        renderAIResponseSequence(text, capturedType, capturedFile);
    });

    function renderUserMessage(text, fileType, imgSrc) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let attachmentMarkup = "";

        if (fileType === "image" && imgSrc) {
            attachmentMarkup = `<img src="${imgSrc}" class="attached-image" alt="Uploaded asset">`;
        } else if (fileType === "document") {
            attachmentMarkup = `<div class="file-preview-bar"><i class="fa-solid fa-file-invoice"></i>&nbsp;&nbsp;<span>${DOM.previewFileName.textContent}</span></div>`;
        }

        const messageHTML = `
            <div class="message user-message">
                <div class="message-avatar">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256" alt="User Avatar">
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        ${attachmentMarkup}
                        ${text ? `<p>${escapeHTML(text)}</p>` : ""}
                    </div>
                    <span class="message-time">${timeStr}</span>
                </div>
            </div>
        `;
        DOM.chatWindow.insertAdjacentHTML("beforeend", messageHTML);
        autoScrollChatWindow();
    }

    function renderAIResponseSequence(userText, fileType, fileAsset) {
        const uniqueId = "ai-node-" + Date.now();
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const aiSkeletonHTML = `
            <div class="message ai-message" id="${uniqueId}">
                <div class="message-avatar">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=256&h=256" alt="Swity AI">
                </div>
                <div class="message-content">
                    <div class="thinking-container">
                        <i class="fa-solid fa-circle-notch"></i>
                        <span>Swity Matrix Thinking...</span>
                    </div>
                    <div class="message-bubble">
                        <div class="typing-animation">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                    </div>
                    <span class="message-time">${timeStr}</span>
                </div>
            </div>
        `;
        
        DOM.chatWindow.insertAdjacentHTML("beforeend", aiSkeletonHTML);
        autoScrollChatWindow();

        // Generate Context-Aware Smart Simulation Logic responses
        setTimeout(() => {
            const targetBubble = document.getElementById(uniqueId).querySelector(".message-bubble");
            const targetThinking = document.getElementById(uniqueId).querySelector(".thinking-container");
            
            if (targetThinking) targetThinking.remove();
            
            let finalResponseHTML = "";
            const lowerText = userText.toLowerCase();

            // Language processing router rules mock simulation
            if (lowerText.includes("marathi") || lowerText.includes("मराठी") || lowerText.includes("कशी आहेस")) {
                finalResponseHTML = `<p>मी उत्तम आहे, बॉस! GurukrupaTech च्या महाजालात आपले स्वागत आहे. मी आपल्याला तांत्रिक सहाय्य पुरवण्यासाठी पूर्णपणे सज्ज आहे. सांगा, आज काय काम करायचे आहे?</p>`;
            } else if (lowerText.includes("hindi") || lowerText.includes("हिंदी") || lowerText.includes("तुम कौन हो")) {
                finalResponseHTML = `<p>नमस्ते बॉस! GurukrupaTech में आपका स्वागत है। मैं स्विती हूँ, आपकी पर्सनल एआई असिस्टेंट। मैं आपकी सभी तकनीकी समस्याओं का समाधान हिंदी, मराठी और अंग्रेजी में कर सकती हूँ।</p>`;
            } else if (lowerText.includes("code") || lowerText.includes("program") || lowerText.includes("html")) {
                finalResponseHTML = `
                    <p>Subroutine deployment successful. Here is the production-ready responsive flex layout structure module requested for your project infrastructure architecture pipeline:</p>
                    <div class="code-container">
                        <div class="code-header">
                            <span class="code-lang">html</span>
                            <button class="copy-code-btn"><i class="fa-regular fa-copy"></i> Copy Code</button>
                        </div>
                        <div class="code-block">&lt;div class="cyber-flex-container"&gt;\n  &lt;div class="node-alpha"&gt;Matrix A&lt;/div&gt;\n  &lt;div class="node-beta"&gt;Matrix B&lt;/div&gt;\n&lt;/div&gt;</div>
                    </div>
                `;
            } else if (fileType === "image") {
                finalResponseHTML = `<p>Image data packet accepted into neural buffer matrix channel. Asset specifications matched. Resolving enhancement filters and metadata profiling matrix nodes successfully for <b>${fileAsset.name}</b>.</p>`;
            } else if (fileType === "document") {
                finalResponseHTML = `<p>Document system stream indexed successfully. Parsed content matrix verification protocol returned structural status 200 OK for verification target <b>${fileAsset.name}</b>.</p>`;
            } else {
                finalResponseHTML = `<p>Command recognized by Swity Core Processor Module. Data telemetry parameters synchronized with GurukrupaTech server matrix nodes cluster. Processing pipeline operating normally.</p>`;
            }

            targetBubble.innerHTML = finalResponseHTML;
            attachCodeCopyHandlers();
            autoScrollChatWindow();
        }, 2200);
    }

    // Automatic Navigation Viewport Control Logic
    function autoScrollChatWindow() {
        DOM.chatWindow.scrollTo({
            top: DOM.chatWindow.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Internal Utility Code Block Copy Subroutines 
    function attachCodeCopyHandlers() {
        document.querySelectorAll(".copy-code-btn").forEach(btn => {
            btn.onclick = function() {
                const codeText = this.closest(".code-container").querySelector(".code-block").innerText;
                navigator.clipboard.writeText(codeText).then(() => {
                    const originalHTML = this.innerHTML;
                    this.innerHTML = `<i class="fa-solid fa-check text-neon-blue"></i> <span style="color:#00f2fe">Copied!</span>`;
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 2000);
                });
            };
        });
    }

    // HTML Component Data Sanitizer Utility Guard
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // Web Audio Native Webkit Speech API Engine Integration Model Layer
    if ('webkitSpeechRecognition' in window || 'speechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.speechRecognition;
        processingState.recognitionPipeline = new SpeechRecognition();
        processingState.recognitionPipeline.continuous = false;
        processingState.recognitionPipeline.interimResults = false;
        processingState.recognitionPipeline.lang = "en-US";

        processingState.recognitionPipeline.onstart = () => {
            processingState.isRecording = true;
            DOM.voiceIcon.className = "fa-solid fa-microphone-lines animate-flicker";
            DOM.voiceBtn.classList.add("recording");
            DOM.userInput.placeholder = "Listening to vocal matrices command stream...";
        };

        processingState.recognitionPipeline.onerror = () => {
            stopVoiceRecognitionPipeline();
        };

        processingState.recognitionPipeline.onend = () => {
            stopVoiceRecognitionPipeline();
        };

        processingState.recognitionPipeline.onresult = (event) => {
            const resultText = event.results[0][0].transcript;
            DOM.userInput.value = resultText;
            DOM.userInput.style.height = (DOM.userInput.scrollHeight - 16) + 'px';
        };

        DOM.voiceBtn.addEventListener("click", () => {
            if (!processingState.isRecording) {
                processingState.recognitionPipeline.start();
            } else {
                processingState.recognitionPipeline.stop();
            }
        });
    } else {
        DOM.voiceBtn.style.opacity = "0.4";
        DOM.voiceBtn.title = "Speech Pipeline API Unassigned by Client browser";
    }

    function stopVoiceRecognitionPipeline() {
        processingState.isRecording = false;
        DOM.voiceIcon.className = "fa-solid fa-microphone";
        DOM.voiceBtn.classList.remove("recording");
        DOM.userInput.placeholder = "Command Swity AI...";
    }
});

