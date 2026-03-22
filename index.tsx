/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

//Vibe coded by ammaar@google.com

import { GoogleGenAI } from '@google/genai';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  IconButton, 
  InputAdornment, 
  CircularProgress,
  Tooltip,
  Fade,
  styled,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  AutoAwesome as SparklesIcon,
  Code as CodeIcon,
  GridView as GridIcon,
  ArrowBack as ArrowLeftIcon,
  ArrowForward as ArrowRightIcon,
  ArrowUpward as ArrowUpIcon,
  Psychology as ThinkingIcon,
  AccountCircle as UserIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import theme from './theme';

import { Artifact, Session, ComponentVariation } from './types';
import { INITIAL_PLACEHOLDERS } from './constants';
import { generateId } from './utils';

import DottedGlowBackground from './features/generator/DottedGlowBackground';
import ArtifactCard from './features/generator/ArtifactCard';
import SideDrawer from './components/layout/SideDrawer';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import AdminDashboard from './features/admin/AdminDashboard';
import Profile from './features/profile/Profile';

const NavButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 100,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  padding: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-50%) scale(1.1)',
  },
  '&.left': { left: theme.spacing(3) },
  '&.right': { right: theme.spacing(3) },
}));

const ActionBar = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 120,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 20,
  backgroundColor: 'rgba(24, 24, 27, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  opacity: 0,
  visibility: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  '&.visible': {
    opacity: 1,
    visibility: 'visible',
    bottom: 140,
  },
}));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    handleMenuClose();
    handleShowProfile();
  };

  const handleLogoutMenu = () => {
    handleMenuClose();
    handleLogout();
  };
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_data');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (token: string, userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const [currentSessionIndex, setCurrentSessionIndex] = useState<number>(-1);
  const [focusedArtifactIndex, setFocusedArtifactIndex] = useState<number | null>(null);
  
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholders, setPlaceholders] = useState<string[]>(INITIAL_PLACEHOLDERS);
  
  const [drawerState, setDrawerState] = useState<{
      isOpen: boolean;
      mode: 'code' | 'variations' | 'profile' | null;
      title: string;
      data: any; 
  }>({ isOpen: false, mode: null, title: '', data: null });

  const [componentVariations, setComponentVariations] = useState<ComponentVariation[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      inputRef.current?.focus();
  }, []);

  // Fix for mobile: reset scroll when focusing an item to prevent "overscroll" state
  useEffect(() => {
    if (focusedArtifactIndex !== null && window.innerWidth <= 1024) {
        if (gridScrollRef.current) {
            gridScrollRef.current.scrollTop = 0;
        }
        window.scrollTo(0, 0);
    }
  }, [focusedArtifactIndex]);

  // Cycle placeholders
  useEffect(() => {
      const interval = setInterval(() => {
          setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
      }, 3000);
      return () => clearInterval(interval);
  }, [placeholders.length]);

  // Dynamic placeholder generation on load
  useEffect(() => {
      const fetchDynamicPlaceholders = async () => {
          try {
              const apiKey = process.env.API_KEY;
              if (!apiKey) return;
              const ai = new GoogleGenAI({ apiKey });
              const response = await ai.models.generateContent({
                  model: 'gemini-3-flash-preview',
                  contents: { 
                      role: 'user', 
                      parts: [{ 
                          text: 'Generate 20 creative, short, diverse UI component prompts (e.g. "bioluminescent task list"). Return ONLY a raw JSON array of strings. IP SAFEGUARD: Avoid referencing specific famous artists, movies, or brands.' 
                      }] 
                  }
              });
              const text = response.text || '[]';
              const jsonMatch = text.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                  const newPlaceholders = JSON.parse(jsonMatch[0]);
                  if (Array.isArray(newPlaceholders) && newPlaceholders.length > 0) {
                      const shuffled = newPlaceholders.sort(() => 0.5 - Math.random()).slice(0, 10);
                      setPlaceholders(prev => [...prev, ...shuffled]);
                  }
              }
          } catch (e) {
              console.warn("Silently failed to fetch dynamic placeholders", e);
          }
      };
      setTimeout(fetchDynamicPlaceholders, 1000);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const parseJsonStream = async function* (responseStream: AsyncGenerator<{ text: string }>) {
      let buffer = '';
      for await (const chunk of responseStream) {
          const text = chunk.text;
          if (typeof text !== 'string') continue;
          buffer += text;
          let braceCount = 0;
          let start = buffer.indexOf('{');
          while (start !== -1) {
              braceCount = 0;
              let end = -1;
              for (let i = start; i < buffer.length; i++) {
                  if (buffer[i] === '{') braceCount++;
                  else if (buffer[i] === '}') braceCount--;
                  if (braceCount === 0 && i > start) {
                      end = i;
                      break;
                  }
              }
              if (end !== -1) {
                  const jsonString = buffer.substring(start, end + 1);
                  try {
                      yield JSON.parse(jsonString);
                      buffer = buffer.substring(end + 1);
                      start = buffer.indexOf('{');
                  } catch (e) {
                      start = buffer.indexOf('{', start + 1);
                  }
              } else {
                  break; 
              }
          }
      }
  };

  const handleGenerateVariations = useCallback(async () => {
    const currentSession = sessions[currentSessionIndex];
    if (!currentSession || focusedArtifactIndex === null) return;
    const currentArtifact = currentSession.artifacts[focusedArtifactIndex];

    setIsLoading(true);
    setComponentVariations([]);
    setDrawerState({ isOpen: true, mode: 'variations', title: 'Variations', data: currentArtifact.id });

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API_KEY is not configured.");
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
You are a master UI/UX designer. Generate 3 RADICAL CONCEPTUAL VARIATIONS of: "${currentSession.prompt}".

**STRICT IP SAFEGUARD:**
No names of artists. 
Instead, describe the *Physicality* and *Material Logic* of the UI.

**CREATIVE GUIDANCE (Use these as EXAMPLES of how to describe style, but INVENT YOUR OWN):**
1. Example: "Asymmetrical Primary Grid" (Heavy black strokes, rectilinear structure, flat primary pigments, high-contrast white space).
2. Example: "Suspended Kinetic Mobile" (Delicate wire-thin connections, floating organic primary shapes, slow-motion balance, white-void background).
3. Example: "Grainy Risograph Press" (Overprinted translucent inks, dithered grain textures, monochromatic color depth, raw paper substrate).
4. Example: "Volumetric Spectral Fluid" (Generative morphing gradients, soft-focus diffusion, bioluminescent light sources, spectral chromatic aberration).

**YOUR TASK:**
For EACH variation:
- Invent a unique design persona name based on a NEW physical metaphor.
- Rewrite the prompt to fully adopt that metaphor's visual language.
- Generate high-fidelity HTML/CSS.

Required JSON Output Format (stream ONE object per line):
\`{ "name": "Persona Name", "html": "..." }\`
        `.trim();

        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-3-flash-preview',
             contents: [{ parts: [{ text: prompt }], role: 'user' }],
             config: { temperature: 1.2 }
        });

        for await (const variation of parseJsonStream(responseStream)) {
            if (variation.name && variation.html) {
                setComponentVariations(prev => [...prev, variation]);
            }
        }
    } catch (e: any) {
        console.error("Error generating variations:", e);
    } finally {
        setIsLoading(false);
    }
  }, [sessions, currentSessionIndex, focusedArtifactIndex]);

  const applyVariation = (html: string) => {
      if (focusedArtifactIndex === null) return;
      setSessions(prev => prev.map((sess, i) => 
          i === currentSessionIndex ? {
              ...sess,
              artifacts: sess.artifacts.map((art, j) => 
                j === focusedArtifactIndex ? { ...art, html, status: 'complete' } : art
              )
          } : sess
      ));
      setDrawerState(s => ({ ...s, isOpen: false }));
  };

  const handleShowCode = () => {
      const currentSession = sessions[currentSessionIndex];
      if (currentSession && focusedArtifactIndex !== null) {
          const artifact = currentSession.artifacts[focusedArtifactIndex];
          setDrawerState({ isOpen: true, mode: 'code', title: 'Source Code', data: artifact.html });
      }
  };

  const handleSendMessage = useCallback(async (manualPrompt?: string) => {
    const promptToUse = manualPrompt || inputValue;
    const trimmedInput = promptToUse.trim();
    
    if (!trimmedInput || isLoading) return;
    if (!manualPrompt) setInputValue('');

    setIsLoading(true);
    const baseTime = Date.now();
    const sessionId = generateId();

    const placeholderArtifacts: Artifact[] = Array(3).fill(null).map((_, i) => ({
        id: `${sessionId}_${i}`,
        styleName: 'Designing...',
        html: '',
        status: 'streaming',
    }));

    const newSession: Session = {
        id: sessionId,
        prompt: trimmedInput,
        timestamp: baseTime,
        artifacts: placeholderArtifacts
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSessionIndex(sessions.length); 
    setFocusedArtifactIndex(null); 

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API_KEY is not configured.");
        const ai = new GoogleGenAI({ apiKey });

        const stylePrompt = `
Generate 3 distinct, highly evocative design directions for: "${trimmedInput}".

**STRICT IP SAFEGUARD:**
Never use artist or brand names. Use physical and material metaphors.

**CREATIVE EXAMPLES (Do not simply copy these, use them as a guide for tone):**
- Example A: "Asymmetrical Rectilinear Blockwork" (Grid-heavy, primary pigments, thick structural strokes, Bauhaus-functionalism vibe).
- Example B: "Grainy Risograph Layering" (Tactile paper texture, overprinted translucent inks, dithered gradients).
- Example C: "Kinetic Wireframe Suspension" (Floating silhouettes, thin balancing lines, organic primary shapes).
- Example D: "Spectral Prismatic Diffusion" (Glassmorphism, caustic refraction, soft-focus morphing gradients).

**GOAL:**
Return ONLY a raw JSON array of 3 *NEW*, creative names for these directions (e.g. ["Tactile Risograph Press", "Kinetic Silhouette Balance", "Primary Pigment Gridwork"]).
        `.trim();

        const styleResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { role: 'user', parts: [{ text: stylePrompt }] }
        });

        let generatedStyles: string[] = [];
        const styleText = styleResponse.text || '[]';
        const jsonMatch = styleText.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
            try {
                generatedStyles = JSON.parse(jsonMatch[0]);
            } catch (e) {
                console.warn("Failed to parse styles, using fallbacks");
            }
        }

        if (!generatedStyles || generatedStyles.length < 3) {
            generatedStyles = [
                "Primary Pigment Gridwork",
                "Tactile Risograph Layering",
                "Kinetic Silhouette Balance"
            ];
        }
        
        generatedStyles = generatedStyles.slice(0, 3);

        setSessions(prev => prev.map(s => {
            if (s.id !== sessionId) return s;
            return {
                ...s,
                artifacts: s.artifacts.map((art, i) => ({
                    ...art,
                    styleName: generatedStyles[i]
                }))
            };
        }));

        const generateArtifact = async (artifact: Artifact, styleInstruction: string) => {
            try {
                const prompt = `
You are Flash UI. Create a stunning, high-fidelity UI component for: "${trimmedInput}".

**CONCEPTUAL DIRECTION: ${styleInstruction}**

**VISUAL EXECUTION RULES:**
1. **Materiality**: Use the specified metaphor to drive every CSS choice. (e.g. if Risograph, use \`feTurbulence\` for grain and \`mix-blend-mode: multiply\` for ink layering).
2. **Typography**: Use high-quality web fonts. Pair a bold sans-serif with a refined monospace for data.
3. **Motion**: Include subtle, high-performance CSS/JS animations (hover transitions, entry reveals).
4. **IP SAFEGUARD**: No artist names or trademarks. 
5. **Layout**: Be bold with negative space and hierarchy. Avoid generic cards.

Return ONLY RAW HTML. No markdown fences.
          `.trim();
          
                const responseStream = await ai.models.generateContentStream({
                    model: 'gemini-3-flash-preview',
                    contents: [{ parts: [{ text: prompt }], role: "user" }],
                });

                let accumulatedHtml = '';
                for await (const chunk of responseStream) {
                    const text = chunk.text;
                    if (typeof text === 'string') {
                        accumulatedHtml += text;
                        setSessions(prev => prev.map(sess => 
                            sess.id === sessionId ? {
                                ...sess,
                                artifacts: sess.artifacts.map(art => 
                                    art.id === artifact.id ? { ...art, html: accumulatedHtml } : art
                                )
                            } : sess
                        ));
                    }
                }
                
                let finalHtml = accumulatedHtml.trim();
                if (finalHtml.startsWith('```html')) finalHtml = finalHtml.substring(7).trimStart();
                if (finalHtml.startsWith('```')) finalHtml = finalHtml.substring(3).trimStart();
                if (finalHtml.endsWith('```')) finalHtml = finalHtml.substring(0, finalHtml.length - 3).trimEnd();

                setSessions(prev => prev.map(sess => 
                    sess.id === sessionId ? {
                        ...sess,
                        artifacts: sess.artifacts.map(art => 
                            art.id === artifact.id ? { ...art, html: finalHtml, status: finalHtml ? 'complete' : 'error' } : art
                        )
                    } : sess
                ));

            } catch (e: any) {
                console.error('Error generating artifact:', e);
                setSessions(prev => prev.map(sess => 
                    sess.id === sessionId ? {
                        ...sess,
                        artifacts: sess.artifacts.map(art => 
                            art.id === artifact.id ? { ...art, html: `<div style="color: #ff6b6b; padding: 20px;">Error: ${e.message}</div>`, status: 'error' } : art
                        )
                    } : sess
                ));
            }
        };

        await Promise.all(placeholderArtifacts.map((art, i) => generateArtifact(art, generatedStyles[i])));

    } catch (e) {
        console.error("Fatal error in generation process", e);
    } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [inputValue, isLoading, sessions.length]);

  const handleSurpriseMe = () => {
      const currentPrompt = placeholders[placeholderIndex];
      setInputValue(currentPrompt);
      handleSendMessage(currentPrompt);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      event.preventDefault();
      handleSendMessage();
    } else if (event.key === 'Tab' && !inputValue && !isLoading) {
        event.preventDefault();
        setInputValue(placeholders[placeholderIndex]);
    }
  };

  const nextItem = useCallback(() => {
      if (focusedArtifactIndex !== null) {
          if (focusedArtifactIndex < 2) setFocusedArtifactIndex(focusedArtifactIndex + 1);
      } else {
          if (currentSessionIndex < sessions.length - 1) setCurrentSessionIndex(currentSessionIndex + 1);
      }
  }, [currentSessionIndex, sessions.length, focusedArtifactIndex]);

  const prevItem = useCallback(() => {
      if (focusedArtifactIndex !== null) {
          if (focusedArtifactIndex > 0) setFocusedArtifactIndex(focusedArtifactIndex - 1);
      } else {
           if (currentSessionIndex > 0) setCurrentSessionIndex(currentSessionIndex - 1);
      }
  }, [currentSessionIndex, focusedArtifactIndex]);

  const handleShowProfile = () => {
    setDrawerState({ isOpen: true, mode: 'profile', title: 'User Profile', data: user });
  };

  const isLoadingDrawer = isLoading && drawerState.mode === 'variations' && componentVariations.length === 0;

  const hasStarted = sessions.length > 0 || isLoading;
  const currentSession = sessions[currentSessionIndex];

  let canGoBack = false;
  let canGoForward = false;

  if (hasStarted) {
      if (focusedArtifactIndex !== null) {
          canGoBack = focusedArtifactIndex > 0;
          canGoForward = focusedArtifactIndex < (currentSession?.artifacts.length || 0) - 1;
      } else {
          canGoBack = currentSessionIndex > 0;
          canGoForward = currentSessionIndex < sessions.length - 1;
      }
  }

  if (!isAuthenticated) {
    if (isSignup) {
      return (
        <Signup 
          onBackToLogin={() => setIsSignup(false)} 
          onSignupSuccess={() => setIsSignup(false)} 
        />
      );
    }
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onGoToSignup={() => setIsSignup(true)} 
      />
    );
  }

  if (user?.role === 'admin') {
    return (
      <>
        <AdminDashboard user={user} onLogout={handleLogout} onShowProfile={handleShowProfile} />
        <SideDrawer 
            isOpen={drawerState.isOpen} 
            onClose={() => setDrawerState(s => ({...s, isOpen: false}))} 
            title={drawerState.title}
        >
            {drawerState.mode === 'profile' && <Profile user={user} />}
        </SideDrawer>
      </>
    );
  }

  return (
    <>
      <Box
        component="a"
        href="https://x.com/ammaar"
        target="_blank"
        rel="noreferrer"
        sx={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 101,
          color: 'text.secondary',
          fontSize: '0.85rem',
          textDecoration: 'none',
          fontWeight: 500,
          opacity: 0.5,
          px: 1.5,
          py: 0.75,
          borderRadius: '99px',
          bgcolor: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid transparent',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s ease',
          display: { xs: hasStarted ? 'none' : 'flex', sm: 'flex' },
          '&:hover': {
            opacity: 1,
            color: 'text.primary',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateY(1px)',
          },
        }}
      >
        created by @ammaar
      </Box>

      <SideDrawer 
          isOpen={drawerState.isOpen} 
          onClose={() => setDrawerState(s => ({...s, isOpen: false}))} 
          title={drawerState.title}
      >
          {isLoadingDrawer && (
               <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', py: 8, fontSize: '1.1rem' }}>
                   <ThinkingIcon sx={{ animation: 'spin 2s linear infinite' }} /> 
                   Designing variations...
               </Box>
          )}

          {drawerState.mode === 'code' && (
              <Box 
                component="pre" 
                sx={{ 
                  bgcolor: 'rgba(0,0,0,0.3)', 
                  p: 2.5, 
                  borderRadius: 3, 
                  overflowX: 'hidden', 
                  fontFamily: 'fontFamilyMono', 
                  fontSize: '0.85rem', 
                  color: '#e5e5e5', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  m: 0,
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word'
                }}
              >
                <code>{drawerState.data}</code>
              </Box>
          )}
          
          {drawerState.mode === 'variations' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {componentVariations.map((v, i) => (
                       <Box 
                        key={i} 
                        onClick={() => applyVariation(v.html)}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 4,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                          position: 'relative',
                          '&:hover': {
                            transform: 'translateY(-4px) scale(1.01)',
                            borderColor: 'rgba(255,255,255,0.25)',
                            boxShadow: '0 15px 30px -10px rgba(0,0,0,0.5)',
                            '& .sexy-label': {
                              color: '#fff',
                              bgcolor: 'rgba(255,255,255,0.05)',
                            }
                          }
                        }}
                       >
                           <Box sx={{ height: 220, bgcolor: '#000', position: 'relative', overflow: 'hidden' }}>
                               <Box 
                                component="iframe" 
                                srcDoc={v.html} 
                                title={v.name} 
                                sandbox="allow-scripts allow-same-origin" 
                                sx={{
                                  width: '400%', 
                                  height: '400%', 
                                  border: 'none', 
                                  pointerEvents: 'none',
                                  transform: 'scale(0.25)',
                                  transformOrigin: 'top left',
                                }}
                               />
                           </Box>
                           <Box className="sexy-label" sx={{ 
                             p: 2, 
                             textAlign: 'center', 
                             fontWeight: 500, 
                             color: 'text.primary',
                             bgcolor: 'rgba(0,0,0,0.2)',
                             borderTop: '1px solid rgba(255,255,255,0.1)',
                             fontSize: '0.95rem',
                             transition: 'all 0.2s'
                           }}>
                            {v.name}
                           </Box>
                       </Box>
                  ))}
              </Box>
          )}

          {drawerState.mode === 'profile' && user && (
            <Box sx={{ p: 2 }}>
              <Profile user={user} />
              <Box sx={{ p: 2, mt: 2 }}>
                <Button 
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 3, 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                  }}
                >
                  Sign Out
                </Button>
              </Box>
            </Box>
          )}
      </SideDrawer>

      <Box sx={{ 
        flex: 1, 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        perspective: '1500px', 
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}>
          <Box sx={{ 
            position: 'fixed',
            top: 24,
            left: 24,
            zIndex: 101,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '99px',
            px: 1,
            py: 0.5,
            backdropFilter: 'blur(10px)',
          }}>
            <IconButton 
                onClick={handleShowProfile}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
            >
                <Typography sx={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.75rem' }}>
                  {user?.username?.[0]}
                </Typography>
            </IconButton>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ color: '#ffffff', p: 0.5 }}
            >
              <MoreIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              sx: {
                bgcolor: '#18181b',
                border: '1px solid #27272a',
                color: '#ffffff',
                mt: 1.5,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                }
              }
            }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleEditProfile}>
              <ListItemIcon>
                <EditIcon fontSize="small" sx={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </MenuItem>
            <MenuItem onClick={handleLogoutMenu}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#f87171' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#f87171' }} />
            </MenuItem>
          </Menu>

          <DottedGlowBackground 
              gap={24} 
              radius={1.5} 
              color="rgba(255, 255, 255, 0.02)" 
              glowColor="rgba(255, 255, 255, 0.15)" 
              speedScale={0.5} 
          />

          <Box sx={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
            perspective: focusedArtifactIndex !== null ? 'none' : '1500px'
          }}>
               <Fade in={!hasStarted} timeout={800}>
                 <Box sx={{ 
                   position: 'absolute', 
                   inset: 0, 
                   display: hasStarted ? 'none' : 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center', 
                   textAlign: 'center', 
                   p: 3,
                   zIndex: 0
                 }}>
                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: '100%' }}>
                         <Typography 
                          variant="h1" 
                          sx={{ 
                            fontWeight: 800, 
                            letterSpacing: '-0.05em', 
                            fontSize: { xs: '3.5rem', md: '6rem' },
                            background: 'linear-gradient(to bottom right, #fff, #aaa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1,
                            textShadow: '0 10px 30px rgba(255,255,255,0.1)',
                          }}
                         >
                          Flash UI
                         </Typography>
                         <Typography 
                          variant="body1" 
                          sx={{ 
                            fontSize: { xs: '1.1rem', md: '1.4rem' }, 
                            color: 'text.secondary', 
                            maxWidth: 600, 
                            lineHeight: 1.4 
                          }}
                         >
                          Creative UI generation in a flash
                         </Typography>
                         <Button
                            variant="outlined"
                            startIcon={<SparklesIcon />}
                            onClick={handleSurpriseMe}
                            disabled={isLoading}
                            sx={{
                              borderRadius: '99px',
                              px: 3,
                              py: 1.5,
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              color: '#ffffff',
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                transform: 'scale(1.05)',
                                boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                              }
                            }}
                         >
                             Surprise Me
                         </Button>
                     </Box>
                 </Box>
               </Fade>

                {sessions.map((session, sIndex) => {
                    let positionStyle: any = { display: 'none' };
                    if (sIndex === currentSessionIndex) {
                      positionStyle = { 
                        display: 'flex', 
                        transform: 'translateX(0) scale(1)', 
                        opacity: 1, 
                        zIndex: 10, 
                        pointerEvents: 'auto' 
                      };
                    } else if (sIndex < currentSessionIndex) {
                      positionStyle = { 
                        display: 'flex', 
                        transform: 'translateX(-120%) translateZ(-300px)', 
                        opacity: 0, 
                        zIndex: 5, 
                        pointerEvents: 'none' 
                      };
                    } else if (sIndex > currentSessionIndex) {
                      positionStyle = { 
                        display: 'flex', 
                        transform: 'translateX(120%) translateZ(-300px)', 
                        opacity: 0, 
                        zIndex: 5, 
                        pointerEvents: 'none' 
                      };
                    }
                    
                    return (
                        <Box 
                          key={session.id} 
                          sx={{
                            position: 'absolute',
                            width: '100%', 
                            height: '100%',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            transition: 'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.7s ease, filter 0.7s ease',
                            transformStyle: 'preserve-3d',
                            ...positionStyle,
                            ...(focusedArtifactIndex !== null && sIndex === currentSessionIndex && {
                              transform: 'none !important',
                              transformStyle: 'flat !important',
                            })
                          }}
                        >
                            <Box 
                              ref={sIndex === currentSessionIndex ? gridScrollRef : null}
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' },
                                gap: 3,
                                width: '95%', 
                                maxWidth: 1600,
                                height: { xs: '100%', lg: '70vh' },
                                maxHeight: { xs: '100vh', lg: 'none' },
                                perspective: '1000px',
                                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                overflowY: { xs: 'auto', lg: focusedArtifactIndex !== null ? 'hidden' : 'visible' },
                                p: { xs: '40px 20px 160px 20px', lg: 0 },
                                boxSizing: 'border-box',
                                ...(focusedArtifactIndex !== null && {
                                  pointerEvents: 'none',
                                  transform: 'none !important',
                                  perspective: 'none !important',
                                  height: { xs: '100vh', lg: '70vh' },
                                })
                              }}
                            >
                                {session.artifacts.map((artifact, aIndex) => {
                                    const isFocused = focusedArtifactIndex === aIndex;
                                    
                                    return (
                                        <ArtifactCard 
                                            key={artifact.id}
                                            artifact={artifact}
                                            isFocused={isFocused}
                                            onClick={() => setFocusedArtifactIndex(aIndex)}
                                        />
                                    );
                                })}
                            </Box>
                        </Box>
                    );
                })}
            </Box>

             {canGoBack && (
                <NavButton className="left" onClick={prevItem} aria-label="Previous">
                    <ArrowLeftIcon />
                </NavButton>
             )}
             {canGoForward && (
                <NavButton className="right" onClick={nextItem} aria-label="Next">
                    <ArrowRightIcon />
                </NavButton>
             )}

            <ActionBar className={focusedArtifactIndex !== null ? 'visible' : ''} elevation={0}>
                 <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {currentSession?.prompt}
                 </Typography>
                 <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                        variant="outlined" 
                        startIcon={<GridIcon />}
                        onClick={() => setFocusedArtifactIndex(null)}
                        sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
                    >
                        Grid View
                    </Button>
                    <Button 
                        variant="outlined" 
                        startIcon={<SparklesIcon />}
                        onClick={handleGenerateVariations} 
                        disabled={isLoading}
                        sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
                    >
                        Variations
                    </Button>
                    <Button 
                        variant="outlined" 
                        startIcon={<CodeIcon />}
                        onClick={handleShowCode}
                        sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
                    >
                        Source
                    </Button>
                 </Box>
            </ActionBar>

            <Box sx={{ 
                position: 'fixed', 
                bottom: 40, 
                left: '50%', 
                transform: 'translateX(-50%)', 
                width: '100%', 
                maxWidth: 600, 
                px: 2,
                zIndex: 110 
            }}>
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 0.5, 
                        borderRadius: '20px', 
                        bgcolor: 'rgba(24, 24, 27, 0.8)', 
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative'
                    }}
                >
                    {(!inputValue && !isLoading) && (
                        <Box sx={{ 
                            position: 'absolute', 
                            left: 20, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1, 
                            pointerEvents: 'none',
                            color: 'rgba(255, 255, 255, 0.3)'
                        }} key={placeholderIndex}>
                            <Typography variant="body2">{placeholders[placeholderIndex]}</Typography>
                            <Box sx={{ 
                                px: 0.8, 
                                py: 0.2, 
                                borderRadius: 1, 
                                border: '1px solid rgba(255, 255, 255, 0.1)', 
                                fontSize: '10px', 
                                fontWeight: 700, 
                                textTransform: 'uppercase' 
                            }}>
                                Tab
                            </Box>
                        </Box>
                    )}
                    
                    {!isLoading ? (
                        <TextField
                            fullWidth
                            inputRef={inputRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder=""
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                sx: { 
                                    px: 2, 
                                    py: 1.5, 
                                    color: '#ffffff',
                                    fontSize: '0.95rem'
                                }
                            }}
                        />
                    ) : (
                        <Box sx={{ flex: 1, px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {currentSession?.prompt}
                            </Typography>
                            <ThinkingIcon sx={{ fontSize: 18, color: '#ffffff', animation: 'spin 2s linear infinite' }} />
                        </Box>
                    )}

                    <IconButton 
                        onClick={() => handleSendMessage()} 
                        disabled={isLoading || !inputValue.trim()}
                        sx={{ 
                            bgcolor: '#ffffff', 
                            color: '#000000',
                            mr: 0.5,
                            '&:hover': { bgcolor: '#e4e4e7' },
                            '&.Mui-disabled': { bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.3)' }
                        }}
                    >
                        <ArrowUpIcon />
                    </IconButton>
                </Paper>
            </Box>
        </Box>
    </>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}