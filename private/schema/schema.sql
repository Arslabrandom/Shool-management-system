-- USE thisandthat;

CREATE TABLE applicationDrafts (
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
    
);