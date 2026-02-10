// ============================================
// SISTEMA DE AUTENTICACIÓN CLIENT-SIDE
// ============================================
// NOTA: Sistema de autenticación DESACTIVADO
// Para reactivarlo, descomenta todo este bloque y la verificación al final

/*
// CONFIGURACIÓN DE ACCESO
const USUARIOS_AUTORIZADOS = {
  'admin': 'Veterinaria2024!',
  'produccion': 'Produccion2024!',
  'calidad': 'Calidad2024!'
};

// Verificar si ya está autenticado
function verificarAutenticacion() {
  const credencialesGuardadas = localStorage.getItem('vet_credenciales');
  const usuarioAutenticado = sessionStorage.getItem('vet_autenticado');
  
  if (usuarioAutenticado && credencialesGuardadas) {
    const [usuario, passHash] = credencialesGuardadas.split(':');
    // Verificar que las credenciales sean válidas
    if (USUARIOS_AUTORIZADOS[usuario] && 
        hashPassword(USUARIOS_AUTORIZADOS[usuario]) === passHash) {
      return true;
    }
  }
  
  return false;
}

// Función simple de hash (no usar en producción real)
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

// Mostrar pantalla de login
function mostrarPantallaLogin() {
  // Detener cualquier ejecución previa
  document.body.innerHTML = '';
  
  // Establecer estilos base para el body
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.boxSizing = 'border-box';
  document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  document.body.style.minHeight = '100vh';
  document.body.style.display = 'flex';
  document.body.style.justifyContent = 'center';
  document.body.style.alignItems = 'center';
  document.body.style.background = 'linear-gradient(135deg, var(--primary-color, #4CAF50) 0%, var(--secondary-color, #2196F3) 100%)';
  document.body.style.padding = '20px';
  
  const loginHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acceso - Fabricaciones Veterinaria</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            body {
                background: linear-gradient(135deg, #4CAF50 0%, #2196F3 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .login-container {
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                padding: 50px 40px;
                width: 100%;
                max-width: 800px;
                text-align: center;
                animation: fadeIn 0.5s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
           .logo {
    margin-bottom: 50px;
}

            
            .logo i {
    font-size: 4rem;
    color: #4CAF50;
    margin-bottom: 25px;
    display: block;
}

.logo h1 {
    color: #333;
    font-size: 2.2rem;
    margin-bottom: 15px;
    font-weight: 600;
    line-height: 1.3;
}
            
            .logo p {
    color: #666;
    font-size: 1.15rem;
    line-height: 1.5;
    margin-bottom: 10px;
}

.login-form {
    margin-top: 20px;
}

.form-group {
    margin-bottom: 30px;
    text-align: left;
}

.form-group label {
    display: block;
    margin-bottom: 12px;
    color: #555;
    font-weight: 500;
    font-size: 1.05rem;
    letter-spacing: 0.3px;
}

.form-group input {
    width: 100%;
    padding: 18px 20px;
    border: 2px solid #E0E0E0;
    border-radius: 10px;
    font-size: 1.1rem;
    transition: all 0.3s;
    background-color: #f9f9f9;
    color: #333;
    box-sizing: border-box;
}
            
            .form-group input:focus {
                outline: none;
                border-color: #4CAF50;
                background-color: white;
                box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
            }
            
            .form-group input::placeholder {
                color: #999;
            }
            
            
.btn-login {
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    color: white;
    border: none;
    padding: 20px;
    width: 100%;
    border-radius: 10px;
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
}
            
            .btn-login:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
            }
            
            .btn-login:active {
                transform: translateY(-1px);
            }
            
            .error-message {
                background-color: #FFEBEE;
                border-left: 4px solid #F44336;
                padding: 15px 20px;
                border-radius: 8px;
                margin-bottom: 25px;
                text-align: left;
                display: none;
                animation: shake 0.5s;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-8px); }
                75% { transform: translateX(8px); }
            }
            
            .error-message i {
                color: #F44336;
                margin-right: 10px;
                font-size: 1.1rem;
            }
            
            .error-message span {
                color: #C62828;
                font-size: 1rem;
                font-weight: 500;
            }
            
            .info-box {
    margin-top: 40px;
    padding: 25px;
    background-color: #F5F5F5;
    border-radius: 10px;
    text-align: left;
    border: 1px solid #E0E0E0;
}

.info-box h3 {
    color: #555;
    font-size: 1.1rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
}

.info-box p {
    color: #666;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 15px;
}
            
            .info-box ul {
                padding-left: 20px;
                color: #666;
                font-size: 0.9rem;
                margin-top: 10px;
            }
            
            .info-box li {
                margin-bottom: 5px;
                line-height: 1.4;
            }
            
            .info-box strong {
                color: #333;
            }
            
            @media (max-width: 480px) {
                .login-container {
                    padding: 35px 25px;
                    max-width: 90%;
                }
                
                .logo i {
                    font-size: 3.2rem;
                }
                
                .logo h1 {
                    font-size: 1.7rem;
                }
                
                .logo p {
                    font-size: 1rem;
                }
                
                .form-group input {
                    padding: 14px 16px;
                    font-size: 1rem;
                }
                
                .btn-login {
                    padding: 16px;
                    font-size: 1.1rem;
                }
            }
            
            @media (max-width: 360px) {
                .login-container {
                    padding: 30px 20px;
                }
                
                .logo i {
                    font-size: 2.8rem;
                }
                
                .logo h1 {
                    font-size: 1.5rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="logo">
                <i class="fas fa-paw"></i>
                <h1>Fabricaciones Veterinaria</h1>
                <p>Sistema de Gestión de Producción</p>
            </div>
            
            <div class="error-message" id="errorMsg">
                <i class="fas fa-exclamation-triangle"></i>
                <span id="errorText">Credenciales incorrectas</span>
            </div>
            
            <div class="login-form">
                <form id="loginForm">
                    <div class="form-group">
                        <label for="username">
                            <i class="fas fa-user"></i> Usuario
                        </label>
                        <input type="text" 
                               id="username" 
                               name="username" 
                               placeholder="Introduce tu nombre de usuario" 
                               required 
                               autocomplete="username">
                    </div>
                    
                    <div class="form-group">
                        <label for="password">
                            <i class="fas fa-lock"></i> Contraseña
                        </label>
                        <input type="password" 
                               id="password" 
                               name="password" 
                               placeholder="Introduce tu contraseña" 
                               required 
                               autocomplete="current-password">
                    </div>
                    
                    <button type="submit" class="btn-login">
                        <i class="fas fa-sign-in-alt"></i> Acceder al Sistema
                    </button>
                </form>
            </div>
            
            <div class="info-box">
                <h3><i class="fas fa-info-circle"></i> Información de acceso</h3>
                <p>Introduce tus credenciales proporcionadas por el administrador del sistema.</p>
                <p style="margin-top: 10px; font-size: 0.9rem; color: #777;">
                    <strong>Nota:</strong> Para acceder en modo demostración puedes usar:
                </p>
                <ul>
                    <li><strong>Usuario:</strong> admin | <strong>Contraseña:</strong> Veterinaria2024!</li>
                </ul>
            </div>
        </div>
        
        <script>
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value;
                const errorMsg = document.getElementById('errorMsg');
                const errorText = document.getElementById('errorText');
                
                // Usuarios autorizados
                const usuarios = {
                    'admin': 'Veterinaria2024!',
                    'produccion': 'Produccion2024!',
                    'calidad': 'Calidad2024!'
                };
                
                // Verificar credenciales
                if (usuarios[username] && usuarios[username] === password) {
                    // Guardar credenciales (hasheadas para seguridad)
                    const passHash = (() => {
                        let hash = 0;
                        for (let i = 0; i < password.length; i++) {
                            const char = password.charCodeAt(i);
                            hash = ((hash << 5) - hash) + char;
                            hash = hash & hash;
                        }
                        return hash.toString();
                    })();
                    
                    localStorage.setItem('vet_credenciales', \`\${username}:\${passHash}\`);
                    sessionStorage.setItem('vet_autenticado', 'true');
                    
                    // Recargar para cargar la app principal
                    window.location.reload();
                } else {
                    errorText.textContent = 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.';
                    errorMsg.style.display = 'block';
                    
                    // Limpiar y enfocar campo de contraseña
                    document.getElementById('password').value = '';
                    document.getElementById('password').focus();
                    
                    // Ocultar error después de 5 segundos
                    setTimeout(() => {
                        errorMsg.style.display = 'none';
                    }, 5000);
                }
            });
            
            // Autofocus en el campo de usuario al cargar
            setTimeout(() => {
                document.getElementById('username').focus();
            }, 100);
            
            // Manejar Enter key para enviar formulario
            document.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const form = document.getElementById('loginForm');
                    if (form) {
                        form.dispatchEvent(new Event('submit'));
                    }
                }
            });
        </script>
    </body>
    </html>
  `;
  
  document.open();
  document.write(loginHTML);
  document.close();
}
*/

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

