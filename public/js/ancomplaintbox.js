let mainForm = document.querySelector('#main-form');
let mainContainer = document.querySelector('#mmcc');
const loader = document.querySelector('.loader-body');

mainForm.addEventListener('submit', (e) => {
    e.preventDefault()
    submitC();
})

async function submitC() {
    const blob = {
        subject: document.querySelector('#subject').value,
        description: document.querySelector('#cBody').value
    }
    loader.style.display = 'block';
    try {
        let response = await fetch('/api/anonymouscomplaint', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(blob)
        })
        if (response.ok) {
            let data = await response.json();
            let cno = data.Complaintno;
            mainContainer.innerHTML = `Complaint Captured Your Complaint no is <strong>${cno}</strong>`
        }
    } catch (err) {
        alert(err)
    } finally {
        loader.style.display = 'none';
    }
}