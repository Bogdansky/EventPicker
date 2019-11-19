import React, { Fragment } from 'react'
import { Route, Redirect } from 'react-router';
import $ from 'jquery'
import UpdateBook from './UpdateBook'
import DeleteBook from './DeleteBook'
import './Book.css'

export default class Book extends React.Component {
    static displayName = Book.name;

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            name: this.props.name,
            author: this.props.author,
            cover: this.props.cover,
            pages: this.props.numberOfPages,
            days: 1,
            wantsToRead: false,
            reading: false,
            error: false,
            deleted: false
        }

        this.getPages = this.getPages.bind(this);
        this.setCover = this.setCover.bind(this);
        this.getReadLink = this.getReadLink.bind(this);
        this.changeNumber = this.changeNumber.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleSaveCover = this.handleSaveCover.bind(this);
        this.letReadOrChangeMind = this.letReadOrChangeMind.bind(this);
    }

    getPages() {
        return `${this.state.pages} pages`;
    }

    getReadLink() {
        let userId = localStorage.getItem("userId") || 0;
        return `https://reading-organizer.azurewebsites.net/api/users/${userId}/books/${this.state.id}?days=${this.state.days}`;
    }

    setCover(newCover) {
        this.setState({ cover: newCover });
    }

    letReadOrChangeMind(e) {
        e.preventDefault();
        let value = this.state.wantsToRead;
        this.setState({ wantsToRead: !value });
    }

    changeNumber(e) {
        e.preventDefault();
        this.setState({ days: e.target.value });
    }

    handleSaveCover(e) {
        //
        e.preventDefault();
        let form = new FormData();
        let cover = $('#inputCover').val();
        form.append("file", $('input[type="file"]')[0].files[0]);

        $.ajax({
            type: "PUT",
            url: `https://reading-organizer.azurewebsites.net/api/books/${this.state.id}/cover${cover ? `?cover=${cover}` : ""}`,
            data: form,
            processData: false,
            contentType: false,
            cache: false,
            success: res => this.setState({ cover: res.cover }),
            error: data => console.log(data)
        })
    }

    handleRemove(book) {
        this.setState({ deleted: true }, this.props.remove(book));
    }

    handleSubmit(e) {
        e.preventDefault();
        let options = {
            method: "POST",
            mode: "cors"
        };
        fetch(this.getReadLink(), options)
            .then(response => {
                if (response.status && response.status > 399) {
                    localStorage.setItem("statusCode", response.status);
                    localStorage.setItem("message", response.statusText);
                    this.setState({ error: true });
                } else {
                    this.setState({ reading: true });
                }
            })
            .catch(error => {
                localStorage.setItem("message", error.message);
                this.setState({ error: true });
            });
    }

    render() {
        if (this.state.error) {
            return (<Redirect to='/error' />);
        }

        return this.state.reading ? 
            <Redirect to="/boards" />
            :
            this.state.wantsToRead ?
                (
                <form onSubmit={this.handleSubmit} hidden={this.state.deleted}>
                    <table className="infobox">
                        <tbody>
                            <tr className="header"><td colSpan={2}>{this.state.name}</td></tr>
                            <tr className="headerImage">
                                <td colSpan={2}>
                                    <a onClick={this.letReadOrChangeMind} target="_blank"><img src={this.state.cover} /></a>
                                </td>
                            </tr>
                            <tr>
                                <th>Author</th>
                                <td>{this.state.author}</td>
                            </tr>
                            <tr>
                                <th>Pages</th>
                                <td>{this.state.pages}</td>
                            </tr>
                            <tr>
                                <th>Choose number of days</th>
                                <td>
                                    <input className="form-control" type="number" min={1} max={this.state.pages} value={this.state.days} onChange={this.changeNumber} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="btn-group">
                                        <button className="btn btn-warning">Read</button>
                                        <UpdateBook setCover={this.setCover} exist={Boolean(this.state.cover)} handleSaveCover={this.handleSaveCover} />
                                        <DeleteBook bookId={this.state.id} remove={this.props.remove} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            )
            :
                (
            <div className="t-col t-col_8 t-align_center t336__block t336__show_hover rounded shadow" hidden={this.state.deleted}>
                <a onClick={this.letReadOrChangeMind} target="_blank">
                    <div className="t336__table">
                        <div className="t336__cell t-align_center t-valign_middle">
                            <div className="t336__bg t336__animation_fast t336__bg_animated t-bgimg loaded" bgimgfield="img" data-original={this.state.cover} style={{ backgroundImage: `url(${this.state.cover})` }} src=""></div>
                            <div className="t336__overlay t336__animation_fast"></div>
                            <div className="t336__textwrapper t336__animation_fast t336__textwrapper_animated">
                                <div className="t336__textwrapper__content">
                                    <div className="t336__title t-title t-title_md" field="title">
                                        <div className="book_description">
                                            <blockquote className="blockquote-reverse">
                                                <p className="jello"><i>{this.state.name} ({this.getPages()})</i></p>
                                                <footer className="jello-main"><i>{this.state.author}</i></footer>
                                            </blockquote>
                                        </div>    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            );
    }
}