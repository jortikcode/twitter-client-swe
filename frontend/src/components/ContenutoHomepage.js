import React from 'react'
import homepageStyle from './ContenutoHomepage.module.css';

function ContenutoHomepage () { 
    return (
        <React.Fragment>
            <h1 className={homepageStyle.Titolo}>La Ghigliottina</h1>
            <br/>
            <p className={homepageStyle.Testo}>Benvenuto! Sei un grande fan de "L'Eredità", il quiz più longevo della televisione italiana? Sei nel posto giusto! Gioca con migliaia di utenti da tutta Italia e scopri chi è riuscito a indovinare la parola nascosta durante l'ultima sfida: "La Ghigliottina"!</p>
        </React.Fragment>
    )
}

export default ContenutoHomepage
