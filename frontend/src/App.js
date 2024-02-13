
import "./App.css";
import RegisterForm from "./Pages/RegisterForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./Pages/LoginForm";
import ProfileForm from "./Pages/ProfileForm";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/Profile" element={<ProfileForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
