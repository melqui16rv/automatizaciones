# Flujo de Power Automate: Renombrado Automático de Archivos
## Documentación Técnica Completa - OneDrive para la Empresa

## 🎯 Objetivo
Automatizar el cambio de nombres de archivos en una carpeta específica de **OneDrive para la Empresa** basándose en palabras clave contenidas en el nombre original, utilizando Power Automate.

## 📋 Reglas de Renombrado
- ✅ Si el archivo contiene **"CDP"** → cambiar nombre a **"CDP.xlsx"**
- ✅ Si el archivo contiene **"RP"** → cambiar nombre a **"RP.xlsx"**  
- ✅ Si el archivo contiene **"PAGO"** → cambiar nombre a **"OP.xlsx"**
- ⚪ Si no cumple ninguna condición → **mantener nombre original**

## 🏗️ Arquitectura del Flujo
- **Conector:** OneDrive para la Empresa
- **Tipo de Flujo:** Automatizado con desencadenador manual
- **Estructura:** Condiciones anidadas con bucle iterativo
- **Manejo de Errores:** Configuración de reintentos y notificaciones

## 🔧 Estructura del Flujo - Elementos Específicos de Power Automate

### **1. 🟠 DESENCADENADOR: Obtener Archivos de OneDrive**
```
Elemento de Power Automate: DESENCADENADOR
┌─────────────────────────────────────────────────────────────┐
│ Tipo: "Activar manualmente un flujo"                       │
│ Categoría: Desencadenadores instantáneos                   │
│ Propósito: Iniciar el flujo cuando el usuario lo ejecute   │
│ Configuración: Sin parámetros adicionales                  │
└─────────────────────────────────────────────────────────────┘
```

### **2. 🔵 ACCIÓN OneDrive: Listar Archivos de la Carpeta**
```
Elemento de Power Automate: ACCIÓN
┌─────────────────────────────────────────────────────────────┐
│ Conector: OneDrive para la Empresa                         │
│ Acción: "Mostrar los archivos de la carpeta"              │
│ Configuración:                                              │
│   ├─ Carpeta: /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva    │
│   └─ Salida: Array "value" con lista de archivos          │
│                                                             │
│ Propiedades devueltas por archivo:                         │
│   ├─ Name: Nombre del archivo                              │
│   ├─ FullPath: Ruta completa del archivo                  │
│   ├─ Id: Identificador único                              │
│   ├─ Size: Tamaño en bytes                                │
│   └─ LastModified: Fecha de última modificación           │
└─────────────────────────────────────────────────────────────┘
```

### **3. 🟣 CONTROL: Iterar Sobre Cada Archivo**
```
Elemento de Power Automate: CONTROL
┌─────────────────────────────────────────────────────────────┐
│ Conector: Control                                           │
│ Acción: "Aplicar a cada uno"                              │
│ Configuración:                                              │
│   ├─ Entrada: value (del paso anterior)                   │
│   └─ Variable automática: items('Apply_to_each')          │
│                                                             │
│ Función: Crea un bucle que procesa cada archivo           │
│ individualmente, permitiendo aplicar lógica específica     │
│ a cada elemento de la lista                                │
└─────────────────────────────────────────────────────────────┘
```

### **4. 🟣 LÓGICA DE EVALUACIÓN: Condiciones Anidadas**
Dentro del bucle "Aplicar a cada uno", se implementa una estructura de **condiciones anidadas** utilizando el elemento **Condición** de Power Automate.

#### **🔍 Condición Principal: Verificar si contiene "CDP"**
```
Elemento de Power Automate: CONTROL - Condición
┌─────────────────────────────────────────────────────────────┐
│ Configuración de la Condición:                             │
│   ├─ Valor: [EXPRESIÓN] contains(items('Apply_to_each')?['Name'], 'CDP') │
│   ├─ Operador: "es igual a"                               │
│   └─ Comparar con: true                                   │
│                                                             │
│ Resultado: Se crean automáticamente dos ramas:            │
│   ├─ Rama "SÍ": Se ejecuta si la condición es verdadera  │
│   └─ Rama "NO": Se ejecuta si la condición es falsa      │
└─────────────────────────────────────────────────────────────┘
```

**🟢 RAMA "SÍ" (contiene CDP):**
```
Elemento de Power Automate: ACCIÓN OneDrive
┌─────────────────────────────────────────────────────────────┐
│ Conector: OneDrive para la Empresa                         │
│ Acción: "Mover un archivo o cambiar su nombre"            │
│ Configuración:                                              │
│   ├─ Archivo: [EXPRESIÓN] items('Apply_to_each')?['{FullPath}'] │
│   ├─ Carpeta destino: /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva │
│   └─ Nuevo nombre: CDP.xlsx                               │
│                                                             │
│ Resultado: El archivo se renombra a "CDP.xlsx"            │
└─────────────────────────────────────────────────────────────┘
```

