import NoteContext from "./noteContext";
const { useState } = require("react");

const NoteState = (props) => {
  const host = "http://localhost:3005";
  const authToken = localStorage.getItem('token')
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // get current user name and set it to the navbar title using useState
  const [userName, setUserName] = useState(null);
  
  const getUser = async () => {
    // API Call
    try {
      const res = await fetch(`${host}/api/auth/getuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });
      const data = await res.json();
      setUserName(data.name);
    } catch (error) {
      console.log(error);
    }
  };


  const getAllNotes = async () => {
    // API Call
    try {
      const res = await fetch(`${host}/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });
      const json = await res.json();
      setNotes(json);
    } catch (error) {
      console.log(error);
    }
  };

  //  Add Note
  const addNote = async (title, description, tag) => {
    // to do API Call
    try {
      const res = await fetch(`${host}/addNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ title, description, tag }),
      });
      const note = await res.json();
      setNotes(notes.concat(note))
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    // API Call
    try {
      const res = await fetch(`${host}/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });
      await res.json();
      const newNotes = notes.filter((note) => {
        return note._id !== id;
      });
      setNotes(newNotes);
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Note
  const editNote = async (id, title, description, tag) => {
    // api call
    try {
      const res = await fetch(`${host}/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ title, description, tag }),
      });
      await res.json();
      // display notes in the UI without page reload
      let newNotes = JSON.parse(JSON.stringify(notes)); // deep copy of notes array using JSON methods
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if (element._id === id) {
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
      }
      setNotes(newNotes);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getAllNotes , getUser, userName }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
