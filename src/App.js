import React from "react";
import Index from "./pages/index";
import Page404 from "./pages/page404";
import Home from "./pages/home";
import Cards from "./pages/postlist";
import AboutUsPage from "./pages/about";
import Reset from './pages/resetpass';
import Signup from "./pages/signup1";
import PhpPage from "./pages/php";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Homepage from "./pages/homepage";
import Bucket from "./pages/bucket";

const GlobalStyles = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
    }
`;

const App = () => {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Router>
      <GlobalStyles />
      <Switch>
      {/* <Route
          path="/"
          render={() => (isLoggedIn ? <Redirect to="/fp" /> : <Home />)}
        />
        <Route
          path="/login"
          render={() => (isLoggedIn ? <Redirect to="/fp" /> : <Index />)}
        />
        <Route
          path="/signup"
          render={() => (isLoggedIn ? <Redirect to="/fp" /> : <Signup />)}
        /> */}
        <Route exact path="/" component={Home} />
        <Route exact path="/index" component={Index} />
        <Route exact path="/bucket" component={Bucket} />
        <Route exact path="/about" component={AboutUsPage} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/reset" component={Reset} />
        <Route
        path="/bucket"
        render={() =>
          localStorage.getItem('token') ? (
            <Bucket/>
          ) : (
            <Redirect to="/index" />
          )
        }
      />
        <Route
        path="/home"
        render={() =>
          localStorage.getItem('token') ? (
            <Homepage/>
          ) : (
            <Redirect to="/index" />
          )
        }
      />
        <Route
        path="/cards"
        render={() =>
          localStorage.getItem('token') ? (
            <Cards />
          ) : (
            <Redirect to="/index" />
          )
        }
      />
        <Route
        path="/make"
        render={() =>
          localStorage.getItem('token') ? (
            <PhpPage />
          ) : (
            <Redirect to="/index" />
          )
        }
      />
        <Route component={Page404} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
