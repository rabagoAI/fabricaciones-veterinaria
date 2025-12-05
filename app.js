// Datos de la aplicación
let appData = {
    currentUser: "Usuario",
    theme: 'light',
    records: [],
    kanbanTasks: [],
    currentRecordId: 1,
    currentTaskId: 1,
    currentPage: 1,
    recordsPerPage: 10,
    filterProduct: 'all',
    filterYear: 'all',
    filterMonth: 'all'
};

// Constantes para claves de localStorage
const STORAGE_KEYS = {
    RECORDS: 'veterinaria_records',
    KANBAN_TASKS: 'veterinaria_kanban_tasks',
    CURRENT_RECORD_ID: 'veterinaria_current_record_id',
    CURRENT_TASK_ID: 'veterinaria_current_task_id',
    SETTINGS: 'veterinaria_settings'
};

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Función de inicialización
function initApp() {
    // Cargar datos guardados
    loadSavedData();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar importación Excel
    setupImportExcel();
    
    // Aplicar tema guardado
    applySavedTheme();
    
    // Inicializar componentes de la aplicación
    populateProductFilters();
    renderTable();
    updateDashboardStats();
    loadKanbanTasks();
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        showToast('Aplicación cargada correctamente. Datos persistidos localmente.', 'success');
    }, 500);
}

// ============================================
// FUNCIONES DE PERSISTENCIA (localStorage)
// ============================================

// Cargar datos guardados
function loadSavedData() {
    try {
        // Cargar registros
        const savedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);
        if (savedRecords) {
            appData.records = JSON.parse(savedRecords);
        }
        
        // Cargar tareas Kanban
        const savedTasks = localStorage.getItem(STORAGE_KEYS.KANBAN_TASKS);
        if (savedTasks) {
            appData.kanbanTasks = JSON.parse(savedTasks);
        }
        
        // Cargar IDs actuales
        const savedRecordId = localStorage.getItem(STORAGE_KEYS.CURRENT_RECORD_ID);
        if (savedRecordId) {
            appData.currentRecordId = parseInt(savedRecordId);
        } else if (appData.records.length > 0) {
            // Si hay registros pero no ID guardado, calcular el máximo ID
            appData.currentRecordId = Math.max(...appData.records.map(r => r.id)) + 1;
        }
        
        const savedTaskId = localStorage.getItem(STORAGE_KEYS.CURRENT_TASK_ID);
        if (savedTaskId) {
            appData.currentTaskId = parseInt(savedTaskId);
        } else if (appData.kanbanTasks.length > 0) {
            // Si hay tareas pero no ID guardado, calcular el máximo ID
            appData.currentTaskId = Math.max(...appData.kanbanTasks.map(t => t.id)) + 1;
        }
        
        // Cargar configuración
        const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            if (settings.theme) {
                appData.theme = settings.theme;
            }
            if (settings.recordsPerPage) {
                appData.recordsPerPage = settings.recordsPerPage;
            }
        }
        
        console.log('Datos cargados:', {
            records: appData.records.length,
            tasks: appData.kanbanTasks.length,
            currentRecordId: appData.currentRecordId,
            currentTaskId: appData.currentTaskId
        });
        
    } catch (error) {
        console.error('Error al cargar datos guardados:', error);
        showToast('Error al cargar datos guardados. Se iniciará con datos vacíos.', 'warning');
        
        // Resetear a valores por defecto
        appData.records = [];
        appData.kanbanTasks = [];
        appData.currentRecordId = 1;
        appData.currentTaskId = 1;
    }
}

// Guardar datos
function saveData() {
    try {
        // Guardar registros
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(appData.records));
        
        // Guardar tareas Kanban
        localStorage.setItem(STORAGE_KEYS.KANBAN_TASKS, JSON.stringify(appData.kanbanTasks));
        
        // Guardar IDs actuales
        localStorage.setItem(STORAGE_KEYS.CURRENT_RECORD_ID, appData.currentRecordId.toString());
        localStorage.setItem(STORAGE_KEYS.CURRENT_TASK_ID, appData.currentTaskId.toString());
        
        // Guardar configuración
        const settings = {
            theme: appData.theme,
            recordsPerPage: appData.recordsPerPage
        };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        
        console.log('Datos guardados exitosamente');
        
    } catch (error) {
        console.error('Error al guardar datos:', error);
        showToast('Error al guardar datos en el almacenamiento local', 'error');
    }
}

// Guardar datos automáticamente después de cambios
function saveDataWithDebounce() {
    // Usar debounce para evitar guardar demasiadas veces
    clearTimeout(window.saveDataTimeout);
    window.saveDataTimeout = setTimeout(saveData, 500);
}

