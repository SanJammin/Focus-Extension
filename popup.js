const timer = document.getElementById("timer");
const start = document.getElementById("start");
const pause = document.getElementById("pause");
const reset = document.getElementById("reset");

start.addEventListener("click", () => {
    let count = 1500;
    
    const countdown = setInterval(function() {
        const timeBetween = count--;

        const minutes = Math.floor((timeBetween / 60));
        const seconds = Math.floor((timeBetween % 60));

        let secondsString = seconds.toString().padStart(2, "0");

        timer.textContent = `${minutes}:${secondsString}`;

        if (timeBetween < 0) {
            clearInterval(countdown);
            timer.textContent = "25:00"
        }
    },1000);
});