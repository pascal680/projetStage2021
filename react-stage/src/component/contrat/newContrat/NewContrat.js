import React, { useState, useEffect } from 'react'
import useNewContrat from './useNewContrat'
import validateInfoContrat from './validateInfoContrat';
import OffreService from '../../../services/OffreService';
import './NewContratCSS.css'


const NewContrat = () => {
    const { handleChange, values, handleSubmit, errors } = useNewContrat(validateInfoContrat);
    const [listOffres, setListOffres] = useState([])
    const [listEtudiants, setListEtudiants] = useState([])
    const [optionOffres, setOptionOffres] = useState([])
    const [optionEtudiants, setOptionEtudiants] = useState([])

    useEffect(() => {
        const getOffres = async () => {
            let dbOffres
            dbOffres = await OffreService.getAllOffres()

            console.log(dbOffres, "dbOffres")
            setListOffres(dbOffres)
        }
        getOffres()
    }, [])


    const onChangeOffre = (e) => {
        let offre = JSON.parse(e.target.value)
        console.log(offre.applicants, "applicants")
        setListEtudiants(offre.applicants);
    }

    return (
        <div className="form-content-right">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Créez un nouveau contrat</h1>


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
                    <select>
                        {listEtudiants.map((etudiant) => (
                            <option value={etudiant}>{etudiant.prenom} {etudiant.nom}</option>
                        ))}
                    </select>
                </div>

                <div className="form-inputs">
                    <label htmlFor="collegeEngagement"
                        className="form-label">
                        Le Collège s’engage à :
                    </label>
                    <input id="collegeEngagement" type="text" name="collegeEngagement" className="form-input" placeholder="Entrez votre prenom" value={values.collegeEngagement} onChange={handleChange}></input>
                    {errors.collegeEngagement && <p>{errors.collegeEngagement}</p>}
                </div>

                <div className="form-inputs">
                    <label htmlFor="entrepriseEngagement"
                        className="form-label">
                        L’entreprise s’engage à :
                    </label>
                    <input id="entrepriseEngagement" type="text" name="entrepriseEngagement" className="form-input" placeholder="Entrez votre prenom" value={values.entrepriseEngagement} onChange={handleChange}></input>
                    {errors.entrepriseEngagement && <p>{errors.entrepriseEngagement}</p>}
                </div>

                <div className="form-inputs">
                    <label htmlFor="etudiantEngagement"
                        className="form-label">
                        L’étudiant s’engage à :
                    </label>
                    <input id="etudiantEngagement" type="text" name="etudiantEngagement" className="form-input" placeholder="Entrez votre prenom" value={values.etudiantEngagement} onChange={handleChange}></input>
                    {errors.etudiantEngagement && <p>{errors.etudiantEngagement}</p>}
                </div>


                <button className="form-input-btn" type="submit">S'inscrire</button>

            </form>
        </div>
    )
}

export default NewContrat