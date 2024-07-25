import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SignUp from './pages/SignUp';

const App = () =>{

	return (
		<BrowserRouter>
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
        // Add your routes here.
	)
}

export default App
