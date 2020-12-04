import React, { useState } from 'react';
import { UserContext } from "./context/user";
import { Layout } from 'antd'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
/** Private routes */
import PrivateRoute from './components/privateRoute'
import PrivateRouteAgent from './components/privateRouteAgent'
/** Components - PUBLIC */
import Nav from './components/nav'
import NavLogSign from './components/navlogsign'
import Home from './components/home'
import Properties from './components/propertiesGrid'
import PropertyPage from './components/propertyPage'
import Verification from './components/verification'
import LoginForm from './components/login'
import SignupForm from './components/signup'
import ResetPassword from './components/resetPass'
import ResetPassVerification from './components/resetPassVerification'
import NotFound from './components/404'
import NotPermitted from './components/401'
/** Componentns - PRIVATE */
import NavUser from './components/navuser'
import UserProfile from './components/userProfile'
import ChangePassword from './components/changePass'
import Messages from './components/messages'
import MessagesThread from './components/messagesThread'
import MessagesNotification from './components/messagesNotification'
/** Componentns - AGENTS ONLY */
import MyProperties from './components/myProperties'
import MyProperty from './components/myProperty'
import CreateListing from './components/createListing'
import ManageCategories from './components/manageCategories'
import EditCategory from './components/editCategory'

const { Header, Content, Footer } = Layout;

/**
 * Wrapper of all available routes and assigned components 
 * When user is logged in, set up polling for messages
 * @category Main APP.js
 * @component
 */
function App() {

  const existingTokens = JSON.parse(localStorage.getItem("user"));
  const [authUser, setAuthUser] = useState(existingTokens);
  /** Save user data in localStorage after log in */
  function setTokens(data) {
    localStorage.setItem("user", JSON.stringify(data));
    setAuthUser(data);
  }

  return (
    <div>
      {/* Poll for messages  */}
      {authUser
        &&
        <MessagesNotification user={authUser} />
      }

      <UserContext.Provider value={{ authUser, setAuthUser: setTokens }}>
        <Router>
          <Layout>
            <Header>
              <Nav />
              {authUser
                ? <NavUser />
                : <NavLogSign />
              }
            </Header>
            <Content>
              <Switch>
                {/* PUBLIC ROUTES */}
                <Route exact path="/properties?category">
                  <Properties />
                </Route>
                <Route exact path="/properties/:id">
                  <PropertyPage />
                </Route>
                <Route exact path="/properties/">
                  <Properties />
                </Route>
                <Route exact strict path="/verification/resetpass/:query">
                  <ResetPassVerification />
                </Route>
                <Route exact strict path="/verification/:query">
                  <Verification />
                </Route>
                <Route path="/login">
                  <LoginForm />
                </Route>
                <Route path="/signup">
                  <SignupForm />
                </Route>
                <Route path="/reset">
                  <ResetPassword />
                </Route>

                {/* PRIVATE ROUTES */}
                <PrivateRoute exact strict path="/profile/changepass">
                  <ChangePassword />
                </PrivateRoute>
                <PrivateRoute exact strict path="/profile">
                  <UserProfile />
                </PrivateRoute>
                <PrivateRoute exact strict path="/messages/archive/:id">
                  <MessagesThread />
                </PrivateRoute>
                <PrivateRoute exact strict path="/messages/:id">
                  <MessagesThread />
                </PrivateRoute>
                <PrivateRoute path="/messages">
                  <Messages />
                </PrivateRoute>

                {/* PRIVATE AGENT ROUTES */}
                <PrivateRouteAgent exact path="/admin/properties/:id">
                  <MyProperty />
                </PrivateRouteAgent>
                <PrivateRouteAgent path="/admin/properties">
                  <MyProperties />
                </PrivateRouteAgent>
                <PrivateRouteAgent path="/admin/createlisting">
                  <CreateListing />
                </PrivateRouteAgent>
                <PrivateRouteAgent path="/admin/category/:id">
                  <EditCategory />
                </PrivateRouteAgent>
                <PrivateRouteAgent path="/admin/categories">
                  <ManageCategories />
                </PrivateRouteAgent>

                <Route exact path="/404">
                  <NotFound />
                </Route>
                <Route exact path="/401">
                  <NotPermitted />
                </Route>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path='*'>
                  <NotFound />
                </Route>
              </Switch>

            </Content>

            <Footer style={{ textAlign: "center" }}>
              ©2020 We Sell Houses
            </Footer>
          </Layout>
        </Router>
      </UserContext.Provider>
    </div>
  )
}

export default App;
