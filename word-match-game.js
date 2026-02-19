// ═══════════════════════════════════════════════════════════
// WORD MATCH MINI-GAME (IMPROVED VERSION)
// Clear, intuitive vocabulary matching game
// ═══════════════════════════════════════════════════════════

class WordMatchGame {
    constructor(vocabulary, onComplete) {
        this.vocabulary = vocabulary;
        this.onComplete = onComplete;
        this.selectedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = Date.now();
    }

    // Create game overlay
    createGameOverlay() {
        const totalPairs = Math.min(6, this.vocabulary.length);
        const selectedVocab = this.vocabulary.slice(0, totalPairs);

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
            -webkit-overflow-scrolling: touch;
        `;

        overlay.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                padding: 20px;
                max-width: 700px;
                width: 100%;
                animation: scaleIn 0.4s;
                margin: auto;
                max-height: 90vh;
                overflow-y: auto;
            ">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 48px; margin-bottom: 8px;">🎮</div>
                    <h2 style="font-size: 24px; font-weight: 900; color: #1A202C; margin-bottom: 8px;">
                        Word Match Game!
                    </h2>
                    <p style="color: #6B7280; font-size: 14px; margin-bottom: 10px; line-height: 1.5;">
                        Match each <strong style="color: #3B82F6;">blue word</strong> with its <strong style="color: #10B981;">green definition</strong>
                    </p>
                    <p style="color: #F59E0B; font-size: 13px; font-weight: 700; margin-bottom: 15px;">
                        👆 Click two cards to match them
                    </p>
                    
                    <!-- Stats -->
                    <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap;">
                        <div style="background: #F3F4F6; padding: 8px 16px; border-radius: 8px;">
                            <div style="font-size: 20px; font-weight: 900; color: #667EEA;" id="game-moves">0</div>
                            <div style="font-size: 11px; color: #6B7280; font-weight: 700;">Moves</div>
                        </div>
                        <div style="background: #F3F4F6; padding: 8px 16px; border-radius: 8px;">
                            <div style="font-size: 20px; font-weight: 900; color: #F59E0B;" id="game-timer">0:00</div>
                            <div style="font-size: 11px; color: #6B7280; font-weight: 700;">Time</div>
                        </div>
                        <div style="background: #F3F4F6; padding: 8px 16px; border-radius: 8px;">
                            <div style="font-size: 20px; font-weight: 900; color: #10B981;" id="game-matches">0/${totalPairs}</div>
                            <div style="font-size: 11px; color: #6B7280; font-weight: 700;">Matches</div>
                        </div>
                    </div>

                    <!-- Skip button -->
                    <button onclick="window.wordMatchGame.skip()" style="
                        background: #F3F4F6; color: #6B7280; border: none;
                        padding: 6px 14px; border-radius: 6px; font-size: 12px;
                        font-weight: 700; cursor: pointer;
                    ">
                        Skip Game →
                    </button>
                </div>

                <!-- Game Grid -->
                <div id="game-grid" style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
                    gap: 10px;
                    margin-bottom: 15px;
                ">
                    ${this.generateCards(selectedVocab)}
                </div>
            </div>
        `;

        return overlay;
    }

