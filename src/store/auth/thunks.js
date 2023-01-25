import {
  loginInWithEmailAndPassword,
  logoutFirebase,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from '../../firebase/providers';
import { clearNotesLogout } from '../journal/journalSlice';
import { checkingCredentials, login, logout } from './authSlice';

export const checkingAuthenticating = (email, password) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
    // setTimeout(() => {
    //   dispatch(login({ uid: '123', name: 'Fernando' }));
    // }, 3500);
  };
};

export const startGoogleLogin = () => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
    const result = await signInWithGoogle();
    if (!result.ok) {
      return dispatch(logout(result.errorMessage));
    }
    dispatch(login(result));
  };
};

export const starCreateUserWithEmailAndPassword = ({
  email,
  password,
  displayName,
}) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
    const { ok, uid, photoURL, errorMessage } =
      await registerWithEmailAndPassword({
        email,
        password,
        displayName,
      });
    if (!ok) {
      return dispatch(logout({ errorMessage }));
    }
    dispatch(login({ uid, displayName, email, photoURL }));
  };
};

export const startLoginWithEmailAndPassword = ({ email, password }) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
    const resp = await loginInWithEmailAndPassword({ email, password });
    if (!resp.ok) {
      return dispatch(logout({ errorMessage: resp.errorMessage }));
    }
    dispatch(login(resp));
  };
};

export const startLogout = () => {
  return async (dispatch) => {
    await logoutFirebase();
    dispatch(clearNotesLogout());
    dispatch(logout({ errorMessage: null }));
  };
};
