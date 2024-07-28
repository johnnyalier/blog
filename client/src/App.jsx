import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Post from './pages/Post';
import SignUp from './pages/SignUp';
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PrivateAdminRoute from "./components/PrivateAdminRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

const App = () =>{

	return (
		<BrowserRouter>
			<Header />
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<SignIn />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route element={<PrivateAdminRoute />}>
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/update-post/:postId" element={<UpdatePost />} />
                </Route>
                <Route path="/projects" element={<Projects />} />
                <Route path="/post/:postSlug" element={<Post />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
            <Footer />
        </BrowserRouter>
	)
}

export default App
