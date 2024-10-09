let timers = {};
let skullIsRed = JSON.parse(localStorage.getItem('skullIsRed')) || { skull1: false, skull2: false, skull3: false, skull4: false, skull5: false, skull6: false, skull7: false, skull8: false, skull9: false }; 
let timeLeft = JSON.parse(localStorage.getItem('timeLeft')) || { skull1: 10800, skull2: 10800, skull3: 10800, skull4: 10800, skull5: 10800, skull6: 10800, skull7: 10800, skull8: 10800, skull9: 10800 }; 

// format time to include leading zeros for hours and minutes
function getFormattedTime(date) {
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// on page load - set skull states based on LS
window.onload = function() {
    for (const skullId in skullIsRed) {
        const skullIcon = document.getElementById(`skull-icon${skullId.slice(-1)}`);
        const timerElement = document.getElementById(`timer-${skullId}`);

        if (skullIsRed[skullId]) {
            skullIcon.src = "red-skull.png";
            timerElement.style.display = "block";
            startTimer(skullId, timeLeft[skullId]); // resume timer if its red
        } else {
            skullIcon.src = "green-skull.png";
            timerElement.style.display = "none";
        }
    }
};

// toggle skull color and start/reset timer
function toggleSkull(skullId) {
    const skullIcon = document.getElementById(`skull-icon${skullId.slice(-1)}`);
    const timerElement = document.getElementById(`timer-${skullId}`);

    if (skullIsRed[skullId]) {
        clearInterval(timers[skullId]);
        skullIsRed[skullId] = false;
        timeLeft[skullId] = 10800; // reset the timer to 3 hours
        skullIcon.src = "green-skull.png";
        timerElement.style.display = "none";
    } else {
        skullIsRed[skullId] = true;
        skullIcon.src = "red-skull.png";
        timerElement.style.display = "block";
        startTimer(skullId, timeLeft[skullId]); // start or resume the timer
    }

    // save the current state to LS
    localStorage.setItem('skullIsRed', JSON.stringify(skullIsRed));
    localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
}

// start a timer for each skull
function startTimer(skullId, secondsLeft) {
    const timerElement = document.getElementById(`timer-${skullId}`);
    
    updateTimerDisplay(timerElement, secondsLeft); // initial display

    timers[skullId] = setInterval(() => {
        secondsLeft--;
        timeLeft[skullId] = secondsLeft;
        updateTimerDisplay(timerElement, secondsLeft);

        if (secondsLeft <= 0) {
            clearInterval(timers[skullId]);
            skullIsRed[skullId] = false;
            document.getElementById(`skull-icon${skullId.slice(-1)}`).src = "green-skull.png";
            timerElement.style.display = "none";
            timeLeft[skullId] = 10800; // reset the timer
            localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
        }

        // save the time left to LS
        localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
    }, 1000);
}

// update timer display
function updateTimerDisplay(timerElement, secondsLeft) {
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;
    timerElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
}

// reset skull colors at 3:00, 11:00, and 19:00
function resetSkullsAtSpecificTimes() {
    const now = new Date();
    const resetTimes = ["03:00", "11:00", "19:00"];
    const currentTime = getFormattedTime(now);

    if (resetTimes.includes(currentTime)) {
        for (const skullId in skullIsRed) {
            skullIsRed[skullId] = false;
            document.getElementById(`skull-icon${skullId.slice(-1)}`).src = "green-skull.png";
            document.getElementById(`timer-${skullId}`).style.display = "none";
            clearInterval(timers[skullId]);
            timeLeft[skullId] = 10800; // reset timer to 3 hours
        }
        localStorage.setItem('skullIsRed', JSON.stringify(skullIsRed));
        localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
    }
}

// call the reset function every minute
setInterval(resetSkullsAtSpecificTimes, 60000);
