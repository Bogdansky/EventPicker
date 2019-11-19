import React from 'react'

export default class Progress extends React.Component{
    static displayName = Progress.name;

    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            userId: props.userId,
            bookId: props.bookId,
            day: props.day,
            done: props.done,
            task: props.task,
            previousStatus: "",
            currentStatus: props.done.toString()
        };
        this.getClass = this.getClass.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.handleChangeState = this.handleChangeState.bind(this);
        this.handleChangePages = this.handleChangePages.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
    }

    getClass(done, day){
        if (done){
            this.setState({currentStatus: "Выполнено"});
            return "col md-4 success";
        }
        else{
            let now = new Date();
            if (day > now){
                this.setState({currentStatus: "Ожидается"});
                return "col md-4 default";
            }
            this.setState({currentStatus: "Не выполнено"});
            return "col md-4 fail";
        }
    }

    handleChangeState(e) {
        const options = {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "day": this.state.day,
                "done": !this.state.done,
                "task": this.state.task
            })
        };
        console.log(options.body);
        this.updateProgress(options);
    }

    handleChangeDate(e) {
        if (this.state.day != e.target.value) {
            if (!e.target.value || e.target.value == "") {
                e.target.value = this.state.day;
                return;
            }
            const options = {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "day": e.target.value,
                    "done": this.state.done,
                    "task": this.state.task
                })
            };
            console.log(options.body);
            this.updateProgress(options);
        }
    }

    updateProgress(options) {
        try {
            const url = `https://reading-organizer.azurewebsites.net/api/users/${this.state.userId}/books/${this.state.bookId}/progress/${this.state.id}`;
            fetch(url, options)
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.message == "Updating is success") {
                        this.setState({
                            day: res.progress.day,
                            done: res.progress.done
                        }, this.props.updateProgress(res.progress));
                    } else {
                        console.log(res.data.message);
                    }
                })
                .catch(error => {
                    console.log(error.message); 
                })
        }
        catch (e) {
            console.log(e);
        }
    }

    handleChangePages(e) {
        const options = {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "task": {
                    id: this.state.task.id,
                    pages: e.target.value
                }
            })
        };
        this.updateTask(options);
    }

    updateTask(options) {
        try {
            const url = `https://reading-organizer.azurewebsites.net/api/tasks/${this.state.task.id}`;
            fetch(url, options)
                .then(res => res.json())
                .then(res => {
                    if (res.message == "Update is success") {
                        let progress = {
                            id: this.state.id,
                            day: this.state.day,
                            done: this.state.done,
                            task: res.task
                        };
                        this.props.updateProgress(progress);
                        //this.setState({
                        //    task: progress.task || this.state.task
                        //}, );
                    }
                })
                .catch(error => console.log(error));
        }
        catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div className="form-inline">
                <div className="form-check">
                    <input type="checkbox" className="todo__checkbox" onChange={this.handleChangeState} checked={this.state.done}/>
                </div>
                <input className="form-control" type="date" value={this.state.day} onChange={this.handleChangeDate} disabled={this.state.done} />
                <input type="number" className="pages form-control" onChange={this.handleChangePages} value={this.state.task.pages} disabled={this.state.done} />
            </div>
        )
    }
}