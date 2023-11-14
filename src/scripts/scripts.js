const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        health: document.querySelector("#health"),
        start: document.querySelector("#start"),
        button: document.querySelector("#playPause")
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        changes: 3,
        
        buttonPause: "Pause",
        buttonPlay: "Play",
        isPaused: false,
        pausedTime: 0,
    },
    actions: {
        timerId: null,
        countDownTimerId: null
    }
}

function countDown() {
    if(!state.values.isPaused) {
        state.values.currentTime--;
        state.view.timeLeft.textContent = state.values.currentTime;
        
        if (state.values.currentTime <= 0) {
            clearInterval(state.actions.countDownTimerId)
            clearInterval(state.actions.timerId)
            alert("Gamer Over! O seu resultado foi: " + state.values.result)
            location.reload()
        }
    }
}

function playSound(audioName){
    let audio = new Audio(`./src/songs/${audioName}.m4a`)
    audio.volume = 0.2
    audio.play();
}

function randomSquare() {
    if (!state.values.isPaused) {
        state.view.squares.forEach((square) => {
            square.classList.remove("enemy");
        });

        let randomNumber = Math.floor(Math.random() * 9);

        let randomSquare = state.view.squares[randomNumber];
        randomSquare.classList.add("enemy");
        state.values.hitPosition = randomSquare.id;
    }
}


function moveEnemy(){
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity)
}

function addListenerHitbox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", handleSquareClick);
    });
}

function handleSquareClick() {
    if (!state.values.isPaused) {
        if (this.id === state.values.hitPosition) {
            state.values.result++;
            state.view.score.textContent = state.values.result;
            state.values.hitPosition = null;
            playSound("hit");
        } else {
            state.values.changes--;
            state.view.health.textContent = "x" + state.values.changes;
            if (state.values.changes <= 0) {
                alert("Gamer over! Sua pontuação foi: " + state.values.result)
                location.reload()
            }
        }
    }
}
function playPause() {
    state.view.button.addEventListener("mousedown", () => {
        state.values.isPaused = !state.values.isPaused;

        if (state.values.isPaused) {
            // Pausar o jogo
            clearInterval(state.values.timerId);
            clearInterval(state.values.countDownTimerId);
        } else {
            // Retomar ou iniciar o jogo
            if (state.values.timerId !== null) {
                clearInterval(state.values.timerId);
            }
            if (state.values.countDownTimerId !== null) {
                clearInterval(state.values.countDownTimerId);
            }

            moveEnemy();
            addListenerHitbox();
            state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
            state.values.countDownTimerId = setInterval(countDown, 1000);
        }

        state.view.button.textContent =
            state.view.button.textContent === state.values.buttonPause
                ? state.values.buttonPlay
                : state.values.buttonPause;
    });
}


function init() {
    moveEnemy();
    addListenerHitbox();
    playPause();
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function startGame() {
    state.view.start.addEventListener("mousedown", () => {
        init();  
    })
}

startGame()