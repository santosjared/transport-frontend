import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
  '& input': {
    textAlign: 'center',
  },
});

interface TimePickerFieldProps {
  value: string;
  onChange: (newValue: string) => void;
  label?:string
}

const TimePickerField: React.FC<TimePickerFieldProps> = ({ value, onChange ,label}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (isValidTime(newValue) || newValue === '') {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    if (!isValidTime(value)) {
      onChange('');
    }
  };

  const isValidTime = (time: string): boolean => {
    return /^([0-3]|[01]?[0-9]):([0-5]?[0-9])$/.test(time);
  };
  

  return (
    <StyledTextField
    fullWidth
      label={label}
      variant="outlined"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      type='time'
      inputProps={{
        maxLength: 5,
        pattern: '^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$',
        placeholder: 'HH:mm',
      }}
    />
  );
};

export default TimePickerField;
