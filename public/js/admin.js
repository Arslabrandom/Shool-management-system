const clockOut = document.querySelector('.clock');
const slider = document.querySelector('.jhantu-container');
let isDown = false;
let startX;
let scrollLeft;

function getFormattedCurrentTime() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[now.getDay()];      
    const monthName = months[now.getMonth()]; 
    const dateNum = String(now.getDate()).padStart(2, '0');           
    const year = now.getFullYear();          

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedHours = String(hours).padStart(2, '0');

    const formattedString = 
        `${dayName} ${monthName} ${dateNum} ${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;

    return formattedString;
}

setInterval(()=>{const t = getFormattedCurrentTime(); clockOut.innerHTML = t}, 1000)

async function logout() {
    try {
        const response = await fetch('/api/logout', {method: 'POST'});
        window.location.href = '/';
    } catch (err) {
        console.err(err)
    }
}

function setNewApplicationNotificationCount(count, element) {
    const elem = document.querySelector(`${element}`);
    elem.classList.add('has-notification');
    if (count > 0) {
        elem.style.setProperty('--new-applications-coint', `"${count}"`);
    } else if (count > 9) {
        elem.style.setProperty('--new-applications-coint', "9+");
    } else {
        elem.classList.remove('has-notification');
    }
};

function handleKeyPress(event) {
    // Check if the key pressed is 'Enter' (modern 'event.key' or old 'event.keyCode')
    if (event.key === 'Enter' || event.keyCode === 13) {
        console.log('Enter key pressed!');
        // Your code here
    }
}

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active-drag');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active-drag');
});

slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active-drag');
});

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return; // Stop the function from running when the mouse is not down
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; // Multiplier for faster scrolling
    slider.scrollLeft = scrollLeft - walk;
});

async function fetchPendingApplications() {
    try {
        const response = await fetch('/api/pendingApplications', {method: 'GET'});
        const result = await response.json();
        if (result.error) {
            console.error(result.message);
        } else {
            return result.applicationsP;
        };
    } catch (err) {
        console.error(err);
    };
};

window.onload = async () => {
    const data = await fetchPendingApplications();
    const count = data.length;
    setNewApplicationNotificationCount(count, '.new-application-button');
};