// Configurar todos los event listeners
function setupEventListeners() {
    // Navegación
    document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavItemClick);
    });
    
    // Cambio de tema
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', handleThemeOptionClick);
    });
    
    // Acciones rápidas del dashboard
    document.getElementById('quick-add-btn').addEventListener('click', () => showRecordModal());
    document.getElementById('quick-export-btn').addEventListener('click', exportToExcel);
    document.getElementById('quick-kanban-btn').addEventListener('click', () => switchToSection('kanban'));
    
    // Tabla de datos
    document.getElementById('add-record-btn').addEventListener('click', () => showRecordModal());
    document.getElementById('export-excel-btn').addEventListener('click', exportToExcel);
    document.getElementById('product-filter').addEventListener('change', handleFilterChange);
    document.getElementById('year-filter').addEventListener('change', handleFilterChange);
    document.getElementById('month-filter').addEventListener('change', handleFilterChange);
    document.getElementById('clear-filters-btn').addEventListener('click', clearFilters);
    document.getElementById('prev-page').addEventListener('click', goToPrevPage);
    document.getElementById('next-page').addEventListener('click', goToNextPage);
    
    // Kanban
    document.getElementById('add-task-btn').addEventListener('click', () => showTaskModal());
    document.querySelectorAll('.add-task-to-column').forEach(btn => {
        btn.addEventListener('click', function() {
            showTaskModal(this.dataset.status);
        });
    });
    
    // Modal de registro
    document.getElementById('modal-close').addEventListener('click', closeRecordModal);
    document.getElementById('modal-cancel').addEventListener('click', closeRecordModal);
    document.getElementById('record-form').addEventListener('submit', handleRecordSubmit);
    
    // Modal de tarea
    document.getElementById('task-modal-close').addEventListener('click', closeTaskModal);
    document.getElementById('task-modal-cancel').addEventListener('click', closeTaskModal);
    document.getElementById('task-form').addEventListener('submit', handleTaskSubmit);
    
    // Configuración
    document.getElementById('animations-toggle').addEventListener('change', toggleAnimations);
    document.getElementById('backup-data-btn').addEventListener('click', backupData);
    document.getElementById('reset-data-btn').addEventListener('click', resetData);
    
    // Configurar event listeners para exportación XLSX y PDF
    document.getElementById('export-xlsx-btn').addEventListener('click', exportToXLSX);
    document.getElementById('export-pdf-btn').addEventListener('click', exportToPDF);
    
    // Guardar datos antes de que la página se cierre
    window.addEventListener('beforeunload', function() {
        saveData();
    });
}

// Configurar importación Excel
function setupImportExcel() {
    const importBtn = document.getElementById('import-excel-btn');
    const fileInput = document.getElementById('excel-file-input');
    
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Configurar modal de importación
    document.getElementById('import-modal-close').addEventListener('click', closeImportModal);
    document.getElementById('import-modal-cancel').addEventListener('click', closeImportModal);
    document.getElementById('import-modal-confirm').addEventListener('click', confirmImport);
}

// Alternar sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// Manejar clic en elementos de navegación
function handleNavItemClick(e) {
    const section = this.dataset.section;
    
    // Remover clase active de todos los elementos
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar clase active al elemento clickeado
    this.classList.add('active');
    
    // Mostrar la sección correspondiente
    switchToSection(section);
}

// Cambiar a una sección específica
function switchToSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección solicitada
    document.getElementById(`${sectionId}-section`).classList.add('active');
}

// Alternar tema claro/oscuro
function toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    if (appData.theme === 'light') {
        appData.theme = 'dark';
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        appData.theme = 'light';
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Guardar preferencia en localStorage
    localStorage.setItem('veterinaria-theme', appData.theme);
    saveDataWithDebounce();
}

// Manejar selección de tema desde opciones
function handleThemeOptionClick() {
    const selectedTheme = this.dataset.theme;
    
    // Remover clase active de todas las opciones
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Agregar clase active a la opción seleccionada
    this.classList.add('active');
    
    // Aplicar tema seleccionado
    appData.theme = selectedTheme;
    
    // Aplicar tema
    document.documentElement.setAttribute('data-theme', appData.theme);
    
    // Actualizar icono del botón de tema
    const themeToggleIcon = document.querySelector('#theme-toggle i');
    if (appData.theme === 'dark') {
        themeToggleIcon.classList.remove('fa-moon');
        themeToggleIcon.classList.add('fa-sun');
    } else {
        themeToggleIcon.classList.remove('fa-sun');
        themeToggleIcon.classList.add('fa-moon');
    }
    
    // Guardar preferencia en localStorage
    localStorage.setItem('veterinaria-theme', appData.theme);
    saveDataWithDebounce();
}

// Aplicar tema guardado en localStorage
function applySavedTheme() {
    const savedTheme = localStorage.getItem('veterinaria-theme');
    const themeToggleIcon = document.querySelector('#theme-toggle i');
    
    if (savedTheme) {
        appData.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Actualizar icono
        if (savedTheme === 'dark') {
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
        }
        
        // Actualizar opciones de tema
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === savedTheme) {
                option.classList.add('active');
            }
        });
    }
}

// Rellenar filtros de productos
function populateProductFilters() {
    const productFilter = document.getElementById('product-filter');
    
    // Obtener productos únicos de los registros
    const uniqueProducts = [...new Set(appData.records.map(record => record.producto))];
    
    // Limpiar opciones existentes (excepto la primera)
    while (productFilter.options.length > 1) {
        productFilter.remove(1);
    }
    
    // Agregar productos a los filtros
    uniqueProducts.sort().forEach(product => {
        const option = document.createElement('option');
        option.value = product;
        option.textContent = product;
        productFilter.appendChild(option);
    });
}

