import React from 'react'
import StileHomepage from '../StileHomepage.module.css';

function Contenuto () {
    return (
        <React.Fragment>
            <h1 className={StileHomepage.Titolo}>La Ghigliottina</h1>
            <br/>
            <p className={StileHomepage.Testo}>Benvenuto! Sei un grande fan de "L'Eredità", il quiz più longevo della televisione italiana? Sei nel posto giusto! Gioca con migliaia di utenti da tutta Italia e scopri chi è riuscito a indovinare la parola nascosta durante l'ultima sfida: "La Ghigliottina"!</p>
        </React.Fragment>
    )
}

export default Contenuto