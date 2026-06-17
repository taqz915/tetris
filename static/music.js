const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentNote = 0;
let musicInterval = null;
let isMusicPlaying = false;

const notes = {
    E5: 659.25,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    A4: 440.00,
    G4: 392.00,
    F4: 349.23,
    E4: 329.63
};

const korobeinikiMelody = [
    { note: 'E5', duration: 0.4 },
    { note: 'B4', duration: 0.2 },
    { note: 'C5', duration: 0.2 },
    { note: 'D5', duration: 0.4 },
    { note: 'C5', duration: 0.2 },
    { note: 'B4', duration: 0.2 },

    { note: 'A4', duration: 0.4 },
    { note: 'A4', duration: 0.2 },
    { note: 'C5', duration: 0.2 },
    { note: 'E5', duration: 0.4 },
    { note: 'D5', duration: 0.2 },
    { note: 'C5', duration: 0.2 },

    { note: 'B4', duration: 0.6 },
    { note: 'C5', duration: 0.2 },
    { note: 'D5', duration: 0.4 },
    { note: 'E5', duration: 0.4 },

    { note: 'C5', duration: 0.4 },
    { note: 'A4', duration: 0.4 },
    { note: 'A4', duration: 0.4 },
    { note: null, duration: 0.4 },

    { note: null, duration: 0.2 },
    { note: 'D5', duration: 0.4 },
    { note: 'F4', duration: 0.2 },
    { note: 'A4', duration: 0.4 },
    { note: 'G4', duration: 0.2 },
    { note: 'F4', duration: 0.2 },

    { note: 'E4', duration: 0.6 },
    { note: 'C5', duration: 0.2 },
    { note: 'E5', duration: 0.4 },
    { note: 'D5', duration: 0.2 },
    { note: 'C5', duration: 0.2 },

    { note: 'B4', duration: 0.4 },
    { note: 'B4', duration: 0.2 },
    { note: 'C5', duration: 0.2 },
    { note: 'D5', duration: 0.4 },
    { note: 'E5', duration: 0.4 },

    { note: 'C5', duration: 0.4 },
    { note: 'A4', duration: 0.4 },
    { note: 'A4', duration: 0.4 },
    { note: null, duration: 0.4 }
];

function playNote(frequency, duration, startTime) {
    if (!frequency) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.1, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

function playTetrisMusic() {
    if (!isMusicPlaying) return;

    let currentTime = audioContext.currentTime;

    korobeinikiMelody.forEach((noteObj, index) => {
        if (noteObj.note) {
            playNote(notes[noteObj.note], noteObj.duration, currentTime);
        }
        currentTime += noteObj.duration;
    });

    const totalDuration = korobeinikiMelody.reduce((sum, n) => sum + n.duration, 0);
    setTimeout(() => {
        if (isMusicPlaying) {
            playTetrisMusic();
        }
    }, totalDuration * 1000);
}

function startMusic() {
    isMusicPlaying = true;

    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            playTetrisMusic();
        });
    } else {
        playTetrisMusic();
    }
}

function stopMusic() {
    isMusicPlaying = false;
}

document.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });
