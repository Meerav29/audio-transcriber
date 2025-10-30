const audioFileInput = document.getElementById('audioFile');
const fileNameDisplay = document.getElementById('fileName');
const transcribeBtn = document.getElementById('transcribeBtn');
const status = document.getElementById('status');
const resultSection = document.getElementById('resultSection');
const resultBox = document.getElementById('resultBox');
const copyBtn = document.getElementById('copyBtn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

let selectedFile = null;

// Theme toggle functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Initialize theme on page load
initializeTheme();

// Handle file selection
audioFileInput.addEventListener('change', (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
        fileNameDisplay.textContent = selectedFile.name;
    } else {
        fileNameDisplay.textContent = 'No file selected';
    }
});

// Handle transcription
transcribeBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        status.textContent = 'Please select an audio file';
        status.className = 'status error';
        return;
    }

    // Reset UI
    status.textContent = 'Transcribing...';
    status.className = 'status';
    resultSection.classList.remove('visible');
    transcribeBtn.disabled = true;

    try {
        // Call our Vercel API route instead of Deepgram directly
        const response = await fetch('/api/transcribe', {
            method: 'POST',
            headers: {
                'Content-Type': selectedFile.type || 'application/octet-stream',
            },
            body: selectedFile
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Extract transcription
        const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript;

        if (transcript) {
            resultBox.textContent = transcript;
            resultSection.classList.add('visible');
            status.textContent = 'Transcription completed successfully!';
            status.className = 'status success';
        } else {
            throw new Error('No transcription found in the response');
        }

    } catch (error) {
        console.error('Transcription error:', error);
        status.textContent = `Error: ${error.message}`;
        status.className = 'status error';
    } finally {
        transcribeBtn.disabled = false;
    }
});

// Handle copy to clipboard
copyBtn.addEventListener('click', async () => {
    const text = resultBox.textContent;
    try {
        await navigator.clipboard.writeText(text);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
    }
});