**🔴 RAMA "NO" (no contiene CDP):**
Se agrega otra condición anidada para evaluar la siguiente regla.

#### **🔍 Condición Secundaria: Verificar si contiene "RP"**
```
Elemento de Power Automate: CONTROL - Condición (Anidada)
┌─────────────────────────────────────────────────────────────┐
│ Ubicación: Dentro de la rama "NO" de la condición anterior │
│ Expresión: contains(items('Apply_to_each')?['Name'], 'RP') │
│ Operador: "es igual a"                                     │
│ Valor: true                                                │
└─────────────────────────────────────────────────────────────┘
```

**🟢 RAMA "SÍ" (contiene RP):**
```
Elemento de Power Automate: ACCIÓN OneDrive
┌─────────────────────────────────────────────────────────────┐
│ Acción: "Mover un archivo o cambiar su nombre"            │
│ Archivo: items('Apply_to_each')?['{FullPath}']            │
│ Nuevo nombre: RP.xlsx                                      │
└─────────────────────────────────────────────────────────────┘
```

**🔴 RAMA "NO" (no contiene RP):**
Se agrega la tercera condición anidada.

#### **🔍 Condición Terciaria: Verificar si contiene "PAGO"**
```
Elemento de Power Automate: CONTROL - Condición (Doblemente Anidada)
┌─────────────────────────────────────────────────────────────┐
│ Ubicación: Dentro de la rama "NO" de la segunda condición  │
│ Expresión: contains(items('Apply_to_each')?['Name'], 'PAGO') │
│ Operador: "es igual a"                                     │
│ Valor: true                                                │
└─────────────────────────────────────────────────────────────┘
```

**🟢 RAMA "SÍ" (contiene PAGO):**
```
Elemento de Power Automate: ACCIÓN OneDrive
┌─────────────────────────────────────────────────────────────┐
│ Acción: "Mover un archivo o cambiar su nombre"            │
│ Archivo: items('Apply_to_each')?['{FullPath}']            │
│ Nuevo nombre: OP.xlsx                                      │
└─────────────────────────────────────────────────────────────┘
```

**🔴 RAMA "NO" (no contiene PAGO):**
```
┌─────────────────────────────────────────────────────────────┐
│ NO SE AGREGA NINGUNA ACCIÓN                                │
│ Resultado: El archivo mantiene su nombre original          │
│ Comportamiento: El flujo continúa con el siguiente archivo │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Alternativa Avanzada: Usando Control Switch

Para flujos más complejos, Power Automate ofrece la opción de usar **Switch** en lugar de condiciones anidadas, lo cual es más elegante y fácil de mantener:

### **1. 🟣 Crear Variable para Determinar Tipo de Archivo**
```
Elemento de Power Automate: ACCIÓN Variable
┌─────────────────────────────────────────────────────────────┐
│ Conector: Variable                                          │
│ Acción: "Inicializar variable"                            │
│ Configuración:                                              │
│   ├─ Nombre: tipoArchivo                                   │
│   ├─ Tipo: Cadena                                          │
│   └─ Valor: [EXPRESIÓN COMPLEJA]                          │
│                                                             │
│ Expresión del Valor:                                       │
│ if(contains(items('Apply_to_each')?['Name'], 'CDP'), 'CDP', │
│   if(contains(items('Apply_to_each')?['Name'], 'RP'), 'RP', │
│     if(contains(items('Apply_to_each')?['Name'], 'PAGO'), 'PAGO', 'OTRO'))) │
└─────────────────────────────────────────────────────────────┘
```

### **2. 🟣 Usar Switch para Manejar Casos**
```
Elemento de Power Automate: CONTROL Switch
┌─────────────────────────────────────────────────────────────┐
│ Conector: Control                                           │
│ Acción: "Switch"                                           │
│ Configuración:                                              │
│   └─ En: variables('tipoArchivo')                          │
│                                                             │
│ Casos:                                                      │
│   ├─ Caso "CDP": Mover archivo a CDP.xlsx                 │
│   ├─ Caso "RP": Mover archivo a RP.xlsx                   │
│   ├─ Caso "PAGO": Mover archivo a OP.xlsx                 │
│   └─ Caso predeterminado: No hacer nada                   │
└─────────────────────────────────────────────────────────────┘
```

**Ventajas del Switch:**
- ✅ Más fácil de leer y mantener
- ✅ Menos anidación de elementos
- ✅ Mejor performance en casos con muchas condiciones
- ✅ Más escalable para agregar nuevas reglas

## 📝 Expresiones Útiles para OneDrive y Power Automate

### **🔗 Referencias del Archivo Actual en el Bucle:**
```javascript
// Nombre del archivo (ej: "LISTADO CDP A 9_06_2025.xlsx")
items('Apply_to_each')?['Name']

