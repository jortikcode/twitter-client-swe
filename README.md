# Twitter App
![](https://github.com/jortikcode/twitter-client-swe/blob/main/docs/dummy_demo.gif)
## Descrizione
L’obiettivo generico dell'applicazione è quello di raccogliere i tweet, organizzarli e analizzarli visualizzandoli in forma sintetica.
Lo scopo è rilevare e classificare tweet che includono particolari parole chiave esaminando i tweet stessi. La raccolta può essere storica (es. ultima settimana) o in stream in tempo reale.

## Avviare l'applicazione con docker-compose
A partire dalla directory radice, dove si trova il file `docker-compose.yml` eseguire dalla shell:

```shell
docker compose up
```
Il frontend sara' consultabile dal browser all'indirizzo http://localhost:3000

## Avviare l'applicazione manualmente

### Installare il backend
A partire dalla directory radice, eseguire dalla shell:
```shell
cd backend
npm install
```

### Far partire il server del backend
Nella cartella del backend, eseguire dalla shell:
```shell
node server.js
```

### Installare il frontend
A partire dalla directory radice, eseguire dalla shell:
```shell
cd frontend
npm install
```

### Far partire il frontend
Nella cartella del frontend, eseguire dalla shell:
```shell
npm start
```
Il frontend sara' consultabile dal browser all'indirizzo http://localhost:3000

## Link utili
Wiki: https://taiga.hjkl.gq/project/ingsw2022-team3/wiki/home

## Licenza
[MIT](https://git.hjkl.gq/team3/twitter-app/-/blob/main/LICENSE)
