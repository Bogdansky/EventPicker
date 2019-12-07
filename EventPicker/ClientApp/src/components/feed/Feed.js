import React from 'react'

export class Feed extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            data: []
        }

        this.getOptions = this.getOptions.bind(this);

        fetch(`/api/events?page=0&offset=10`, this.getOptions("GET"))
        .then(response => response.json())
        .then(data => {
            if (data.statusCode){
                console.log(`${data.statusCode} - ${data.message}`)
            } else {
                this.setState({data});
            }
        })
        .catch(error => console.error(error))
    }

    getOptions(method, data){
        return {
            method, 
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        }
    }

    render(){
        return (
            <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>Title</th>
                        <th>Categories</th>
                        <th>Description</th>
                        <th>User name</th>
                        <th>Coordinates</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map(e => 
                        <tr key={JSON.stringify(e.coordinates)}>
                            <td>{e.title}</td>
                            <td>{e.categories}</td>
                            <td>{e.description}</td>
                            <td>{e.nickname}</td>
                            <td>{e.coordinates.latitude} {e.coordinates.longitude}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}