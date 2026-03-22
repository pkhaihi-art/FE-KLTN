/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Drawer, Box, Typography, IconButton, styled } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface SideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#18181b',
    borderLeft: '1px solid #27272a',
    color: '#ffffff',
    backgroundImage: 'none',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
}));

const SideDrawer = ({ isOpen, onClose, title, children }: SideDrawerProps) => {
    return (
        <StyledDrawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ 
                    p: 3, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #27272a'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {title}
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: '#a1a1aa' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                    {children}
                </Box>
            </Box>
        </StyledDrawer>
    );
};

export default SideDrawer;
