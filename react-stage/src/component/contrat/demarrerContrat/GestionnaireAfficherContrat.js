import React, { useState, useEffect } from 'react'
import ContratService from '../../../services/ContratService'

const GestionnaireAfficherContrat = () => {
    const [listContrats, setListContrats] = useState([])
    const [listOffres, setListOffres] = useState([])
    const [listEtudiants, setListEtudiants] = useState([])
    const [contrat, setContrat] = useState({})
    const [errors, setErrors] = useState({})

    useEffect(async () => {
        let dbContrats
        dbContrats = await ContratService.getAllContrats()
        getOffres(dbContrats)
        setListContrats(dbContrats)
    }, [])

    const getOffres = (listContrats) => {
        let tempListOffres = []
        listContrats.forEach(contrat => {
            if (offreIsNotInList(tempListOffres, contrat)) {
                tempListOffres = [...tempListOffres, contrat.offre]
            }
        })
        setListOffres(tempListOffres)
        setValuesOnLoad(listContrats, tempListOffres)
    }

    const offreIsNotInList = (tempListOffres, contratToCheck) => {
        if (tempListOffres.some(offre => offre.id === contratToCheck.offre.id)) {
            return false
        }
        return true
    }

    const setValuesOnLoad = (listContrats, listOffres) => {
        getListEtudiants(listContrats, listOffres[0].applicants)

    }

    const getListEtudiants = (listContrats, listApplicants) => {
        let listEtudiantsContratOffre = getEtudiantsForContrat(listContrats, listApplicants)
        setListEtudiants(listEtudiantsContratOffre)
        setContratValues(listContrats, listEtudiantsContratOffre[0])
    }

    const getEtudiantsForContrat = (listContrats, listApplicants) => {
        let tempListEtudiantsContratOffre = []
        listContrats.forEach(contrat => {
            if (listApplicants.some(applicant => applicant.id === contrat.etudiant.id)) {
                tempListEtudiantsContratOffre = [...tempListEtudiantsContratOffre, contrat.etudiant]
            }
        })
        return tempListEtudiantsContratOffre
    }

    const onChangeOffre = (e) => {
        let offre = JSON.parse(e.target.value)
        getListEtudiants(listContrats, offre.applicants)
        setErrors({})

    }

    const onChangeEtudiant = (e) => {
        let etudiant = JSON.parse(e.target.value)
        setErrors({})
        setContratValues(listContrats, etudiant)
    }

    const setContratValues = (listContrats, etudiant) => {
        listContrats.forEach(contrat => {
            if (contrat.etudiant.id === etudiant.id) {
                setContrat(contrat)
            }
        })
    }

    const isAlreadyStarted = (contrat) => {
        if (contrat.gestionnaireConfirmed == true && contrat.moniteurConfirmed == true && contrat.etudiantConfirmed == true) {
            return true
        } else {
            return false
        }
    }

    function checkError(values) {
        let errors = {}

        if (!values.etudiantConfirmed) {
            errors.etudiantConfirmed = "La signature de l'étudiant est requise"
        }

        if (!values.moniteurConfirmed) {
            errors.moniteurConfirmed = "La signature du moniteur est requise"
        }

        return errors
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setErrors(checkError(contrat))
        if (Object.keys(checkError(contrat)).length === 0 && !isAlreadyStarted(contrat)) {
            const date = new Date()
            contrat.dateSignatureGestionnaire = date.toISOString().split('T')[0];
            contrat.gestionnaireConfirmed = true
            await ContratService.saveContrat(contrat)
        }
    }

    return (
        <form className="form" id="txtform" onSubmit={handleSubmit}>
            <h2>Démarrer contrat</h2>

            <div className="form-inputs">
                <label htmlFor="offre"
                    className="form-label">
                    Offre
                </label>
                <select onChange={onChangeOffre}>
                    {listOffres.map((offre) => (
                        <option value={JSON.stringify(offre)}>{offre.titre}</option>
                    ))}
                </select>
            </div>

            <div className="form-inputs">
                <label htmlFor="etudiant"
                    className="form-label">
                    Étudiant
                </label>
                <select onChange={onChangeEtudiant}>
                    {listEtudiants.map((etudiant) => (
                        <option value={JSON.stringify(etudiant)}>{etudiant.prenom} {etudiant.nom}</option>
                    ))}
                </select>
            </div>

            <div className="form-inputs">
                <label htmlFor="collegeEngagement"
                    className="form-label">
                    Le Collège s’engage à :
                </label>
                <textarea form="txtform" rows="3" cols="50" id="collegeEngagement" name="collegeEngagement" className="form-input" placeholder="Entrez les engagments du collège" defaultValue={contrat.collegeEngagement} readOnly></textarea>
            </div>

            <div className="form-inputs">
                <label htmlFor="entrepriseEngagement"
                    className="form-label">
                    L’entreprise s’engage à :
                </label>
                <textarea form="txtform" rows="3" cols="50" id="entrepriseEngagement" name="entrepriseEngagement" className="form-input" placeholder="Entrez les engagments de l'entreprise" defaultValue={contrat.entrepriseEngagement} readOnly></textarea>
            </div>

            <div className="form-inputs">
                <label htmlFor="etudiantEngagement"
                    className="form-label">
                    L’étudiant s’engage à :
                </label>
                <textarea form="txtform" rows="3" cols="50" id="etudiantEngagement" type="text" name="etudiantEngagement" className="form-input" placeholder="Entrez les engagments de l'étudiant" defaultValue={contrat.etudiantEngagement} readOnly></textarea>
            </div>

            <div className="form-inputs">
                <label htmlFor="moniteurConfirmed" className="form-label">
                    Signature moniteur
                </label>
                <input id="moniteurConfirmed" type="checkbox" name="moniteurConfirmed" className="form-input" placeholder="" checked={contrat.moniteurConfirmed} disabled></input>
            </div>
            {errors.moniteurConfirmed && <p className="error">{errors.moniteurConfirmed}</p>}

            <div className="form-inputs">
                <label htmlFor="etudiantConfirmed" className="form-label">
                    Signature étudiant
                </label>
                <input id="etudiantConfirmed" type="checkbox" name="etudiantConfirmed" className="form-input" placeholder="" checked={contrat.etudiantConfirmed} disabled></input>
            </div>
            {errors.etudiantConfirmed && <p className="error">{errors.etudiantConfirmed}</p>}

            <div className="form-inputs">
                <label htmlFor="gestionnaireConfirmed" className="form-label">
                    Signature gestionnaire
                </label>
                <input id="gestionnaireConfirmed" type="checkbox" name="gestionnaireConfirmed" className="form-input" placeholder="" checked={contrat.gestionnaireConfirmed} disabled></input>
            </div>


            <button className="button" type="submit">Signer et démarrer le contrat</button>

        </form>
    )
}

export default GestionnaireAfficherContrat
