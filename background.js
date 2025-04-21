let timerInterval = null;
let endTime = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "START_TIMER") {
        const duration = message.duration;
        endTime = Date.now() + duration * 1000;

        console.log("Timer started for ", duration, " seconds.");

        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            const timeLeft = Math.floor((endTime - Date.now()) / 1000);
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                console.log("Timer finished!");
            } else {
                console.log("Time left: ", timeLeft, "s");
            }
        }, 1000);
    } else if (message.type === "GET_TIME_LEFT") {
        const timeLeft = endTime ? Math.max(0, Math.floor((endTime - Date.now()) / 1000)) : 0;
        sendResponse({ timeLeft });
        return true;
    }
});