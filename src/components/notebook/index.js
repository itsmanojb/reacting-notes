import React from 'react';
import firebase from '../../firebase';
import PropTypes from 'prop-types';
import iconSidebar from '../../assets/img/sidebar.png';
import iconDelete from '../../assets/img/trash.png';
import iconNew from '../../assets/img/new.png';
import iconSearch from '../../assets/img/search.png';
import iconText from '../../assets/img/t-t.png';
import iconTable from '../../assets/img/grid.png';
import iconUser from '../../assets/img/user.png';
import iconTodo from '../../assets/img/check.png';
import iconLock from '../../assets/img/locked.png';
import iconShare from '../../assets/img/share.png';
import './notes.css';

class Notebook extends React.Component {

    constructor(props) {
        super(props);
        this.database = firebase.database().ref().child('notes');
        const dateOnly  = new Date().toLocaleDateString();
        this.state = {
            notes: [],
            noteSelected: false,
            selectedNoteIndex: null,
            selectedNote: null,
            sidebarOpened: true,
            newNote: false,
            noteTitle: '',
            noteBody: '',
            addedOn: dateOnly
        };
        this.selectNote = this.selectNote.bind(this)
        this.toggleSidebar = this.toggleSidebar.bind(this)
        this.deleteNote = this.deleteNote.bind(this)
        this.newNote = this.newNote.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.writeNote = this.writeNote.bind(this);
    }

    componentWillMount() {

        const previousNotes = this.state.notes;
        this.database.on('child_added', snap => {
            previousNotes.push({
                id: snap.key,
                noteTitle: snap.val().noteTitle,
                noteBody: snap.val().noteBody,
                addedBy: snap.val().addedBy,
                addedOn: snap.val().addedOn
            })

            const myNotes = previousNotes.filter(note => {
                return note.addedBy === this.props.user.email
            })

            this.setState({
                notes: myNotes,
                selectedNote: myNotes[myNotes.length - 1],
                selectedNoteIndex : myNotes.length - 1,
                noteSelected: true
            })
        })

        this.database.on('child_removed', snap => {
            for (var i = 0; i < previousNotes.length; i++) {
                if (previousNotes[i].id === snap.key) {
                    previousNotes.splice(i, 1);
                }
            }

            const myNotes = previousNotes.filter(note => {
                return note.addedBy === this.props.user.email
            })

            this.setState({
                notes: myNotes,
                noteSelected: false,
                selectedNoteIndex : null
            })
        })
    }

    handleChange(e) {
        this.setState({
          [e.target.name]: e.target.value
        });
    }

    selectNote(note, id){
        this.setState({
            noteSelected: true,
            newNote: false,
            selectedNoteIndex : id,
            selectedNote : note
        })
    }

    deleteNote(){
        const noteId = this.state.selectedNote.id;
        this.database.child(noteId).remove();        
    }

    newNote(){
        this.setState({
            selectedNoteIndex: null,
            noteSelected: false,
            newNote: true
        })
    }

    addNote(note){
        this.database.push().set(note);

        this.setState({
            noteTitle: '',
            noteBody: '',
            selectedNoteIndex: null,
            newNote : false,
            noteSelected : false
        });
    }

    toggleSidebar() {
        this.setState({
            sidebarOpened : !this.state.sidebarOpened
        })
    }

    writeNote(e) {
                
        const newNote = {
          noteTitle: this.state.noteTitle || 'Untitled',
          noteBody: this.state.noteBody,
          addedBy: this.props.user.email,
          addedOn: this.state.addedOn
        };

        this.addNote(newNote);

    }

