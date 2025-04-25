import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { User } from '../types/globalTypes';
import { searchUsersByName } from '../services/userService'; 
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActivePage } from '../store/slices/activePageSlice';
import { useNavigate } from 'react-router-dom';

type FriendAutocompleteProps = {
  onUserSelect?: (user: User) => void;
};

const FriendAutocomplete: React.FC<FriendAutocompleteProps> = ({ onUserSelect }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.authentication.token);
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleViewProfile = (slug: string) => {
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: 'Dashboard' }));

    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
      navigate(`/Dashboard/${slug}`);
    }, 500);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (inputValue.trim().length > 0 && typeof token === 'string') {
        setLoading(true);
        searchUsersByName(inputValue.trim(), token)
          .then(setOptions)
          .catch((err) => {
            console.error('Error searching users:', err);
            setOptions([]);
          })
          .finally(() => setLoading(false));
      } else {
        setOptions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, token]);

  return (
    <Autocomplete
      freeSolo
      size="small"
      options={options}
      sx={{ mt: 1, mb: 2 }}
      getOptionLabel={(option) =>
        typeof option === 'string'
          ? option
          : `${option.UserFirstName} ${option.UserLastName}`
      }
      onInputChange={(_, newValue) => setInputValue(newValue)}
      onChange={(_, selectedOption) => {
        if (selectedOption && typeof selectedOption !== 'string') {
          if (onUserSelect) {
            onUserSelect(selectedOption);
          } else {
            handleViewProfile(selectedOption.docId); 
          }
        }
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          label="Search for friends"
          {...params}
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default FriendAutocomplete;
