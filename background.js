let timerInterval = null;
let endTime = null;
let timeLeftWhenPaused = null;
let timerState = "not_started";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "START_TIMER") {
        const duration = message.duration;
        endTime = Date.now() + duration * 1000;
        timerState = "running";

        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            const timeLeft = Math.floor((endTime - Date.now()) / 1000);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                endTime = null;
                timerState = "finished";
            }
        }, 1000);

        sendResponse({ timeLeft, timerState });
        return true;

    } else if (message.type === "PAUSE_TIMER") {
        if (timerState === "running") {
            timeLeftWhenPaused = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            clearInterval(timerInterval);
            timerInterval = null;
            timerState = "paused";
        }

        sendResponse({ timeLeft: timeLeftWhenPaused, timerState});
        return true;

    } else if (message.type === "RESUME_TIMER") {
        if (timerState === "paused" && timeLeftWhenPaused !== null) {
            endTime = Date.now() + timeLeftWhenPaused * 1000;
            timerState = "running";

            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                const timeLeft = Math.floor((endTime - Date.now()) / 1000);
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    endTime = null;
                    timerState = "finished";
                }
            }, 1000);
        }

        sendResponse({ timeLeft: timeLeftWhenPaused, timerState });
        return true;

    } else if (message.type === "GET_TIME_LEFT") {
        const timeLeft = timerState === "paused"
            ? timeLeftWhenPaused
            : endTime
                ? Math.max(0, Math.floor((endTime - Date.now()) / 1000))
                : 0;
        sendResponse({ timeLeft, timerState });
        return true;
    }
});