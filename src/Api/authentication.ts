
import {
  setUILoading, clearUILoading, openSnackbar,
  SetUILoadingAction, SetUIStopLoadingAction, OpenSnackbarAction,
} from 'src/Store/ui/UIActions';
import {
  saveUserData, SaveUserAction, logoutUser, LogoutUserAction,
} from 'src/Store/user/UserActions';
import firebase from './firebase';

export const signUpWithEmailPassword = (email: string, password: string) => (
  dispatch: (
    arg0: SetUILoadingAction | SetUIStopLoadingAction | SaveUserAction | OpenSnackbarAction
  ) => void,
): void => {
  dispatch(setUILoading());
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
      dispatch(saveUserData(result.user));
      dispatch(openSnackbar('You have been successfully signed up.'));
      dispatch(clearUILoading());
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};

export const signInWithEmailPassword = (email: string, password: string) => (
  dispatch: (
    arg0: SetUILoadingAction | SetUIStopLoadingAction | SaveUserAction | OpenSnackbarAction
  ) => void,
): void => {
  dispatch(setUILoading());
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((result) => {
      dispatch(saveUserData(result.user));
      dispatch(openSnackbar('You\'ve been successfully signed in.'));
      dispatch(clearUILoading());
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};

export const signOut = () => (
  dispatch: (
    arg0: OpenSnackbarAction | LogoutUserAction
  ) => void,
): void => {
  firebase.auth().signOut()
    .then(() => {
      dispatch(openSnackbar('You\'ve been successfully signed out.'));
      dispatch(logoutUser());
    })
    .catch((error) => dispatch(openSnackbar(error.message)));
};

export const resetPassword = (email: string) => (
  dispatch: (
    arg0: SetUILoadingAction | SetUIStopLoadingAction | OpenSnackbarAction
  ) => void,
): void => {
  dispatch(setUILoading());
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      dispatch(openSnackbar('You\'ve successfully reseted your password.'));
      dispatch(clearUILoading());
    })
    .catch((error) => {
      dispatch(openSnackbar(error.message));
      dispatch(clearUILoading());
    });
};
