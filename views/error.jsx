import React, {Component} from 'react'
import Html from './html'

export default class Errors extends Component {
    constructor(props = {}) {
        super(props)
    }

    render() {
        if (this.props.error.status) {
            return (
                <Html title={this.props.title} >
                    <section >

                        <h2>{this.props.error.name || 'Error'}:&nbsp;
                            <span style={{ color: 'crimson'}}>
                                {this.props.message}
                            </span>
                        </h2 >
                        <h3>Status:&nbsp;
                            <span style={{ color: 'gold'}}>
                                {this.props.error.status}
                            </span>
                        </h3>
                        <pre>{this.props.error.stack}</pre >

                    </section >
                </Html >
            )
        } else {
            return (
                <Html title={this.props.title} >
                    <section >

                        <h2>Error:&nbsp;
                            <span style={{ color: 'crimson'}}>
                                {this.props.message}
                            </span>
                        </h2>

                        <pre>{this.props.error.stack}</pre >

                    </section >
                </Html >
            )
        }
    }
}