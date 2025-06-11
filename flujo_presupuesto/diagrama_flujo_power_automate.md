# Diagrama de Flujo Completo - Power Automate
## Renombrado Automático de Archivos de Presupuesto

---

## 📋 CONFIGURACIÓN INICIAL DEL FLUJO

**Nombre del Flujo:** `Renombrar Archivos Presupuesto ADMIN`
**Tipo:** Flujo de nube automatizado
**Desencadenador:** Manual (botón) o Programado

---

## 🔄 DIAGRAMA DE FLUJO COMPLETO

```
┌─────────────────────────────────────────────────────────────┐
│                    INICIO DEL FLUJO                        │
│                   [Trigger Manual]                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   PASO 1                                   │
│              LISTAR ARCHIVOS                               │
│                                                            │
│ Conector: SharePoint                                       │
│ Acción: "Obtener archivos (propiedades únicamente)"       │
│ Sitio: /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva          │
│ Biblioteca: Documents                                      │
│ Carpeta: /nueva                                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   PASO 2                                   │
│               APLICAR A CADA UNO                           │
│                                                            │
│ Entrada: value (del paso anterior)                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │              INICIO DEL BUCLE                           │ │
│ │                                                         │ │
│ │  Variable automática: items('Apply_to_each')           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   PASO 3                                   │
│              CONDICIÓN 1 - CDP                            │
│                                                            │
│ Expresión:                                                 │
│ contains(items('Apply_to_each')?['Name'], 'CDP')          │
│                                                            │
│           SÍ                    │           NO             │
│           │                     │           │              │
│           ▼                     │           ▼              │
│  ┌───────────────────┐         │  ┌───────────────────┐   │
│  │ RENOMBRAR A CDP   │         │  │   IR A CONDICIÓN  │   │
│  │                   │         │  │       2 - RP      │   │
│  │ Acción: Mover o   │         │  └───────────────────┘   │
│  │ cambiar nombre    │         │                          │
│  │                   │         │                          │
│  │ Archivo:          │         │                          │
│  │ items('Apply_to_  │         │                          │
│  │ each')?['{Full    │         │                          │
│  │ Path}']           │         │                          │
│  │                   │         │                          │
│  │ Nuevo nombre:     │         │                          │
│  │ concat('/SENA/    │         │                          │
│  │ CDFPI/PRESU       │         │                          │
│  │ PUESTO/nuve/      │         │                          │
│  │ ADMIN/nueva/',    │         │                          │
│  │ 'CDP.xlsx')       │         │                          │
│  └───────────────────┘         │                          │
│           │                     │                          │
│           ▼                     │                          │
│     FIN DEL BUCLE              │                          │
└─────────────────────────────────┼──────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   PASO 4                                   │
│              CONDICIÓN 2 - RP                             │
│                                                            │
│ Expresión:                                                 │
│ contains(items('Apply_to_each')?['Name'], 'RP')           │
│                                                            │
│           SÍ                    │           NO             │
│           │                     │           │              │
│           ▼                     │           ▼              │
│  ┌───────────────────┐         │  ┌───────────────────┐   │
│  │ RENOMBRAR A RP    │         │  │   IR A CONDICIÓN  │   │
│  │                   │         │  │     3 - PAGO      │   │
│  │ Acción: Mover o   │         │  └───────────────────┘   │
│  │ cambiar nombre    │         │                          │
│  │                   │         │                          │
│  │ Archivo:          │         │                          │
│  │ items('Apply_to_  │         │                          │
│  │ each')?['{Full    │         │                          │
│  │ Path}']           │         │                          │
│  │                   │         │                          │
│  │ Nuevo nombre:     │         │                          │
│  │ concat('/SENA/    │         │                          │
│  │ CDFPI/PRESU       │         │                          │
│  │ PUESTO/nuve/      │         │                          │
│  │ ADMIN/nueva/',    │         │                          │
│  │ 'RP.xlsx')        │         │                          │
│  └───────────────────┘         │                          │
│           │                     │                          │
│           ▼                     │                          │
│     FIN DEL BUCLE              │                          │
└─────────────────────────────────┼──────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   PASO 5                                   │
│              CONDICIÓN 3 - PAGO                           │
│                                                            │
│ Expresión:                                                 │
│ contains(items('Apply_to_each')?['Name'], 'PAGO')         │
│                                                            │
│           SÍ                    │           NO             │
│           │                     │           │              │
│           ▼                     │           ▼              │
│  ┌───────────────────┐         │  ┌───────────────────┐   │
│  │ RENOMBRAR A OP    │         │  │   NO HACER NADA   │   │
│  │                   │         │  │                   │   │
│  │ Acción: Mover o   │         │  │  (Mantener nombre │   │
│  │ cambiar nombre    │         │  │     original)     │   │
│  │                   │         │  └───────────────────┘   │
│  │ Archivo:          │         │           │              │
│  │ items('Apply_to_  │         │           ▼              │
│  │ each')?['{Full    │         │     FIN DEL BUCLE        │
│  │ Path}']           │         │                          │
│  │                   │         │                          │
│  │ Nuevo nombre:     │         │                          │
│  │ concat('/SENA/    │         │                          │
│  │ CDFPI/PRESU       │         │                          │
│  │ PUESTO/nuve/      │         │                          │
│  │ ADMIN/nueva/',    │         │                          │
│  │ 'OP.xlsx')        │         │                          │
│  └───────────────────┘         │                          │
│           │                     │                          │
│           ▼                     │                          │
│     FIN DEL BUCLE              │                          │
└─────────────────────────────────┼──────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 FIN DEL BUCLE                              │
│            (Aplicar a cada uno)                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 FIN DEL FLUJO                              │
│              [Proceso Completado]                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ PASOS DETALLADOS DE CONFIGURACIÓN

### **PASO 1: Configurar el Desencadenador**
1. **Crear nuevo flujo** → "Flujo de nube automatizado"
2. **Nombre:** "Renombrar Archivos Presupuesto ADMIN"
3. **Desencadenador:** "Activar manualmente un flujo" (para pruebas)
   - O "Periodicidad" (para automatización)

### **PASO 2: Obtener Archivos de la Carpeta**
1. **Agregar nueva acción** → Buscar "SharePoint"
2. **Seleccionar:** "Obtener archivos (propiedades únicamente)"
3. **Configuración:**
   ```
   Dirección del sitio de SharePoint: [Seleccionar tu sitio]
   Biblioteca de documentos: Documents
   Carpeta: /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva
   ```

### **PASO 3: Crear Bucle Para Cada Archivo**
1. **Agregar nueva acción** → Buscar "Control"
2. **Seleccionar:** "Aplicar a cada uno"
3. **Configuración:**
   ```
   Seleccionar una salida de los pasos anteriores: value
   ```

### **PASO 4: Primera Condición (CDP)**
*Dentro del bucle "Aplicar a cada uno":*

1. **Agregar acción** → Buscar "Control"
2. **Seleccionar:** "Condición"
3. **Configuración de la condición:**
   ```
   Lado izquierdo: [Clic en "Expresión"]
   Expresión: contains(items('Apply_to_each')?['Name'], 'CDP')
   Condición: es igual a
   Lado derecho: true
   ```

#### **4.1 Rama SÍ (Contiene CDP):**
1. **Agregar acción** → Buscar "SharePoint"
2. **Seleccionar:** "Mover archivo"
3. **Configuración:**
   ```
   Dirección del sitio de SharePoint: [Tu sitio]
   Biblioteca de documentos: Documents
   Archivo: [Expresión] items('Apply_to_each')?['{FullPath}']
   Carpeta de destino: /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva
   Nuevo nombre: CDP.xlsx
   ```

#### **4.2 Rama NO (No contiene CDP):**
Continuar con la siguiente condición...

### **PASO 5: Segunda Condición (RP)**
*Dentro de la rama NO de la primera condición:*

1. **Agregar acción** → "Condición"
2. **Configuración:**
   ```
   Expresión: contains(items('Apply_to_each')?['Name'], 'RP')
   es igual a: true
   ```

#### **5.1 Rama SÍ (Contiene RP):**
1. **Mover archivo**
2. **Configuración:**
   ```
   Archivo: items('Apply_to_each')?['{FullPath}']
   Nuevo nombre: RP.xlsx
   ```

### **PASO 6: Tercera Condición (PAGO)**
*Dentro de la rama NO de la segunda condición:*

1. **Agregar acción** → "Condición"
2. **Configuración:**
   ```
   Expresión: contains(items('Apply_to_each')?['Name'], 'PAGO')
   es igual a: true
   ```

#### **6.1 Rama SÍ (Contiene PAGO):**
1. **Mover archivo**
2. **Configuración:**
   ```
   Archivo: items('Apply_to_each')?['{FullPath}']
   Nuevo nombre: OP.xlsx
   ```

#### **6.2 Rama NO (No contiene PAGO):**
- **No agregar ninguna acción** (mantener nombre original)

---

## 🔧 EXPRESIONES IMPORTANTES

### **Para referencia del archivo actual:**
```
items('Apply_to_each')?['Name']          // Nombre del archivo
items('Apply_to_each')?['{FullPath}']    // Ruta completa
items('Apply_to_each')?['Id']            // ID del archivo
```

### **Para construir rutas de destino:**
```
concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'CDP.xlsx')
concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'RP.xlsx')
concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'OP.xlsx')
```

### **Para condiciones:**
```
contains(items('Apply_to_each')?['Name'], 'CDP')
contains(items('Apply_to_each')?['Name'], 'RP')
contains(items('Apply_to_each')?['Name'], 'PAGO')
```

---

## ⚙️ CONFIGURACIONES ADICIONALES

### **Configuración de Manejo de Errores:**
1. En cada acción "Mover archivo", clic en "..." → "Configuración"
2. **Configurar ejecución tras error:** Continuar
3. **Tiempo de espera:** 5 minutos

### **Configuración de Concurrencia:**
1. En "Aplicar a cada uno", clic en "..." → "Configuración"
2. **Control de simultaneidad:** Activado
3. **Grado de paralelismo:** 1 (para evitar conflictos)

---

## 📊 RESULTADOS ESPERADOS

| Archivo Original | Archivo Renombrado | Condición |
|------------------|-------------------|-----------|
| LISTADO CDP A 9_06_2025 CIDE.xlsx | CDP.xlsx | Contiene "CDP" |
| LISTADO RP A 9_06_2025 CIDE.xlsx | RP.xlsx | Contiene "RP" |
| LISTADO DE PAGO A 9_06_2025 CIDE.xlsx | OP.xlsx | Contiene "PAGO" |
| EJECUCION PRESUPUESTAL A 9_06_2025.xlsx | [Sin cambios] | No cumple condiciones |

---

## 🚨 CONSIDERACIONES IMPORTANTES

1. **Orden de Prioridad:** CDP → RP → PAGO (en ese orden)
2. **Sobreescritura:** Si ya existe un archivo con el nuevo nombre, el flujo fallará
3. **Permisos:** Necesario permisos de edición en SharePoint
4. **Pruebas:** Ejecutar primero en una carpeta de prueba
5. **Backup:** Hacer respaldo antes de la ejecución masiva

---

## 🧪 PROCESO DE PRUEBA

1. **Crear carpeta de prueba** con archivos de ejemplo
2. **Ejecutar flujo** en modo manual
3. **Verificar resultados** antes de aplicar en producción
4. **Revisar historial de ejecución** para detectar errores

---

**Fecha de creación:** 11 de junio de 2025  
**Versión:** 1.0  
**Estado:** Listo para implementación
