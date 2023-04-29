import './App.css';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import { createContext, useState } from 'react';
export const FormContext = createContext({});

function App() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState("");
  const [id, setId] = useState("");
  const [reminder, setReminder] = useState(0);
  const [user, setUser] = useState("");

  return (
    <FormContext.Provider value={{ id, setId, open, setActive, setOpen, active, value, setValue, setReminder, reminder,user,setUser }}>
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path='/signup'
              element={<SignUp />}
            />
            <Route
              path='/login'
              element={<Login />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </FormContext.Provider>
  );
}

export default App;
