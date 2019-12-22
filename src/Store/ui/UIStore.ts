import { Snackbar } from 'src/Models/Notification';

export interface UIStore {
  loading: boolean;
  snackbar: Snackbar | null;
}
