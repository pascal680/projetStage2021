import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClockCircle } from 'react-icons/ai'
import CVService from '../../services/CVService'
import './VerificationCV.css'

const VerificationCVList = () => {
    const [cvList, setCVList] = useState([])

    useEffect(() => {
        const getAllCVs = async () => {
            const cvs = await CVService.getAllCVs()
            console.log(cvs)
            setCVList(cvs);
        }
        getAllCVs();
    }, [])

    const getStatusIcon = (status) => {
        switch(status) {
            case "PENDING":
                return <AiOutlineClockCircle color="gold" size="48px"/>
            case "ACCEPTED":
                return <AiOutlineCheckCircle color="green" size="48px"/>
            case "REJECTED":
                return <AiOutlineCloseCircle color="red" size="48px"/>
            default:
                return;
        }
    }

    return (
        <div className="container">
            <h1 className="center">Liste des CV des étudiants</h1>
            <div className="table">
                <div className="border row container">
                    <div className="col-5 bold auto">Nom d'étudiant</div>
                    <div className="col-5 bold auto">Date soumission</div>
                    <div className="col-2 bold right">Statut du CV</div>
                </div>
                {cvList.length === 0 ? <div className="col center">Aucun CV à afficher</div> : cvList.map(cv =>
                    <Link key={cv.id} className="row border container cvitem" to={`/gestion/cv/${cv.id}`}>
                        <div className="col-5 auto">{cv.etudiant.nom}, {cv.etudiant.prenom}</div>
                        <div className="col-5 auto">{cv.dateSoumission}</div>
                        <div className="col-2 right">{getStatusIcon(cv.status)}</div>
                    </Link>)}
            </div>
        </div>
    )
}

export default VerificationCVList