const loader = document.querySelector('.loader-body');
const loginBtn = document.querySelector('#loginbtn');
const dashboardBtn = document.querySelector('#dashboardbtn');
const dynamicText = document.querySelector('#dynamic-text');
const mainNav = document.querySelector('.main-navbar');

window.onload = () => {
    mainNav.classList.add('fadein');
    prvL(true);
}


loginBtn.style.display='none';

const prvL = async (greet) => {
    try {
        const response = await fetch('/pingForPrevLogin', { method: 'POST' })
        const result = await response.json();
        if (result.prevLogged) {
            let str = result.username;
            correctedString = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            if (greet) {
                greetUser(correctedString);
            }
            dashboardBtn.style.display = 'flex'
            loginBtn.style.display = 'none'
        } else {
            loginBtn.style.display = 'flex'
            dashboardBtn.style.display = 'none'
            if (greet) {
                greetUser();
            }
        }
    } catch (error) {}
}

setTimeout(() => {
    setInterval(() => {prvL(false)}, 1000);
}, 2000)

async function arm96mxjck() {
    window.location.href = '/dashboard'
}

function greetUser(username) {
    if (username) {
        dynamicText.innerHTML = `Welcome back Mr. ${username}`;
        dynamicText.classList.add('slidein')
        setTimeout(() => {
            dynamicText.innerHTML = 'This & That School';
            dynamicText.classList.remove('slidein');
            dynamicText.classList.add('fadein');
        }, 3000)
    } else {
        dynamicText.innerHTML = 'Welcome to This & That School';
        setTimeout(() => { dynamicText.innerHTML = 'This & That School' }, 3000)
    }
}

function developement() {
    window.location.href = '/underdevelopment'
}