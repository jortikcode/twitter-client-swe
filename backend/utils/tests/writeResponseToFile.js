import { argv, exit } from 'node:process';
import fetch from 'node-fetch';
import fs from 'fs';
import path, { dirname, join } from 'node:path';
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* 
    Prima di eseguire lo script:
    Assicurarsi di avere accesso al server che hosta la API, altrimenti non sara' possibile
    salvarne le risposte.

    Come eseguire:
    Per avviare lo script: node writeResponseToFile.js {fileIdentifier} {apiUrlToSave}
    NB. 
    - fileIdentifier e apiUrlToSave NON sono parametri opzionali.
    - il method della richiesta e' di default 'GET'


    Funzionamento:
    Questo script scrive su un file chiamato `mock${fileIdentifier}.js` nella stessa directory
    in cui risiede writeResponseToFile.js (per cui e' a vostra discrezione scegliere un identificatore
    univoco per non sovrascriverne quelli che potrebbero essere gia' presenti) la risposta della 
    chiamata GET ad apiUrlToSave.
    .
    
*/

// Parametri mancanti
if (argv.length !== 4){
    console.log("Missing parameters\n","node writeResponseToFile.js {fileIdentifier} {apiUrlToSave}")
    exit(-1);
}
const fileIdentifier = argv[2];
const apiUrlToSave = argv[3];
fetch(apiUrlToSave)
.then(res => {
    if (!res.ok)
        throw new Error("Errore HTTP: " + res.status);
    return res.text();
})
.then(JSONStringResponse => {
    const buffer = `export const mock${fileIdentifier} = ` + JSONStringResponse;
    fs.writeFile(`mock${fileIdentifier}.js`, buffer, (err) => {
        if (err) throw err;
        console.log(`Il file di mock e' stato salvato in:\n ${path.join(__dirname, `mock${fileIdentifier}.js`)}`);
    })
})
