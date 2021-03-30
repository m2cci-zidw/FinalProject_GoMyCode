import { Route, Switch } from 'react-router';

import LandPage from "./Pages/LangPage/LandPage";
import SignUp from "./Pages/SignUp/SignUp";
import SignIn from "./Pages/SignIn/SignIn";
import Profil from "./Pages/Profil/Profil";
import Errors from "./Pages/Errors/Errors";
import  NavBar  from './Components/NavBar/NavBar';

// import './App.css';

function App() {
  return (
    <div >
      
      <NavBar/>
      <Switch>
       <Route exact path='/' component={LandPage} />
        <Route  path='/signup' component={SignUp} />
        <Route  path='/signin' component={SignIn} />
        <Route  path='/profil' component={Profil} />
        <Route  path='/*' component={Errors} />

      </Switch>
    </div>
  );
}

export default App;
