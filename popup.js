const timer = document.getElementById("timer");
const start = document.getElementById("start");
const pause = document.getElementById("pause");
const reset = document.getElementById("reset");
const modeToggle = document.getElementById("modeToggle");

const alarmLoop = new Audio("sounds/alarm-loop.mp3");
alarmLoop.loop = true;
alarmLoop.volume = 1;

let isCountdownInProgress = false;
let isPaused = false;

function updateTimerDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = String(timeLeft % 60).padStart(2, "0");
    timer.textContent = `${minutes}:${seconds}`;
}

function pollTimeLeft() {
    setInterval(() => {
        chrome.runtime.sendMessage({ type: "GET_TIME_LEFT" }, (response) => {
            if (response && typeof response.timeLeft === "number") {
                const { timeLeft, timerState } = response;

                if (timerState === "running") {
                    updateTimerDisplay(timeLeft);
                    isCountdownInProgress = true;
                } else if (timerState === "finished") {
                    updateTimerDisplay(0);
                    isCountdownInProgress = false;
                }
            }
        });
    }, 1000);
}

modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});


start.addEventListener("click", () => {
    if(!isCountdownInProgress) {
        updateTimerDisplay(1500);

        chrome.runtime.sendMessage({
            type: "START_TIMER",
            duration: 1500
        }, (response) => {
            if (response && typeof response.timeLeft === "number") {
                updateTimerDisplay(response.timeLeft);
            }
        });

        isCountdownInProgress = true;
    }
});

pause.addEventListener("click", () => {
    if (!isPaused) {
        chrome.runtime.sendMessage({ type: "PAUSE_TIMER"}, (response) => {
            if (response && typeof response.timeLeft === "number") {
                updateTimerDisplay(response.timeLeft);
                isPaused = true;
                pause.textContent = "⏵";
            }
        });
    } else {
        chrome.runtime.sendMessage({ type: "RESUME_TIMER" }, (response) => {
            if (response && typeof response.timeLeft === "number") {
                updateTimerDisplay(response.timeLeft);
                isPaused = false;
                pause.textContent = "⏸";
            }
        });
    }
});

reset.addEventListener("click", () => {
    clearInterval(countdown); //TODO: Replace with message-based reset logic later
    updateTimerDisplay(1500);
    isCountdownInProgress = false;
});

chrome.runtime.sendMessage({ type: "GET_TIME_LEFT" }, (response) => {

    if(!response || response.timeLeft === undefined || response.timerState === undefined) {
        updateTimerDisplay(1500);
        isCountdownInProgress = false;
        return;
    }

    const { timeLeft, timerState } = response;

    switch (timerState) {
        case "running":
            updateTimerDisplay(timeLeft);
            isCountdownInProgress = true;
            break;
        case "finished":
            updateTimerDisplay(0);
            isCountdownInProgress = false;
            break;
        case "not_started":
        default:
            updateTimerDisplay(1500);
            isCountdownInProgress = false;
            break;
    }
});

pollTimeLeft();