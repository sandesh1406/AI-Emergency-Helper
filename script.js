const inputField = document.getElementById('emergency-input');
const helpBtn = document.getElementById('help-btn');
const micBtn = document.getElementById('mic-btn');
const loadingDiv = document.getElementById('loading');
const responseBox = document.getElementById('response-box');
const responseText = document.getElementById('response-text');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        inputField.value = transcript;
        micBtn.innerHTML = "🎤 Voice Input";
    };
    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        micBtn.innerHTML = "🎤 Voice Input";
    };
    recognition.onend = () => {
        micBtn.innerHTML = "🎤 Voice Input";
    };
} else {
    micBtn.style.display = 'none';
    console.warn("Speech Recognition API not supported in this browser.");
}

micBtn.addEventListener('click', () => {
    if (recognition) {
        inputField.value = "";
        micBtn.innerHTML = "🔴 Listening...";
        recognition.start();
    }
});

helpBtn.addEventListener('click', async () => {
    const emergencyText = inputField.value.trim();
    if (!emergencyText) {
        alert("Please describe the emergency first.");
        return;
    }
    loadingDiv.classList.remove('hidden');
    responseBox.classList.add('hidden');
    helpBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/get-help', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emergency: emergencyText })
        });
        const data = await response.json();
        responseText.textContent = data.advice;
        responseBox.classList.remove('hidden');
    } catch (error) {
        console.error("Error:", error);
        responseText.textContent = "Stay calm, call emergency services, move to safe place, help others, wait for help";
        responseBox.classList.remove('hidden');
    } finally {
        loadingDiv.classList.add('hidden');
        helpBtn.disabled = false;
    }
});
