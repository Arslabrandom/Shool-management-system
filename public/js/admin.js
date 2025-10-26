const clockOut = document.querySelector('.clock');

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
        const response = await fetch('/logout', {method: 'POST'});
        window.location.href = '/';
    } catch (err) {
        console.err(err)
    }
}