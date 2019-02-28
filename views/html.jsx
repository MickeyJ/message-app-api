import React, {Component} from 'react'

export default class Html extends Component {
    render() {
        return (
            <html lang="en" >
                <head >
                    <base href={this.props.url} />
                    <title >{this.props.title}</title >
                    {/*<link rel='stylesheet' type='text/css' href='/print.css' />*/}
                    <link rel='stylesheet' type='text/css' href='/style.css' />
                    <style >

                    </style >
                </head >
                <body >
                    {this.props.children}
                </body >
            </html >
        )
    }
}