// Ruta completa del archivo en OneDrive
items('Apply_to_each')?['{FullPath}']

// ID único del archivo en OneDrive
items('Apply_to_each')?['Id']

// Tamaño del archivo en bytes
items('Apply_to_each')?['Size']

// Fecha de última modificación
items('Apply_to_each')?['LastModified']
```

### **🏗️ Construcción de Rutas de Destino OneDrive:**
```javascript
// Ruta completa concatenada (NO necesaria para renombrar en misma carpeta)
concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'CDP.xlsx')
concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'RP.xlsx')
concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'OP.xlsx')

// Para renombrar en la misma carpeta, solo especifica el nuevo nombre:
'CDP.xlsx'
'RP.xlsx'
'OP.xlsx'
```

### **🔍 Expresiones de Condiciones Mejoradas:**
```javascript
// Búsqueda básica (sensible a mayúsculas/minúsculas)
contains(items('Apply_to_each')?['Name'], 'CDP')

// Búsqueda insensible a mayúsculas/minúsculas (RECOMENDADO)
contains(toLower(items('Apply_to_each')?['Name']), 'cdp')
contains(toLower(items('Apply_to_each')?['Name']), 'rp')
contains(toLower(items('Apply_to_each')?['Name']), 'pago')

// Validación múltiple: archivo Excel Y contiene palabra clave
and(
  contains(items('Apply_to_each')?['Name'], '.xlsx'),
  contains(toLower(items('Apply_to_each')?['Name']), 'cdp')
)
```

### **🧠 Expresiones Lógicas Complejas:**
```javascript
// Evaluación múltiple con prioridad (para uso con Switch)
if(contains(toLower(items('Apply_to_each')?['Name']), 'cdp'), 'CDP',
   if(contains(toLower(items('Apply_to_each')?['Name']), 'rp'), 'RP',
      if(contains(toLower(items('Apply_to_each')?['Name']), 'pago'), 'PAGO', 'OTRO')))