// Renderizar tabla con datos
function renderTable() {
    const tableBody = document.getElementById('table-body');
    const currentCount = document.getElementById('current-count');
    const totalCount = document.getElementById('total-count');
    const pageIndicator = document.getElementById('page-indicator');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    // Aplicar filtros
    let filteredRecords = [...appData.records];
    
    if (appData.filterProduct !== 'all') {
        filteredRecords = filteredRecords.filter(record => record.producto === appData.filterProduct);
    }
    
    if (appData.filterYear !== 'all') {
        filteredRecords = filteredRecords.filter(record => record.año.toString() === appData.filterYear);
    }
    
    if (appData.filterMonth !== 'all') {
        filteredRecords = filteredRecords.filter(record => record.mes.toString() === appData.filterMonth);
    }
    
    // Calcular paginación
    const totalRecords = filteredRecords.length;
    const totalPages = Math.ceil(totalRecords / appData.recordsPerPage);
    const startIndex = (appData.currentPage - 1) * appData.recordsPerPage;
    const endIndex = Math.min(startIndex + appData.recordsPerPage, totalRecords);
    const pageRecords = filteredRecords.slice(startIndex, endIndex);
    
    // Actualizar controles de paginación
    currentCount.textContent = pageRecords.length;
    totalCount.textContent = totalRecords;
    pageIndicator.textContent = totalPages > 0 ? `Página ${appData.currentPage} de ${totalPages}` : 'Sin registros';
    
    prevButton.disabled = appData.currentPage === 1;
    nextButton.disabled = appData.currentPage === totalPages || totalPages === 0;
    
    // Limpiar tabla
    tableBody.innerHTML = '';
    
    // Mostrar mensaje si no hay registros
    if (pageRecords.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="10" style="text-align: center; padding: 40px;">
                <i class="fas fa-inbox" style="font-size: 3rem; color: #ccc; margin-bottom: 15px; display: block;"></i>
                <h3 style="color: #666; margin-bottom: 10px;">No hay registros</h3>
                <p style="color: #999;">Agrega tu primer registro haciendo clic en "Añadir Registro"</p>
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    // Llenar tabla con registros de la página actual
    pageRecords.forEach(record => {
        const row = document.createElement('tr');
        
        // Formatear fecha para mostrar
        const formattedDate = new Date(record.fecha).toLocaleDateString('es-ES');
        
        // Mapear número de mes a nombre
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const monthName = monthNames[record.mes - 1] || '';
        
        // Aplicar clase si tiene pérdidas
        if (record.perdidas && record.perdidas.trim() !== '') {
            row.classList.add('with-losses');
        }
        
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${formattedDate}</td>
            <td>${record.producto}</td>
            <td>${record.lote}</td>
            <td>${record.cantidad.toLocaleString()}</td>
            <td>${monthName}</td>
            <td>${record.año}</td>
            <td class="${record.perdidas && record.perdidas.trim() !== '' ? 'losses-cell' : ''}">${record.perdidas || '-'}</td>
            <td>${record.observaciones ? (record.observaciones.length > 50 ? record.observaciones.substring(0, 50) + '...' : record.observaciones) : '-'}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn-small edit" data-id="${record.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn-small delete" data-id="${record.id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones de acción
    document.querySelectorAll('.action-btn-small.edit').forEach(button => {
        button.addEventListener('click', function() {
            const recordId = parseInt(this.dataset.id);
            editRecord(recordId);
        });
    });
    
    document.querySelectorAll('.action-btn-small.delete').forEach(button => {
        button.addEventListener('click', function() {
            const recordId = parseInt(this.dataset.id);
            deleteRecord(recordId);
        });
    });
}

// Manejar cambio de filtros
function handleFilterChange() {
    appData.filterProduct = document.getElementById('product-filter').value;
    appData.filterYear = document.getElementById('year-filter').value;
    appData.filterMonth = document.getElementById('month-filter').value;
    appData.currentPage = 1;
    
    renderTable();
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('product-filter').value = 'all';
    document.getElementById('year-filter').value = 'all';
    document.getElementById('month-filter').value = 'all';
    
    handleFilterChange();
}

// Ir a la página anterior
function goToPrevPage() {
    if (appData.currentPage > 1) {
        appData.currentPage--;
        renderTable();
    }
}

// Ir a la página siguiente
function goToNextPage() {
    const totalRecords = appData.records.length;
    const totalPages = Math.ceil(totalRecords / appData.recordsPerPage);
    
    if (appData.currentPage < totalPages) {
        appData.currentPage++;
        renderTable();
    }
}

// Mostrar modal para añadir/editar registro
function showRecordModal(recordId = null) {
    const modal = document.getElementById('record-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('record-form');
    
    if (recordId) {
        // Modo edición
        modalTitle.textContent = 'Editar Registro';
        document.getElementById('modal-submit').textContent = 'Actualizar Registro';
        
        // Buscar registro por ID
        const record = appData.records.find(r => r.id === recordId);
        
        if (record) {
            // Llenar formulario con datos del registro
            document.getElementById('form-product').value = record.producto;
            document.getElementById('form-lote').value = record.lote;
            document.getElementById('form-date').value = record.fecha;
            document.getElementById('form-quantity').value = record.cantidad;
            document.getElementById('form-month').value = record.mes;
            document.getElementById('form-year').value = record.año;
            document.getElementById('form-losses').value = record.perdidas || '';
            document.getElementById('form-observations').value = record.observaciones || '';
            
            // Guardar ID del registro en el formulario
            form.dataset.recordId = recordId;
        }
    } else {
        // Modo añadir
        modalTitle.textContent = 'Añadir Nuevo Registro';
        document.getElementById('modal-submit').textContent = 'Guardar Registro';
        
        // Establecer valores por defecto
        form.reset();
        const today = new Date();
        document.getElementById('form-date').valueAsDate = today;
        document.getElementById('form-month').value = (today.getMonth() + 1).toString();
        document.getElementById('form-year').value = today.getFullYear().toString();
        
        // Limpiar ID del registro en el formulario
        delete form.dataset.recordId;
    }
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Cerrar modal de registro
function closeRecordModal() {
    const modal = document.getElementById('record-modal');
    modal.style.display = 'none';
    
    // Limpiar formulario
    document.getElementById('record-form').reset();
}

// Manejar envío del formulario de registro
function handleRecordSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const recordId = form.dataset.recordId;
    
    // Obtener valores del formulario
    const newRecord = {
        producto: document.getElementById('form-product').value.trim(),
        lote: document.getElementById('form-lote').value.trim(),
        fecha: document.getElementById('form-date').value,
        cantidad: parseInt(document.getElementById('form-quantity').value),
        mes: parseInt(document.getElementById('form-month').value),
        año: parseInt(document.getElementById('form-year').value),
        perdidas: document.getElementById('form-losses').value.trim() || '',
        observaciones: document.getElementById('form-observations').value.trim() || ''
    };
    
    // Validar campos requeridos
    if (!newRecord.producto || !newRecord.lote || !newRecord.fecha || isNaN(newRecord.cantidad)) {
        showToast('Por favor, complete todos los campos requeridos', 'error');
        return;
    }
    
    if (recordId) {
        // Actualizar registro existente
        const index = appData.records.findIndex(r => r.id === parseInt(recordId));
        if (index !== -1) {
            newRecord.id = parseInt(recordId);
            appData.records[index] = newRecord;
            showToast('Registro actualizado exitosamente', 'success');
            
            // Guardar datos
            saveDataWithDebounce();
        }
    } else {
        // Añadir nuevo registro
        newRecord.id = appData.currentRecordId++;
        appData.records.push(newRecord);
        showToast('Registro añadido exitosamente', 'success');
        
        // Guardar datos
        saveDataWithDebounce();
    }
    
    // Cerrar modal
    closeRecordModal();
    
    // Actualizar interfaz
    renderTable();
    updateDashboardStats();
    populateProductFilters();
}

// Editar registro existente
function editRecord(recordId) {
    showRecordModal(recordId);
}

// Eliminar registro
function deleteRecord(recordId) {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
        const index = appData.records.findIndex(r => r.id === recordId);
        
        if (index !== -1) {
            appData.records.splice(index, 1);
            renderTable();
            updateDashboardStats();
            populateProductFilters();
            
            // Guardar datos
            saveDataWithDebounce();
            
            showToast('Registro eliminado exitosamente', 'success');
        }
    }
}

// Actualizar estadísticas del dashboard
function updateDashboardStats() {
    // Productos totales (únicos)
    const uniqueProducts = [...new Set(appData.records.map(record => record.producto))];
    document.getElementById('total-products').textContent = uniqueProducts.length;
    
    // Cantidad total
    const totalQuantity = appData.records.reduce((sum, record) => sum + record.cantidad, 0);
    document.getElementById('total-quantity').textContent = totalQuantity.toLocaleString();
    
    // Fabricaciones este mes (asumiendo mes actual)
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentMonthRecords = appData.records.filter(record => 
        record.mes === currentMonth && record.año === currentYear
    );
    document.getElementById('current-month').textContent = currentMonthRecords.length;
    
    // Producto más fabricado
    const productQuantities = {};
    appData.records.forEach(record => {
        if (!productQuantities[record.producto]) {
            productQuantities[record.producto] = 0;
        }
        productQuantities[record.producto] += record.cantidad;
    });
    
    let topProduct = 'N/A';
    let maxQuantity = 0;
    
    for (const [product, quantity] of Object.entries(productQuantities)) {
        if (quantity > maxQuantity) {
            maxQuantity = quantity;
            topProduct = product;
        }
    }
    
    document.getElementById('top-product').textContent = topProduct;
    
    // Actualizar configuración
    document.getElementById('settings-total-records').textContent = appData.records.length;
    document.getElementById('settings-unique-products').textContent = uniqueProducts.length;
    document.getElementById('settings-last-update').textContent = new Date().toLocaleDateString('es-ES');
}

// ============================================
// FUNCIONES DE IMPORTACIÓN DESDE EXCEL
// ============================================

// Variable para almacenar datos de importación temporal
let importData = {
    records: [],
    errors: [],
    duplicates: 0
};

// Manejar la selección de archivo
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validar tipo de archivo
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
        showToast('Por favor, selecciona un archivo Excel (.xlsx, .xls) o CSV', 'error');
        // Limpiar input
        event.target.value = '';
        return;
    }
    
    // Leer el archivo
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Procesar los datos
            processExcelData(workbook, file.name);
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            showToast('Error al leer el archivo. Verifica que sea un archivo Excel válido.', 'error');
        }
    };
    
    reader.onerror = function() {
        showToast('Error al leer el archivo', 'error');
    };
    
    reader.readAsArrayBuffer(file);
}

// Procesar datos del Excel
function processExcelData(workbook, fileName) {
    // Resetear datos de importación
    importData = {
        records: [],
        errors: [],
        duplicates: 0
    };
    
    // Obtener la primera hoja
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length < 2) {
        showToast('El archivo está vacío o no contiene datos', 'warning');
        return;
    }
    
    // Obtener encabezados (primera fila)
    const headers = data[0].map(h => h ? h.toString().trim().toLowerCase() : '');
    
    // Mapear nombres de columnas esperados
    const expectedHeaders = [
        'producto', 'lote', 'fecha fabricación', 'cantidad (l)', 
        'mes', 'año', 'pérdidas', 'observaciones'
    ];
    
    // Verificar que los encabezados coincidan (al menos parcialmente)
    let headerMatch = false;
    for (const expected of expectedHeaders) {
        if (headers.includes(expected)) {
            headerMatch = true;
            break;
        }
    }
    
    if (!headerMatch) {
        // Intentar con nombres alternativos
        const alternativeHeaders = [
            'producto', 'lote', 'fecha', 'cantidad', 
            'mes', 'año', 'perdidas', 'observaciones'
        ];
        
        headerMatch = false;
        for (const expected of alternativeHeaders) {
            if (headers.includes(expected)) {
                headerMatch = true;
                break;
            }
        }
        
        if (!headerMatch) {
            showToast('El archivo no tiene el formato esperado. Por favor, verifica los nombres de las columnas.', 'error');
            return;
        }
    }
    
    // Procesar filas de datos
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        
        try {
            // Crear objeto de registro
            const record = {
                producto: getCellValue(row, headers, 'producto') || '',
                lote: getCellValue(row, headers, 'lote') || '',
                fecha: parseDate(getCellValue(row, headers, 'fecha fabricación') || 
                                getCellValue(row, headers, 'fecha') || ''),
                cantidad: parseFloat(getCellValue(row, headers, 'cantidad (l)') || 
                                    getCellValue(row, headers, 'cantidad') || 0),
                mes: parseInt(getCellValue(row, headers, 'mes') || 
                            (new Date(parseDate(getCellValue(row, headers, 'fecha fabricación') || 
                                               getCellValue(row, headers, 'fecha') || '')).getMonth() + 1) || 
                            new Date().getMonth() + 1),
                año: parseInt(getCellValue(row, headers, 'año') || 
                             (new Date(parseDate(getCellValue(row, headers, 'fecha fabricación') || 
                                                getCellValue(row, headers, 'fecha') || '')).getFullYear()) || 
                             new Date().getFullYear()),
                perdidas: getCellValue(row, headers, 'pérdidas') || 
                         getCellValue(row, headers, 'perdidas') || '',
                observaciones: getCellValue(row, headers, 'observaciones') || ''
            };
            
            // Validar registro
            const validation = validateImportRecord(record, i);
            
            if (validation.isValid) {
                // Verificar duplicados (mismo producto, lote y fecha)
                const isDuplicate = appData.records.some(existing => 
                    existing.producto === record.producto && 
                    existing.lote === record.lote && 
                    existing.fecha === record.fecha
                );
                
                if (isDuplicate) {
                    importData.duplicates++;
                } else {
                    importData.records.push(record);
                }
            } else {
                importData.errors.push(`Fila ${i + 1}: ${validation.error}`);
            }
        } catch (error) {
            importData.errors.push(`Fila ${i + 1}: Error al procesar - ${error.message}`);
        }
    }
    
    // Mostrar resumen de importación
    showImportSummary(fileName);
}

