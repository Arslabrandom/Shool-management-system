import { query, validationResult } from "express-validator";
import { applicationModelCreator } from "../private/small_helper_function/hFunctions.js";
import { initApplication, chechForIdDuplicacy, getPendingApplications } from "../private/schema/schema.js";

export const newApplication = async ( req, res) => {
    const vError = validationResult(req);
    if (!vError.isEmpty()) {
        return res.status(422).json({message: vError.array()[0].msg})
    }
    const readyModel = applicationModelCreator(req.body);
    const queryResult = await initApplication(readyModel);
    if (!queryResult.applicationCreated) {
        return res.json({applicationCreated: false, message: queryResult.message});
    }
    res.json({ applicationCreated: true, message: `Application submitted for ${readyModel.appName} S/O ${readyModel.appFatherName}`, applicationDataEcho: readyModel});
};

export const duplIdCheck = async ( req, res ) => {
    const {nid} = req.body || {};
    if (!nid) { return res.status(422).json({duplicateId: true, message: "nid required"}) }
    else if (typeof(nid) !== "string") { return res.status(422).json({duplicateId: true, message: "nid must be a string"}) }
    const queryResult = await chechForIdDuplicacy(nid);
    if (queryResult.duplicateId) {
        return res.json({duplicateId: true, message: queryResult.message});
    } else {
        res.json({duplicateId: false, message: queryResult.message});
    }
}

export const PDApplications = async  (req, res) => {
    const queryResult = await getPendingApplications();
    if (queryResult.error) {
        return res.status(404).json(queryResult);
    }
    res.json(queryResult);
};