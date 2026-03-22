import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  Tab,
  Tabs,
  styled,
  alpha,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Security as SecurityIcon,
  People as PeopleIcon,
  SettingsInputComponent as SimulatorIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  School as EducatorIcon,
  MenuBook as StudentIcon,
  Business as EnterpriseIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: '#18181b',
    borderRight: '1px solid #27272a',
    color: '#ffffff',
  },
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  margin: '4px 12px',
  borderRadius: '12px',
  backgroundColor: active ? alpha('#ffffff', 0.05) : 'transparent',
  color: active ? '#ffffff' : '#a1a1aa',
  '&:hover': {
    backgroundColor: alpha('#ffffff', 0.08),
    color: '#ffffff',
  },
  '& .MuiListItemIcon-root': {
    color: active ? '#ffffff' : '#71717a',
    minWidth: '40px',
  },
}));

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
  onShowProfile: () => void;
}

type ViewType = 'permissions' | 'users' | 'simulators';
type UserType = 'admin' | 'educator' | 'student' | 'enterprise';

export default function AdminDashboard({ user, onLogout, onShowProfile }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<ViewType>('users');
  const [activeUserTab, setActiveUserTab] = useState<UserType>('admin');
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
    onShowProfile();
  };

  const handleLogoutMenu = () => {
    handleMenuClose();
    onLogout();
  };

  const renderContent = () => {
    switch (activeView) {
      case 'permissions':
        return <PermissionsManagement />;
      case 'users':
        return <UserManagement activeTab={activeUserTab} onTabChange={setActiveUserTab} />;
      case 'simulators':
        return <SimulatorManagement />;
      default:
        return <UserManagement activeTab={activeUserTab} onTabChange={setActiveUserTab} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#09090b' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'rgba(9, 9, 11, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #27272a',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: '#ffffff' }}>
            {activeView === 'permissions' && 'Quản lý quyền'}
            {activeView === 'users' && 'Quản lý người dùng'}
            {activeView === 'simulators' && 'Quản lý trình mô phỏng'}
          </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff' }}>
                  {user?.username}
                </Typography>
                <Typography variant="caption" sx={{ color: '#71717a' }}>
                  Administrator
                </Typography>
              </Box>
              <Avatar 
                onClick={handleMenuOpen}
                sx={{ 
                  bgcolor: '#ffffff', 
                  color: '#000000', 
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
              <IconButton
                onClick={handleMenuOpen}
                sx={{ color: '#ffffff' }}
              >
                <MoreIcon />
              </IconButton>

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
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
                    }
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
            </Box>
        </Toolbar>
      </AppBar>

      <StyledDrawer variant="permanent" open>
        <Box sx={{ p: 3, mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
            Flash Admin
          </Typography>
        </Box>
        <List sx={{ px: 1 }}>
          <ListItem disablePadding>
            <StyledListItemButton 
              active={activeView === 'permissions'} 
              onClick={() => setActiveView('permissions')}
            >
              <ListItemIcon><SecurityIcon /></ListItemIcon>
              <ListItemText primary="Quản lý quyền" primaryTypographyProps={{ fontWeight: 600 }} />
            </StyledListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledListItemButton 
              active={activeView === 'users'} 
              onClick={() => setActiveView('users')}
            >
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Quản lý người dùng" primaryTypographyProps={{ fontWeight: 600 }} />
            </StyledListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledListItemButton 
              active={activeView === 'simulators'} 
              onClick={() => setActiveView('simulators')}
            >
              <ListItemIcon><SimulatorIcon /></ListItemIcon>
              <ListItemText primary="Quản lý trình mô phỏng" primaryTypographyProps={{ fontWeight: 600 }} />
            </StyledListItemButton>
          </ListItem>
        </List>
      </StyledDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}

function PermissionsManagement() {
  return (
    <FadeIn>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
            Quản lý quyền
          </Typography>
          <Typography variant="body2" sx={{ color: '#71717a' }}>
            Thiết lập và phân bổ quyền hạn cho các vai trò trong hệ thống.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ffffff', color: '#000000', borderRadius: '10px', '&:hover': { bgcolor: '#e4e4e7' } }}>
          Thêm quyền mới
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#71717a', fontWeight: 600, borderBottom: '1px solid #27272a' }}>Tên quyền</TableCell>
              <TableCell sx={{ color: '#71717a', fontWeight: 600, borderBottom: '1px solid #27272a' }}>Mô tả</TableCell>
              <TableCell sx={{ color: '#71717a', fontWeight: 600, borderBottom: '1px solid #27272a' }}>Vai trò áp dụng</TableCell>
              <TableCell sx={{ color: '#71717a', fontWeight: 600, borderBottom: '1px solid #27272a' }} align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { name: 'VIEW_DASHBOARD', desc: 'Cho phép xem bảng điều khiển chính', roles: ['Admin', 'Educator'] },
              { name: 'MANAGE_USERS', desc: 'Quản lý tài khoản người dùng', roles: ['Admin'] },
              { name: 'RUN_SIMULATION', desc: 'Khởi chạy các trình mô phỏng', roles: ['Student', 'Educator'] },
            ].map((row) => (
              <TableRow key={row.name}>
                <TableCell sx={{ color: '#ffffff', borderBottom: '1px solid #27272a' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{row.name}</Typography>
                </TableCell>
                <TableCell sx={{ color: '#a1a1aa', borderBottom: '1px solid #27272a' }}>{row.desc}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #27272a' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {row.roles.map(role => (
                      <Chip key={role} label={role} size="small" sx={{ bgcolor: alpha('#ffffff', 0.05), color: '#ffffff', border: '1px solid #27272a' }} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #27272a' }} align="right">
                  <IconButton size="small" sx={{ color: '#a1a1aa' }}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#f87171' }}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </FadeIn>
  );
}

function UserManagement({ activeTab, onTabChange }: { activeTab: UserType, onTabChange: (tab: UserType) => void }) {
  const users = {
    admin: [
      { id: 1, name: 'Admin Root', email: 'admin@flash.ui', status: 'Active' },
      { id: 2, name: 'Hao Trinh', email: 'hao.trinh@flash.ui', status: 'Active' },
    ],
    educator: [
      { id: 3, name: 'Prof. Smith', email: 'smith@edu.com', status: 'Active' },
    ],
    student: [
      { id: 4, name: 'John Doe', email: 'john@student.com', status: 'Pending' },
    ],
    enterprise: [
      { id: 5, name: 'Tech Corp', email: 'contact@techcorp.com', status: 'Active' },
    ],
  };

  const currentUsers = users[activeTab];

  return (
    <FadeIn>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
          Quản lý người dùng
        </Typography>
        <Typography variant="body2" sx={{ color: '#71717a' }}>
          Quản lý danh sách người dùng theo từng phân hệ.
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, val) => onTabChange(val)}
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': { bgcolor: '#ffffff' },
          '& .MuiTab-root': { color: '#71717a', fontWeight: 600, textTransform: 'none', fontSize: '1rem' },
          '& .Mui-selected': { color: '#ffffff !important' },
        }}
      >
        <Tab icon={<AdminIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Admin" value="admin" />
        <Tab icon={<EducatorIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Educator" value="educator" />
        <Tab icon={<StudentIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Student" value="student" />
        <Tab icon={<EnterpriseIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Enterprise" value="enterprise" />
      </Tabs>

      <TableContainer component={Paper} sx={{ bgcolor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#71717a', fontWeight: 600, borderBottom: '1px solid #27272a' }}>Người dùng</TableCell>
              <TableCell sx={{ color: '#71717a', fontWeight: 600, borderBottom: '1px solid #27272a' }}>Email</TableCell>
              <TableCell sx={{ color: '#71717a', fontWeight: 600, borderBottom: '1px solid #27272a' }}>Trạng thái</TableCell>
              <TableCell sx={{ color: '#71717a', fontWeight: 600, borderBottom: '1px solid #27272a' }} align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell sx={{ color: '#ffffff', borderBottom: '1px solid #27272a' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: alpha('#ffffff', 0.1) }}>{user.name[0]}</Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#a1a1aa', borderBottom: '1px solid #27272a' }}>{user.email}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #27272a' }}>
                  <Chip 
                    label={user.status} 
                    size="small" 
                    sx={{ 
                      bgcolor: user.status === 'Active' ? alpha('#10b981', 0.1) : alpha('#f59e0b', 0.1),
                      color: user.status === 'Active' ? '#10b981' : '#f59e0b',
                      border: `1px solid ${user.status === 'Active' ? alpha('#10b981', 0.2) : alpha('#f59e0b', 0.2)}`,
                      fontWeight: 600
                    }} 
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #27272a' }} align="right">
                  <IconButton size="small" sx={{ color: '#a1a1aa' }}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#f87171' }}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </FadeIn>
  );
}

function SimulatorManagement() {
  return (
    <FadeIn>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
            Quản lý trình mô phỏng
          </Typography>
          <Typography variant="body2" sx={{ color: '#71717a' }}>
            Quản lý và cấu hình các môi trường mô phỏng trong hệ thống.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#ffffff', color: '#000000', borderRadius: '10px', '&:hover': { bgcolor: '#e4e4e7' } }}>
          Tạo mô phỏng mới
        </Button>
      </Box>

      <Grid container spacing={3}>
        {[
          { name: 'Mô phỏng Mạch điện', type: 'Physics', status: 'Stable' },
          { name: 'Mô phỏng Hóa học', type: 'Chemistry', status: 'Beta' },
          { name: 'Mô phỏng Cơ học', type: 'Physics', status: 'Stable' },
        ].map((sim, idx) => (
          <Grid size={{ xs: 12, md: 4 }} key={idx}>
            <Paper sx={{ p: 3, bgcolor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', borderColor: '#3f3f46' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <SimulatorIcon sx={{ color: '#ffffff', fontSize: 32 }} />
                <Chip label={sim.status} size="small" sx={{ bgcolor: alpha('#ffffff', 0.05), color: '#ffffff' }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>{sim.name}</Typography>
              <Typography variant="caption" sx={{ color: '#71717a', display: 'block', mb: 2 }}>Category: {sim.type}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button fullWidth size="small" variant="outlined" sx={{ borderColor: '#27272a', color: '#ffffff' }}>Cấu hình</Button>
                <Button fullWidth size="small" variant="outlined" sx={{ borderColor: '#27272a', color: '#f87171' }}>Gỡ bỏ</Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </FadeIn>
  );
}

function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {children}
    </Box>
  );
}