// Obtener valor de celda basado en encabezado
function getCellValue(row, headers, headerName) {
    const index = headers.indexOf(headerName);
    if (index !== -1 && row[index] !== undefined) {
        return row[index];
    }
    
    // Intentar con variaciones
    const variations = [
        headerName,
        headerName.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u'),
        headerName.replace(' (l)', '').replace(' (L)', ''),
        headerName.replace('fabricación', 'fabricacion')
    ];
    
    for (const variation of variations) {
        const idx = headers.indexOf(variation);
        if (idx !== -1 && row[idx] !== undefined) {
            return row[idx];
        }
    }
    
    return null;
}

// Parsear fecha
function parseDate(dateStr) {
    if (!dateStr) return '';
    
    // Intentar diferentes formatos de fecha
    const formats = [
        // Formato ISO
        (str) => {
            const date = new Date(str);
            return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : null;
        },
        // Formato DD/MM/YYYY
        (str) => {
            const parts = str.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const year = parseInt(parts[2]);
                const date = new Date(year, month, day);
                return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : null;
            }
            return null;
        },
        // Formato MM/DD/YYYY
        (str) => {
            const parts = str.split('/');
            if (parts.length === 3) {
                const month = parseInt(parts[0]) - 1;
                const day = parseInt(parts[1]);
                const year = parseInt(parts[2]);
                const date = new Date(year, month, day);
                return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : null;
            }
            return null;
        },
        // Formato YYYY-MM-DD
        (str) => {
            const parts = str.split('-');
            if (parts.length === 3 && parts[0].length === 4) {
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const day = parseInt(parts[2]);
                const date = new Date(year, month, day);
                return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : null;
            }
            return null;
        }
    ];
    
    for (const format of formats) {
        const result = format(dateStr.toString());
        if (result) return result;
    }
    
    return '';
}

