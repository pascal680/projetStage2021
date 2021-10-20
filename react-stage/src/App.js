import './App.css';
import FormEtudiant from './component/inscriptionEtudiant/FormEtudiant'
import FormSuperviseur from './component/inscriptionSuperviseur/FormSuperviseur';
import FormMoniteur from './component/inscriptionMoniteur/FormMoniteur'
import LoginUser from './component/loginUser/LoginUser';
import Navbar from './component/navbar/NavbarHTML'
import Home from './component/Home/Home';
import Offres from './component/gestionOffres/Offres';
import FormOffre from "./component/deposeOffreDeStage/FormOffre";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import UserInfo, { UserInfoContext } from './contexts/UserInfo';
import AccountDetails from './component/AccountDetails/AccountDetails';
import Offre from './component/gestionOffres/Offre';
import VerificationCV from './component/gestionCV/VerificationCV';
import VerificationCVList from './component/gestionCV/VerificationCVList';



function App() {
  return (
      <Router>
        <div className="App">
          <UserInfo>
            <Navbar />
            <div>
              <Switch>

                <Route exact path="/"><Home /></Route>
                <Route exact path="/etudiant"><FormEtudiant /></Route>
                <Route exact path="/superviseur"><FormSuperviseur /></Route>
                <Route exact path="/moniteur"><FormMoniteur /></Route>
                <Route exact path="/account"><AccountDetails /></Route>
        	      <Route exact path="/offres"><Offres/></Route>
                <Route exact path="/gestion/cv"><VerificationCVList/></Route>
                <Route exact path="/gestion/cv/:id"><VerificationCV/></Route>
                <Route exact path="/login"><LoginUser /></Route>

                <Route exact path="/newOffre"><FormOffre/></Route>

              </Switch>
              {/* <UserInfoContext.Consumer>
        {(user) => (user.isLoggedIn ? <Redirect push to = "/moniteur"/>: null)}
        </UserInfoContext.Consumer> */}
            </div>
          </UserInfo>
        </div>

      </Router>
  );
}


export default App;
