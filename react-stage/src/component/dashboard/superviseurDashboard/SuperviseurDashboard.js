import React, { useContext, useState, useEffect } from 'react'
import { UserInfoContext } from '../../../contexts/UserInfo'
import UserService from '../../../services/UserService'

const SuperviseurDashboard = () => {
    const [loggedUser] = useContext(UserInfoContext)
    const [fullUser, setFullUser] = useState({
        id: Number,
        prenom: String,
        nom: String,
        courriel: String,
        password: String,
        numTelephone: String,
        role: String,
        programme: String,
        adresse: String,
        numMatricule: String,
        hasLicense: Boolean,
        hasVoiture: Boolean,
        departement: String,
        nomEntreprise: String,
        adresseEntreprise: String,
        specialite: String
    })

    const [listEtudiants, setListEtudiants] = useState([])

    useEffect(() => {
        if (loggedUser.isLoggedIn) {
            UserService.getUserByEmail(loggedUser.courriel).then(data => {
                getEtudiants(data.id)
                setFullUser(data)
            })

        }
    }, []);

    const getEtudiants = async (id) => {
        const dbEtudiants = await UserService.getListEtudiantSuperviseur(id)
        setListEtudiants(dbEtudiants)
    }

    const etudiantsList = listEtudiants.map((etudiant) =>
        <tr key={etudiant.id.toString()}>
            <td>{etudiant.prenom} {etudiant.nom}</td>
            <td>{etudiant.courriel}</td>
        </tr>);

    return (
        <>
            <div>
                <h2>Bonjour {fullUser.prenom} {fullUser.nom}</h2>
            </div>
            {listEtudiants.length > 0 ?
                <div>
                    <h2>Liste étudiants</h2>
                    <table>
                        <tr>
                            <th>Nom</th>
                            <th>Courriel</th>
                        </tr>

                        {etudiantsList}
                    </table>
                </div>
                :
                <p className="superviseurDashboard_P">Vous etes responsable d'aucun étudiant pour l'instant</p>
            }
        </>
    )
}

export default SuperviseurDashboard