    render() {

        return (
            <div>
                <div className="alert">App is not optimized for smaller devices. Kindly switch to laptop, desktop or mac.</div>
                <div className={ this.state.sidebarOpened ? "titlebar" : "titlebar shrinked" }>
                    <div className="buttons">
                        <div className="close">
                            <a className="closebutton" onClick={this.props.onLogout} title="Logout"><span><strong>x</strong></span></a>
                        </div>
                        <div className="minimize">
                            <a className="minimizebutton"><span><strong>&ndash;</strong></span></a>
                        </div>
                        <div className="zoom">
                            <a className="zoombutton"><span><strong>+</strong></span></a>
                        </div>
                    </div>
                    <div className="actions">
                        <a className="osxbutton" onClick={() => this.toggleSidebar()}>
                            <img src={iconSidebar} alt="sidebar"/>
                        </a>
                        <a className="osxbutton" onClick={() => this.deleteNote()}>
                            <img src={iconDelete} alt="trash" className="d"/>
                        </a>
                        <a className="osxbutton" onClick={() => this.newNote()}>
                            <img src={iconNew} alt="new"/>
                        </a>
                    </div>
                    <div className="tools">
                        <div className="formating">
                            <a className="osxbutton">
                                <img src={iconLock} alt="lock" className="d"/>
                            </a>
                            <a className="osxbutton">
                                <img src={iconTable} alt="table" className="d"/>
                            </a>
                            <a className="osxbutton">
                                <img src={iconTodo} alt="todo"/>
                            </a>
                            <a className="osxbutton">
                                <img src={iconText} alt="format"/>
                            </a>
                        </div>
                        <div className="search">
                            <a className="osxbutton">
                                <img src={iconUser} alt="log in" className="u"/>
                                {/* {this.props.user.displayName} */}
                            </a>
                            <a className="osxbutton">
                                <img src={iconShare} alt="share" className="d"/>
                            </a>
                            <a className="osxbutton s">
                                <img src={iconSearch} alt="search" className="s"/> Search
                            </a>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className={ this.state.sidebarOpened ? "notes" : "notes no-sidebar" }>
                        <div className={ this.state.sidebarOpened ? "sidebar" : "sidebar collapsed" }>
                            <h4>On this notebook</h4>
                            <ul>
                                <li className="selected">Notes</li>
                                {/* <li>Recently Deleted</li> */}
                            </ul>
                        </div>
                        <div className="all-notes">
                            {this.state.newNote && <div className="notes-list-item selected">
                                <div className="note">
                                    <h4 className="title">{this.state.noteTitle === '' ? 'New Note' :  this.state.noteTitle}</h4>
                                    <p className="gist">
                                        <span className="meta">{this.state.addedOn}</span>
                                        <span className="short-text">{this.state.noteBody === '' ? 'No additonal text' : this.state.noteBody}</span>
                                    </p>
                                </div>
                            </div>
                            }
                            {this.state.notes.map((note, i) => {
                                return (

                                    <div key={i} className={this.state.selectedNoteIndex === i ? "notes-list-item selected" : "notes-list-item"} onClick={() => this.selectNote(note, i)}>
                                        <div className="note">
                                            <h4 className="title">{note.noteTitle}</h4>
                                            <p className="gist">
                                                <span className="meta">{note.addedOn}</span>
                                                <span className="short-text">{note.noteBody}</span>
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </div>
                        <div className="notes-view">
                            {this.state.notes.length > 0 && this.state.noteSelected &&
                                <div className="oldnote">
                                    <div className="dateHeader">{this.state.selectedNote.addedOn}</div>
                                    <input type="text" readOnly className="notetitle" value={this.state.selectedNote.noteTitle}/>
                                    <textarea className="editNoteBox" readOnly value={this.state.selectedNote.noteBody}></textarea>
                                </div>
                            }
                            {this.state.newNote &&  
                                <div className="newnote">
                                    <div className="dateHeader">{this.state.addedOn}</div>
                                    <input name="noteTitle" id="noteTitle" className="notetitle" placeholder="New Note" autoComplete="off" onChange={this.handleChange} value={this.state.noteTitle} />
                                    <textarea name="noteBody" id="noteBody" className="editNoteBox" onChange={this.handleChange} value={this.state.noteBody} onBlur={this.writeNote}></textarea>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    };

}

Notebook.propTypes = {
    onLogout: PropTypes.func
};

export default Notebook;