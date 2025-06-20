import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  Computer as ComputerIcon,
  Storage as StorageIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  List as ListIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import VirtualMachinePage from './pages/VirtualMachinePage';
import KubernetesClusterPage from './pages/KubernetesClusterPage';
import TemplateListPage from './pages/TemplateListPage';
import VirtualMachineListPage from './pages/VirtualMachineListPage';
import KubernetesClusterListPage from './pages/KubernetesClusterListPage';

// Drawer width for desktop
const drawerWidth = 280;

// Navigation items
const navItems = [
  {
    category: 'Обзор',
    items: [
      { name: 'Панель управления', path: '/', icon: <DashboardIcon /> }
    ]
  },
  {
    category: 'Виртуальные машины',
    items: [
      { name: 'Список машин', path: '/vm/list', icon: <ListIcon /> },
      { name: 'Создать машину', path: '/vm/create', icon: <AddIcon /> }
    ]
  },
  {
    category: 'Kubernetes',
    items: [
      { name: 'Список кластеров', path: '/kubernetes/list', icon: <ListIcon /> },
      { name: 'Создать кластер', path: '/kubernetes/create', icon: <AddIcon /> }
    ]
  },
  {
    category: 'Шаблоны',
    items: [
      { name: 'Управление шаблонами', path: '/templates/list', icon: <DescriptionIcon /> }
    ]
  }
];

// Navigation drawer component
function NavigationDrawer({ mobileOpen, handleDrawerToggle, container }) {
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 1
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          PaaS Provider
        </Typography>
      </Toolbar>
      <Divider />
      {navItems.map((category) => (
        <React.Fragment key={category.category}>
          <List subheader={
            <Typography 
              variant="overline" 
              sx={{ 
                display: 'block', 
                px: 2, 
                py: 1, 
                color: 'text.secondary',
                fontWeight: 'bold'
              }}
            >
              {category.category}
            </Typography>
          }>
            {category.items.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: '0 24px 24px 0',
                    mx: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />
        </React.Fragment>
      ))}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: 'none'
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

// Dashboard component for the home page
function Dashboard() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Добро пожаловать в PaaS Provider
      </Typography>
      <Typography variant="body1" paragraph>
        Выберите раздел в меню для управления ресурсами.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 4 }}>
        <Paper 
          component={RouterLink} 
          to="/vm/list" 
          sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <ComputerIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" component="h2" gutterBottom>
            Виртуальные машины
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Управление виртуальными машинами и их конфигурациями
          </Typography>
        </Paper>

        <Paper 
          component={RouterLink} 
          to="/kubernetes/list" 
          sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <StorageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" component="h2" gutterBottom>
            Kubernetes кластеры
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Управление кластерами Kubernetes и их настройками
          </Typography>
        </Paper>

        <Paper 
          component={RouterLink} 
          to="/templates/list" 
          sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" component="h2" gutterBottom>
            Шаблоны
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Управление шаблонами для виртуальных машин и кластеров
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />

        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}
            >
              PaaS Provider
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <NavigationDrawer 
          mobileOpen={mobileOpen} 
          handleDrawerToggle={handleDrawerToggle} 
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: 'background.default',
            minHeight: '100vh'
          }}
        >
          <Toolbar /> {/* Spacer for fixed AppBar */}
          <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />

              {/* Creation routes */}
              <Route path="/vm/create" element={<VirtualMachinePage />} />
              <Route path="/kubernetes/create" element={<KubernetesClusterPage />} />
              <Route path="/templates/create" element={<Navigate to="/templates/list" replace />} />

              {/* Management routes */}
              <Route path="/vm/list" element={<VirtualMachineListPage />} />
              <Route path="/kubernetes/list" element={<KubernetesClusterListPage />} />
              <Route path="/templates/list" element={<TemplateListPage />} />

              {/* Redirect old routes */}
              <Route path="/vm" element={<Navigate to="/vm/create" replace />} />
              <Route path="/kubernetes" element={<Navigate to="/kubernetes/create" replace />} />
            </Routes>
          </Container>

          {/* Footer */}
          <Box 
            component="footer" 
            sx={{ 
              mt: 'auto', 
              py: 3, 
              textAlign: 'center',
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              marginTop: 4
            }}
          >
            <Typography variant="body2" color="text.secondary">
              PaaS Provider &copy; {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
