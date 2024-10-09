let timers = {};
let skullIsRed = JSON.parse(localStorage.getItem('skullIsRed')) || { skull1: false, skull2: false, skull3: false, skull4: false, skull5: false, skull6: false, skull7: false, skull8: false, skull9: false }; 
let timeLeft = JSON.parse(localStorage.getItem('timeLeft')) || { skull1: 10800, skull2: 10800, skull3: 10800, skull4: 10800, skull5: 10800, skull6: 10800, skull7: 10800, skull8: 10800, skull9: 10800 }; 

// Format time to include leading zeros for hours and minutes
function getFormattedTime(date) {
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// On page load, set skull states based on localStorage
window.onload = function() {
    for (const skullId in skullIsRed) {
        const skullIcon = document.getElementById(`skull-icon${skullId.slice(-1)}`);
        const timerElement = document.getElementById(`timer-${skullId}`);

        if (skullIsRed[skullId]) {
            skullIcon.src = "red-skull.png";
            timerElement.style.display = "block";
            startTimer(skullId, timeLeft[skullId]); // Resume timer if it's red
        } else {
            skullIcon.src = "green-skull.png";
            timerElement.style.display = "none";
        }
    }
};

// Toggle skull color and start/reset timer
function toggleSkull(skullId) {
    const skullIcon = document.getElementById(`skull-icon${skullId.slice(-1)}`);
    const timerElement = document.getElementById(`timer-${skullId}`);

    if (skullIsRed[skullId]) {
        clearInterval(timers[skullId]);
        skullIsRed[skullId] = false;
        timeLeft[skullId] = 10800; // Reset the timer to 3 hours
        skullIcon.src = "green-skull.png";
        timerElement.style.display = "none";
    } else {
        skullIsRed[skullId] = true;
        skullIcon.src = "red-skull.png";
        timerElement.style.display = "block";
        startTimer(skullId, timeLeft[skullId]); // Start or resume the timer
    }

    // Save the current state to localStorage
    localStorage.setItem('skullIsRed', JSON.stringify(skullIsRed));
    localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
}

// Start a timer for each skull
function startTimer(skullId, secondsLeft) {
    const timerElement = document.getElementById(`timer-${skullId}`);
    
    updateTimerDisplay(timerElement, secondsLeft); // Initial display

    timers[skullId] = setInterval(() => {
        secondsLeft--;
        timeLeft[skullId] = secondsLeft;
        updateTimerDisplay(timerElement, secondsLeft);

        if (secondsLeft <= 0) {
            clearInterval(timers[skullId]);
            skullIsRed[skullId] = false;
            document.getElementById(`skull-icon${skullId.slice(-1)}`).src = "green-skull.png";
            timerElement.style.display = "none";
            timeLeft[skullId] = 10800; // Reset the timer
            localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
        }

        // Save the time left to localStorage
        localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
    }, 1000);
}

// Update timer display
function updateTimerDisplay(timerElement, secondsLeft) {
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;
    timerElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
}

// Reset skull colors at 5:22, 11:00, and 19:00
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
            timeLeft[skullId] = 10800; // Reset timer to 3 hours
        }
        localStorage.setItem('skullIsRed', JSON.stringify(skullIsRed));
        localStorage.setItem('timeLeft', JSON.stringify(timeLeft));
    }
}

// Call the reset function every minute
setInterval(resetSkullsAtSpecificTimes, 60000);
