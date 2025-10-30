# Audio Transcriber

A minimalistic web application for transcribing audio files using the Deepgram API.

## Features

- Simple, clean interface
- Upload audio files in various formats
- Real-time transcription using Deepgram
- Copy transcription to clipboard
- Responsive design

## Setup

1. Get a Deepgram API key:
   - Sign up at [Deepgram](https://deepgram.com/)
   - Create a new project and generate an API key

2. Open the application:
   - Simply open `index.html` in your web browser
   - No build process or server required

## Usage

1. Click "Choose Audio File" to select an audio file from your computer
2. Enter your Deepgram API key in the password field
3. Click "Transcribe" to start the transcription process
4. Once complete, the transcription will appear below
5. Click "Copy to Clipboard" to copy the transcription

## Supported Audio Formats

Deepgram supports various audio formats including:
- MP3
- WAV
- FLAC
- OGG
- M4A
- And many more

## Security Note

Your API key is never stored and is only used for the current transcription request. For production use, consider implementing a backend service to securely handle API keys.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Deepgram API
