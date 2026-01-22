// ============================================
// MEDICLO CARE - SIMPLE SCRIPT
// ============================================

let cartItems = [];
let currentAppointment = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mediclo Care - Simple Version');
    
    initLoadingScreen();
    initNavigation();
    initHeroSection();
    initAIDiagnosis();
    initTeleconsultation();
    initPharmacy();
    initBookingSystem();
    
    // Set min date for booking
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    document.getElementById('bookingDate').value = today;
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            showNotification('success', 'Selamat Datang!', 'Mediclo Care siap melayani Anda.');
        }, 500);
    }, 2000);
}

// ===== NAVIGATION =====
function initNavigation() {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== HERO SECTION =====
function initHeroSection() {
    // Animated counters
    animateCounter('patientCount', 0, 15000, 2000);
    animateCounter('doctorCount', 0, 150, 1500);
    
    // Start Diagnosis button
    document.getElementById('startDiagnosis').addEventListener('click', function(e) {
        e.preventDefault();
        scrollToSection('aidiagnosis');
        showNotification('info', 'AI Diagnosis', 'Pilih gejala yang Anda alami.');
    });
}

function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    let current = start;
    const increment = (end - start) / (duration / 16); // 60fps
    
    const updateCounter = () => {
        current += increment;
        if (current >= end) {
            element.textContent = end + '+';
            return;
        }
        element.textContent = Math.floor(current) + '+';
        requestAnimationFrame(updateCounter);
    };
    
    updateCounter();
}

// ===== AI DIAGNOSIS =====
function initAIDiagnosis() {
    // Load symptoms
    const symptoms = [
        'Demam', 'Sakit Kepala', 'Batuk', 'Pilek',
        'Sakit Tenggorokan', 'Mual', 'Diare', 'Pusing'
    ];
    
    const symptomList = document.getElementById('symptomList');
    symptomList.innerHTML = '';
    
    symptoms.forEach(symptom => {
        const item = document.createElement('div');
        item.className = 'symptom-item';
        item.innerHTML = `
            <input type="checkbox" id="symptom_${symptom}" value="${symptom}">
            <label for="symptom_${symptom}">${symptom}</label>
        `;
        symptomList.appendChild(item);
    });
    
    // Run AI Diagnosis
    document.getElementById('runAIDiagnosis').addEventListener('click', function() {
        const selectedSymptoms = Array.from(document.querySelectorAll('.symptom-item input:checked'))
            .map(input => input.value);
        
        if (selectedSymptoms.length === 0) {
            showNotification('warning', 'Pilih Gejala', 'Pilih minimal 1 gejala yang dialami.');
            return;
        }
        
        // Show loading
        const btn = this;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menganalisis...';
        btn.disabled = true;
        
        // Simulate AI processing
        setTimeout(() => {
            const analysis = analyzeSymptoms(selectedSymptoms);
            displayDiagnosisResults(analysis);
            
            // Reset button
            btn.innerHTML = '<i class="fas fa-brain"></i> Analisis dengan AI';
            btn.disabled = false;
            
            showNotification('success', 'Analisis Selesai', 'AI telah menganalisis gejala Anda.');
        }, 1500);
    });
}

function analyzeSymptoms(symptoms) {
    // Simple analysis logic
    let diagnosis = 'Kondisi Umum';
    let urgency = 'Rendah';
    let description = 'Kondisi kesehatan umum yang memerlukan istirahat.';
    
    if (symptoms.includes('Demam') && symptoms.includes('Batuk')) {
        diagnosis = 'Common Cold (Flu Biasa)';
        urgency = 'Sedang';
        description = 'Infeksi virus ringan pada saluran pernapasan atas.';
    } else if (symptoms.includes('Sakit Kepala') && symptoms.includes('Mual')) {
        diagnosis = 'Migrain';
        urgency = 'Sedang';
        description = 'Sakit kepala berat yang mungkin memerlukan perhatian medis.';
    } else if (symptoms.includes('Diare') && symptoms.includes('Mual')) {
        diagnosis = 'Gangguan Pencernaan';
        urgency = 'Rendah';
        description = 'Gangguan pada sistem pencernaan, perlu banyak minum air.';
    }
    
    return { diagnosis, urgency, description };
}

function displayDiagnosisResults(analysis) {
    document.getElementById('diagnosisTitle').textContent = analysis.diagnosis;
    document.getElementById('diagnosisUrgency').textContent = analysis.urgency;
    document.getElementById('diagnosisDescription').textContent = analysis.description;
}

