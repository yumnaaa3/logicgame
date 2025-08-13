// Game state
let gameState = {
    currentGame: null,
    currentLevel: 1,
    currentScore: 0,
    totalScore: 0,
    soundEnabled: true,
    gameProgress: {
        'shape-matcher': { level: 0, score: 0, completed: false },
        'number-sequence': { level: 0, score: 0, completed: false },
        'color-mixer': { level: 0, score: 0, completed: false },
        'pattern-builder': { level: 0, score: 0, completed: false }
    }
};

// Game definitions
const games = {
    'shape-matcher': {
        title: 'Pencocok Bentuk',
        description: 'Cocokkan bentuk dan warna',
        icon: '🔴🔵🟡',
        createGame: createShapeMatcherGame
    },
    'number-sequence': {
        title: 'Urutan Angka',
        description: 'Susun angka dengan benar',
        icon: '🔢📊',
        createGame: createNumberSequenceGame
    },
    'color-mixer': {
        title: 'Pencampur Warna',
        description: 'Campur warna untuk hasil yang tepat',
        icon: '🎨🌈',
        createGame: createColorMixerGame
    },
    'pattern-builder': {
        title: 'Pembuat Pola',
        description: 'Lanjutkan pola yang ada',
        icon: '🔶🔷🔸',
        createGame: createPatternBuilderGame
    }
};

// Shape definitions for shape matcher
const shapes = [
    { emoji: '🔴', name: 'lingkaran merah', color: '#ff6b6b' },
    { emoji: '🔵', name: 'lingkaran biru', color: '#4ecdc4' },
    { emoji: '🟡', name: 'lingkaran kuning', color: '#ffe66d' },
    { emoji: '🟢', name: 'lingkaran hijau', color: '#95e1d3' },
    { emoji: '🟣', name: 'lingkaran ungu', color: '#a8a4e6' },
    { emoji: '🟠', name: 'lingkaran oranye', color: '#ffa726' },
    { emoji: '⭐', name: 'bintang', color: '#ffd54f' },
    { emoji: '💎', name: 'berlian', color: '#81c784' },
    { emoji: '❤️', name: 'hati', color: '#f06292' },
    { emoji: '🌟', name: 'kilau', color: '#ffb74d' },
    { emoji: '🎈', name: 'balon', color: '#ba68c8' },
    { emoji: '🎪', name: 'tenda', color: '#4db6ac' }
];

// Sound effects using Web Audio API
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playCorrectSound() {
        if (!gameState.soundEnabled || !this.audioContext) return;
        
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator1.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
        oscillator1.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1);
        oscillator1.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2);
        oscillator1.frequency.setValueAtTime(1046.50, this.audioContext.currentTime + 0.3);
        
        oscillator2.frequency.setValueAtTime(392.00, this.audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(493.88, this.audioContext.currentTime + 0.1);
        oscillator2.frequency.setValueAtTime(587.33, this.audioContext.currentTime + 0.2);
        oscillator2.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.4);
        oscillator2.stop(this.audioContext.currentTime + 0.4);
    }

    playIncorrectSound() {
        if (!gameState.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(196, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    playLevelUpSound() {
        if (!gameState.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1046.50, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }

    playCrownSound() {
        if (!gameState.soundEnabled || !this.audioContext) return;
        
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Crown achievement melody
        oscillator1.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
        oscillator1.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.2);
        oscillator1.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.4);
        oscillator1.frequency.setValueAtTime(1046.50, this.audioContext.currentTime + 0.6);
        oscillator1.frequency.setValueAtTime(1318.51, this.audioContext.currentTime + 0.8);
        
        oscillator2.frequency.setValueAtTime(392.00, this.audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(493.88, this.audioContext.currentTime + 0.2);
        oscillator2.frequency.setValueAtTime(587.33, this.audioContext.currentTime + 0.4);
        oscillator2.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.6);
        oscillator2.frequency.setValueAtTime(987.77, this.audioContext.currentTime + 0.8);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
        
        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 1.0);
        oscillator2.stop(this.audioContext.currentTime + 1.0);
    }
}

// Initialize sound manager
const soundManager = new SoundManager();

// DOM elements
const gameSelection = document.getElementById('game-selection');
const gamePlay = document.getElementById('game-play');
const gameContent = document.getElementById('game-content');
const messageElement = document.getElementById('message');
const totalScoreElement = document.getElementById('total-score');
const crownsElement = document.getElementById('crowns');
const currentGameTitle = document.getElementById('current-game-title');
const currentLevel = document.getElementById('current-level');
const currentScore = document.getElementById('current-score');

