const timer = document.getElementById("timer");
const start = document.getElementById("start");
const pause = document.getElementById("pause");
const reset = document.getElementById("reset");
const modeToggle = document.getElementById("modeToggle");

modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

let isCountdownInProgress = false;
let count = 1500;
let countdown;

start.addEventListener("click", () => {
    if (!isCountdownInProgress) {    
        countdown = setInterval(function() {
            const timeBetween = count--;

            const minutes = Math.floor((timeBetween / 60));
            const seconds = Math.floor((timeBetween % 60));

            let secondsString = seconds.toString().padStart(2, "0");

            timer.textContent = `${minutes}:${secondsString}`;

            if (timeBetween < 0) {
                clearInterval(countdown);
                count = 1500;
                timer.textContent = "25:00"
                isCountdownInProgress = false;
            }
        },1000);

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