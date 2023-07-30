import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from "./components/Login";
import {Home} from "./components/Home";
import Navigation from './components/Nav';
import {Logout} from './components/Logout';

function App() {
    return (
        <BrowserRouter>
            <Navigation></Navigation>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
