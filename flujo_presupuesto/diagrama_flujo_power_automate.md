# Diagrama de Flujo Completo - Power Automate
## Renombrado Automático de Archivos de Presupuesto (OneDrive)

---

## 📋 CONFIGURACIÓN INICIAL DEL FLUJO

**Nombre del Flujo:** `Renombrar Archivos Presupuesto ADMIN`
**Tipo:** Flujo de nube automatizado
**Conector:** OneDrive para la Empresa
**Desencadenador:** Manual (botón) o Programado

---

## 🔄 DIAGRAMA DE FLUJO PRINCIPAL

```mermaid
flowchart TD
    A[🚀 INICIO DEL FLUJO<br/>Activar manualmente] --> B[📁 LISTAR ARCHIVOS<br/>OneDrive: Carpeta ADMIN/nueva]
    B --> C[🔄 APLICAR A CADA UNO<br/>Para cada archivo encontrado]
    
    C --> D{🔍 ¿Contiene CDP?<br/>contains Name CDP}
    
    D -->|SÍ| E[📝 RENOMBRAR A CDP.xlsx<br/>Mover archivo OneDrive]
    D -->|NO| F{🔍 ¿Contiene RP?<br/>contains Name RP}
    
    F -->|SÍ| G[📝 RENOMBRAR A RP.xlsx<br/>Mover archivo OneDrive]
    F -->|NO| H{🔍 ¿Contiene PAGO?<br/>contains Name PAGO}
    
    H -->|SÍ| I[📝 RENOMBRAR A OP.xlsx<br/>Mover archivo OneDrive]
    H -->|NO| J[⚪ MANTENER NOMBRE<br/>Sin cambios]
    
    E --> K[🔚 FIN DEL BUCLE]
    G --> K
    I --> K
    J --> K
    
    K --> L{🔄 ¿Más archivos?}
    L -->|SÍ| C
    L -->|NO| M[✅ FLUJO COMPLETADO]

    classDef startEnd fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef process fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef action fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef maintain fill:#fafafa,stroke:#616161,stroke-width:2px
    
    class A,M startEnd
    class B,C process
    class D,F,H,L decision
    class E,G,I action
    class J maintain
```

---

## 🎯 DIAGRAMA DE LÓGICA DE RENOMBRADO

```mermaid
graph LR
    A[Archivo Original] --> B{Evaluar Nombre}
    
    B -->|Contiene CDP| C[CDP.xlsx]
    B -->|Contiene RP| D[RP.xlsx]
    B -->|Contiene PAGO| E[OP.xlsx]
    B -->|No cumple reglas| F[Nombre Original]
    
    subgraph "Ejemplos de Transformación"
        G["LISTADO CDP A 9_06_2025.xlsx"] --> C
        H["LISTADO RP A 9_06_2025.xlsx"] --> D
        I["LISTADO DE PAGO A 9_06_2025.xlsx"] --> E
        J["EJECUCION PRESUPUESTAL.xlsx"] --> F
    end
    
    classDef input fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef output fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef example fill:#fff9c4,stroke:#f9a825,stroke-width:1px
    
    class A,G,H,I,J input
    class C,D,E,F output
```

---

## 🛠️ PASOS DETALLADOS DE CONFIGURACIÓN

### **PASO 1: Configurar el Desencadenador**
1. **Crear nuevo flujo** → "Flujo de nube automatizado"
2. **Nombre:** "Renombrar Archivos Presupuesto ADMIN"
3. **Desencadenador:** "Activar manualmente un flujo" (para pruebas)
   - O "Periodicidad" (para automatización)

```mermaid
graph LR
    A[Nuevo Flujo] --> B[Flujo Automatizado]
    B --> C[Desencadenador Manual]
    C --> D[Listo para usar]
    
    classDef step fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    class A,B,C,D step
```

### **PASO 2: Obtener Archivos de OneDrive**
1. **Agregar nueva acción** → Buscar "OneDrive"
2. **Seleccionar:** "Enumerar archivos de la carpeta"
3. **Configuración:**
   ```
   Carpeta: /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva
   ```

