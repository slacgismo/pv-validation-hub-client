'use client';
// *********** START OF IMPORTS ***********
import React, {useState} from 'react';

// *********** MODULE IMPORTS ***********

import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

// *********** START OF TYPES ***********

interface EditableInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: () => void;
  }

// *********** END OF TYPES ***********

// *********** START OF COMPONENTS ***********

const EditableInput: React.FC<EditableInputProps> = ({
  value, onChange, onClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCheckClick = () => {
    setIsEditing(false);
    onClick();
  };

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      {!isEditing &&
      <EditIcon
        onClick={handleEditClick}
        style={{cursor: 'pointer'}}
      />}
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        style={{marginLeft: isEditing ? '0' : '8px'}}
      />
      {isEditing &&
      <CheckCircleIcon
        onClick={handleCheckClick}
        style={{cursor: 'pointer', marginLeft: '8px'}}
      />}
    </div>
  );
};

// *********** END OF COMPONENTS ***********

// *********** START OF EXPORTS ***********

export {EditableInput};

// *********** END OF EXPORTS ***********