// Validar registro de importación
function validateImportRecord(record, rowNumber) {
    const errors = [];
    
    // Validar campos requeridos
    if (!record.producto || record.producto.trim() === '') {
        errors.push('Producto es requerido');
    }
    
    if (!record.lote || record.lote.trim() === '') {
        errors.push('Lote es requerido');
    }
    
    if (!record.fecha) {
        errors.push('Fecha de fabricación es requerida');
    }
    
    if (!record.cantidad || isNaN(record.cantidad) || record.cantidad <= 0) {
        errors.push('Cantidad debe ser un número positivo');
    }
    
    if (!record.mes || isNaN(record.mes) || record.mes < 1 || record.mes > 12) {
        errors.push('Mes debe ser un número entre 1 y 12');
    }
    
    if (!record.año || isNaN(record.año) || record.año < 2000 || record.año > 2100) {
        errors.push('Año debe ser un número válido');
    }
    
    return {
        isValid: errors.length === 0,
        error: errors.length > 0 ? errors.join(', ') : ''
    };
}

// Mostrar resumen de importación
function showImportSummary(fileName) {
    const modal = document.getElementById('import-confirm-modal');
    const summaryContainer = document.getElementById('import-summary');
    
    // Construir HTML del resumen
    let html = `
        <p><strong>Archivo:</strong> ${fileName}</p>
        <div class="import-summary">
            <div class="import-summary-item">
                <span>Registros válidos:</span>
                <strong>${importData.records.length}</strong>
            </div>
            <div class="import-summary-item">
                <span>Registros duplicados:</span>
                <strong>${importData.duplicates}</strong>
            </div>
            <div class="import-summary-item">
                <span>Errores encontrados:</span>
                <strong>${importData.errors.length}</strong>
            </div>
        </div>
    `;
    
    // Mostrar errores si existen
    if (importData.errors.length > 0) {
        html += `
            <div class="import-errors">
                <h4><i class="fas fa-exclamation-triangle"></i> Errores:</h4>
                ${importData.errors.slice(0, 5).map(error => 
                    `<div class="import-error-item">${error}</div>`
                ).join('')}
                ${importData.errors.length > 5 ? 
                    `<div class="import-error-item">... y ${importData.errors.length - 5} errores más</div>` : 
                    ''}
            </div>
        `;
    }
    
    // Mostrar advertencia si no hay registros válidos
    if (importData.records.length === 0) {
        html += `
            <div class="import-errors">
                <h4><i class="fas fa-exclamation-triangle"></i> Advertencia:</h4>
                <p>No se encontraron registros válidos para importar. Verifica el formato del archivo.</p>
            </div>
        `;
    } else {
        html += `
            <p><strong>¿Deseas importar estos registros?</strong></p>
            <p>Los registros se agregarán a los existentes en la aplicación.</p>
        `;
    }
    
    summaryContainer.innerHTML = html;
    
    // Habilitar o deshabilitar botón de confirmación
    const confirmBtn = document.getElementById('import-modal-confirm');
    confirmBtn.disabled = importData.records.length === 0;
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Cerrar modal de importación
function closeImportModal() {
    const modal = document.getElementById('import-confirm-modal');
    modal.style.display = 'none';
    
    // Limpiar input de archivo
    document.getElementById('excel-file-input').value = '';
}

// Confirmar importación
function confirmImport() {
    if (importData.records.length === 0) {
        showToast('No hay registros válidos para importar', 'warning');
        closeImportModal();
        return;
    }
    
    // Agregar IDs a los registros
    importData.records.forEach(record => {
        record.id = appData.currentRecordId++;
        appData.records.push(record);
    });
    
    // Guardar datos
    saveData();
    
    // Actualizar interfaz
    renderTable();
    updateDashboardStats();
    populateProductFilters();
    
    // Mostrar mensaje de éxito
    showToast(`Importación completada: ${importData.records.length} registros añadidos`, 'success');
    
    // Cerrar modal
    closeImportModal();
}

// ============================================
// FUNCIONES DE EXPORTACIÓN
// ============================================

// Exportar a Excel (CSV simplificado)
function exportToExcel() {
    // Verificar si hay datos para exportar
    if (appData.records.length === 0) {
        showToast('No hay datos para exportar', 'warning');
        return;
    }
    
    // Crear contenido CSV
    let csvContent = "ID,Fecha Fabricación,Producto,Lote,Cantidad (L),Mes,Año,Pérdidas,Observaciones\n";
    
    appData.records.forEach(record => {
        const row = [
            record.id,
            record.fecha,
            `"${record.producto}"`,
            record.lote,
            record.cantidad,
            record.mes,
            record.año,
            `"${record.perdidas || ''}"`,
            `"${(record.observaciones || '').replace(/"/g, '""')}"`
        ].join(',');
        
        csvContent += row + "\n";
    });
    
    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `fabricaciones_veterinaria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Datos exportados exitosamente (CSV)', 'success');
}

// Exportar a XLSX usando la biblioteca
function exportToXLSX() {
    // Verificar si hay datos para exportar
    if (appData.records.length === 0) {
        showToast('No hay datos para exportar', 'warning');
        return;
    }
    
    // Crear datos para la hoja de cálculo
    const data = [
        // Encabezados
        ['ID', 'Fecha Fabricación', 'Producto', 'Lote', 'Cantidad (L)', 'Mes', 'Año', 'Pérdidas', 'Observaciones']
    ];
    
    // Agregar registros
    appData.records.forEach(record => {
        data.push([
            record.id,
            record.fecha,
            record.producto,
            record.lote,
            record.cantidad,
            record.mes,
            record.año,
            record.perdidas || '',
            record.observaciones || ''
        ]);
    });
    
    // Crear hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Ajustar anchos de columnas
    const colWidths = [
        { wch: 5 },   // ID
        { wch: 12 },  // Fecha
        { wch: 20 },  // Producto
        { wch: 10 },  // Lote
        { wch: 12 },  // Cantidad
        { wch: 8 },   // Mes
        { wch: 8 },   // Año
        { wch: 15 },  // Pérdidas
        { wch: 30 }   // Observaciones
    ];
    ws['!cols'] = colWidths;
    
    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fabricaciones");
    
    // Descargar archivo
    XLSX.writeFile(wb, `fabricaciones_veterinaria_${new Date().toISOString().slice(0, 10)}.xlsx`);
    
    showToast('Datos exportados exitosamente (XLSX)', 'success');
}

// Exportar a PDF
function exportToPDF() {
    // Verificar si hay datos para exportar
    if (appData.records.length === 0) {
        showToast('No hay datos para exportar', 'warning');
        return;
    }
    
    try {
        // Inicializar jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');
        
        // Título
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text('Reporte de Fabricaciones Veterinarias', 148, 15, { align: 'center' });
        
        // Fecha de generación
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 148, 22, { align: 'center' });
        
        // Estadísticas
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        
        // Calcular estadísticas
        const uniqueProducts = [...new Set(appData.records.map(record => record.producto))];
        const totalQuantity = appData.records.reduce((sum, record) => sum + record.cantidad, 0);
        
        doc.text(`Total de registros: ${appData.records.length}`, 14, 35);
        doc.text(`Productos únicos: ${uniqueProducts.length}`, 14, 42);
        doc.text(`Cantidad total: ${totalQuantity.toLocaleString()} L`, 14, 49);
        
        // Crear tabla
        const tableData = appData.records.map(record => [
            record.id,
            record.fecha,
            record.producto,
            record.lote,
            record.cantidad.toLocaleString(),
            record.mes,
            record.año,
            record.perdidas || '-',
            record.observaciones ? (record.observaciones.length > 30 ? record.observaciones.substring(0, 30) + '...' : record.observaciones) : '-'
        ]);
        
        // Configurar autoTable
        doc.autoTable({
            head: [['ID', 'Fecha', 'Producto', 'Lote', 'Cantidad (L)', 'Mes', 'Año', 'Pérdidas', 'Observaciones']],
            body: tableData,
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [76, 175, 80] },
            styles: { fontSize: 8, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 25 },
                2: { cellWidth: 40 },
                3: { cellWidth: 25 },
                4: { cellWidth: 25 },
                5: { cellWidth: 20 },
                6: { cellWidth: 20 },
                7: { cellWidth: 25 },
                8: { cellWidth: 50 }
            },
            margin: { left: 14, right: 14 },
            pageBreak: 'auto'
        });
        
        // Guardar PDF
        doc.save(`fabricaciones_veterinaria_${new Date().toISOString().slice(0, 10)}.pdf`);
        
        showToast('Datos exportados exitosamente (PDF)', 'success');
    } catch (error) {
        console.error('Error al generar PDF:', error);
        showToast('Error al generar el archivo PDF', 'error');
    }
}

// ============================================
// FUNCIONES RESTANTES (KANBAN, CONFIGURACIÓN, ETC.)
// ============================================

// Cargar tareas Kanban
function loadKanbanTasks() {
    const pendingTasks = document.getElementById('pending-tasks');
    const inprogressTasks = document.getElementById('inprogress-tasks');
    const completedTasks = document.getElementById('completed-tasks');
    
    // Contadores
    let pendingCount = 0;
    let inprogressCount = 0;
    let completedCount = 0;
    
    // Limpiar listas
    pendingTasks.innerHTML = '';
    inprogressTasks.innerHTML = '';
    completedTasks.innerHTML = '';
    
    // Mostrar mensaje si no hay tareas
    if (appData.kanbanTasks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-kanban-message';
        emptyMessage.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #666;">
                <i class="fas fa-tasks" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                <p>No hay tareas</p>
                <p style="font-size: 0.9rem; color: #999;">Añade tu primera tarea</p>
            </div>
        `;
        pendingTasks.appendChild(emptyMessage.cloneNode(true));
        inprogressTasks.appendChild(emptyMessage.cloneNode(true));
        completedTasks.appendChild(emptyMessage.cloneNode(true));
        
        // Actualizar contadores
        document.querySelectorAll('.task-count')[0].textContent = '0';
        document.querySelectorAll('.task-count')[1].textContent = '0';
        document.querySelectorAll('.task-count')[2].textContent = '0';
        return;
    }
    
    // Agregar tareas a sus columnas correspondientes
    appData.kanbanTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        
        if (task.status === 'pending') {
            pendingTasks.appendChild(taskElement);
            pendingCount++;
        } else if (task.status === 'inprogress') {
            inprogressTasks.appendChild(taskElement);
            inprogressCount++;
        } else if (task.status === 'completed') {
            completedTasks.appendChild(taskElement);
            completedCount++;
        }
    });
    
    // Actualizar contadores
    document.querySelectorAll('.task-count')[0].textContent = pendingCount;
    document.querySelectorAll('.task-count')[1].textContent = inprogressCount;
    document.querySelectorAll('.task-count')[2].textContent = completedCount;
}