```mermaid
sequenceDiagram
    participant PA as Power Automate
    participant OD as OneDrive
    participant CP as Carpeta ADMIN/nueva
    
    PA->>OD: Conectar a OneDrive
    OD->>CP: Enumerar archivos
    CP->>OD: Lista de archivos
    OD->>PA: Retornar archivos encontrados
```

### **PASO 3: Crear Bucle Para Cada Archivo**
1. **Agregar nueva acción** → Buscar "Control"
2. **Seleccionar:** "Aplicar a cada uno"
3. **Configuración:**
   ```
   Seleccionar una salida de los pasos anteriores: value
   ```

### **PASO 4-6: Condiciones Anidadas**

```mermaid
graph TD
    A[Archivo Actual] --> B{¿Contiene CDP?}
    B -->|SÍ| C[Renombrar a CDP.xlsx]
    B -->|NO| D{¿Contiene RP?}
    D -->|SÍ| E[Renombrar a RP.xlsx]
    D -->|NO| F{¿Contiene PAGO?}
    F -->|SÍ| G[Renombrar a OP.xlsx]
    F -->|NO| H[Mantener nombre original]
    
    C --> I[Siguiente archivo]
    E --> I
    G --> I
    H --> I
    
    classDef condition fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef action fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef neutral fill:#fafafa,stroke:#616161,stroke-width:2px
    
    class B,D,F condition
    class C,E,G action
    class H neutral
```

#### **Configuración Detallada de Condiciones:**

**Condición 1 - CDP:**
```javascript
// Expresión de condición
contains(items('Apply_to_each')?['Name'], 'CDP')

// Acción en rama SÍ: Mover archivo
Conector: OneDrive para la Empresa
Acción: "Mover archivo"
Archivo: items('Apply_to_each')?['{FullPath}']
Carpeta de destino: /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva
Nuevo nombre: CDP.xlsx
```

**Condición 2 - RP:**
```javascript
// Expresión de condición
contains(items('Apply_to_each')?['Name'], 'RP')

// Acción en rama SÍ: Mover archivo
Archivo: items('Apply_to_each')?['{FullPath}']
Nuevo nombre: RP.xlsx
```

**Condición 3 - PAGO:**
```javascript
// Expresión de condición
contains(items('Apply_to_each')?['Name'], 'PAGO')

// Acción en rama SÍ: Mover archivo
Archivo: items('Apply_to_each')?['{FullPath}']
Nuevo nombre: OP.xlsx
```

---

## 🔧 EXPRESIONES Y CONFIGURACIONES OneDrive

### **Para referencia del archivo actual:**
```javascript
items('Apply_to_each')?['Name']          // Nombre del archivo
items('Apply_to_each')?['{FullPath}']    // Ruta completa OneDrive
items('Apply_to_each')?['Id']            // ID único del archivo
items('Apply_to_each')?['Size']          // Tamaño del archivo
```

### **Para construir rutas de destino OneDrive:**
```javascript
// Concatenar ruta base con nuevo nombre
concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'CDP.xlsx')
concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'RP.xlsx')
concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'OP.xlsx')
```

### **Expresiones de condiciones mejoradas:**
```javascript
// Búsqueda insensible a mayúsculas/minúsculas
contains(toLower(items('Apply_to_each')?['Name']), 'cdp')
contains(toLower(items('Apply_to_each')?['Name']), 'rp')
contains(toLower(items('Apply_to_each')?['Name']), 'pago')
```

### **Validación de archivos Excel:**
```javascript
// Verificar que sea archivo Excel
and(
  contains(items('Apply_to_each')?['Name'], '.xlsx'),
  contains(items('Apply_to_each')?['Name'], 'CDP')
)
```

---

## 📁 ACCIONES ESPECÍFICAS DE ONEDRIVE DISPONIBLES

