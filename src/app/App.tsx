import CalendarScreen from "./CalendarScreen";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import {getToday} from "./dateFunctions";
import { useEffect, useState } from "react";
import {getUser, IUser} from "./backend";
import { LoginScreen } from "./LoginScreen";
import { authContext } from "./authContext";

function App() {
  const month = getToday().substring(0, 7);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUser().then((user) => setUser(user), () => setUser(null));
  }, [])

  const onSignOut = () => {
    setUser(null);
  }

  if(user){
    return (
      <authContext.Provider value={{user, onSignOut}}>
          <Router>
            <Routes>
              <Route path="/calendar/:month" element={<CalendarScreen />} />
              <Route path="*" element={<Navigate to={`/calendar/${month}`}/>} />
            </Routes>
          </Router>
      </authContext.Provider>
    )
  }else{
    return <LoginScreen onSignIn={setUser} />
  }

}

export default App;
