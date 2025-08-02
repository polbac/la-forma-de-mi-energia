// Función para guardar el usuario de GitHub en localStorage
function saveGithubUser(username) {
    try {
        localStorage.setItem('githubUsername', username);
        // También guardar el hash generado para consistencia
        const userHash = generateUserHash(username);
        localStorage.setItem('userHash', userHash);
        return true;
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
        return false;
    }
}

// Función para obtener el usuario de GitHub desde localStorage
function getGithubUser() {
    return localStorage.getItem('githubUsername');
}

// Función para generar un hash único de 300 caracteres basado en el nombre de usuario
function generateUserHash(username) {
    // Crear una semilla única basada en el nombre de usuario
    let seed = 0;
    for (let i = 0; i < username.length; i++) {
        seed += username.charCodeAt(i) * (i + 1);
    }
    
    // Función para generar números pseudo-aleatorios basados en la semilla
    function seededRandom() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }
    
    // Caracteres disponibles para el hash
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Generar el hash de 300 caracteres
    let hash = '';
    for (let i = 0; i < 300; i++) {
        const randomIndex = Math.floor(seededRandom() * chars.length);
        hash += chars[randomIndex];
    }
    
    return hash;
}

// Función para obtener el hash del usuario actual
function getUserHash() {
    const username = getGithubUser();
    if (username) {
        return generateUserHash(username);
    }
    return null;
}

// Función para generar un array de objetos de formas basado en el hash
function generateShapesFromHash(hash) {
    // Crear una semilla única basada en el hash
    let seed = 0;
    for (let i = 0; i < hash.length; i++) {
        seed += hash.charCodeAt(i) * (i + 1);
    }
    
    // Función para generar números pseudo-aleatorios basados en la semilla
    function seededRandom() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }
    
    // Definir las formas disponibles
    const formas = ["linea", "cuadrado", "punto"];
    
    // Generar colores hexadecimales fuertes (tendiendo a colores vibrantes)
    function generateStrongColor() {
        const strongColors = [
            '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
            '#FF4500', '#FF1493', '#00CED1', '#32CD32', '#FFD700', '#FF69B4',
            '#00FA9A', '#FF6347', '#4169E1', '#FF4500', '#8A2BE2', '#FF8C00',
            '#00BFFF', '#FF1493', '#32CD32', '#FFD700', '#FF69B4', '#00FA9A'
        ];
        return strongColors[Math.floor(seededRandom() * strongColors.length)];
    }
    
    // Determinar la cantidad de objetos (entre 20 y 50)
    const cantidad = Math.floor(seededRandom() * 31) + 20;
    
    const shapes = [];
    
    for (let i = 0; i < cantidad; i++) {
        const shape = {
            forma: formas[Math.floor(seededRandom() * formas.length)],
            color: generateStrongColor(),
            tamaño: Math.floor(seededRandom() * 10) + 1,
            posicionX: Math.floor(seededRandom() * 100) + 1,
            posicionY: Math.floor(seededRandom() * 100) + 1
        };
        shapes.push(shape);
    }
    
    return shapes;
}

