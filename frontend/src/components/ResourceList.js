import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const ResourceList = ({
  resources, 
  columns, 
  onView, 
  onEdit, 
  onDelete, 
  emptyMessage = "Нет доступных ресурсов" 
}) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (resource) => {
    setConfirmDelete(resource);
  };

  const confirmDeleteAction = () => {
    if (confirmDelete && onDelete) {
      onDelete(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  if (!resources || resources.length === 0) {
    return (
      <Alert 
        severity="info" 
        variant="outlined" 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          py: 3,
          backgroundColor: 'background.paper'
        }}
      >
        {emptyMessage}
      </Alert>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mb: 3, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="resource table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.default' }}>
              {columns.map((column) => (
                <TableCell 
                  key={column.key}
                  sx={{ 
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ width: 140, fontWeight: 'bold' }}>
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((resource) => (
              <TableRow 
                key={resource.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                  transition: 'background-color 0.2s'
                }}
              >
                {columns.map((column) => (
                  <TableCell key={`${resource.id}-${column.key}`}>
                    {column.render ? column.render(resource) : resource[column.key]}
                  </TableCell>
                ))}
                <TableCell align="right">
                  {onView && (
                    <Tooltip title="Просмотр">
                      <IconButton 
                        size="small" 
                        color="info" 
                        onClick={() => onView(resource)}
                        sx={{ mr: 1 }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onEdit && (
                    <Tooltip title="Редактировать">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => onEdit(resource)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {onDelete && (
                    <Tooltip title="Удалить">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(resource)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete confirmation dialog */}
      <Dialog
        open={Boolean(confirmDelete)}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы уверены, что хотите удалить ресурс "{confirmDelete?.name}"?
            Это действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary" variant="outlined">
            Отмена
          </Button>
          <Button onClick={confirmDeleteAction} color="error" variant="contained" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResourceList;