// Crear elemento de tarea para Kanban
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-card';
    taskElement.dataset.taskId = task.id;
    
    // Formatear fecha límite
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES') : 'Sin fecha';
    
    taskElement.innerHTML = `
        <div class="task-header">
            <div>
                <div class="task-title">${task.title}</div>
                <div class="task-priority priority-${task.priority}">${getPriorityText(task.priority)}</div>
            </div>
            <button class="action-btn-small delete-task" data-id="${task.id}" title="Eliminar tarea">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="task-description">${task.description || ''}</div>
        <div class="task-footer">
            <div class="assignee">
                <i class="fas fa-user"></i> ${task.assignee || 'Usuario'}
            </div>
            <div class="due-date">
                <i class="fas fa-calendar-alt"></i> ${dueDate}
            </div>
        </div>
    `;
    
    // Agregar event listener para eliminar tarea
    const deleteBtn = taskElement.querySelector('.delete-task');
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteTask(task.id);
    });
    
    return taskElement;
}

// Obtener texto de prioridad
function getPriorityText(priority) {
    switch(priority) {
        case 'low': return 'Baja';
        case 'medium': return 'Media';
        case 'high': return 'Alta';
        default: return 'Media';
    }
}

// Mostrar modal para añadir/editar tarea
function showTaskModal(status = 'pending') {
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('task-modal-title');
    const form = document.getElementById('task-form');
    
    modalTitle.textContent = 'Añadir Nueva Tarea';
    document.getElementById('task-modal-submit').textContent = 'Guardar Tarea';
    
    // Establecer estado por defecto
    document.getElementById('task-status').value = status;
    
    // Establecer fecha por defecto (7 días desde hoy)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    document.getElementById('task-due-date').valueAsDate = dueDate;
    
    // Limpiar formulario
    form.reset();
    delete form.dataset.taskId;
    
    // Mostrar modal
    modal.style.display = 'flex';
}