Basado en las opciones que mostraste, aquí están las acciones exactas que necesitamos:

### **ACCIONES QUE USAREMOS EN NUESTRO FLUJO:**

```mermaid
graph LR
    subgraph "Acciones OneDrive Necesarias"
        A["📋 Mostrar los archivos<br/>de la carpeta"]
        B["📝 Mover un archivo o<br/>cambiar su nombre"]
    end
    
    subgraph "Otras Acciones Disponibles"
        C["📄 Crear archivo"]
        D["🔄 Actualizar archivo"]
        E["🔍 Buscar archivos en la carpeta"]
        F["📥 Cargar un archivo desde una dirección"]
        G["🔗 Copiar archivo"]
        H["🗑️ Eliminar archivo"]
        I["📊 Obtener contenido de archivo"]
        J["🏷️ Obtener metadatos del archivo"]
    end
    
    classDef needed fill:#4caf50,color:#ffffff,stroke:#388e3c,stroke-width:3px
    classDef available fill:#e3f2fd,stroke:#1976d2,stroke-width:1px
    
    class A,B needed
    class C,D,E,F,G,H,I,J available
```

### **1. "Mostrar los archivos de la carpeta"**
```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 PROPÓSITO: Obtener lista de archivos de una carpeta     │
│                                                             │
│ 📍 CONFIGURACIÓN:                                          │
│   ├─ Carpeta: /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva    │
│   └─ Resultado: Array "value" con información de archivos  │
│                                                             │
│ 📤 SALIDA: Lista de archivos con propiedades:             │
│   ├─ Name: Nombre del archivo                              │
│   ├─ FullPath: Ruta completa                              │
│   ├─ Id: Identificador único                              │
│   ├─ Size: Tamaño del archivo                             │
│   └─ LastModified: Fecha de modificación                  │
└─────────────────────────────────────────────────────────────┘
```

### **2. "Mover un archivo o cambiar su nombre"**
```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 PROPÓSITO: Renombrar o mover archivos                   │
│                                                             │
│ 📍 CONFIGURACIÓN:                                          │
│   ├─ Archivo: [Expresión] items('Apply_to_each')?['{FullPath}'] │
│   ├─ Carpeta de destino: /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva │
│   └─ Nuevo nombre: CDP.xlsx (o RP.xlsx, OP.xlsx)          │
│                                                             │
│ ⚠️ IMPORTANTE:                                             │
│   ├─ Si cambias solo el nombre, mantén la misma carpeta   │
│   ├─ Si existe archivo con mismo nombre, puede fallar     │
│   └─ OneDrive mantiene versiones anteriores               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ ESTRUCTURA REAL DEL FLUJO EN POWER AUTOMATE

```mermaid
flowchart TD
    subgraph "Nivel 1: Flujo Principal"
        A["🟠 Activar manualmente un flujo"]
        B["🔵 Mostrar los archivos de la carpeta"]
        C["🟣 Aplicar a cada uno"]
    end
    
    subgraph "Nivel 2: Dentro del Bucle"
        D["🟣 Condición 1"]
        E["🔵 Mover archivo → CDP.xlsx"]
        F["🟣 Condición 2"]
        G["🔵 Mover archivo → RP.xlsx"]
        H["🟣 Condición 3"]
        I["🔵 Mover archivo → OP.xlsx"]
        J["⚪ [Vacío - Sin acción]"]
    end
    
    A --> B
    B --> C
    C --> D
    
    D -->|"SÍ<br/>Contiene 'CDP'"| E
    D -->|"NO<br/>No contiene 'CDP'"| F
    
    F -->|"SÍ<br/>Contiene 'RP'"| G
    F -->|"NO<br/>No contiene 'RP'"| H
    
    H -->|"SÍ<br/>Contiene 'PAGO'"| I
    H -->|"NO<br/>No contiene 'PAGO'"| J
    
    E --> K["🔚 Siguiente iteración"]
    G --> K
    I --> K
    J --> K
    
    classDef trigger fill:#ff9800,color:#ffffff,stroke:#f57c00,stroke-width:2px
    classDef action fill:#2196f3,color:#ffffff,stroke:#1976d2,stroke-width:2px
    classDef control fill:#9c27b0,color:#ffffff,stroke:#7b1fa2,stroke-width:2px
    classDef empty fill:#fafafa,stroke:#616161,stroke-width:1px
    
    class A trigger
    class B,E,G,I action
    class C,D,F,H control
    class J empty
