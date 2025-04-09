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
  const { open, title, body } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ className: 'modal-container' }}
    >
      <IconButton onClick={handleClose} className="modal-close-button">
        <CloseIcon />
      </IconButton>

      <DialogTitle className="modal-title">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText className="modal-body-text">
          {body}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
