import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./components/Sidebar";
import Counter from "./components/counter";
import zikirlerData from "./data/zikirler";
import { selectSidebar, toggleSidebar } from "./redux/sidebar/sidebarSlice";
import "./App.scss";

function App() {
  // LocalStorage'dan zikirleri yükle
  const loadZikirlerFromStorage = () => {
    const savedZikirler = localStorage.getItem('hatmeyolu_zikirler');
    if (savedZikirler) {
      try {
        return JSON.parse(savedZikirler);
      } catch (error) {
        console.error('Zikirler yüklenirken hata:', error);
        return zikirlerData;
      }
    }
    return zikirlerData;
  };

  // LocalStorage'dan son seçili zikri yükle
  const loadSelectedZikirFromStorage = (zikirler) => {
    const savedSelectedId = localStorage.getItem('hatmeyolu_selected_zikir_id');
    if (savedSelectedId) {
      const found = zikirler.find(z => z.id === parseInt(savedSelectedId));
      return found || zikirler[0];
    }
    return zikirler[0];
  };

  const [zikirler, setZikirler] = useState(loadZikirlerFromStorage);
  const [selectedZikir, setSelectedZikir] = useState(() => loadSelectedZikirFromStorage(loadZikirlerFromStorage()));
  const isSidebarOpen = useSelector(selectSidebar);
  const dispatch = useDispatch();

  // Zikirler değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('hatmeyolu_zikirler', JSON.stringify(zikirler));
  }, [zikirler]);

  // Seçili zikir değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (selectedZikir) {
      localStorage.setItem('hatmeyolu_selected_zikir_id', selectedZikir.id.toString());
    }
  }, [selectedZikir]);

  const handleZikirSelect = (zikir) => {
    setSelectedZikir(zikir);
    // Zikir seçilince sidebar'ı kapat
    dispatch(toggleSidebar());
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // Yeni zikir ekleme fonksiyonu
  const handleAddZikir = (newZikir) => {
    const zikirWithId = {
      ...newZikir,
      id: Math.max(...zikirler.map(z => z.id), 0) + 1 // Güvenli ID oluşturma
    };
    const updatedZikirler = [...zikirler, zikirWithId];
    setZikirler(updatedZikirler);
  };

  // Zikir hedefini güncelleme fonksiyonu
  const handleUpdateZikir = (zikirId, newTarget) => {
    const updatedZikirler = zikirler.map(zikir => 
      zikir.id === zikirId 
        ? { ...zikir, toplam: newTarget }
        : zikir
    );
    setZikirler(updatedZikirler);
    
    // Seçili zikir güncellenmişse, onu da güncelle
    if (selectedZikir?.id === zikirId) {
      setSelectedZikir({ ...selectedZikir, toplam: newTarget });
    }
  };

  // Zikir silme fonksiyonu
  const handleDeleteZikir = (zikirId) => {
    const updatedZikirler = zikirler.filter(zikir => zikir.id !== zikirId);
    setZikirler(updatedZikirler);
    
    // Zikrin localStorage'daki sayım verisini de sil
    localStorage.removeItem(`zikir_${zikirId}`);
    
    // Seçili zikir silinmişse, ilk zikri seç
    if (selectedZikir?.id === zikirId) {
      const newSelected = updatedZikirler[0] || null;
      setSelectedZikir(newSelected);
    }
  };

  // Tüm verileri sıfırlama fonksiyonu (isteğe bağlı)
  const handleResetAllData = () => {
    if (window.confirm('Tüm zikir verileri ve sayımlar silinecek. Emin misiniz?')) {
      // Tüm zikir sayımlarını sil
      zikirler.forEach(zikir => {
        localStorage.removeItem(`zikir_${zikir.id}`);
      });
      
      // Zikirler'i varsayılana sıfırla
      setZikirler(zikirlerData);
      setSelectedZikir(zikirlerData[0]);
      
      // LocalStorage'dan özel verileri sil
      localStorage.removeItem('hatmeyolu_zikirler');
      localStorage.removeItem('hatmeyolu_selected_zikir_id');
    }
  };

  return (
    <div className="app">
      {/* Hamburger Menu Button - Sidebar açıkken gizlenir */}
      <button 
        className={`hamburger-btn ${isSidebarOpen ? 'hidden' : ''}`} 
        onClick={handleToggleSidebar}
      >
        <span className={isSidebarOpen ? 'hamburger-line active' : 'hamburger-line'}></span>
        <span className={isSidebarOpen ? 'hamburger-line active' : 'hamburger-line'}></span>
        <span className={isSidebarOpen ? 'hamburger-line active' : 'hamburger-line'}></span>
      </button>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={handleToggleSidebar}></div>}
      
      <Sidebar 
        zikirler={zikirler}
        selectedZikir={selectedZikir}
        onZikirSelect={handleZikirSelect}
        onAddZikir={handleAddZikir}
        onUpdateZikir={handleUpdateZikir}
        onDeleteZikir={handleDeleteZikir}
        onResetAllData={handleResetAllData}
        isOpen={isSidebarOpen}
        onClose={handleToggleSidebar}
      />
      <main className={`main-content ${isSidebarOpen ? 'main-content--sidebar-open' : ''}`}>
        <div className="content-container">
          <h1>Hatmeyolu</h1>
          <Counter selectedZikir={selectedZikir} />
          <footer className="footer">
            <p>
              Developed by{' '}
              <a 
                href="https://github.com/hamzademirr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__link"
              >
                Hamza D.
              </a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
