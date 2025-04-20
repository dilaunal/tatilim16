import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminPanel.css';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    rating: '',
    image: '',
    photos: [],
  });
  const [campaigns, setCampaigns] = useState([]);
  const [openCampaignDialog, setOpenCampaignDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignFormData, setCampaignFormData] = useState({
    title: '',
    description: '',
    discount: '',
    startDate: '',
    endDate: '',
    image: ''
  });
  const [activeTab, setActiveTab] = useState(0);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchHotels();
    fetchComplaints();
    fetchCampaigns();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/hotels');
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Şikayetler yüklenirken hata oluştu:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/campaigns');
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleOpenDialog = (hotel = null) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData(hotel);
    } else {
      setEditingHotel(null);
      setFormData({
        name: '',
        location: '',
        price: '',
        rating: '',
        image: '',
        photos: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingHotel(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = editingHotel 
        ? `http://localhost:5002/api/hotels/${editingHotel.id}`
        : 'http://localhost:5002/api/hotels';
      
      const method = editingHotel ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchHotels();
        handleCloseDialog();
        setSnackbar({
          open: true,
          message: editingHotel ? 'Otel başarıyla güncellendi' : 'Otel başarıyla eklendi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'İşlem sırasında bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/hotels/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchHotels();
        setSnackbar({
          open: true,
          message: 'Otel başarıyla silindi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Silme işlemi sırasında bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleStatusChange = async (complaintId, status) => {
    try {
      await axios.put(`http://localhost:5002/api/complaints/${complaintId}`, { status });
      fetchComplaints();
    } catch (error) {
      console.error('Durum güncellenirken hata oluştu:', error);
    }
  };

  const handleDeleteComplaint = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/complaints/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchComplaints();
        setSnackbar({
          open: true,
          message: 'Şikayet başarıyla silindi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Şikayet silinirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleOpenCampaignDialog = (campaign = null) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setCampaignFormData(campaign);
    } else {
      setEditingCampaign(null);
      setCampaignFormData({
        title: '',
        description: '',
        discount: '',
        startDate: '',
        endDate: '',
        image: ''
      });
    }
    setOpenCampaignDialog(true);
  };

  const handleCloseCampaignDialog = () => {
    setOpenCampaignDialog(false);
    setEditingCampaign(null);
  };

  const handleCampaignInputChange = (e) => {
    const { name, value } = e.target;
    setCampaignFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCampaignSubmit = async () => {
    try {
      const url = editingCampaign 
        ? `http://localhost:5002/api/campaigns/${editingCampaign.id}`
        : 'http://localhost:5002/api/campaigns';
      
      const method = editingCampaign ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignFormData),
      });

      if (response.ok) {
        fetchCampaigns();
        handleCloseCampaignDialog();
        setSnackbar({
          open: true,
          message: editingCampaign ? 'Kampanya başarıyla güncellendi' : 'Kampanya başarıyla eklendi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'İşlem sırasında bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5002/api/campaigns/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCampaigns();
        setSnackbar({
          open: true,
          message: 'Kampanya başarıyla silindi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Kampanya silinirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleOpenPhotoDialog = (hotel) => {
    setSelectedHotel(hotel);
    setPhotoDialogOpen(true);
  };

  const handleClosePhotoDialog = () => {
    setPhotoDialogOpen(false);
    setSelectedHotel(null);
    setNewPhoto('');
  };

  const handleAddPhoto = async () => {
    if (!newPhoto || !selectedHotel) return;

    try {
      const updatedHotel = {
        ...selectedHotel,
        photos: [...(selectedHotel.photos || []), newPhoto]
      };

      const response = await fetch(`http://localhost:5002/api/hotels/${selectedHotel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedHotel),
      });

      if (response.ok) {
        fetchHotels();
        handleClosePhotoDialog();
        setSnackbar({
          open: true,
          message: 'Fotoğraf başarıyla eklendi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Fotoğraf eklenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDeletePhoto = async (hotelId, photoIndex) => {
    try {
      const hotel = hotels.find(h => h.id === hotelId);
      if (!hotel) return;

      const updatedPhotos = [...hotel.photos];
      updatedPhotos.splice(photoIndex, 1);

      const response = await fetch(`http://localhost:5002/api/hotels/${hotelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...hotel, photos: updatedPhotos }),
      });

      if (response.ok) {
        fetchHotels();
        setSnackbar({
          open: true,
          message: 'Fotoğraf başarıyla silindi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Fotoğraf silinirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>★</span>
      );
    }
    return stars;
  };

  const handleOpenComplaintDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setOpenDialog(true);
  };

  const handleSaveStatus = async () => {
    if (selectedComplaint) {
      await handleStatusChange(selectedComplaint._id, newStatus);
      handleCloseDialog();
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button className="logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
          onClick={() => handleTabChange(0)}
        >
          Oteller
        </button>
        <button 
          className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => handleTabChange(1)}
        >
          Kampanyalar
        </button>
        <button 
          className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => handleTabChange(2)}
        >
          Şikayetler
        </button>
      </div>

      {/* Oteller Sekmesi */}
      {activeTab === 0 && (
        <div className="hotels-section">
          <button className="add-button" onClick={() => handleOpenDialog()}>
            Yeni Otel Ekle
          </button>

          <div className="hotels-grid">
            {hotels.map((hotel) => (
              <div className="hotel-card" key={hotel.id}>
                {hotel.image && (
                  <div className="hotel-image-container">
                    <img src={hotel.image} alt={hotel.name} className="hotel-main-image" />
                  </div>
                )}
                <div className="hotel-content">
                  <h3>{hotel.name}</h3>
                  <p className="location">{hotel.location}</p>
                  <p className="price">Fiyat: {hotel.price} TL</p>
                  <div className="rating">{renderStars(hotel.rating)}</div>
                  
                  <div className="photos-section">
                    <h4>Otel Fotoğrafları <span className="photo-count">({hotel.photos ? hotel.photos.length : 0})</span></h4>
                    {hotel.photos && hotel.photos.length > 0 ? (
                      <div className="photos-grid">
                        {hotel.photos.map((photo, index) => (
                          <div className="photo-item" key={index}>
                            <img src={photo} alt={`${hotel.name} - Fotoğraf ${index + 1}`} />
                            <button 
                              className="delete-photo-button"
                              onClick={() => handleDeletePhoto(hotel.id, index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-photos">Henüz fotoğraf eklenmemiş</p>
                    )}
                  </div>
                </div>
                <div className="hotel-actions">
                  <button onClick={() => handleOpenDialog(hotel)}>Düzenle</button>
                  <button onClick={() => handleOpenPhotoDialog(hotel)} className="add-photo-button">
                    <span className="add-icon">+</span> Fotoğraf Ekle
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(hotel.id)}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kampanyalar Sekmesi */}
      {activeTab === 1 && (
        <div className="campaigns-section">
          <button className="add-button" onClick={() => handleOpenCampaignDialog()}>
            Yeni Kampanya Ekle
          </button>

          <div className="campaigns-grid">
            {campaigns.map((campaign) => (
              <div className="campaign-card" key={campaign.id}>
                {campaign.image && (
                  <div className="campaign-image-container">
                    <img src={campaign.image} alt={campaign.title} className="campaign-image" />
                  </div>
                )}
                <div className="campaign-content">
                  <h3>{campaign.title}</h3>
                  <p className="description">{campaign.description}</p>
                  <p className="discount">İndirim: %{campaign.discount}</p>
                  <p className="date">
                    Başlangıç: {new Date(campaign.startDate).toLocaleDateString()}
                  </p>
                  <p className="date">
                    Bitiş: {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="campaign-actions">
                  <button onClick={() => handleOpenCampaignDialog(campaign)}>Düzenle</button>
                  <button className="delete-button" onClick={() => handleDeleteCampaign(campaign.id)}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Şikayetler Sekmesi */}
      {activeTab === 2 && (
        <div className="complaints-section">
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Başlık</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Oluşturulma Tarihi</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint._id}>
                    <TableCell>{complaint.title}</TableCell>
                    <TableCell>{complaint.description}</TableCell>
                    <TableCell>{complaint.status}</TableCell>
                    <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenComplaintDialog(complaint)}
                        sx={{ mr: 1 }}
                      >
                        Durum Güncelle
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteComplaint(complaint._id)}
                      >
                        Sil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Otel Ekleme/Düzenleme Dialog */}
      {openDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>{editingHotel ? 'Otel Düzenle' : 'Yeni Otel Ekle'}</h2>
            <div className="dialog-content">
              <input
                type="text"
                name="name"
                placeholder="Otel Adı"
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Konum"
                value={formData.location}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="price"
                placeholder="Fiyat"
                value={formData.price}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="rating"
                placeholder="Puan"
                value={formData.rating}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="image"
                placeholder="Ana Fotoğraf URL"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>
            <div className="dialog-actions">
              <button onClick={handleCloseDialog}>İptal</button>
              <button onClick={handleSubmit}>
                {editingHotel ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kampanya Ekleme/Düzenleme Modalı */}
      {openCampaignDialog && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h2>{editingCampaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya Ekle'}</h2>
            <div className="dialog-content">
              <div className="form-group">
                <label>Kampanya Başlığı:</label>
                <input 
                  type="text" 
                  name="title" 
                  value={campaignFormData.title} 
                  onChange={handleCampaignInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Açıklama:</label>
                <textarea 
                  name="description" 
                  value={campaignFormData.description} 
                  onChange={handleCampaignInputChange} 
                />
              </div>
              <div className="form-group">
                <label>İndirim Oranı (%):</label>
                <input 
                  type="number" 
                  name="discount" 
                  value={campaignFormData.discount} 
                  onChange={handleCampaignInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Başlangıç Tarihi:</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={campaignFormData.startDate ? campaignFormData.startDate.substring(0, 10) : ''} 
                  onChange={handleCampaignInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Bitiş Tarihi:</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={campaignFormData.endDate ? campaignFormData.endDate.substring(0, 10) : ''} 
                  onChange={handleCampaignInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Görsel URL:</label>
                <input 
                  type="text" 
                  name="image" 
                  value={campaignFormData.image} 
                  onChange={handleCampaignInputChange} 
                />
              </div>
            </div>
            <div className="dialog-actions">
              <button onClick={handleCloseCampaignDialog}>İptal</button>
              <button onClick={handleCampaignSubmit}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* Fotoğraf Ekleme Dialog */}
      {photoDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Fotoğraf Ekle - {selectedHotel?.name}</h2>
            <div className="dialog-content">
              <div className="form-group">
                <label>Fotoğraf URL:</label>
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                />
                <p className="form-hint">*.jpg, *.png veya *.webp formatında bir fotoğraf URL'si girin</p>
              </div>
              
              {newPhoto && (
                <div className="photo-preview">
                  <p className="preview-label">Önizleme:</p>
                  <div className="preview-container">
                    <img 
                      src={newPhoto} 
                      alt="Fotoğraf önizleme" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Görüntü+Yüklenemedi';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="dialog-actions">
              <button onClick={handleClosePhotoDialog}>İptal</button>
              <button 
                onClick={handleAddPhoto}
                disabled={!newPhoto}
                className={!newPhoto ? 'button-disabled' : ''}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`snackbar ${snackbar.severity}`}>
          {snackbar.message}
          <button onClick={() => setSnackbar({ ...snackbar, open: false })}>×</button>
        </div>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Şikayet Durumunu Güncelle</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Yeni Durum</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Yeni Durum"
            >
              <MenuItem value="Beklemede">Beklemede</MenuItem>
              <MenuItem value="İnceleniyor">İnceleniyor</MenuItem>
              <MenuItem value="Çözüldü">Çözüldü</MenuItem>
              <MenuItem value="Reddedildi">Reddedildi</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSaveStatus} variant="contained" color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPanel; 