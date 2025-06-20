import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ResourceDetail = ({ resource, fields, onClose, title }) => {
  if (!resource) return null;

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          backgroundColor: 'background.default'
        }}
      >
        <Typography variant="h6" component="div">
          {title || 'Детали ресурса'}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.key}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {field.label}
                </Typography>
                <Typography variant="body1">
                  {field.render ? field.render(resource) : resource[field.key] || '—'}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {resource.renderedTemplate && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              Результат
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                backgroundColor: 'background.default',
                fontFamily: '"Roboto Mono", monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                overflowX: 'auto',
                borderRadius: 1
              }}
            >
              {resource.renderedTemplate}
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceDetail;
