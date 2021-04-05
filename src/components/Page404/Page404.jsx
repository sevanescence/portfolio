import { Component } from 'react';

class Page404 extends Component {
    constructor() {
        super();
        this.state = {
            secondsRemaining: 5,
        };
    }
    componentDidMount() {
        const redirectTimerId = setInterval(() => {
            if (this.state.secondsRemaining === 1) {
                clearInterval(redirectTimerId);
                window.location.pathname = '/';
            }
            this.setState({
                secondsRemaining: this.state.secondsRemaining - 1,
            });
        }, 1000);
    }
    render() {
        return (
            <div id='p404'>
                <h2>Hey there!</h2>
                <p>
                    It looks like you found an invalid page. Redirecting you
                    in&nbsp;
                    {this.state.secondsRemaining}
                </p>
            </div>
        );
    }
}

export default Page404;
