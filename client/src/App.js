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
  const [backup, setBackup] = useState("");
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [method, setMethod] = useState("");

  const [status, setStatus] = useState([]);
  const [user, setUser] = useState("");
  const [change, setChange] = useState(false);

  return (
    <FormContext.Provider
      value={
        {
          backup, setBackup, status, setStatus, change, setChange,
          id, setId, open, setActive, setOpen, active,
          user, setUser, data, setData, method, setMethod
        }
      }>
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
