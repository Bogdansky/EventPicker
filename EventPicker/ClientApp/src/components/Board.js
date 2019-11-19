import React from 'react'
import Progress from './Progress'
import ProgressBar from 'react-bootstrap/ProgressBar'
import 'bootstrap'
import $ from 'jquery'

export default class Board extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            userId: props.userId,
            book: props.book,
            progress: props.progress
        };
        console.log(this.state.progress);
        this.hideProgress = this.hideProgress.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
    }

    hideProgress(e) {
        let id = this.state.book.name.replace(/ /g, '_');
        $(`#${id}`).attr("hidden", "hidden");
    }

    updateProgress(updatedProgress) {
        let elements = this.state.progress;
        let element = elements.find(p => p.id == updatedProgress.id);
        console.log(`update progress(${JSON.stringify(element)}) by replace with ${JSON.stringify(updatedProgress)}`);
        let index = elements.indexOf(element);
        elements[index] = updatedProgress;
        this.setState({ progress: elements });
    }

    render() {
        return (
            <div className="row">
                <div className="book">
                    <table className="infobox">
                        <tbody>
                            <tr className="header"><td colSpan={2} className="jello">{this.state.book.name}</td></tr>
                            <tr className="headerImage">
                                <td colSpan={2}>
                                    <img src={this.state.book.cover} />
                                </td>
                            </tr>
                            <tr>
                                <th>Author</th>
                                <td>{this.state.book.author}</td>
                            </tr>
                            <tr>
                                <th>Pages</th>
                                <td>{this.state.book.numberOfPages}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="progressPanel" className="progressContent col" style={{display: 'line'}}>
                    <button onClick={this.hideProgress} hidden>Hide</button>
                    <ProgressBar animated now={this.state.progress.reduce((counter, p) => {
                        if (p.done) {
                            return counter + p.task.pages;
                        }
                        return counter;
                    }, 0)} max={this.state.book.numberOfPages} />
                    <div id={this.state.book.name.replace(/ /g, '_')}>
                        {
                            this.state.progress.map(p => {
                                return (<div className=".col-xs-4" key={`${p.day}_${p.id}`}>
                                    <Progress key={p.id} userId={this.state.userId} bookId={this.state.book.id} updateProgress={this.updateProgress} {...p} />
                                </div>)
                            })
                        }
                    </div>
                </div>
            </div>
            );
    }
}