// AUTENTICACIÓN DESACTIVADA - La aplicación se carga directamente
// Para reactivar la autenticación, descomenta el bloque anterior y esta sección:
/*
if (!verificarAutenticacion()) {
  // Mostrar pantalla de login
  mostrarPantallaLogin();
} else {
*/
// ============================================
// TU CÓDIGO ORIGINAL COMIENZA AQUÍ
// ============================================

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
document.addEventListener('DOMContentLoaded', function () {
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
    document.getElementById('product-filter').addEventListener('change', handleFilterChange);
    document.getElementById('year-filter').addEventListener('change', handleFilterChange);
    document.getElementById('month-filter').addEventListener('change', handleFilterChange);
    document.getElementById('clear-filters-btn').addEventListener('click', clearFilters);
    document.getElementById('prev-page').addEventListener('click', goToPrevPage);
    document.getElementById('next-page').addEventListener('click', goToNextPage);

    // Kanban
    document.getElementById('add-task-btn').addEventListener('click', () => showTaskModal());
    document.querySelectorAll('.add-task-to-column').forEach(btn => {
        btn.addEventListener('click', function () {
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

    // Configurar importación Excel
    setupImportExcel();

    // Guardar datos antes de que la página se cierre
    window.addEventListener('beforeunload', function () {
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

// Alternar sidebar (menú hamburguesa)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// Manejar clic en items de navegación
function handleNavItemClick() {
    const section = this.dataset.section;

    // Remover clase active de todos los items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Agregar clase active al item seleccionado
    this.classList.add('active');

    // Cambiar a la sección correspondiente
    switchToSection(section);

    // En móvil, cerrar el sidebar después de seleccionar
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
}

// Cambiar entre secciones
function switchToSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Actualizar datos según la sección
    switch (sectionName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'table':
            renderTable();
            break;
        case 'kanban':
            renderKanban();
            break;
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
        button.addEventListener('click', function () {
            const recordId = parseInt(this.dataset.id);
            editRecord(recordId);
        });
    });

    document.querySelectorAll('.action-btn-small.delete').forEach(button => {
        button.addEventListener('click', function () {
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

    reader.onload = function (e) {
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

    reader.onerror = function () {
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

    // DEBUG: Mostrar encabezados detectados
    console.log('📋 Encabezados detectados en el Excel:', headers);
    console.log('📋 Total de columnas:', headers.length);

    // Encabezados esperados (nombres comunes)
    const expectedHeaders = [
        'fecha fabricación', 'producto', 'lote', 'cantidad (l)',
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
        // Intentar con nombres alternativos y específicos del Excel del usuario
        // NOTA: Los encabezados ya están en minúsculas (línea 1244)
        const alternativeHeaders = [
            'producto', 'lote',
            'fecha', 'fecha fab',
            'cantidad',
            'mes', 'meses',
            'año',
            'perdidas',
            'observaciones'
        ];

        headerMatch = false;
        for (const expected of alternativeHeaders) {
            if (headers.includes(expected)) {
                headerMatch = true;
                break;
            }
        }

        if (!headerMatch) {
            showToast('El archivo no tiene el formato esperado. Por favor, verifica que contenga las columnas: Producto, lote, FECHA FAB (o fecha), cantidad, Meses, Año', 'error');
            return;
        }
    }

    // Procesar filas de datos
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        try {
            // Crear objeto de registro con mapeo específico para el Excel del usuario
            // NOTA: Los encabezados están normalizados a minúsculas (línea 1244)
            const record = {
                // Producto: buscar en columnas 'producto'
                producto: getCellValue(row, headers, 'producto') || '',

                // Lote: buscar en columnas 'lote'
                lote: getCellValue(row, headers, 'lote') || '',

                // Fecha: buscar en 'fecha fab', 'fecha fabricación', 'fecha', etc.
                fecha: parseDate(
                    getCellValue(row, headers, 'fecha fab') ||
                    getCellValue(row, headers, 'fecha fabricación') ||
                    getCellValue(row, headers, 'fecha fabricacion') ||
                    getCellValue(row, headers, 'fecha') || ''
                ),

                // Cantidad: buscar en 'cantidad', 'cantidad (l)', etc.
                cantidad: parseFloat(
                    getCellValue(row, headers, 'cantidad') ||
                    getCellValue(row, headers, 'cantidad (l)') || 0
                ),

                // Mes: buscar en 'meses', 'mes' o extraer de la fecha
                mes: parseInt(
                    getCellValue(row, headers, 'meses') ||
                    getCellValue(row, headers, 'mes') ||
                    (new Date(parseDate(
                        getCellValue(row, headers, 'fecha fab') ||
                        getCellValue(row, headers, 'fecha fabricación') ||
                        getCellValue(row, headers, 'fecha') || ''
                    )).getMonth() + 1) ||
                    new Date().getMonth() + 1
                ),

                // Año: buscar en 'año' o extraer de la fecha
                año: parseInt(
                    getCellValue(row, headers, 'año') ||
                    (new Date(parseDate(
                        getCellValue(row, headers, 'fecha fab') ||
                        getCellValue(row, headers, 'fecha fabricación') ||
                        getCellValue(row, headers, 'fecha') || ''
                    )).getFullYear()) ||
                    new Date().getFullYear()
                ),

                // Pérdidas: buscar en 'perdidas', 'pérdidas', 'litros perdidos', etc.
                perdidas: getCellValue(row, headers, 'perdidas') ||
                    getCellValue(row, headers, 'pérdidas') ||
                    getCellValue(row, headers, 'litros perdidos') || '',

                // Observaciones: buscar en 'observaciones'
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

// Exportar a XLSX usando la biblioteca con formato mejorado
function exportToXLSX() {
    // Verificar si hay datos para exportar
    if (appData.records.length === 0) {
        showToast('No hay datos para exportar', 'warning');
        return;
    }

    // Función auxiliar para convertir fecha string a número de serie de Excel
    function dateToExcelSerial(dateStr) {
        if (!dateStr) return '';

        // Parsear la fecha (formato esperado: YYYY-MM-DD o DD-MM-YYYY)
        let date;
        if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts[0].length === 4) {
                // Formato YYYY-MM-DD
                date = new Date(parts[0], parts[1] - 1, parts[2]);
            } else {
                // Formato DD-MM-YYYY o DD-MM-YY
                const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
                date = new Date(year, parts[1] - 1, parts[0]);
            }
        } else {
            date = new Date(dateStr);
        }

        // Convertir a número de serie de Excel (días desde 1900-01-01)
        const epoch = new Date(1899, 11, 30);
        const days = (date - epoch) / (24 * 60 * 60 * 1000);
        return days;
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
            dateToExcelSerial(record.fecha), // Convertir a fecha de Excel
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

    // Aplicar formato de fecha a la columna B (Fecha Fabricación)
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let row = 1; row <= range.e.r; row++) { // Empezar desde fila 1 (después de encabezados)
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 1 }); // Columna B (índice 1)
        if (ws[cellAddress] && typeof ws[cellAddress].v === 'number') {
            ws[cellAddress].t = 'n'; // Tipo numérico
            ws[cellAddress].z = 'dd/mm/yyyy'; // Formato de fecha
        }
    }

    // Aplicar formato numérico a la columna E (Cantidad)
    for (let row = 1; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 4 }); // Columna E (índice 4)
        if (ws[cellAddress] && typeof ws[cellAddress].v === 'number') {
            ws[cellAddress].z = '#,##0'; // Formato numérico con separador de miles
        }
    }

    // Aplicar estilos a los encabezados (fila 0)
    for (let col = 0; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (ws[cellAddress]) {
            ws[cellAddress].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "4CAF50" } },
                alignment: { horizontal: "center", vertical: "center" }
            };
        }
    }

    // Ajustar anchos de columnas
    const colWidths = [
        { wch: 6 },   // ID
        { wch: 15 },  // Fecha (más ancho para formato dd/mm/yyyy)
        { wch: 25 },  // Producto
        { wch: 12 },  // Lote
        { wch: 14 },  // Cantidad
        { wch: 8 },   // Mes
        { wch: 8 },   // Año
        { wch: 18 },  // Pérdidas
        { wch: 35 }   // Observaciones
    ];
    ws['!cols'] = colWidths;

    // Agregar filtros automáticos a los encabezados
    ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };

    // Congelar la primera fila (encabezados)
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fabricaciones");

    // Descargar archivo
    const fileName = `fabricaciones_veterinaria_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);

    showToast('Datos exportados exitosamente con formato mejorado (XLSX)', 'success');
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

        // Función auxiliar para formatear fechas
        function formatDateForPDF(dateStr) {
            if (!dateStr) return '-';

            // Parsear la fecha (formato esperado: YYYY-MM-DD o DD-MM-YYYY)
            let date;
            if (dateStr.includes('-')) {
                const parts = dateStr.split('-');
                if (parts[0].length === 4) {
                    // Formato YYYY-MM-DD
                    date = new Date(parts[0], parts[1] - 1, parts[2]);
                } else {
                    // Formato DD-MM-YYYY o DD-MM-YY
                    const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
                    date = new Date(year, parts[1] - 1, parts[0]);
                }
            } else {
                date = new Date(dateStr);
            }

            // Formatear como dd/mm/yyyy
            if (!isNaN(date.getTime())) {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }

            return dateStr; // Si no se puede parsear, devolver el original
        }

        // Crear tabla
        const tableData = appData.records.map(record => [
            record.id,
            formatDateForPDF(record.fecha), // Formatear fecha
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
    deleteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        deleteTask(task.id);
    });

    return taskElement;
}

// Obtener texto de prioridad
function getPriorityText(priority) {
    switch (priority) {
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
    closeBtn.addEventListener('click', function () {
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

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

// Función principal de inicialización
function initializeApp() {
    console.log('🚀 Inicializando aplicación...');

    // Cargar datos guardados
    loadSavedData();

    // Aplicar tema guardado
    applySavedTheme();

    // Configurar event listeners
    setupEventListeners();

    // Configurar importación de Excel
    setupImportExcel();

    // Configurar exportaciones
    setupExportButtons();

    // Actualizar interfaz
    // updateDashboard(); // Función no definida
    // renderTable(); // Función no definida
    // populateProductFilters(); // Función no definida
    // populateYearFilters(); // Función no definida
    // populateMonthFilters(); // Función no definida

    console.log('✅ Aplicación inicializada correctamente');
}

// Configurar botones de exportación
function setupExportButtons() {
    const exportXlsxBtn = document.getElementById('export-xlsx-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    if (exportXlsxBtn) {
        exportXlsxBtn.addEventListener('click', exportToXLSX);
    }

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportToPDF);
    }
}

// Cuando la ventana se carga completamente
window.addEventListener('load', function () {
    // Inicializar la aplicación
    initializeApp();
});

// ============================================
// FIN DE TU CÓDIGO ORIGINAL
// ============================================

// Cierre del bloque de autenticación (comentado)
// }