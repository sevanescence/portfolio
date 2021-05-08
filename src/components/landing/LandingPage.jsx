import { Component } from 'react';
import './LandingPage.css';

class LandingPage extends Component {
    componentDidMount() {
        /** @type {HTMLElement[]} */
        const buttons = document.getElementsByClassName('fling');
        for (let button of buttons) {
            button.onmouseup = (e) => {
                setTimeout(() => {
                    e.target.blur();
                }, 250);
            };
        }
    }
    redirect() {
        setTimeout(() => {
            window.location.pathname = '/github';
        }, 250);
    }
    render() {
        return (
            <div id='landing'>
                <div id='left'>
                    <div id='pad'>
                        <div id='content'>
                            <div id='content-text'>
                                <h1>Hey there!</h1>
                                <p>
                                    This is my portfolio. It isn't quite actually completed yet, but you can find out about me
                                    and my work here:
                                </p>
                            </div>
                            <div id='buttons'>
                                <button id='github' class='fling' onClick={this.redirect}>
                                    Check out my GitHub
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='right'>
                    <div id='line'></div>
                </div>
            </div>
        );
    }
}

export default LandingPage;
