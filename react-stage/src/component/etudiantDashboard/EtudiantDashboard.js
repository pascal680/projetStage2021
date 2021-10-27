import React, { useContext, useState, useEffect } from 'react'
import { UserInfoContext } from '../../contexts/UserInfo'
import Offres from '../Offres/Offres'
import ContratService from '../../services/ContratService'
import Contrat from '../contrat/Contrat'


const EtudiantDashboard = () => {
    const [loggedUser, setLoggedUser] = useContext(UserInfoContext)
    const [contrat, setContrat] = useState()

    useEffect(() => {
        const getContrat = async () => {
            const dbContrat
                await ContratService.getContrat(loggedUser.courriel)
            console.log(dbContrat, "dbContrat")
            setContrat(dbContrat)
        }
        getContrat()
    }, [])

    console.log(loggedUser)
    return (
        <>
            {contrat != null ?
                <Contrat />
                :
                <Offres />
            }
        </>
    )
}

export default EtudiantDashboard