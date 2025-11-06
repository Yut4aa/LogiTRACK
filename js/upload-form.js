/**
 * js/upload-form.js
 * Maneja la subida de documentos y el select de camiones (localStorage).
 * VERSIÓN ACTUALIZADA: Guarda el tipo de documento (Factura/Devolución)
 * y usa FileReader para que los datos persistan.
 * Incluye lógica para el input de archivo personalizado.
 */

/**
 * Puebla el <select> en la sección 'Subir Factura'
 * con los camiones guardados en localStorage.
 */
function populateTruckSelectForUpload() {
    const truckSelect = document.getElementById('truck-plate-select');
    const submitBtn = document.getElementById('upload-submit-btn');
    if (!truckSelect) return;

    const trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];
    
    truckSelect.innerHTML = ''; // Limpiar opciones

    if (trucks.length > 0) {
        // Ordenar alfabéticamente
        trucks.sort((a, b) => a.plate.localeCompare(b.plate));
        
        truckSelect.appendChild(new Option('Selecciona un camión...', ''));
        trucks.forEach(truck => {
            const optionText = `${truck.plate} (${truck.driver})`;
            truckSelect.appendChild(new Option(optionText, truck.plate));
        });
        
        truckSelect.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
    } else {
        truckSelect.appendChild(new Option('Agregue un camión primero', ''));
        truckSelect.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
    }
}

/**
 * Maneja el evento de submit del formulario 'upload-form'.
 */
function handleUploadSubmit(event) {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    const plateSelect = document.getElementById('truck-plate-select');
    const fileInput = document.getElementById('document-file');
    const typeSelect = document.getElementById('document-type-select');

    const plate = plateSelect.value;
    const file = fileInput.files[0];
    const documentType = typeSelect.value;

    if (!plate || !file || !documentType) {
        alert('Por favor, complete todos los campos: camión, archivo y tipo de documento.');
        return;
    }
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<i data-feather="loader" class="spin"></i> Subiendo...';
    feather.replace(); // Activar el icono de "loader"

    // Usar FileReader para convertir la imagen a Data URL (texto base64)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = function() {
        const fileUrl = reader.result;
        const today = new Date();
        const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        
        const documents = JSON.parse(localStorage.getItem('logitrack_documents')) || {};

        if (!documents[dateKey]) {
            documents[dateKey] = [];
        }
        
        documents[dateKey].push({
            plate: plate,
            type: documentType, 
            fileUrl: fileUrl,
            date: today.toISOString()
        });
        
        localStorage.setItem('logitrack_documents', JSON.stringify(documents));

        if (typeof renderCalendar === 'function') {
            renderCalendar();
        }
        if (typeof renderTrucksList === 'function') {
            renderTrucksList();
        }
        
        alert('Documento subido con éxito.');
        
        // --- LIMPIEZA DE FORMULARIO ACTUALIZADA ---
        plateSelect.value = '';
        fileInput.value = '';
        typeSelect.value = ''; 
        
        const fileNameDisplay = document.getElementById('file-name-display');
        if (fileNameDisplay) {
            fileNameDisplay.textContent = 'Seleccionar Archivo';
        }
        // --- FIN DE LIMPIEZA ---

        submitButton.disabled = false;
        submitButton.innerHTML = '<i data-feather="upload-cloud"></i> Subir Documento';
        feather.replace(); // Reactivar icono original
    };
    
    reader.onerror = function() {
        alert('Error al leer el archivo.');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i data-feather="upload-cloud"></i> Subir Documento';
        feather.replace();
    };
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUploadSubmit);
    }
    
    if (typeof populateTruckSelectForUpload === 'function') {
        populateTruckSelectForUpload();
    }
    
    // --- NUEVO: Lógica para el input de archivo customizado ---
    const fileInput = document.getElementById('document-file');
    const fileNameDisplay = document.getElementById('file-name-display');
    
    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                // Mostrar solo el nombre del archivo
                fileNameDisplay.textContent = fileInput.files[0].name;
            } else {
                fileNameDisplay.textContent = 'Seleccionar Archivo';
            }
        });
    }
    // --- Fin del nuevo bloque ---
});