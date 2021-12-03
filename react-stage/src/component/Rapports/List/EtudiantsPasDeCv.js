import { React, useState, useEffect, useContext } from 'react'
import { saveAs } from 'file-saver'
import { UserInfoContext } from '../../../contexts/UserInfo';
import RapportService from '../../../services/RapportService';
import Table from "react-bootstrap/Table";

const EtudiantsPasDeCv = () => {
    const [loggedUser, setLoggedUser] = useContext(UserInfoContext)
    const [etudiants, setEtudiants] = useState([])


    useEffect(async () => {
        if (loggedUser.isLoggedIn && loggedUser.role === "GESTIONNAIRE") {
            const etudiantsFetch = await RapportService.getEtudiantsPasDeCv()
            setEtudiants(etudiantsFetch.slice(0, 3))
        }
    }, []);

    const downloadEtudiantsSansCv = () => {
        saveAs("http://localhost:9191/rapport/pdf/etudiantsSansCv")
    }


    const etudiantsList = etudiants.map((etudiant) =>
        <tr key={etudiant.id.toString()}>
            <td>{etudiant.nom}</td>
            <td>{etudiant.prenom}</td>
        </tr>);

    return (
        <>
            {etudiantsList.length > 0 ? (
                <div className="cardRapport">
                    <h4 className="text-wrap">Liste des etudiants n'ayant pas de cv</h4>
                    <Table striped bordered hover variant="dark" className="tableRapport">
                        <thead >
                            <tr>
                                <th>Nom</th>
                                <th>Courriel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {etudiantsList}
                            <tr>
                                <td colSpan="2">
                                    <button className="btn bg-secondary" onClick={downloadEtudiantsSansCv}>Télécharger</button>
                                </td>
                            </tr>

                        </tbody>
                    </Table>
                </div>
            ) : <div className="cardRapport">
                <h4>Liste des etudiants n'ayant pas de cv</h4>
                <h3 className="text-warning mt-4">Cette liste est vide</h3>
            </div>}
        </>
    )
}

export default EtudiantsPasDeCv
