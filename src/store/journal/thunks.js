import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import { fileUpload } from '../../helpers/fileUpload';
import { loadNotes } from '../../helpers/loadNotes';
import {
  addNewEmptyNote,
  deleteNoteById,
  noteUpdated,
  savingNewnote,
  setActiveNote,
  setNotes,
  setPhotosToActiveNote,
  setSaving,
} from './journalSlice';

export const startNewNote = () => {
  return async (dispatch, getState) => {
    dispatch(savingNewnote());
    // gettate viene de redux-thunk y es una función que permite obtener el estado actual de la aplicación
    const { uid } = getState().auth;

    const newNote = {
      title: '',
      body: '',
      imageUrls: [],
      date: new Date().getTime(),
    };
    // creamos una nueva colección en la base de datos de firebase con el uid del usuario autenticado y la colección journal y la colección notes
    // y creamos un nuevo documento en esa colección con el objeto newNote
    const newDoc = await addDoc(
      collection(FirebaseDB, `${uid}/journal/notes`),
      newNote
    );
    newNote.id = newDoc.id;

    dispatch(addNewEmptyNote(newNote));
    dispatch(setActiveNote(newNote));
  };
};

export const startLoadingNotes = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().auth;
    if (!uid) throw new Error('No existe el uid del usuario');
    const notes = await loadNotes(uid);
    dispatch(setNotes(notes));
  };
};

export const startSaveNote = (note) => {
  return async (dispatch, getState) => {
    dispatch(setSaving());
    const { uid } = getState().auth;
    if (!uid) throw new Error('No existe el uid del usuario');

    const { active: note } = getState().journal;

    const noteToFirestore = { ...note };
    delete noteToFirestore.id;

    const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note.id}`);
    await setDoc(docRef, noteToFirestore, { merge: true });
    dispatch(noteUpdated(note));
  };
};

export const startUploadingFiles = (files = []) => {
  return async (dispatch) => {
    dispatch(setSaving());
    const fileUploadPromises = [];
    for (const file of files) {
      fileUploadPromises.push(fileUpload(file));
    }
    const photosUrl = await Promise.all(fileUploadPromises);
    dispatch(setPhotosToActiveNote(photosUrl));
  };
};

export const startDeletingNote = () => {
  return async (dispatch, getState) => {
    const { active: note } = getState().journal;
    const { uid } = getState().auth;
    const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note.id}`);
    await deleteDoc(docRef);
    dispatch(deleteNoteById(note.id));
  };
};
