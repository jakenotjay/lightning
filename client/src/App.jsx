import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import SignUpPage from './containers/SignUpPage.jsx';
import ReportPage from './containers/ReportPage.jsx';
import ReadingPage from './containers/ReadingPage.jsx';
import SignInPage from './containers/SignInPage.jsx';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/SignUp" component={SignUpPage} />
                <Route path="/reports" component={ReportPage} />
                <Route path="/report:reportID" component={ReadingPage} />
                <Route path="/" component={SignInPage} />
            </Switch>
        </Router>
    )
}

export default App;