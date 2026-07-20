document.getElementById('ask-btn').addEventListener('click', startAIResponse);

// 'Enter' की दाबल्यावरही चालण्यासाठी
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'key' || e.key === 'Enter') {
        startAIResponse();
    }
});

function startAIResponse() {
    const userInput = document.getElementById('user-input').value;
    const responseText = document.getElementById('response-text');
    const avatar = document.getElementById('swity-avatar');

    if (userInput.trim() === "") return;

    // इथे तुम्ही तुमची API किंवा कस्टमाइज्ड उत्तरे जोडू शकता
    // सध्या उदाहरणासाठी एक फिक्स उत्तर दिले आहे:
    const reply = "मी तुमची मदत करण्यास तयार आहे! तुम्ही विचारलेला प्रश्न मला समजला.";
    
    responseText.innerText = reply;
    document.getElementById('user-input').value = ""; // इनपुट क्लिअर करा

    // बोलणे सुरू करा (Web Speech API)
    const speech = new SpeechSynthesisUtterance();
    speech.text = reply;
    speech.lang = 'mr-IN'; // मराठी आवाजासाठी (तुमच्या सिस्टीममध्ये सपोर्ट हवा)
    speech.rate = 1.0;

    // जेव्हा Swity बोलू लागेल, तेव्हा तिचा चेहरा/इमेज हलवण्यासाठी 'talking' क्लास जोडा
    speech.onstart = function() {
        avatar.classList.add('talking');
    };

    // बोलणे संपल्यावर हालचाल थांबवा
    speech.onend = function() {
        avatar.classList.remove('talking');
    };

    // सिस्टीमद्वारे आवाज प्ले करा
    window.speechSynthesis.speak(speech);
}
 
