/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';
import { Box, Card, Typography, styled, alpha } from '@mui/material';
import { Artifact } from '../../types';

interface ArtifactCardProps {
    artifact: Artifact;
    isFocused: boolean;
    onClick: () => void;
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isFocused' && prop !== 'isBlurring'
})<{ isFocused: boolean; isBlurring: boolean }>(({ theme, isFocused, isBlurring }) => ({
  position: 'relative',
  backgroundColor: '#111',
  borderRadius: 12,
  border: `1px solid ${isBlurring ? theme.palette.primary.main : '#27272a'}`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  cursor: isFocused ? 'default' : 'pointer',
  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  boxShadow: isFocused ? '0 50px 100px -20px rgba(0,0,0,0.8)' : '0 10px 30px -10px rgba(0,0,0,0.5)',
  transformOrigin: 'center center',
  pointerEvents: 'auto',
  ...(isFocused && {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '90vw',
    maxWidth: 1200,
    height: '85vh',
    transform: 'translate(-50%, -50%)',
    zIndex: 100,
    borderColor: 'rgba(255,255,255,0.1)',
    [theme.breakpoints.down('lg')]: {
      width: '92vw',
      height: '65vh',
      top: '40%',
      transform: 'translate(-50%, -40%)',
    },
  }),
  '&:hover': {
    ...(!isFocused && {
      borderColor: 'rgba(255,255,255,0.3)',
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7)',
    }),
  },
}));

const ArtifactCard = React.memo(({ 
    artifact, 
    isFocused, 
    onClick 
}: ArtifactCardProps) => {
    const codeRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            codeRef.current.scrollTop = codeRef.current.scrollHeight;
        }
    }, [artifact.html]);

    const isBlurring = artifact.status === 'streaming';

    return (
        <StyledCard 
            isFocused={isFocused}
            isBlurring={isBlurring}
            onClick={!isFocused ? onClick : undefined}
            elevation={0}
        >
            {!isFocused && (
                <Box sx={{ 
                    p: 1.5, 
                    borderBottom: '1px solid #27272a', 
                    bgcolor: 'rgba(0,0,0,0.2)', 
                    display: 'flex', 
                    justifyContent: 'center' 
                }}>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            bgcolor: 'rgba(255,255,255,0.05)', 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1, 
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        {artifact.styleName}
                    </Typography>
                </Box>
            )}
            <Box sx={{ flex: 1, position: 'relative', bgcolor: '#fff', width: '100%', height: '100%' }}>
                {isBlurring && (
                    <Box sx={{ 
                        position: 'absolute', 
                        inset: 0, 
                        zIndex: 20, 
                        bgcolor: 'rgba(0,0,0,0.9)', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'flex-end',
                        overflow: 'hidden'
                    }}>
                        <Box 
                            component="pre" 
                            ref={codeRef} 
                            sx={{ 
                                m: 0, 
                                p: 2.5, 
                                color: '#4ade80', 
                                fontFamily: 'fontFamilyMono', 
                                fontSize: 11, 
                                lineHeight: 1.4, 
                                whiteSpace: 'pre-wrap', 
                                wordBreak: 'break-all', 
                                overflow: 'hidden', 
                                maskImage: 'linear-gradient(to bottom, transparent, black 20%)', 
                                opacity: 0.9 
                            }}
                        >
                            {artifact.html}
                        </Box>
                    </Box>
                )}
                <Box 
                    component="iframe" 
                    srcDoc={artifact.html} 
                    title={artifact.id} 
                    sandbox="allow-scripts allow-forms allow-modals allow-popups allow-presentation allow-same-origin"
                    sx={{ 
                        width: '100%', 
                        height: '100%', 
                        border: 'none', 
                        display: 'block', 
                        pointerEvents: isFocused ? 'auto' : 'none' 
                    }}
                />
            </Box>
        </StyledCard>
    );
});

export default ArtifactCard;
