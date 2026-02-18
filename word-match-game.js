// ═══════════════════════════════════════════════════════════
// WORD MATCH MINI-GAME
// Memory card game for vocabulary practice after lessons
// ═══════════════════════════════════════════════════════════

class WordMatchGame {
    constructor(vocabulary, onComplete) {
        this.vocabulary = vocabulary;
        this.onComplete = onComplete;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = Date.now();
        this.gameActive = false;
    }

    // Create game overlay
    createGameOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'word-match-game';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.95);
            z-index: 99997;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: fadeIn 0.3s;
            overflow-y: auto;
        `;

        const totalPairs = Math.min(6, this.vocabulary.length); // Max 6 pairs (12 cards)
        const selectedVocab = this.vocabulary.slice(0, totalPairs);

        overlay.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                padding: 30px;
                max-width: 600px;
                width: 100%;
                animation: scaleIn 0.4s;
            ">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 25px;">
                    <div style="font-size: 60px; margin-bottom: 10px;">🎮</div>
                    <h2 style="font-size: 28px; font-weight: 900; color: #1A202C; margin-bottom: 10px;">
                        Word Match Game!
                    </h2>
                    <p style="color: #6B7280; font-size: 16px; margin-bottom: 20px;">
                        Match words with their definitions
                    </p>
                    
                    <!-- Stats -->
                    <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 15px;">
                        <div style="background: #F3F4F6; padding: 10px 20px; border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: 900; color: #667EEA;" id="game-moves">0</div>
                            <div style="font-size: 12px; color: #6B7280; font-weight: 700;">Moves</div>
                        </div>
                        <div style="background: #F3F4F6; padding: 10px 20px; border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: 900; color: #F59E0B;" id="game-timer">0:00</div>
                            <div style="font-size: 12px; color: #6B7280; font-weight: 700;">Time</div>
                        </div>
                        <div style="background: #F3F4F6; padding: 10px 20px; border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: 900; color: #10B981;" id="game-matches">0/${totalPairs}</div>
                            <div style="font-size: 12px; color: #6B7280; font-weight: 700;">Matches</div>
                        </div>
                    </div>

                    <!-- Skip button -->
                    <button onclick="window.wordMatchGame.skip()" style="
                        background: #F3F4F6; color: #6B7280; border: none;
                        padding: 8px 16px; border-radius: 6px; font-size: 13px;
                        font-weight: 700; cursor: pointer; margin-top: 10px;
                    ">
                        Skip Game →
                    </button>
                </div>

                <!-- Game Grid -->
                <div id="game-grid" style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 10px;
                    margin-bottom: 20px;
                ">
                    ${this.generateCards(selectedVocab)}
                </div>
            </div>
        `;

        return overlay;
    }

    // Generate shuffled cards
    generateCards(vocabulary) {
        const cards = [];
        
        // Create pairs
        vocabulary.forEach((item, index) => {
            // Word card
            cards.push({
                id: `word-${index}`,
                pairId: index,
                type: 'word',
                content: item.word,
                matched: false
            });
            
            // Definition card
            cards.push({
                id: `def-${index}`,
                pairId: index,
                type: 'definition',
                content: item.definition,
                matched: false
            });
        });

        // Shuffle
        this.cards = this.shuffleArray(cards);

        // Generate HTML
        return this.cards.map((card, index) => `
            <div 
                class="game-card" 
                data-index="${index}"
                data-pair-id="${card.pairId}"
                style="
                    background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
                    color: white;
                    padding: 20px 15px;
                    border-radius: 12px;
                    min-height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s;
                    transform-style: preserve-3d;
                    position: relative;
                "
                onclick="window.wordMatchGame.flipCard(${index})"
            >
                <div class="card-back" style="
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    backface-visibility: hidden;
                ">
                    ${card.type === 'word' ? '📝' : '💡'}
                </div>
                <div class="card-front" style="
                    backface-visibility: hidden;
                    transform: rotateY(180deg);
                    opacity: 0;
                    line-height: 1.4;
                ">
                    ${card.content}
                </div>
            </div>
        `).join('');
    }

    // Shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Flip card
    flipCard(index) {
        if (!this.gameActive) return;
        if (this.flippedCards.length >= 2) return;
        
        const cardElement = document.querySelector(`.game-card[data-index="${index}"]`);
        if (!cardElement || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
            return;
        }

        // Flip animation
        cardElement.style.transform = 'rotateY(180deg)';
        cardElement.classList.add('flipped');
        cardElement.querySelector('.card-back').style.opacity = '0';
        cardElement.querySelector('.card-front').style.opacity = '1';

        this.flippedCards.push({ index, pairId: this.cards[index].pairId, element: cardElement });

        // Check for match
        if (this.flippedCards.length === 2) {
            this.moves++;
            document.getElementById('game-moves').textContent = this.moves;
            
            setTimeout(() => this.checkMatch(), 800);
        }
    }

    // Check if cards match
    checkMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.pairId === card2.pairId) {
            // Match!
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            card1.element.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            card2.element.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            card1.element.style.transform = 'rotateY(180deg) scale(1.05)';
            card2.element.style.transform = 'rotateY(180deg) scale(1.05)';
            
            this.matchedPairs++;
            document.getElementById('game-matches').textContent = 
                `${this.matchedPairs}/${Math.min(6, this.vocabulary.length)}`;

            // Check if game complete
            if (this.matchedPairs === Math.min(6, this.vocabulary.length)) {
                setTimeout(() => this.gameComplete(), 500);
            }
        } else {
            // No match - flip back
            setTimeout(() => {
                card1.element.style.transform = '';
                card2.element.style.transform = '';
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
                card1.element.querySelector('.card-back').style.opacity = '1';
                card1.element.querySelector('.card-front').style.opacity = '0';
                card2.element.querySelector('.card-back').style.opacity = '1';
                card2.element.querySelector('.card-front').style.opacity = '0';
            }, 500);
        }

        this.flippedCards = [];
    }

    // Game complete
    gameComplete() {
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        this.gameActive = false;

        const overlay = document.getElementById('word-match-game');
        overlay.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                padding: 40px 30px;
                max-width: 400px;
                width: 100%;
                text-align: center;
                animation: scaleIn 0.4s;
            ">
                <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 1s;">🎉</div>
                <h2 style="font-size: 28px; font-weight: 900; color: #1A202C; margin-bottom: 15px;">
                    Perfect Match!
                </h2>
                <p style="color: #6B7280; margin-bottom: 25px; font-size: 16px;">
                    You matched all the words!
                </p>
                
                <div style="
                    background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                    border: 2px solid #FED7AA;
                ">
                    <div style="font-size: 42px; font-weight: 900; color: #F59E0B; margin-bottom: 10px;">
                        +25 XP
                    </div>
                    <div style="color: #92400E; font-weight: 700; margin-bottom: 15px;">Bonus Reward!</div>
                    <div style="display: flex; gap: 15px; justify-content: center; font-size: 14px; color: #78350F;">
                        <div>⚡ ${this.moves} moves</div>
                        <div>⏱️ ${timeTaken}s</div>
                    </div>
                </div>

                <button onclick="window.wordMatchGame.close()" style="
                    background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
                    color: white;
                    border: none;
                    padding: 14px 32px;
                    border-radius: 8px;
                    font-weight: 800;
                    font-size: 16px;
                    cursor: pointer;
                    width: 100%;
                ">
                    Continue →
                </button>
            </div>
        `;
    }

    // Skip game
    skip() {
        this.gameActive = false;
        document.getElementById('word-match-game')?.remove();
        if (this.onComplete) this.onComplete({ skipped: true });
    }

    // Close game
    close() {
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        document.getElementById('word-match-game')?.remove();
        if (this.onComplete) {
            this.onComplete({
                completed: true,
                moves: this.moves,
                time: timeTaken,
                bonusXP: 25
            });
        }
    }

    // Start game
    start() {
        const overlay = this.createGameOverlay();
        document.body.appendChild(overlay);
        
        // Start timer
        this.gameActive = true;
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('game-timer').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
            .game-card:hover {
                transform: translateY(-5px) !important;
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
            }
            .game-card.matched {
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    // Cleanup
    destroy() {
        clearInterval(this.timerInterval);
        document.getElementById('word-match-game')?.remove();
    }
}

// Global function to show game
function showWordMatchGame(vocabulary, onComplete) {
    if (!vocabulary || vocabulary.length === 0) {
        console.warn('No vocabulary provided for game');
        if (onComplete) onComplete({ skipped: true });
        return;
    }

    const game = new WordMatchGame(vocabulary, onComplete);
    window.wordMatchGame = game; // Make accessible globally for onclick handlers
    game.start();
}

// Export
if (typeof window !== 'undefined') {
    window.WordMatchGame = WordMatchGame;
    window.showWordMatchGame = showWordMatchGame;
}