// Función para generar valores animados basados en el hash y timestamp
function generateAnimatedValues(shape, index, timestamp) {
    // Crear una semilla única para cada forma basada en su hash original
    let seed = 0;
    const shapeString = `${shape.forma}${shape.color}${shape.tamaño}${shape.posicionX}${shape.posicionY}${index}`;
    for (let i = 0; i < shapeString.length; i++) {
        seed += shapeString.charCodeAt(i) * (i + 1);
    }
    
    // Función para generar números pseudo-aleatorios
    function seededRandom() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }
    
    // Generar valores base para la animación (centrado en la pantalla)
    const baseX = 50; // Centro horizontal
    const baseY = 50; // Centro vertical
    const baseScale = shape.tamaño;
    const baseAngle = seededRandom() * 360;
    
    // Frecuencias de animación únicas para cada forma (más equilibradas)
    const freqX = 0.3 + seededRandom() * 1.2; // 0.3 a 1.5
    const freqY = 0.3 + seededRandom() * 1.2; // 0.3 a 1.5 (mismo rango que X)
    const freqScale = 0.2 + seededRandom() * 0.8; // 0.2 a 1.0
    const freqAngle = 0.1 + seededRandom() * 0.4; // 0.1 a 0.5
    
    // Amplitudes de movimiento (desde el centro)
    const ampX = 15 + seededRandom() * 25; // 15 a 40 píxeles
    const ampY = 15 + seededRandom() * 25; // 15 a 40 píxeles
    const ampScale = 0.1 + seededRandom() * 0.3; // 0.1 a 0.4
    const ampAngle = 10 + seededRandom() * 20; // 10 a 30 grados
    
    // Calcular valores animados usando funciones sinusoidales equilibradas
    const time = timestamp * 0.001; // Convertir a segundos
    
    const animatedX = baseX + Math.sin(time * freqX) * ampX;
    const animatedY = baseY + Math.sin(time * freqY) * ampY; // Cambiar a sin para equilibrio
    const animatedScale = baseScale * (1 + Math.sin(time * freqScale) * ampScale);
    const animatedAngle = baseAngle + Math.sin(time * freqAngle) * ampAngle;
    
    return {
        x: Math.max(10, Math.min(90, animatedX)), // Permitir movimiento más amplio desde el centro
        y: Math.max(10, Math.min(90, animatedY)), // Permitir movimiento más amplio desde el centro
        scale: Math.max(0.5, Math.min(2.0, animatedScale)), // Limitar escala entre 0.5 y 2.0
        angle: animatedAngle
    };
}

// Función para renderizar las formas en el contenedor con animación
function renderShapes(shapes) {
    const container = document.getElementById('shapesContainer');
    container.innerHTML = ''; // Limpiar contenedor
    
    // Guardar las formas actuales para el pause
    currentShapes = shapes;
    
    shapes.forEach((shape, index) => {
        const shapeElement = document.createElement('div');
        shapeElement.className = `shape ${shape.forma}`;
        shapeElement.style.color = shape.color;
        shapeElement.style.width = `${shape.tamaño * 10}px`;
        shapeElement.style.height = `${shape.tamaño * 10}px`;
        shapeElement.style.left = `${shape.posicionX}%`;
        shapeElement.style.top = `${shape.posicionY}%`;
        shapeElement.style.transform = 'translate(-50%, -50%)';
        shapeElement.style.transition = 'none';
        
        // Agregar glow intenso con box-shadow dinámico
        shapeElement.style.boxShadow = `
            0 0 20px ${shape.color},
            0 0 40px ${shape.color},
            0 0 60px ${shape.color},
            0 0 80px ${shape.color},
            0 0 100px ${shape.color}
        `;
        shapeElement.style.filter = `drop-shadow(0 0 15px ${shape.color})`;
        
        // Agregar título con información de la forma
        shapeElement.title = `${shape.forma} - Tamaño: ${shape.tamaño} - Pos: (${shape.posicionX}, ${shape.posicionY})`;
        
        container.appendChild(shapeElement);
    });
    
    // Iniciar la animación
    animateShapes(shapes);
}

// Variable global para controlar la animación
let animationId = null;
let currentShapes = null;

// Función para animar las formas
function animateShapes(shapes) {
    const container = document.getElementById('shapesContainer');
    const shapeElements = container.querySelectorAll('.shape');
    
    // Detener animación anterior si existe
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    function animate(timestamp) {
        // Verificar si la animación está pausada
        if (isPaused) {
            return;
        }
        
        shapeElements.forEach((element, index) => {
            const shape = shapes[index];
            const animatedValues = generateAnimatedValues(shape, index, timestamp);
            
            // Aplicar transformaciones usando porcentajes para centrado correcto
            element.style.left = `${animatedValues.x}%`;
            element.style.top = `${animatedValues.y}%`;
            element.style.transform = `translate(-50%, -50%) rotate(${animatedValues.angle}deg) scale(${animatedValues.scale})`;
        });
        
        // Continuar la animación
        animationId = requestAnimationFrame(animate);
    }
    
    // Iniciar el loop de animación
    animationId = requestAnimationFrame(animate);
}

// Función para detener la animación
function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// Variable global para controlar el estado de pause
let isPaused = false;
let timestampInterval = null;

