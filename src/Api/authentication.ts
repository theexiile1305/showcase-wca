
import {
  setUILoading, clearUILoading, openSnackbar,
  SetUILoadingAction, SetUIStopLoadingAction, OpenSnackbarAction,
} from 'src/Store/ui/UIActions';
import { Dispatch } from 'react';
import {
  saveUserData, SaveUserAction, logoutUser, LogoutUserAction,
} from 'src/Store/user/UserActions';
import firebase from './firebase';

export const signUp = (
  displayName: string, email: string, password: string, redirect: () => void,
) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | SaveUserAction
  | OpenSnackbarAction>,
): void => {
  dispatch(setUILoading());
  firebase.auth().languageCode = 'en';
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      const user = firebase.auth().currentUser;
      if (user) {
        user.updateProfile({ displayName });
        user.sendEmailVerification();
        dispatch(openSnackbar('Please verify your e-mail adress in order to sign in.'));
      }
      return user;
    })
    .then((user) => {
      dispatch(saveUserData(user));
      dispatch(clearUILoading());
      redirect();
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};

export const signInWithEmailPassword = (email: string, password: string, redirect: () => void) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | SaveUserAction
  | OpenSnackbarAction>,
): void => {
  dispatch(setUILoading());
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      if (!result.user?.emailVerified) {
        throw new Error('Please verify your e-mail adress in order to sign in.');
      }
      return result.user;
    })
    .then((user) => {
      dispatch(saveUserData(user));
      dispatch(openSnackbar('You\'ve been successfully signed in.'));
      dispatch(clearUILoading());
      redirect();
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};

export const signOut = () => (
  dispatch: Dispatch<OpenSnackbarAction | LogoutUserAction>,
): void => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(openSnackbar('You\'ve been successfully signed out.'));
      dispatch(logoutUser());
    })
    .catch((error) => dispatch(openSnackbar(error.message)));
};

export const resetPassword = (email: string, redirect: () => void) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction>,
): void => {
  dispatch(setUILoading());
  firebase.auth().languageCode = 'en';
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      dispatch(openSnackbar('You\'ve successfully reseted your password.'));
      dispatch(clearUILoading());
      redirect();
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};

export const changeDisplayName = (email: string, password: string, displayName: string) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction>,
): void => {
  dispatch(setUILoading());
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        user.updateProfile({ displayName });
        dispatch(openSnackbar('You\'ve successfully changed your username.'));
        dispatch(clearUILoading());
      }
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};

export const changeEmail = (email: string, password: string, newEmail: string) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction>,
): void => {
  dispatch(setUILoading());
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        user.updateEmail(newEmail);
        dispatch(openSnackbar('You\'ve successfully changed your email.'));
        dispatch(clearUILoading());
      }
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};

export const changePassword = (email: string, password: string, newPassword: string) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction>,
): void => {
  dispatch(setUILoading());
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        user.updatePassword(newPassword);
        dispatch(openSnackbar('You\'ve successfully changed your password.'));
        dispatch(clearUILoading());
      }
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};

export const deleteAccount = (email: string, password: string, redirect: () => void) => (
  dispatch: Dispatch<SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  | LogoutUserAction>,
): void => {
  dispatch(setUILoading());
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        user.delete();
        dispatch(openSnackbar('You\'ve successfully deleted your account.'));
        dispatch(logoutUser());
        dispatch(clearUILoading());
        redirect();
      }
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};
