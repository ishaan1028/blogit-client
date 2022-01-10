import Profile from "./pages/Profile";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CommonContext from "./context/CommonContext";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useState } from "react";
import PrivateRoute from "./components/PrivateRoute";
import UpdateProfile from "./pages/UpdateProfile";
import Blogs from "./pages/Blogs";
import CreateBlog from "./pages/CreateBlog";
import ReadBlog from "./pages/ReadBlog";
import UpdateBlog from "./pages/UpdateBlog";

function App() {

  axios.defaults.baseURL = process.env.REACT_APP_BACKEND;

  const [isLoggedIn, SetIsLoggedIn] = useState(localStorage.getItem("token"));

  return <div className="App">
    <ToastContainer
      position="top-center"
    />
    <CommonContext.Provider value={{ isLoggedIn, SetIsLoggedIn }}>

      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/" exact ><Redirect to="/blogs" /></Route>
          <Route path="/home" exact ><Redirect to="/blogs" /></Route>

          <Route path="/blogs" exact component={Blogs} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />

          <PrivateRoute path="/blogs/create" exact component={CreateBlog} />
          <PrivateRoute path="/blogs/update/:id" exact component={UpdateBlog} />
          <PrivateRoute path="/profile" exact component={Profile} />
          <PrivateRoute path="/profile/edit" exact component={UpdateProfile} />

          <Route path="/blogs/:id" exact component={ReadBlog} />
        </Switch>
      </BrowserRouter>

    </CommonContext.Provider>
  </div>
}

export default App;
