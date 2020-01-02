import { Snackbar } from 'src/Models/Notification';
import DialogType from 'src/Models/DialogType';

export interface UIStore {
  loading: boolean;
  snackbar: Snackbar | null;
  dialog: DialogType | null;
}
