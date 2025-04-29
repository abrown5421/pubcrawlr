import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closeModal } from '../store/slices/modalSlice';
import '../styles/components/modal.css';

export default function Modal() {
  const { open, title, body, closeable = true } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (closeable) {
      dispatch(closeModal());
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(reason) => {
        if (!closeable && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
          return;
        }
        handleClose();
      }}
      disableEscapeKeyDown={!closeable}
      maxWidth="sm"
      fullWidth
      PaperProps={{ className: 'app-relative modal-container' }}
    >
      {closeable && (
        <IconButton onClick={handleClose} className="app-absolute-imp modal-close-button">
          <CloseIcon />
        </IconButton>
      )}

      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>
          {body}
        </DialogContentText>
      </DialogContent>
    </Dialog>

  );
}
