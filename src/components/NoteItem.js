import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title ">{note.title}</h5>
            <i
              className="ri-delete-bin-5-line mx-2"
              onClick={() => {
                deleteNote(note._id).then(() => {
                  props.showAlert("Note Deleted Succesfully", "success");
                });
              }}
            ></i>
            <i
              className="ri-edit-box-line mx-2"
              onClick={() => {
                updateNote(note);
              }}
            ></i>
          </div>
          <p className="card-text">{note.description} </p>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