// Cerrar modal de tarea
function closeTaskModal() {
    const modal = document.getElementById('task-modal');
    modal.style.display = 'none';
}

// Manejar envío del formulario de tarea
function handleTaskSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Obtener valores del formulario
    const newTask = {
        title: document.getElementById('task-title').value.trim(),
        description: document.getElementById('task-description').value.trim() || '',
        status: document.getElementById('task-status').value,
        priority: document.getElementById('task-priority').value,
        assignee: document.getElementById('task-assignee').value.trim() || 'Usuario',
        dueDate: document.getElementById('task-due-date').value || '',
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Validar título
    if (!newTask.title) {
        showToast('El título de la tarea es requerido', 'error');
        return;
    }
    
    // Añadir nueva tarea
    newTask.id = appData.currentTaskId++;
    appData.kanbanTasks.push(newTask);
    
    // Guardar datos
    saveDataWithDebounce();
    
    // Cerrar modal
    closeTaskModal();
    
    // Actualizar panel Kanban
    loadKanbanTasks();
    
    showToast('Tarea añadida exitosamente', 'success');
}

// Eliminar tarea
function deleteTask(taskId) {
    if (confirm('¿Está seguro de que desea eliminar esta tarea?')) {
        const index = appData.kanbanTasks.findIndex(t => t.id === taskId);
        
        if (index !== -1) {
            appData.kanbanTasks.splice(index, 1);
            
            // Guardar datos
            saveDataWithDebounce();
            
            // Actualizar panel
            loadKanbanTasks();
            
            showToast('Tarea eliminada exitosamente', 'success');
        }
    }
}

