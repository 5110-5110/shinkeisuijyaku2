const grid = document.getElementById('game-grid');
const turnsDisplay = document.getElementById('turns');
const restartBtn = document.getElementById('restart-btn');

// かわいい絵文字のリスト（ペアにするもの）
const emojis = ['🌸', '⭐', '🌈', '🌙', '🎀', '💎', '🦄', '🍀']; 
// ※8種類用意すると、2ペアずつで16枚のカード（4x4）になります
let gameEmojis = [...emojis, ...emojis]; // ペアにするために2倍にする

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let turns = 0;
let matchedCount = 0;

// ゲームを初期化してスタートする関数
function initGame() {
    grid.innerHTML = '';
    turns = 0;
    matchedCount = 0;
    turnsDisplay.textContent = turns;
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    // 絵文字をランダムにシャッフルする
    gameEmojis.sort(() => Math.random() - 0.5);

    // カード要素を生成して画面に追加
    gameEmojis.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        card.innerHTML = `
            <div class="card-face card-back">❓</div>
            <div class="card-face card-front">${emoji}</div>
        `;

        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

// カードをクリックしたときの処理
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        // 1枚目のカードをめくったとき
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // 2枚目のカードをめくったとき
    secondCard = this;
    turns++;
    turnsDisplay.textContent = turns;

    checkForMatch();
}

// 絵文字が一致するかチェックする関数
function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// 一致した場合：クリックイベントを削除して開いたままにする
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedCount += 2;
    resetBoard();

    // すべて揃ったらお祝いメッセージ
    if (matchedCount === gameEmojis.length) {
        setTimeout(() => {
            alert(`🎉 おめでとうございます！ ${turns}手でクリアしました！`);
        }, 500);
    }
}

// 一致しなかった場合：少し待ってから裏に戻す
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000); // 1秒後に裏に戻る
}

// 盤面の状態をリセット
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// もう一度ボタンのイベント
restartBtn.addEventListener('click', initGame);

// 初回読み込み時にゲームを開始
initGame();