// Verificar múltiples palabras clave en el mismo archivo
or(
  contains(toLower(items('Apply_to_each')?['Name']), 'certificado'),
  contains(toLower(items('Apply_to_each')?['Name']), 'disponibilidad'),
  contains(toLower(items('Apply_to_each')?['Name']), 'presupuestal')
)
```

## 📊 Ejemplos de Transformación Detallados

| Archivo Original | Nuevo Nombre | Regla Aplicada | Elemento Power Automate |
|------------------|--------------|----------------|------------------------|
| EJECUCION PRESUPUESTAL A 9_06_2025 CIDE.xlsx | `[Sin cambios]` | No cumple condiciones | Rama "NO" de todas las condiciones |
| EJECUCION PRESUPUESTAL AGREGADA A 9_06_2025 CIDE.xlsx | `[Sin cambios]` | No cumple condiciones | Rama "NO" de todas las condiciones |
| LISTADO CDP A 9_06_2025 CIDE.xlsx | **CDP.xlsx** | Contiene "CDP" | Primera condición → Rama "SÍ" |
| LISTADO DE PAGO A 9_06_2025 CIDE.xlsx | **OP.xlsx** | Contiene "PAGO" | Tercera condición → Rama "SÍ" |
| LISTADO RP A 9_06_2025 CIDE.xlsx | **RP.xlsx** | Contiene "RP" | Segunda condición → Rama "SÍ" |
| informe CDP mensual.xlsx | **CDP.xlsx** | Contiene "CDP" | Primera condición → Rama "SÍ" |
| reporte RP trimestral.xlsx | **RP.xlsx** | Contiene "RP" | Segunda condición → Rama "SÍ" |
| orden de PAGO especial.xlsx | **OP.xlsx** | Contiene "PAGO" | Tercera condición → Rama "SÍ" |

### **🔄 Flujo de Evaluación:**
1. **Archivo actual:** `LISTADO CDP A 9_06_2025 CIDE.xlsx`
2. **Primera condición:** `contains(Name, 'CDP')` → **✅ TRUE**
3. **Acción ejecutada:** Mover archivo con nuevo nombre `CDP.xlsx`
4. **Resultado:** Las demás condiciones **NO se evalúan** (flujo eficiente)

## ⚠️ Consideraciones Importantes para OneDrive

### **🔒 Permisos y Autenticación:**
1. **Conexión requerida:** OneDrive para la Empresa (no OneDrive personal)
2. **Permisos necesarios:** Lectura y escritura en la carpeta específica
3. **Autenticación:** Usar cuenta corporativa con acceso a la ruta
4. **Verificación:** Probar acceso manual a la carpeta antes de crear el flujo

### **⚙️ Comportamiento del Sistema:**
1. **Orden de Evaluación:** El flujo evalúa en este orden secuencial: CDP → RP → PAGO
2. **Sobreescritura:** Si ya existe un archivo con el nuevo nombre:
   - OneDrive puede crear versión duplicada (`CDP (1).xlsx`)
   - O el flujo puede fallar con error de conflicto
3. **Manejo de Errores:** Configurar reintentos automáticos y notificaciones
4. **Performance:** OneDrive tiene límites de API para operaciones masivas

### **💾 Backup y Recuperación:**
1. **Versiones automáticas:** OneDrive mantiene historial de versiones de archivos
2. **Papelera de reciclaje:** Archivos eliminados se pueden recuperar por 30-90 días
3. **Recomendación:** Hacer backup manual antes de ejecutar flujo masivamente
4. **Pruebas:** Siempre probar con archivos de muestra primero

## 🏆 Flujo Recomendado Final - Implementación Completa

### **📋 Secuencia de Elementos en Power Automate:**

1. **🟠 DESENCADENADOR**
   - Elemento: "Activar manualmente un flujo"
   - Configuración: Sin parámetros

2. **🔵 ACCIÓN OneDrive**
   - Elemento: "Mostrar los archivos de la carpeta"
   - Carpeta: `/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva`

3. **🟣 CONTROL Bucle**
   - Elemento: "Aplicar a cada uno"
   - Entrada: `value` (salida del paso anterior)

4. **🟣 CONDICIÓN 1 (dentro del bucle)**
   - Expresión: `contains(items('Apply_to_each')?['Name'], 'CDP')`
   - **Rama SÍ:** 🔵 "Mover un archivo o cambiar su nombre" → `CDP.xlsx`
   - **Rama NO:** ⬇️ Continuar a Condición 2

5. **🟣 CONDICIÓN 2 (anidada en Rama NO)**
   - Expresión: `contains(items('Apply_to_each')?['Name'], 'RP')`
   - **Rama SÍ:** 🔵 "Mover un archivo o cambiar su nombre" → `RP.xlsx`
   - **Rama NO:** ⬇️ Continuar a Condición 3

6. **🟣 CONDICIÓN 3 (doblemente anidada)**
   - Expresión: `contains(items('Apply_to_each')?['Name'], 'PAGO')`
   - **Rama SÍ:** 🔵 "Mover un archivo o cambiar su nombre" → `OP.xlsx`
   - **Rama NO:** ⚪ No hacer nada (mantener nombre original)

### **💡 Ventajas de este Enfoque:**
- ✅ **Simplicidad:** Más fácil de entender y mantener que expresiones complejas anidadas
- ✅ **Escalabilidad:** Fácil agregar nuevas reglas de renombrado
- ✅ **Debugging:** Cada paso es visible y se puede probar individualmente
- ✅ **Performance:** Evaluación secuencial eficiente (se detiene en la primera coincidencia)
- ✅ **Mantenimiento:** Cada condición es independiente y modificable

### **🔧 Configuraciones Adicionales Recomendadas:**

#### **En "Aplicar a cada uno":**
- ⚙️ **Control de simultaneidad:** Activado
- ⚙️ **Grado de paralelismo:** 1 (para evitar conflictos en OneDrive)

#### **En cada "Mover archivo":**
- ⚙️ **Configurar ejecución tras error:** Continuar
- ⚙️ **Tiempo de espera:** 5 minutos
- ⚙️ **Reintentos:** 3 intentos

#### **En el flujo general:**
- ⚙️ **Enviar notificación al completar**
- ⚙️ **Registrar errores en log**
- ⚙️ **Crear variable contador de archivos procesados**

---

## 🎯 Resumen Ejecutivo

**Este flujo automatiza el renombrado de archivos de presupuesto en OneDrive utilizando:**
- **3 elementos principales:** Desencadenador → Listar archivos → Bucle con condiciones
- **Lógica de negocio:** CDP → RP → PAGO → Sin cambios
- **Tecnología:** Power Automate + OneDrive para la Empresa
- **Mantenimiento:** Estructura modular y escalable para futuras modificaciones

**Resultado esperado:** Archivos con nombres estandarizados que facilitan la gestión y localización de documentos presupuestales del SENA.