// Función para actualizar el timestamp en tiempo real
function updateTimestamp() {
    const timestampElement = document.getElementById('currentTimestamp');
    if (timestampElement) {
        timestampElement.textContent = Date.now();
    }
}

// Función para configurar el botón de pause
function setupPauseButton() {
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            if (isPaused) {
                // Reanudar animación
                isPaused = false;
                pauseBtn.textContent = '⏸️';
                
                animateShapes(currentShapes); // Necesitamos guardar las formas actuales
            } else {
                // Pausar animación
                isPaused = true;
                pauseBtn.textContent = '▶️';
                
                stopAnimation();
            }
        });
    }
    
    // Iniciar actualización del timestamp
    if (timestampInterval) {
        clearInterval(timestampInterval);
    }
    timestampInterval = setInterval(updateTimestamp, 100); // Actualizar cada 100ms
}

// Función para buscar usuarios en GitHub
async function searchGitHubUsers(query) {
    if (query.length < 2) return [];
    
    try {
        const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=10`);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error buscando usuarios:', error);
        return [];
    }
}

// Función para mostrar el dropdown de búsqueda
function showSearchDropdown(users, isLoading = false, noResults = false) {
    const dropdown = document.getElementById('searchDropdown');
    
    if (isLoading) {
        dropdown.innerHTML = '<div class="search-loading">Buscando usuarios...</div>';
        dropdown.classList.add('active');
        return;
    }
    
    if (noResults) {
        dropdown.innerHTML = '<div class="search-no-results">No se encontraron usuarios</div>';
        dropdown.classList.add('active');
        return;
    }
    
    if (users.length === 0) {
        dropdown.classList.remove('active');
        return;
    }
    
    dropdown.innerHTML = users.map(user => `
        <div class="search-item" data-username="${user.login}">
            <img src="${user.avatar_url}" alt="${user.login}" class="search-item-avatar">
            <div class="search-item-info">
                <div class="search-item-username">${user.login}</div>
                <div class="search-item-name">${user.name || 'Sin nombre'}</div>
            </div>
        </div>
    `).join('');
    
    dropdown.classList.add('active');
}

// Función para manejar la selección de usuario
function selectUser(username) {
    const input = document.getElementById('githubUsername');
    const dropdown = document.getElementById('searchDropdown');
    
    // Establecer el valor del input
    input.value = username;
    
    // Ocultar el dropdown
    dropdown.classList.remove('active');
    
    // Enfocar el input
    input.focus();
    
    // Limpiar cualquier timeout de búsqueda pendiente
    if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
    }
    
    console.log('Usuario seleccionado:', username); // Para debugging
}

// Función para mostrar mensajes al usuario
function showMessage(message, isSuccess = true) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = isSuccess ? 'success' : 'error';
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 3000);
}

// Función para mostrar el formulario y ocultar el menú del usuario
function showForm() {
    document.getElementById('githubFormContainer').style.display = 'block';
    document.getElementById('userMenuContainer').style.display = 'none';
    document.getElementById('rootContainer').style.display = 'none';
    
    // Detener la animación cuando se oculta el contenedor
    stopAnimation();
    
    // Limpiar el intervalo del timestamp
    if (timestampInterval) {
        clearInterval(timestampInterval);
        timestampInterval = null;
    }
    
    // Resetear el estado de pause
    isPaused = false;
}

// Función para mostrar el menú del usuario y ocultar el formulario
function showUserMenu(username) {
    document.getElementById('githubFormContainer').style.display = 'none';
    document.getElementById('userMenuContainer').style.display = 'block';
    document.getElementById('rootContainer').style.display = 'block';
    document.getElementById('currentUser').textContent = username;
    
    // Obtener el hash del usuario (generado o guardado)
    const userHash = localStorage.getItem('userHash') || generateUserHash(username);
    
    // Generar el array de formas basado en el hash
    const shapes = generateShapesFromHash(userHash);
    
    // Renderizar las formas visualmente
    renderShapes(shapes);
    
    // Mostrar información adicional
    const infoDiv = document.createElement('div');
    infoDiv.style.cssText = 'position: absolute; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); color: white; padding: 15px; border-radius: 8px; font-size: 12px; z-index: 1000; min-width: 300px;';
    infoDiv.innerHTML = `
        <div style="margin-bottom: 10px;"><strong>Hash:</strong> ${userHash}</div>
        <div style="margin-bottom: 15px;"><strong>Timestamp:</strong> <span id="currentTimestamp">${Date.now()}</span></div>
        <button id="pauseBtn" style="background: #0366d6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: inherit; font-size: 11px;">⏸️</button>
    `;
    
    document.getElementById('rootContainer').appendChild(infoDiv);
    
    // Actualizar timestamp en tiempo real
    updateTimestamp();
    
    // Manejar el botón de pause
    setupPauseButton();
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('githubUsername');
    showForm();
    
}

// Manejar el envío del formulario
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('githubForm');
    const input = document.getElementById('githubUsername');
    const userMenuTrigger = document.getElementById('userMenuTrigger');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    
    window.searchTimeout = null;
    
    // Cargar usuario guardado si existe
    const savedUser = getGithubUser();
    if (savedUser) {
        showUserMenu(savedUser);
    } else {
        showForm();
    }
    
    // Manejar la búsqueda de usuarios
    input.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Limpiar timeout anterior
        if (window.searchTimeout) {
            clearTimeout(window.searchTimeout);
        }
        
        if (query.length < 2) {
            document.getElementById('searchDropdown').classList.remove('active');
            return;
        }
        
        // Mostrar loading
        showSearchDropdown([], true);
        
        // Debounce de 300ms para evitar muchas requests
        window.searchTimeout = setTimeout(async () => {
            const users = await searchGitHubUsers(query);
            showSearchDropdown(users, false, users.length === 0);
        }, 300);
    });
    
    // Manejar clics en el dropdown
    document.getElementById('searchDropdown').addEventListener('click', function(e) {
        const searchItem = e.target.closest('.search-item');
        if (searchItem) {
            e.preventDefault();
            e.stopPropagation();
            const username = searchItem.dataset.username;
            selectUser(username);
        }
    });
    
    // Event listener adicional para elementos específicos del dropdown
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('search-item') || e.target.closest('.search-item')) {
            const searchItem = e.target.closest('.search-item');
            if (searchItem) {
                e.preventDefault();
                e.stopPropagation();
                const username = searchItem.dataset.username;
                selectUser(username);
            }
        }
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            document.getElementById('searchDropdown').classList.remove('active');
        }
        userMenuDropdown.classList.remove('active');
    });
    
    // Manejar navegación con teclado
    input.addEventListener('keydown', function(e) {
        const dropdown = document.getElementById('searchDropdown');
        const items = dropdown.querySelectorAll('.search-item');
        const selectedItem = dropdown.querySelector('.search-item.selected');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedItem) {
                selectedItem.classList.remove('selected');
                const nextItem = selectedItem.nextElementSibling;
                if (nextItem) {
                    nextItem.classList.add('selected');
                } else {
                    items[0]?.classList.add('selected');
                }
            } else {
                items[0]?.classList.add('selected');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedItem) {
                selectedItem.classList.remove('selected');
                const prevItem = selectedItem.previousElementSibling;
                if (prevItem) {
                    prevItem.classList.add('selected');
                } else {
                    items[items.length - 1]?.classList.add('selected');
                }
            } else {
                items[items.length - 1]?.classList.add('selected');
            }
        } else if (e.key === 'Enter' && selectedItem) {
            e.preventDefault();
            const username = selectedItem.dataset.username;
            selectUser(username);
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = input.value.trim();
        
        if (!username) {
            showMessage('Por favor ingresa un nombre de usuario', false);
            return;
        }
        
        // Guardar en localStorage
        if (saveGithubUser(username)) {
            showUserMenu(username);
            showMessage(`Usuario "${username}" guardado exitosamente`);
        } else {
            showMessage('Error al guardar el usuario', false);
        }
    });
    
    // Manejar el menú contextual del usuario
    userMenuTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        userMenuDropdown.classList.toggle('active');
    });
    
    // Manejar el botón de cerrar sesión
    logoutBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        logout();
        userMenuDropdown.classList.remove('active');
    });
});
