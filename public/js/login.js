let role;
let typeSelection = ''
const formL = document.querySelector('#loginForm');
const loader = document.querySelector('.loader-body');
const roleDisplay = document.getElementById('roleDisplay');
const togglePassword = document.querySelector('.togglePassword');
const passwordInput = document.getElementById('password');
const typeSelectors = document.querySelectorAll('.rayta');
let isVisible = false;
let icon = {
    success: '<span class="material-symbols-outlined">task_alt</span>',
    danger: '<span class="material-symbols-outlined">error</span>',
    warning: '<span class="material-symbols-outlined">warning</span>',
    info: '<span class="material-symbols-outlined">info</span>'
};

async function Login(role, creds) {
    loader.style.display = 'block';
    try {
        const response = await fetch(`/login/${role}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(creds),
            credentials: 'include'
        })
        const data = await response.json();
        if (data.login) {
            showToast(`${data.message} Redirecting`, "success", 1000)
            setTimeout(()=>{window.location.href = '/dashboard';}, 1100)
        } else {
            showToast(data.message, "danger", 2000);
        }
    } catch (error) {
        console.error(error);
    } finally {
        loader.style.display = 'none';
    }
}

typeSelectors.forEach((selector) => {
    selector.addEventListener('click', () => {
        typeSelectors.forEach((e) => {
            e.style.backgroundColor = 'white'
            e.style.color = 'black'
        })
        const n = selector.querySelector('.val');
        selector.style.backgroundColor = 'black';
        selector.style.color = 'white';
        roleDisplay.innerHTML = `Continue as - ${n.innerHTML.trim()}`;
        roleDisplay.style.color = 'green';
        roleDisplay.style.border = '1px solid green';
        typeSelection = n.innerHTML.trim().toLowerCase();
    });
});

formL.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeSelection == '') {
        showToast("Please select a Valid user type", "warning", 2000);
    } else {
        const creds = {
            userid: document.querySelector('#id').value,
            password: document.querySelector('#password').value
        }
        Login(typeSelection, creds);
    }
})

togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    console.log(isVisible)
    isVisible = !isVisible
    if (isVisible === true) {
        return togglePassword.innerHTML = "visibility";
    }
    togglePassword.innerHTML = "visibility_off";
});

const showToast = (
    message = "Sample Message",
    toastType = "info",
    duration = 5000) => {
    if (
        !Object.keys(icon).includes(toastType))
        toastType = "info";

    let box = document.createElement("div");
    box.classList.add(
        "toast", `toast-${toastType}`);
    box.innerHTML = ` <div class="toast-content-wrapper">
                      <div class="toast-icon">
                      ${icon[toastType]}
                      </div>
                      <div class="toast-message">${message}</div>
                      <div class="toast-progress"></div>
                      </div>`;
    duration = duration || 5000;
    box.querySelector(".toast-progress").style.animationDuration =
        `${duration / 1000}s`;

    let toastAlready =
        document.body.querySelector(".toast");
    if (toastAlready) {
        toastAlready.remove();
    }

    document.body.appendChild(box)
};