// ===== TELECONSULTATION =====
function initTeleconsultation() {
    let isConsultationActive = false;
    
    document.getElementById('startConsultation').addEventListener('click', function() {
        if (!isConsultationActive) {
            isConsultationActive = true;
            this.innerHTML = '<i class="fas fa-phone-slash"></i> Akhiri';
            
            document.getElementById('doctorVideo').innerHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-user-md fa-3x"></i>
                    <p>dr. Widya Sari - Online</p>
                </div>
            `;
            
            showNotification('success', 'Konsultasi Dimulai', 'Terhubung dengan dokter...');
        } else {
            isConsultationActive = false;
            this.innerHTML = '<i class="fas fa-phone"></i> Mulai Konsultasi';
            
            document.getElementById('doctorVideo').innerHTML = `
                <i class="fas fa-user-md fa-3x"></i>
                <p>Video Dokter</p>
            `;
            
            showNotification('info', 'Konsultasi Berakhir', 'Sesi konsultasi telah berakhir.');
        }
    });
}

// ===== PHARMACY =====
function initPharmacy() {
    // Load medicines
    const medicines = [
        { id: 1, name: 'Paracetamol 500mg', price: 15000 },
        { id: 2, name: 'Ibuprofen 400mg', price: 20000 },
        { id: 3, name: 'Vitamin C 500mg', price: 30000 },
        { id: 4, name: 'Antasida Tablet', price: 18000 }
    ];
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    medicines.forEach(med => {
        const product = document.createElement('div');
        product.className = 'product-card';
        product.innerHTML = `
            <h6>${med.name}</h6>
            <p class="product-price">Rp ${med.price.toLocaleString()}</p>
            <button class="btn-add-to-cart" data-id="${med.id}" data-name="${med.name}" data-price="${med.price}">
                <i class="fas fa-cart-plus"></i> Tambah
            </button>
        `;
        productsGrid.appendChild(product);
    });
    
    // Add to cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseInt(this.dataset.price);
            
            addToCart(id, name, price);
        });
    });
    
    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (cartItems.length === 0) {
            showNotification('warning', 'Keranjang Kosong', 'Tambahkan obat terlebih dahulu.');
            return;
        }
        
        showNotification('success', 'Checkout Berhasil!', 'Obat akan dikirim dalam 1-2 jam.');
        cartItems = [];
        updateCartDisplay();
    });
}

function addToCart(id, name, price) {
    cartItems.push({
        id: id,
        name: name,
        price: price,
        quantity: 1
    });
    
    updateCartDisplay();
    showNotification('success', 'Ditambahkan', `${name} telah ditambahkan ke keranjang.`);
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Keranjang kosong</p>';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <strong>${item.name}</strong>
            <span>Rp ${item.price.toLocaleString()}</span>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

// ===== BOOKING SYSTEM =====
function initBookingSystem() {
    document.getElementById('submitBookingBtn').addEventListener('click', function() {
        const name = document.getElementById('bookingName').value.trim();
        const phone = document.getElementById('bookingPhone').value.trim();
        
        if (!name || !phone) {
            showNotification('warning', 'Data Tidak Lengkap', 'Harap isi nama dan nomor WhatsApp.');
            return;
        }
        
        // Save appointment
        currentAppointment = {
            name: name,
            phone: phone,
            doctor: document.getElementById('bookingDoctor').value,
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('bookingTime').value,
            description: document.getElementById('bookingDescription').value
        };
        
        // Update summary
        document.getElementById('summaryDoctor').textContent = currentAppointment.doctor;
        document.getElementById('summaryDateTime').textContent = `${currentAppointment.date} ${currentAppointment.time}`;
        
        // Clear form
        document.getElementById('bookingName').value = '';
        document.getElementById('bookingPhone').value = '';
        document.getElementById('bookingDescription').value = '';
        
        showNotification('success', 'Booking Berhasil!', 
            `Konfirmasi akan dikirim ke WhatsApp Anda. Terima kasih ${name}!`);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(type, title, message) {
    const toast = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    // Set icon
    let icon = 'fa-bell';
    switch(type) {
        case 'success': icon = 'fa-check-circle'; break;
        case 'warning': icon = 'fa-exclamation-triangle'; break;
        case 'info': icon = 'fa-info-circle'; break;
    }
    
    // Update content
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.querySelector('.toast-icon i').className = `fas ${icon}`;
    
    // Show toast
    toast.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    const toast = document.getElementById('notificationToast');
    toast.classList.remove('show');
}

// ===== UTILITY FUNCTIONS =====
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// Export for console
window.MedicloCare = {
    showNotification,
    scrollToSection
};