    // Generate cards (NO FLIPPING - show content immediately)
    generateCards(vocabulary) {
        const cards = [];
        
        // Create pairs
        vocabulary.forEach((item, index) => {
            // Word card (BLUE)
            cards.push({
                id: `word-${index}`,
                pairId: index,
                type: 'word',
                content: item.word,
                color: '#3B82F6',
                bgColor: '#EFF6FF',
                matched: false
            });
            
            // Definition card (GREEN)
            cards.push({
                id: `def-${index}`,
                pairId: index,
                type: 'definition',
                content: item.definition,
                color: '#10B981',
                bgColor: '#ECFDF5',
                matched: false
            });
        });

        // Shuffle
        const shuffled = this.shuffleArray(cards);

        // Generate HTML - content is VISIBLE from the start
        return shuffled.map((card, index) => `
            <div 
                class="game-card" 
                data-index="${index}"
                data-pair-id="${card.pairId}"
                data-type="${card.type}"
                style="
                    background: ${card.bgColor};
                    border: 2px solid ${card.color};
                    color: ${card.color};
                    padding: 12px 10px;
                    border-radius: 10px;
                    min-height: 75px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-weight: 700;
                    font-size: 12px;
                    line-height: 1.3;
                    cursor: pointer;
                    transition: all 0.2s;
                    user-select: none;
                    -webkit-tap-highlight-color: transparent;
                "
                onclick="window.wordMatchGame.selectCard(${index})"
            >
                ${card.content}
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

    // Select card (NEW APPROACH - no flipping)
    selectCard(index) {
        const cardElement = document.querySelector(`.game-card[data-index="${index}"]`);
        
        // Can't select if already matched or already selected
        if (!cardElement || 
            cardElement.classList.contains('matched') || 
            cardElement.classList.contains('selected')) {
            return;
        }

        // Can't select more than 2 cards at once
        if (this.selectedCards.length >= 2) {
            return;
        }

        // Select this card
        cardElement.classList.add('selected');
        cardElement.style.transform = 'scale(1.05)';
        cardElement.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
        
        const pairId = parseInt(cardElement.dataset.pairId);
        const type = cardElement.dataset.type;
        
        this.selectedCards.push({ index, pairId, type, element: cardElement });

        // Check for match if 2 cards selected
        if (this.selectedCards.length === 2) {
            this.moves++;
            document.getElementById('game-moves').textContent = this.moves;
            
            setTimeout(() => this.checkMatch(), 600);
        }
    }

    // Check if cards match
    checkMatch() {
        const [card1, card2] = this.selectedCards;

        // Must be same pair AND different types (word + definition)
        if (card1.pairId === card2.pairId && card1.type !== card2.type) {
            // MATCH! ✅
            card1.element.classList.remove('selected');
            card2.element.classList.remove('selected');
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            
            // Change to success color
            card1.element.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            card2.element.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            card1.element.style.borderColor = '#10B981';
            card2.element.style.borderColor = '#10B981';
            card1.element.style.color = 'white';
            card2.element.style.color = 'white';
            card1.element.style.transform = 'scale(1)';
            card2.element.style.transform = 'scale(1)';
            card1.element.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            card2.element.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            
            this.matchedPairs++;
            document.getElementById('game-matches').textContent = 
                `${this.matchedPairs}/${Math.min(6, this.vocabulary.length)}`;

            // Check if game complete
            if (this.matchedPairs === Math.min(6, this.vocabulary.length)) {
                setTimeout(() => this.gameComplete(), 500);
            }
        } else {
            // NO MATCH ❌
            // Shake animation
            card1.element.style.animation = 'shake 0.4s';
            card2.element.style.animation = 'shake 0.4s';
            
            setTimeout(() => {
                card1.element.classList.remove('selected');
                card2.element.classList.remove('selected');
                card1.element.style.transform = '';
                card2.element.style.transform = '';
                card1.element.style.boxShadow = '';
                card2.element.style.boxShadow = '';
                card1.element.style.animation = '';
                card2.element.style.animation = '';
            }, 400);
        }

        this.selectedCards = [];
    }

    // Game complete
    gameComplete() {
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Check if user is logged in
        const isLoggedIn = typeof window.EFCD_Auth !== 'undefined' && window.EFCD_Auth.getCurrentUser();

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
                
                ${isLoggedIn ? `
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
                ` : `
                    <div style="
                        background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
                        padding: 20px;
                        border-radius: 12px;
                        margin-bottom: 25px;
                        border: 2px solid #BFDBFE;
                    ">
                        <div style="font-size: 36px; margin-bottom: 12px;">🎓</div>
                        <div style="color: #1E40AF; font-weight: 700; font-size: 18px; margin-bottom: 10px;">
                            Great practice!
                        </div>
                        <div style="color: #1E40AF; font-size: 14px; margin-bottom: 15px;">
                            ⚡ ${this.moves} moves • ⏱️ ${timeTaken}s
                        </div>
                        <div style="color: #3B82F6; font-size: 13px; line-height: 1.5;">
                            💡 Sign up for free to earn XP, track progress & unlock achievements!
                        </div>
                    </div>
                `}

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
                    ${isLoggedIn ? 'Continue →' : 'Continue'}
                </button>
            </div>
        `;
    }

    // Skip game
    skip() {
        clearInterval(this.timerInterval);
        document.getElementById('word-match-game')?.remove();
        if (this.onComplete) this.onComplete({ skipped: true });
    }

    // Close game
    close() {
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        clearInterval(this.timerInterval);
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
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
            .game-card:not(.matched):not(.selected):hover {
                transform: translateY(-4px) !important;
                box-shadow: 0 6px 16px rgba(0,0,0,0.15) !important;
            }
            .game-card.matched {
                pointer-events: none;
                cursor: default;
            }
        `;
        document.head.appendChild(style);
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
    window.wordMatchGame = game;
    game.start();
}

// Export
if (typeof window !== 'undefined') {
    window.WordMatchGame = WordMatchGame;
    window.showWordMatchGame = showWordMatchGame;
}
