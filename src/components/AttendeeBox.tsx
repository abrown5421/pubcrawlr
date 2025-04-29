import { Box, Avatar, Typography, IconButton, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserBoxProps } from '../types/globalTypes';

const AttendeeBox: React.FC<UserBoxProps> = ({ firstName, lastName, creator, onRemove, attending }) => {
  const theme = useTheme();
  const initials = `${firstName[0] ?? ''}${lastName?.[0] ?? ''}`;

  return (
    <Box
      sx={{
        width: "48%",
        p: 2,
        marginBottom: '16px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        backgroundColor: '#f9f9f9',
        position: 'relative',
      }}
    >
      <Avatar sx={{backgroundColor: theme.palette.custom?.dark }}>{initials}</Avatar>
      <Typography variant="subtitle1" fontWeight="bold">
        {firstName} {lastName ?? ''}
      </Typography>
      {creator ? <Typography variant="caption">(Creator)</Typography> : (attending ? <Typography variant="caption">(Attending)</Typography> : <Typography variant="caption">(Pending)</Typography>)}
      {!creator && (
        <IconButton
            onClick={onRemove}
            sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: theme.palette.custom?.error,
            }}
            aria-label="remove user"
        >
            <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default AttendeeBox;
