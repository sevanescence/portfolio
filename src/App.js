import { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from 'react-router-dom';
import './App.css';
import GithubRedirect from './components/github_redir/Github';
import LandingPage from './components/landing/LandingPage';
import Page404 from './components/Page404/Page404';

class App extends Component {
    render() {
        return (
            <Router>
                <div id='main'>
                    <header>
                        <h2>
                            &lt;<span>MakotoMiyamoto</span> /&gt;
                        </h2>
                    </header>
                </div>
                <Switch>
                    <Route exact path='/'>
                        <LandingPage />
                    </Route>
                    <Route exact path='/github'>
                        <GithubRedirect />
                    </Route>
                    <Route path='*'>
                        <Page404 />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
