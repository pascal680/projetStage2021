import { React, useState, useContext, useEffect } from 'react'
import { UserInfoContext } from '../../../contexts/UserInfo';
import { saveAs } from 'file-saver'
import { Link } from 'react-router-dom'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClockCircle } from 'react-icons/ai'
import CVService from '../../../services/CVService';
import UserService from '../../../services/UserService';

const VoirCVState = () => {
    const [etudiant, setEtudiant] = useState()
    const [cvs, setCvs] = useState([]);
    const [loggedUser] = useContext(UserInfoContext)

    const updateCvs = async () => {
        //await CVService.updateCVsEtudiant(etudiant.id).then(data => { setCvs(data)  })
        fetch(`http://localhost:9191/cv/etudiant/${etudiant.id}`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setCvs(data)
            })
    }

    const deleteCV = async (cv) => {
        //await CVService.deleteCV(cv).then(updateCvs())
        const res = await fetch(`http://localhost:9191/cv/delete/${cv.id}`, { method: 'DELETE' })
        await res.json().then(updateCvs())
    }

    const download = (cv) => {
        saveAs(`http://localhost:9191/cv/pdf/${cv.id}`)
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "PENDING":
                return <AiOutlineClockCircle color="gold" size="48px" />
            case "ACCEPTED":
                return <AiOutlineCheckCircle color="green" size="48px" />
            case "REJECTED":
                return <AiOutlineCloseCircle color="red" size="48px" />
            default:
                return;
        }
    }

    useEffect(() => {
        if (loggedUser.isLoggedIn) {
            UserService.getUserByEmail(loggedUser.courriel)
                .then(data => {
                    setEtudiant(data)
                    //await CVService.updateCVsEtudiant(data.id).then(data => { setCvs(data)  })
                    fetch(`http://localhost:9191/cv/etudiant/${data.id}`)
                        .then(res => {
                            return res.json()
                        })
                        .then(data => {
                            setCvs(data)
                        })
                })
        }
    }, [])

    const cvList = cvs.map((cv) =>
        <tr key={cv.id.toString()}>
            <td>{cv.nom}</td>
            <td>{cv.dateSoumission}</td>
            <td><button onClick={() => deleteCV(cv)}>effacer</button></td>
            <td><button onClick={() => download(cv)}>télécharger</button></td>
            <td>{getStatusIcon(cv.status)}</td>
        </tr>);


    return (
        <div>
            {cvs.length > 0 ?
                <table>
                    <tr>
                        <th>nom du fichier</th>
                        <th>Date de soumission</th>
                        <th>effacer</th>
                        <th>télécarger</th>
                        <th>Statut du CV</th>
                    </tr>
                    {cvList}
                </table>
                :
                <p style={{ textAlign: "center" }}>Déposez votre cv <Link to="/dropCv" style={{ color: "blue" }}>ici</Link></p>
            }
        </div>
    )
}

export default VoirCVState