// Initialize the game
function initGame() {
    loadGameProgress();
    updateDisplay();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Game selection
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => selectGame(card.dataset.game));
    });

    // Navigation
    document.getElementById('back-to-menu').addEventListener('click', showGameSelection);
    document.getElementById('reset-all-btn').addEventListener('click', resetAllGames);
    
    // Sound toggles
    document.getElementById('sound-toggle').addEventListener('click', toggleSound);
    document.getElementById('sound-toggle-game').addEventListener('click', toggleSound);
    
    // Game controls
    document.getElementById('new-game-btn').addEventListener('click', restartCurrentGame);
}

// Select a game
function selectGame(gameId) {
    gameState.currentGame = gameId;
    gameState.currentLevel = gameState.gameProgress[gameId].level + 1;
    gameState.currentScore = gameState.gameProgress[gameId].score;
    
    showGamePlay();
    games[gameId].createGame();
}

// Show game selection screen
function showGameSelection() {
    gameSelection.style.display = 'block';
    gamePlay.style.display = 'none';
    updateDisplay();
}

// Show game play screen
function showGamePlay() {
    gameSelection.style.display = 'none';
    gamePlay.style.display = 'block';
    
    currentGameTitle.textContent = games[gameState.currentGame].title;
    updateGameDisplay();
}

// Update main display
function updateDisplay() {
    totalScoreElement.textContent = gameState.totalScore;
    crownsElement.textContent = `👑 ${getTotalCrowns()}`;
    
    // Update game cards
    Object.keys(gameState.gameProgress).forEach(gameId => {
        const progress = gameState.gameProgress[gameId];
        const card = document.querySelector(`[data-game="${gameId}"]`);
        const levelFill = card.querySelector('.level-fill');
        const levelText = card.querySelector('.level-text');
        const crownStatus = card.querySelector('.crown-status');
        
        levelFill.style.width = `${(progress.level / 5) * 100}%`;
        levelText.textContent = `Level ${progress.level}/5`;
        
        if (progress.completed) {
            crownStatus.classList.add('earned');
        } else {
            crownStatus.classList.remove('earned');
        }
    });
}

// Update game display
function updateGameDisplay() {
    currentLevel.textContent = `Level ${gameState.currentLevel}`;
    currentScore.textContent = `Skor: ${gameState.currentScore}`;
}

// Get total crowns
function getTotalCrowns() {
    return Object.values(gameState.gameProgress).filter(progress => progress.completed).length;
}

// Save game progress
function saveGameProgress() {
    localStorage.setItem('gameProgress', JSON.stringify(gameState.gameProgress));
    localStorage.setItem('totalScore', gameState.totalScore.toString());
}

// Load game progress
function loadGameProgress() {
    const savedProgress = localStorage.getItem('gameProgress');
    const savedScore = localStorage.getItem('totalScore');
    
    if (savedProgress) {
        gameState.gameProgress = JSON.parse(savedProgress);
    }
    
    if (savedScore) {
        gameState.totalScore = parseInt(savedScore);
    }
}

// Handle correct answer
function handleCorrectAnswer() {
    gameState.currentScore += 10 * gameState.currentLevel;
    gameState.gameProgress[gameState.currentGame].score = gameState.currentScore;
    gameState.totalScore += 10 * gameState.currentLevel;
    
    soundManager.playCorrectSound();
    createConfetti();
    
    showMessage('🎉 Bagus! Jawaban benar! 🎉', 'correct');
    
    // Check for level completion
    if (gameState.currentScore >= gameState.currentLevel * 50) {
        completeLevel();
    }
    
    updateGameDisplay();
    updateDisplay();
    saveGameProgress();
}

// Handle incorrect answer
function handleIncorrectAnswer() {
    soundManager.playIncorrectSound();
    showMessage('😊 Coba lagi! Kamu pasti bisa! 😊', 'incorrect');
}

// Complete level
function completeLevel() {
    gameState.gameProgress[gameState.currentGame].level = gameState.currentLevel;
    
    if (gameState.currentLevel === 5) {
        // Game completed!
        gameState.gameProgress[gameState.currentGame].completed = true;
        soundManager.playCrownSound();
        showMessage('👑 SELAMAT! Kamu mendapatkan mahkota! 👑', 'correct');
        setTimeout(() => {
            createCrownConfetti();
            setTimeout(() => showGameSelection(), 3000);
        }, 2000);
    } else {
        // Level up
        gameState.currentLevel++;
        soundManager.playLevelUpSound();
        showMessage(`🎊 Level Up! Sekarang level ${gameState.currentLevel}! 🎊`, 'correct');
        setTimeout(() => {
            games[gameState.currentGame].createGame();
        }, 2000);
    }
    
    updateGameDisplay();
    updateDisplay();
    saveGameProgress();
}

// Show message
function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = `message show ${type}`;
}

