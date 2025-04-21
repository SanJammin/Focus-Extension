const timer = document.getElementById("timer");
const start = document.getElementById("start");
const pause = document.getElementById("pause");
const reset = document.getElementById("reset");
const modeToggle = document.getElementById("modeToggle");
const alarmLoop = new Audio("sounds/alarm-loop.mp3");

alarmLoop.loop = true;
alarmLoop.volume = 1;

function pollTimeLeft() {
    setInterval(() => {
        chrome.runtime.sendMessage({ type: "GET_TIME_LEFT" }, (response) => {
            if (response && typeof response.timeLeft === "number") {
                const minutes = Math.floor(response.timeLeft / 60);
                const seconds = String(response.timeLeft % 60).padStart(2, "0");
                timer.textContent = `${minutes}:${seconds}`;
            }
        });
    }, 1000);
};

modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

let isCountdownInProgress = false;
let count = 15; //Should be 1500 but for testing purposes
let countdown;

start.addEventListener("click", () => {
    if (!isCountdownInProgress) {    
        chrome.runtime.sendMessage({
            type: "START_TIMER",
            duration: 1500
        });
        isCountdownInProgress = true;
    }
});

pause.addEventListener("click", () => {
    clearInterval(countdown);
    isCountdownInProgress = false;
});

reset.addEventListener("click", () => {
    clearInterval(countdown);
    count = 1500;
    timer.textContent = "25:00"
    isCountdownInProgress = false;
});

pollTimeLeft();