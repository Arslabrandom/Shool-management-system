USE thisandthat;

SELECT * FROM applicationDrafts;

truncate applicationDrafts;

SELECT appRef FROM applicationDrafts WHERE !verified;

SELECT appName FROM applicationDrafts WHERE verified = false;

alter table applicationDrafts
drop index appEmail;

alter table applicationDrafts
add unique (appNidNumber);

show index from applicationDrafts;

CREATE TABLE IF NOT EXISTS
    applicationDrafts (
        appRef VARCHAR(8) PRIMARY KEY,
        forStandard VARCHAR(10),
        applicantRole VARCHAR(10) NOT NULL,
        forSubject VARCHAR(10),
        appName VARCHAR(20) NOT NULL,
        appFirstName VARCHAR(20),
        appLastName VARCHAR(20),
        appFatherName VARCHAR(20) NOT NULL,
        appFatherFirstName VARCHAR(20),
        appFatherLastName VARCHAR(20),
        appMotherName VARCHAR(20) NOT NULL,
        appMotherFirstName VARCHAR(20),
        appMotherLastName VARCHAR(20),
        appDateOfBirth DATE NOT NULL,
        appNidType VARCHAR(20) NOT NULL,
        appNidNumber VARCHAR(20) NOT NULL,
        appAddress VARCHAR(100) NOT NULL,
        appCity VARCHAR(20) NOT NULL,
        appState VARCHAR(20) NOT NULL,
        appPostCode VARCHAR(20) NOT NULL,
        appPhoneNumber VARCHAR(20) NOT NULL,
        appEmail VARCHAR(100) UNIQUE,
        verified BOOLEAN NOT NULL DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );


INSERT INTO
    applicationDrafts (
        appRef,
        forStandard,
        applicantRole,
        forSubject,
        appName,
        appFirstName,
        appLastName,
        appFatherName,
        appFatherFirstName,
        appFatherLastName,
        appMotherName,
        appMotherFirstName,
        appMotherLastName,
        appDateOfBirth,
        appNidType,
        appNidNumber,
        appAddress,
        appCity,
        appState,
        appPostCode,
        appPhoneNumber,
        appEmail,
        verified
    ) VALUES (
        "12345678",
        "9th",
        "Student",
        null,
        "Subhash",
        null,
        "Kumar",
        "Santosh",
        null,
        "Kumar",
        "Chandrakala",
        null,
        "Kumar",
        "2007-03-19",
        "UIDAI Aadhar",
        "897489761234",
        "Rehmant nagar karula pagwada, gali no 426",
        "Moradabad",
        "Uttar Pradesh",
        "244001",
        "9045755688",
        "riyazmo021@yahoomail.com",
        false
    );