// Toggle sound
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    const buttons = document.querySelectorAll('#sound-toggle, #sound-toggle-game');
    buttons.forEach(btn => {
        btn.textContent = gameState.soundEnabled ? '🔊 Suara Aktif' : '🔇 Suara Mati';
    });
    
    if (gameState.soundEnabled && soundManager.audioContext && soundManager.audioContext.state === 'suspended') {
        soundManager.audioContext.resume();
    }
}

// Reset all games
function resetAllGames() {
    if (confirm('Yakin ingin reset semua progress game?')) {
        Object.keys(gameState.gameProgress).forEach(gameId => {
            gameState.gameProgress[gameId] = { level: 0, score: 0, completed: false };
        });
        gameState.totalScore = 0;
        saveGameProgress();
        updateDisplay();
        showMessage('🔄 Semua game telah direset! 🔄', 'correct');
    }
}

// Restart current game
function restartCurrentGame() {
    gameState.currentScore = 0;
    gameState.currentLevel = 1;
    games[gameState.currentGame].createGame();
    showMessage('🎮 Game baru dimulai! 🎮', 'correct');
}

// Create confetti effect
function createConfetti() {
    const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#ff9a9e', '#fecfef'];
    const confettiEmojis = ['🌟', '⭐', '💎', '❤️', '🎈', '🎪', '🔴', '🔵', '🟡', '🟢'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-20px';
            confetti.style.fontSize = Math.random() * 20 + 15 + 'px';
            confetti.style.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.userSelect = 'none';
            confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
            
            const animation = confetti.animate([
                { 
                    transform: 'translateY(0px) rotate(0deg)',
                    opacity: 1
                },
                { 
                    transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`,
                    opacity: 0
                }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            document.body.appendChild(confetti);
            
            animation.onfinish = () => {
                confetti.remove();
            };
        }, i * 100);
    }
}

// Create crown confetti effect
function createCrownConfetti() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-20px';
            confetti.style.fontSize = Math.random() * 30 + 20 + 'px';
            confetti.style.color = '#ffd700';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.userSelect = 'none';
            confetti.textContent = '👑';
            
            const animation = confetti.animate([
                { 
                    transform: 'translateY(0px) rotate(0deg) scale(1)',
                    opacity: 1
                },
                { 
                    transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg) scale(1.5)`,
                    opacity: 0
                }
            ], {
                duration: Math.random() * 4000 + 3000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            document.body.appendChild(confetti);
            
            animation.onfinish = () => {
                confetti.remove();
            };
        }, i * 150);
    }
}

// Game 1: Shape Matcher
function createShapeMatcherGame() {
    const targetIndex = Math.floor(Math.random() * shapes.length);
    const targetShape = shapes[targetIndex];
    
    gameContent.innerHTML = `
        <div class="target-area">
            <h2>Cari bentuk ini:</h2>
            <div class="target-shape" style="background-color: ${targetShape.color}">${targetShape.emoji}</div>
        </div>
        <div class="choices-area">
            <h2>Klik bentuk yang sama:</h2>
            <div class="choices-grid">
                ${generateShapeChoices(targetShape)}
            </div>
        </div>
    `;
    
    // Add click handlers
    document.querySelectorAll('.choice-shape').forEach(choice => {
        choice.addEventListener('click', () => {
            const selectedEmoji = choice.textContent;
            if (selectedEmoji === targetShape.emoji) {
                choice.classList.add('correct');
                handleCorrectAnswer();
            } else {
                choice.classList.add('incorrect');
                handleIncorrectAnswer();
            }
            
            setTimeout(() => {
                choice.classList.remove('correct', 'incorrect');
                createShapeMatcherGame();
            }, 1500);
        });
    });
}

function generateShapeChoices(targetShape) {
    let choices = [...shapes];
    
    // Shuffle and take 6
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    
    choices = choices.slice(0, 6);
    
    // Ensure target is included
    if (!choices.includes(targetShape)) {
        choices[Math.floor(Math.random() * choices.length)] = targetShape;
    }
    
    // Shuffle again
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    
    return choices.map(shape => `
        <div class="choice-shape" style="background-color: ${shape.color}">${shape.emoji}</div>
    `).join('');
}

