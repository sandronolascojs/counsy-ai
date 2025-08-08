import React from 'react';
import { ChatSheet } from './ChatSheet';
import { MicFab } from './MicFab';

export const FloatingControls = React.memo(
  () => {
    return (
      <>
        <MicFab />
        <ChatSheet />
      </>
    );
  },
  () => true,
);

FloatingControls.displayName = 'FloatingControls';