```

---

## 🔧 CONFIGURACIÓN PASO A PASO CON CAPTURAS

### **PASO 1: Desencadenador**
```
1. Ir a Power Automate → Crear → Flujo automatizado
2. Nombre: "Renombrar Archivos Presupuesto ADMIN"
3. Buscar: "manual"
4. Seleccionar: "Activar manualmente un flujo"
5. Clic en "Crear"

✅ Resultado: Aparece caja naranja con título del desencadenador
```

### **PASO 2: Acción OneDrive - Listar Archivos**
```
1. Clic en "+ Nuevo paso"
2. Buscar: "OneDrive"
3. Seleccionar: "OneDrive para la Empresa"
4. Buscar acción: "Mostrar los archivos de la carpeta"
5. En "Carpeta": escribir o navegar a:
   /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva

✅ Resultado: Aparece caja azul con el conector OneDrive
```

### **PASO 3: Control - Aplicar a cada uno**
```
1. Clic en "+ Nuevo paso"
2. Buscar: "Control"
3. Seleccionar: "Aplicar a cada uno"
4. En "Seleccionar una salida de los pasos anteriores":
   - Clic en el campo
   - Seleccionar "value" (aparece automáticamente)

✅ Resultado: Aparece caja morada que contiene otros elementos
```

### **PASO 4: Primera Condición (CDP)**
```
1. DENTRO del bucle "Aplicar a cada uno":
   - Clic en "Agregar una acción"
2. Buscar: "Control"
3. Seleccionar: "Condición"
4. Configurar:
   - Lado izquierdo: Clic en "Expresión"
   - Escribir: contains(items('Apply_to_each')?['Name'], 'CDP')
   - Operador: "es igual a"
   - Lado derecho: true

✅ Resultado: Se crea condición con dos ramas (Sí/No)
```

### **PASO 5: Acción en Rama "SÍ"**
```
1. En la rama "Sí" de la condición:
   - Clic en "Agregar una acción"
2. Buscar: "OneDrive"
3. Seleccionar: "Mover un archivo o cambiar su nombre"
4. Configurar:
   - Archivo: Clic en "Expresión"
   - Escribir: items('Apply_to_each')?['{FullPath}']
   - Carpeta de destino: /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva
   - Nuevo nombre: CDP.xlsx

✅ Resultado: Acción de renombrado en rama positiva
```

### **PASO 6: Condición Anidada en Rama "NO"**
```
1. En la rama "No" de la primera condición:
   - Clic en "Agregar una acción"
2. Repetir proceso de condición
3. Expresión: contains(items('Apply_to_each')?['Name'], 'RP')

✅ Resultado: Segunda condición anidada dentro de la primera
```

---

## ❓ PREGUNTAS FRECUENTES

### **P: ¿Por qué no veo las ramas SÍ/NO al principio?**
**R:** Las ramas aparecen **automáticamente** cuando agregas una **Condición**. No tienes que crearlas manualmente.

### **P: ¿Qué pasa si no agrego nada en la rama "NO"?**
**R:** El flujo **continúa normalmente**. Es perfectamente válido dejar una rama vacía.

### **P: ¿Puedo probar el flujo sin archivos reales?**
**R:** Sí, pero necesitas al menos **acceso a la carpeta** de OneDrive. Puedes crear archivos de prueba con nombres como "test CDP.xlsx".

### **P: ¿Qué significa "items('Apply_to_each')"?**
**R:** Es la referencia al **archivo actual** en el bucle. Power Automate la genera automáticamente.
