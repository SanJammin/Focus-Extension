const timer = document.getElementById("timer");
const start = document.getElementById("start");
const pause = document.getElementById("pause");
const reset = document.getElementById("reset");
const modeToggle = document.getElementById("modeToggle");

const alarmLoop = new Audio("sounds/alarm-loop.mp3");
alarmLoop.loop = true;
alarmLoop.volume = 1;

function updateTimerDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = String(timeLeft % 60).padStart(2, "0");
    timer.textContent = `${minutes}:${seconds}`;
}

function pollTimeLeft() {
    setInterval(() => {
        chrome.runtime.sendMessage({ type: "GET_TIME_LEFT" }, (response) => {
            if (response && typeof response.timeLeft === "number") {
                updateTimerDisplay(response.timeLeft);

                if (response.timerState === "finished") {
                    isCountdownInProgress = false;
                }
            }
        });
    }, 1000);
}

modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

let isCountdownInProgress = false;

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
    clearInterval(countdown) // TODO: Replace with message-based pause logic later
    isCountdownInProgress = false;
});

reset.addEventListener("click", () => {
    clearInterval(countdown); //TODO: Replace with message-based reset logic later
    updateTimerDisplay(1500);
    isCountdownInProgress = false;
});

chrome.runtime.sendMessage ({ type: "GET_TIME_LEFT" }, (response) => {
    if (response && typeof response.timeLeft === "number") {
        updateTimerDisplay(response.timeLeft);
        if (response.timerState === "finished") {
            isCountdownInProgress = false;
        }
    }
});

pollTimeLeft();