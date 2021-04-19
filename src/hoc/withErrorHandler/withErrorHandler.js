import React, {Component} from 'react';

import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null,
            initialized: false
        }
        
        componentDidMount() {
            this.requestInterceptor = axios.interceptors.request.use(request => {
                this.setState({error: null});
                return request;
            }, null)

            this.responseInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });

            this.setState({initialized: true});
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.requestInterceptor);
            axios.interceptors.response.eject(this.responseInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render() {
            if (!this.state.initialized) 
                return null;

            return (
                <>
                    <Modal 
                        show={this.state.error} 
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </>
            );
        }
    }
}

export default withErrorHandler;