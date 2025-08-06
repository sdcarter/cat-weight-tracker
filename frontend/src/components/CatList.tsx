import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Pets as PetsIcon,
} from '@mui/icons-material';
import { CatListProps } from '../types/api';

const CatList: React.FC<CatListProps> = ({ 
  cats, 
  selectedCatId, 
  onSelectCat, 
  onEditCat, 
  onDeleteCat 
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuCatId, setMenuCatId] = React.useState<number | null>(null);
  
  if (!cats || cats.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          py: 6,
          textAlign: 'center'
        }}
      >
        <PetsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t('cats.noCatsFound', 'No cats found')}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          {t('cats.addFirstCat', 'Add your first cat to get started!')}
        </Typography>
      </Box>
    );
  }

  const handleCatSelect = (catId: number): void => {
    onSelectCat(selectedCatId === catId ? null : catId);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, catId: number): void => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuCatId(catId);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
    setMenuCatId(null);
  };

  const handleEdit = (cat: CatListProps['cats'][0]): void => {
    onEditCat(cat);
    handleMenuClose();
  };

  const handleDelete = (catId: number): void => {
    onDeleteCat(catId);
    handleMenuClose();
  };

  return (
    <>
      <Grid container spacing={3}>
        {cats.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                border: selectedCatId === cat.id ? 2 : 1,
                borderColor: selectedCatId === cat.id ? 'primary.main' : 'divider',
                bgcolor: selectedCatId === cat.id ? 'primary.50' : 'background.paper',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => handleCatSelect(cat.id)}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PetsIcon color="primary" />
                    <Typography variant="h6" component="h3" noWrap>
                      {cat.name}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, cat.id)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('cats.targetWeight', 'Target Weight')}
                    </Typography>
                    <Chip
                      label={`${cat.target_weight} ${t('common.weightUnit', 'lbs')}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ pt: 0, justifyContent: 'center' }}>
                <Button
                  size="small"
                  variant={selectedCatId === cat.id ? 'contained' : 'outlined'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCatSelect(cat.id);
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  {selectedCatId === cat.id 
                    ? t('cats.selected', 'Selected') 
                    : t('cats.select', 'Select')
                  }
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <MenuItem 
          onClick={() => {
            const cat = cats.find(c => c.id === menuCatId);
            if (cat) handleEdit(cat);
          }}
        >
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          {t('common.edit', 'Edit')}
        </MenuItem>
        <MenuItem 
          onClick={() => menuCatId && handleDelete(menuCatId)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          {t('common.delete', 'Delete')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default CatList;
