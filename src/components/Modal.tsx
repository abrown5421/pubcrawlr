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
      PaperProps={{ className: 'modal-container' }}
    >
      {closeable && (
        <IconButton onClick={handleClose} className="modal-close-button">
          <CloseIcon />
        </IconButton>
      )}

      <DialogTitle className="modal-title">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText className="modal-body-text">
          {body}
        </DialogContentText>
      </DialogContent>
    </Dialog>

  );
}
