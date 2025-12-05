// middleware.js - Middleware de autenticación para Vercel
// VERSIÓN CORREGIDA: Excluye archivos estáticos

// ============================================
// CONFIGURACIÓN DE ACCESO
// ============================================

// USUARIOS AUTORIZADOS (cambia estos valores)
// Formato: 'usuario:contraseña'
const USUARIOS_AUTORIZADOS = [
  'admin:Veterinaria2025!',       // Usuario administrador
  'envasado:Envasado2025!',   // Usuario de producción
  'calidad:Calidad2025!'          // Usuario de calidad
];

// ============================================
// FUNCIÓN PRINCIPAL DEL MIDDLEWARE
// ============================================

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  console.log(`[Middleware] Ruta solicitada: ${pathname}`);
  
  // 1. PERMITIR ARCHIVOS ESTÁTICOS SIN AUTENTICACIÓN
  // Estos son archivos que deben servirse directamente
  const staticFilePatterns = [
    /\.(css|js|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i,
    /^\/styles\.css$/,
    /^\/app\.js$/,
    /^\/favicon\.ico$/,
    /^\/robots\.txt$/,
    /^\/manifest\.json$/
  ];
  
  // Verificar si es un archivo estático
  const isStaticFile = staticFilePatterns.some(pattern => 
    pattern.test(pathname)
  );
  
  if (isStaticFile) {
    console.log(`[Middleware] Sirviendo archivo estático: ${pathname}`);
    // Devolver null permite que Vercel sirva el archivo estático
    return null;
  }
  
  // 2. Verificar si ya está autenticado por cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => c.trim().split('='))
  );
  
  if (cookies.vet_auth === 'true') {
    console.log('[Middleware] Usuario ya autenticado');
    return null;
  }
  
  // 3. Verificar autenticación básica HTTP
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    console.log('[Middleware] No autenticado, solicitando credenciales');
    return mostrarLogin();
  }
  
  // 4. Extraer y verificar credenciales
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  const credencialValida = `${username}:${password}`;
  
  if (USUARIOS_AUTORIZADOS.includes(credencialValida)) {
    console.log(`[Middleware] Usuario autenticado: ${username}`);
    
    // Si es la raíz o una ruta de la app, redirigir a index.html
    if (pathname === '/' || !pathname.includes('.')) {
      const response = new Response(null, {
        status: 302,
        headers: {
          'Location': pathname === '/' ? '/' : pathname,
          'Set-Cookie': `vet_auth=true; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`
        }
      });
      
      return response;
    }
    
    return null;
  }
  
  console.log(`[Middleware] Credenciales incorrectas para: ${username}`);
  return mostrarLogin(true);
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function mostrarLogin(error = false) {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acceso Restringido - Fabricaciones Veterinaria</title>
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
                padding: 40px;
                width: 100%;
                max-width: 420px;
                text-align: center;
                animation: fadeIn 0.5s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .logo {
                margin-bottom: 30px;
            }
            
            .logo i {
                font-size: 3.5rem;
                color: #4CAF50;
                margin-bottom: 15px;
                display: block;
            }
            
            .logo h1 {
                color: #333;
                font-size: 1.8rem;
                margin-bottom: 5px;
            }
            
            .logo p {
                color: #666;
                font-size: 1rem;
            }
            
            .login-form {
                margin-top: 20px;
            }
            
            .form-group {
                margin-bottom: 20px;
                text-align: left;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                color: #555;
                font-weight: 500;
                font-size: 0.95rem;
            }
            
            .form-group input {
                width: 100%;
                padding: 14px 16px;
                border: 2px solid #E0E0E0;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.3s;
                background-color: #f9f9f9;
            }
            
            .form-group input:focus {
                outline: none;
                border-color: #4CAF50;
                background-color: white;
            }
            
            .btn-login {
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                border: none;
                padding: 16px;
                width: 100%;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                margin-top: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .btn-login:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
            }
            
            .error-message {
                background-color: #FFEBEE;
                border-left: 4px solid #F44336;
                padding: 12px 15px;
                border-radius: 6px;
                margin-bottom: 20px;
                text-align: left;
                display: ${error ? 'block' : 'none'};
                animation: shake 0.5s;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .error-message i {
                color: #F44336;
                margin-right: 8px;
            }
            
            .error-message span {
                color: #C62828;
                font-size: 0.95rem;
            }
            
            .user-guide {
                margin-top: 25px;
                padding: 15px;
                background-color: #E8F5E9;
                border-radius: 8px;
                text-align: left;
            }
            
            .user-guide h3 {
                color: #2E7D32;
                font-size: 1rem;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .user-guide ul {
                padding-left: 20px;
                color: #555;
                font-size: 0.9rem;
            }
            
            .user-guide li {
                margin-bottom: 5px;
            }
            
            @media (max-width: 480px) {
                .login-container {
                    padding: 25px;
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
            
            ${error ? `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Credenciales incorrectas. Por favor, inténtalo de nuevo.</span>
                </div>
            ` : ''}
            
            <div class="login-form">
                <form id="loginForm" method="post">
                    <div class="form-group">
                        <label for="username">
                            <i class="fas fa-user"></i> Usuario
                        </label>
                        <input type="text" 
                               id="username" 
                               name="username" 
                               placeholder="Introduce tu usuario" 
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
            
            <div class="user-guide">
                <h3><i class="fas fa-info-circle"></i> Usuarios de prueba:</h3>
                <ul>
                    <li><strong>admin</strong> / Veterinaria2024!</li>
                    <li><strong>produccion</strong> / Produccion2024!</li>
                    <li><strong>calidad</strong> / Calidad2024!</li>
                </ul>
                <p style="margin-top: 10px; font-size: 0.85rem; color: #666;">
                    Contacta con el administrador para obtener tus credenciales.
                </p>
            </div>
        </div>
        
        <script>
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                // Crear credenciales en Base64
                const credentials = btoa(username + ':' + password);
                
                // Reenviar la solicitud con las credenciales
                const xhr = new XMLHttpRequest();
                xhr.open('GET', window.location.pathname + window.location.search, true);
                xhr.setRequestHeader('Authorization', 'Basic ' + credentials);
                
                xhr.onload = function() {
                    if (xhr.status === 200 || xhr.status === 302) {
                        // Recargar la página para acceder con la cookie
                        window.location.reload();
                    } else {
                        // Mostrar error
                        window.location.search = 'error=true';
                    }
                };
                
                xhr.send();
            });
            
            // Autofocus en el campo de usuario
            document.getElementById('username').focus();
            
            // Manejar parámetro de error en la URL
            if (window.location.search.includes('error=true')) {
                document.querySelector('.error-message').style.display = 'block';
            }
        </script>
    </body>
    </html>
  `;
  
  return new Response(html, {
    status: 401,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'WWW-Authenticate': 'Basic realm="Fabricaciones Veterinaria"'
    }
  });
}

// ============================================
// CONFIGURACIÓN DEL MIDDLEWARE
// ============================================

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. Archivos estáticos (ya manejados en el código)
     * 2. Rutas API (si las hubiera)
     */
    '/((?!api/).*)'
  ]
};