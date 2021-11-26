import Swal from "sweetalert2";

const urlBase = 'http://localhost:9191/user'
const UserService = {
    getUserByEmail: async (email) => {
        const res = await fetch(urlBase + '/' + email)
        const data = await res.json()
        return data
    },

    getListAllEtudiants: async () => {
        const res = await fetch(urlBase + '/etudiants')
        const data = await res.json()
        return data
    },

    getListAllEtudiantsAllSession: async () => {
        const res = await fetch(urlBase + '/etudiants/allSession')
        const data = await res.json()
        return data
    },

    getListEtudiantWithoutSuperviseur: async () => {
        const res = await fetch(urlBase + '/etudiants/nosuperviseur')
        const data = await res.json()
        return data
    },

    getListAllSuperviseurs: async () => {
        const res = await fetch(urlBase + '/superviseurs')
        const data = await res.json()
        return data
    },

    getListAllSuperviseursAllSession: async () => {
        const res = await fetch(urlBase + '/superviseurs/allSession')
        const data = await res.json()
        return data
    },

    getListAllMoniteurs: async () => {
        const res = await fetch(urlBase + '/moniteurs')
        const data = await res.json()
        return data
    },

    getListAllMoniteursAllSession: async () => {
        const res = await fetch(urlBase + '/moniteurs/allSession')
        const data = await res.json()
        return data
    },

    getListEtudiantSuperviseur: async (superviseurId) => {
        const res = await fetch(urlBase + '/superviseur/etudiants/' + superviseurId)
        const data = await res.json()
        return data
    },

    saveSuperviseurEtudiants: async (etudiants, idSuperviseur) => {
        const res = await fetch(`http://localhost:9191/user/superviseur/${idSuperviseur}/etudiants`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(etudiants)
            })
        if (!res.ok) {
            errorAlert("Incapable de sauver la liste d'etudiants sélectionnés")
            return
        }
        const data = await res.json()
        return data

    },

    getMoniteur: async (id) => {
        //     //const res = await fetch(urlBase + '/moniteur/' + id)
        //     //const data = await res.json()
        //     //return data
    },

    getGestionnaires: async () => {
        const res = await fetch(urlBase + '/gestionnaires')
        const data = await res.json()
        return data
    },
}
const errorAlert = (errorMessage) => {
    Swal.fire(
        'Cancelled',
        errorMessage,
        'error'
    )
}

const toastError = (errorMessage) => {
    Swal.fire({
        toast: true,
        icon: 'error',
        title: errorMessage,
        animation: false,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
}

export default UserService