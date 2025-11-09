const trackingForm = document.querySelector('#tracking-form');
const $f = document.querySelector('#main-application-form');

trackingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Tracking unavailable right now!');
});

const getApplicationFormData = () => {
    return {
        applicantRole: $f.applicantRole.value,
        forStandard: $f.forStandard.value,
        forSubject: $f.forSubject.value,
        appName: $f.appName.value,
        appFirstName: $f.appFirstName.value,
        appLastName: $f.appLastName.value,
        appFatherName: $f.appFatherName.value,
        appFatherFirstName: $f.appFatherFirstName.value,
        appFatherLastName: $f.appFatherLastName.value,
        appMotherName: $f.appMotherName.value,
        appMotherFirstName: $f.appMotherFirstName.value,
        appMotherLastName: $f.appMotherLastName.value,
        appDateOfBirth: $f.appDateOfBirth.value,
        appNidType: $f.appNidType.value,
        appNidNumber: $f.appNidNumber.value,
        appAddress: $f.appAddress.value,
        appCity: $f.appCity.value,
        appState: $f.appState.value,
        appPostCode: $f.appPostCode.value,
        appPhoneNumber: $f.appPhoneNumber.value,
        appEmail: $f.appEmail.value
    };
};

$f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = getApplicationFormData();
    const postResults = await doPostForm(userData);
    console.log(postResults);
})

async function doPostForm(jsonData) {
    try {
        const response = await fetch('api/newApplication', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(err);
    };
};