import React, { useState } from 'react';
import './style.scss';

function Sidebar({ zikirler, selectedZikir, onZikirSelect, onAddZikir, onUpdateZikir, onDeleteZikir, onResetAllData, isOpen, onClose }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingZikir, setEditingZikir] = useState(null);
  const [newZikirName, setNewZikirName] = useState('');
  const [newZikirTarget, setNewZikirTarget] = useState('');
  const [editTarget, setEditTarget] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newZikirName.trim() && newZikirTarget > 0) {
      onAddZikir({
        isim: newZikirName.trim(),
        toplam: parseInt(newZikirTarget)
      });
      setNewZikirName('');
      setNewZikirTarget('');
      setShowAddForm(false);
    }
  };

  const handleEditSubmit = (zikirId) => {
    if (editTarget > 0) {
      onUpdateZikir(zikirId, parseInt(editTarget));
      setEditingZikir(null);
      setEditTarget('');
    }
  };

  const startEditing = (zikir) => {
    setEditingZikir(zikir.id);
    setEditTarget(zikir.toplam.toString());
  };

  const cancelEditing = () => {
    setEditingZikir(null);
    setEditTarget('');
  };

  return (
    <div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__header">
        <h3>Hatmeyolu - Zikir Listesi</h3>
        <div className="sidebar__header-buttons">
          <button 
            className="sidebar__add-btn" 
            onClick={() => setShowAddForm(!showAddForm)}
            title="Yeni Zikir Ekle"
          >
            +
          </button>
          <button className="sidebar__close-btn" onClick={onClose}>
            ×
          </button>
        </div>
      </div>

      {/* Yeni Zikir Ekleme Formu */}
      {showAddForm && (
        <div className="sidebar__add-form">
          <form onSubmit={handleAddSubmit}>
            <input
              type="text"
              placeholder="Zikir adı..."
              value={newZikirName}
              onChange={(e) => setNewZikirName(e.target.value)}
              className="sidebar__input"
              autoFocus
            />
            <input
              type="number"
              placeholder="Hedef sayı..."
              value={newZikirTarget}
              onChange={(e) => setNewZikirTarget(e.target.value)}
              className="sidebar__input"
              min="1"
            />
            <div className="sidebar__form-buttons">
              <button type="submit" className="sidebar__form-btn sidebar__form-btn--save">
                Ekle
              </button>
              <button 
                type="button" 
                className="sidebar__form-btn sidebar__form-btn--cancel"
                onClick={() => {
                  setShowAddForm(false);
                  setNewZikirName('');
                  setNewZikirTarget('');
                }}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}
      
      <ul className="sidebar__content">
        {zikirler.map((zikir) => (
          <li 
            key={zikir.id} 
            className={`sidebar__item ${selectedZikir?.id === zikir.id ? 'sidebar__item--active' : ''}`}
          >
            <div 
              className="sidebar__item-content"
              onClick={() => onZikirSelect(zikir)}
            >
              <div className="sidebar__item-name">{zikir.isim}</div>
              {editingZikir === zikir.id ? (
                <div className="sidebar__edit-form">
                  <input
                    type="number"
                    value={editTarget}
                    onChange={(e) => setEditTarget(e.target.value)}
                    className="sidebar__edit-input"
                    min="1"
                    autoFocus
                  />
                  <div className="sidebar__edit-buttons">
                    <button 
                      onClick={() => handleEditSubmit(zikir.id)}
                      className="sidebar__edit-btn sidebar__edit-btn--save"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={cancelEditing}
                      className="sidebar__edit-btn sidebar__edit-btn--cancel"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="sidebar__item-total">{zikir.toplam.toLocaleString()} kez</div>
              )}
            </div>
            
            {/* Zikir İşlem Butonları */}
            <div className="sidebar__item-actions">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(zikir);
                }}
                className="sidebar__action-btn sidebar__action-btn--edit"
                title="Hedef Güncelle"
              >
                ✎
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`"${zikir.isim}" zikrini silmek istediğinizden emin misiniz?`)) {
                    onDeleteZikir(zikir.id);
                  }
                }}
                className="sidebar__action-btn sidebar__action-btn--delete"
                title="Zikri Sil"
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      {/* Reset Butonu */}
      <div className="sidebar__footer">
        <button 
          className="sidebar__reset-btn"
          onClick={onResetAllData}
          title="Tüm verileri sıfırla"
        >
          🔄 Tüm Verileri Sıfırla
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