// Alternar animaciones
function toggleAnimations() {
    const toggle = document.getElementById('animations-toggle');
    
    if (toggle.checked) {
        document.body.classList.remove('no-animations');
        showToast('Animaciones activadas', 'info');
    } else {
        document.body.classList.add('no-animations');
        showToast('Animaciones desactivadas', 'info');
    }
}

// Respaldar datos
function backupData() {
    const backup = {
        records: appData.records,
        kanbanTasks: appData.kanbanTasks,
        currentRecordId: appData.currentRecordId,
        currentTaskId: appData.currentTaskId,
        backupDate: new Date().toISOString(),
        version: '1.0'
    };
    
    // Crear blob y descargar
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_veterinaria_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Datos respaldados exitosamente', 'success');
}

// Restablecer datos
function resetData() {
    if (confirm('¿Está seguro de que desea restablecer todos los datos? Esta acción eliminará todos los registros y tareas y no se puede deshacer.')) {
        if (confirm('¿REALMENTE está seguro? Esta acción es permanente.')) {
            // Limpiar todos los datos en localStorage
            localStorage.removeItem(STORAGE_KEYS.RECORDS);
            localStorage.removeItem(STORAGE_KEYS.KANBAN_TASKS);
            localStorage.removeItem(STORAGE_KEYS.CURRENT_RECORD_ID);
            localStorage.removeItem(STORAGE_KEYS.CURRENT_TASK_ID);
            localStorage.removeItem(STORAGE_KEYS.SETTINGS);
            
            // Limpiar todos los datos en memoria
            appData.records = [];
            appData.kanbanTasks = [];
            appData.currentRecordId = 1;
            appData.currentTaskId = 1;
            appData.currentPage = 1;
            
            // Actualizar interfaz
            renderTable();
            updateDashboardStats();
            populateProductFilters();
            loadKanbanTasks();
            
            showToast('Todos los datos han sido eliminados permanentemente', 'success');
        }
    }
}

// Mostrar toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    
    // Crear toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icono según tipo
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // Agregar event listener para cerrar
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        container.removeChild(toast);
    });
    
    // Agregar toast al contenedor
    container.appendChild(toast);
    
    // Eliminar automáticamente después de 5 segundos
    setTimeout(() => {
        if (toast.parentNode === container) {
            container.removeChild(toast);
        }
    }, 5000);
}

// Cuando la ventana se carga completamente
window.addEventListener('load', function() {
    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('veterinaria-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
});