// Game 2: Number Sequence
function createNumberSequenceGame() {
    const sequenceLength = Math.min(3 + gameState.currentLevel, 8);
    const sequence = generateNumberSequence(sequenceLength);
    const shuffledSequence = [...sequence].sort(() => Math.random() - 0.5);
    
    gameContent.innerHTML = `
        <div class="target-area">
            <h2>Urutan yang benar:</h2>
            <div class="sequence-display">
                ${sequence.map(num => `<span class="sequence-number">${num}</span>`).join('')}
            </div>
        </div>
        <div class="choices-area">
            <h2>Susun angka dengan urutan yang benar:</h2>
            <div class="sequence-choices">
                ${shuffledSequence.map(num => `
                    <div class="sequence-choice" data-number="${num}">${num}</div>
                `).join('')}
            </div>
            <div class="sequence-result"></div>
        </div>
    `;
    
    let selectedNumbers = [];
    
    document.querySelectorAll('.sequence-choice').forEach(choice => {
        choice.addEventListener('click', () => {
            if (!choice.classList.contains('selected')) {
                choice.classList.add('selected');
                selectedNumbers.push(parseInt(choice.dataset.number));
                
                const resultDiv = document.querySelector('.sequence-result');
                resultDiv.innerHTML = selectedNumbers.map(num => `<span class="result-number">${num}</span>`).join('');
                
                if (selectedNumbers.length === sequence.length) {
                    // Check if correct
                    const isCorrect = selectedNumbers.every((num, index) => num === sequence[index]);
                    
                    if (isCorrect) {
                        handleCorrectAnswer();
                    } else {
                        handleIncorrectAnswer();
                    }
                    
                    setTimeout(() => {
                        selectedNumbers = [];
                        document.querySelectorAll('.sequence-choice').forEach(c => c.classList.remove('selected'));
                        resultDiv.innerHTML = '';
                        createNumberSequenceGame();
                    }, 2000);
                }
            }
        });
    });
}

function generateNumberSequence(length) {
    const sequence = [];
    let start = Math.floor(Math.random() * 10) + 1;
    
    for (let i = 0; i < length; i++) {
        sequence.push(start + i);
    }
    
    return sequence;
}

// Game 3: Color Mixer
function createColorMixerGame() {
    const colors = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    const mixColors = colors.filter(c => c !== targetColor).slice(0, 4);
    mixColors.push(targetColor);
    
    // Shuffle mix colors
    for (let i = mixColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mixColors[i], mixColors[j]] = [mixColors[j], mixColors[i]];
    }
    
    gameContent.innerHTML = `
        <div class="target-area">
            <h2>Buat warna ini:</h2>
            <div class="target-color">${targetColor}</div>
        </div>
        <div class="choices-area">
            <h2>Pilih warna yang tepat:</h2>
            <div class="color-choices">
                ${mixColors.map(color => `
                    <div class="color-choice" data-color="${color}">${color}</div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.querySelectorAll('.color-choice').forEach(choice => {
        choice.addEventListener('click', () => {
            const selectedColor = choice.dataset.color;
            
            if (selectedColor === targetColor) {
                choice.classList.add('correct');
                handleCorrectAnswer();
            } else {
                choice.classList.add('incorrect');
                handleIncorrectAnswer();
            }
            
            setTimeout(() => {
                choice.classList.remove('correct', 'incorrect');
                createColorMixerGame();
            }, 1500);
        });
    });
}

// Game 4: Pattern Builder
function createPatternBuilderGame() {
    const patterns = [
        { sequence: ['🔶', '🔷', '🔶', '🔷'], next: '🔶' },
        { sequence: ['⭐', '🌟', '⭐', '🌟'], next: '⭐' },
        { sequence: ['💎', '❤️', '💎', '❤️'], next: '💎' },
        { sequence: ['🎈', '🎪', '🎈', '🎪'], next: '🎈' },
        { sequence: ['🔴', '🔵', '🟡', '🔴'], next: '🔵' }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const options = [pattern.next, ...generateRandomOptions(pattern.next, 3)];
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    gameContent.innerHTML = `
        <div class="target-area">
            <h2>Lanjutkan pola ini:</h2>
            <div class="pattern-display">
                ${pattern.sequence.map(item => `<span class="pattern-item">${item}</span>`).join('')}
                <span class="pattern-question">?</span>
            </div>
        </div>
        <div class="choices-area">
            <h2>Pilih yang tepat:</h2>
            <div class="pattern-choices">
                ${options.map(option => `
                    <div class="pattern-choice" data-option="${option}">${option}</div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.querySelectorAll('.pattern-choice').forEach(choice => {
        choice.addEventListener('click', () => {
            const selectedOption = choice.dataset.option;
            
            if (selectedOption === pattern.next) {
                choice.classList.add('correct');
                handleCorrectAnswer();
            } else {
                choice.classList.add('incorrect');
                handleIncorrectAnswer();
            }
            
            setTimeout(() => {
                choice.classList.remove('correct', 'incorrect');
                createPatternBuilderGame();
            }, 1500);
        });
    });
}

function generateRandomOptions(correct, count) {
    const allOptions = ['🔶', '🔷', '⭐', '🌟', '💎', '❤️', '🎈', '🎪', '🔴', '🔵', '🟡', '🟢'];
    const options = allOptions.filter(opt => opt !== correct);
    
    const result = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * options.length);
        result.push(options[randomIndex]);
        options.splice(randomIndex, 1);
    }
    
    return result;
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Show welcome message
    setTimeout(() => {
        showMessage('🎮 Selamat datang di Game Logika Anak! 🎮', 'correct');
    }, 500);
});
