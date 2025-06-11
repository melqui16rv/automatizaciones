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

## 📊 DIAGRAMA DE RESULTADOS ESPERADOS

```mermaid
graph LR
    subgraph "Archivos de Entrada"
        A1["LISTADO CDP A 9_06_2025 CIDE.xlsx"]
        A2["LISTADO RP A 9_06_2025 CIDE.xlsx"]
        A3["LISTADO DE PAGO A 9_06_2025 CIDE.xlsx"]
        A4["EJECUCION PRESUPUESTAL A 9_06_2025.xlsx"]
        A5["informe CDP mensual.xlsx"]
        A6["reporte RP trimestral.xlsx"]
        A7["orden de PAGO especial.xlsx"]
    end
    
    subgraph "Procesamiento"
        B[Power Automate<br/>Flujo de Renombrado]
    end
    
    subgraph "Archivos de Salida"
        C1["CDP.xlsx"]
        C2["RP.xlsx"] 
        C3["OP.xlsx"]
        C4["EJECUCION PRESUPUESTAL A 9_06_2025.xlsx"]
        C5["CDP.xlsx"]
        C6["RP.xlsx"]
        C7["OP.xlsx"]
    end
    
    A1 --> B
    A2 --> B
    A3 --> B
    A4 --> B
    A5 --> B
    A6 --> B
    A7 --> B
    
    B --> C1
    B --> C2
    B --> C3
    B --> C4
    B --> C5
    B --> C6
    B --> C7
    
    classDef input fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef process fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
    classDef output fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef unchanged fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    
    class A1,A2,A3,A4,A5,A6,A7 input
    class B process
    class C1,C2,C3,C5,C6,C7 output
    class C4 unchanged
```

---

## ⚙️ CONFIGURACIONES AVANZADAS OneDrive

### **Configuración de Manejo de Errores:**
```mermaid
graph TD
    A[Acción: Mover archivo] --> B{¿Error al mover?}
    B -->|SÍ| C[Registrar en variable de error]
    B -->|NO| D[Continuar con siguiente archivo]
    C --> E[Enviar notificación de error]
    E --> F[Continuar flujo]
    D --> F
    F --> G[Siguiente iteración]
    
    classDef error fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    classDef success fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef process fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    
    class C,E error
    class D,F,G success
    class A,B process
```

### **Configuración de Concurrencia:**
1. En "Aplicar a cada uno", clic en "..." → "Configuración"
2. **Control de simultaneidad:** Activado
3. **Grado de paralelismo:** 1 (para evitar conflictos en OneDrive)

### **Configuración de Tiempo de Espera:**
- **Tiempo de espera:** 5 minutos por archivo
- **Reintentos:** 3 intentos en caso de fallo
- **Intervalo entre reintentos:** 30 segundos

---

## 🚨 CONSIDERACIONES IMPORTANTES OneDrive

```mermaid
mindmap
  root((Consideraciones OneDrive))
    Permisos
      Acceso a carpeta OneDrive
      Permisos de escritura
      Autenticación corporativa
    Conflictos
      Archivos duplicados
      Nombres existentes
      Sincronización
    Performance
      Límites de API OneDrive
      Tiempo de respuesta
      Concurrencia limitada
    Backup
      Papelera de reciclaje
      Versiones de archivo
      Restore automático
```

### **Puntos Críticos:**
1. **Orden de Prioridad:** CDP → RP → PAGO (evaluación secuencial)
2. **Sobreescritura:** OneDrive puede mantener versiones anteriores
3. **Permisos:** Necesario acceso completo a la carpeta OneDrive
4. **Límites:** API de OneDrive tiene limitaciones de velocidad
5. **Backup:** OneDrive mantiene papelera de reciclaje automática

---

## 🧪 PROCESO DE PRUEBA Y VALIDACIÓN

```mermaid
graph TD
    A[Preparar Entorno de Prueba] --> B[Crear Carpeta Test]
    B --> C[Copiar Archivos de Muestra]
    C --> D[Ejecutar Flujo en Modo Manual]
    D --> E{¿Resultados Correctos?}
    E -->|SÍ| F[Ejecutar en Carpeta Real]
    E -->|NO| G[Revisar y Corregir]
    G --> H[Ajustar Expresiones]
    H --> D
    F --> I[Monitorear Ejecución]
    I --> J[Validar Resultados Finales]
    J --> K[Documentar y Finalizar]
    
    classDef prep fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef test fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef success fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef error fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    
    class A,B,C prep
    class D,E,I,J test
    class F,K success
    class G,H error
```

### **Lista de Verificación de Pruebas:**
- [ ] Crear carpeta `/test/ADMIN/nueva` en OneDrive
- [ ] Subir archivos de prueba con diferentes patrones de nombres
- [ ] Ejecutar flujo manualmente
- [ ] Verificar que archivos se renombren correctamente
- [ ] Comprobar que archivos sin patrones se mantengan iguales
- [ ] Revisar logs de ejecución en Power Automate
- [ ] Confirmar que no hay errores de permisos
- [ ] Validar manejo de archivos duplicados

---

## 📈 MONITOREO Y MÉTRICAS

```mermaid
graph LR
    subgraph "Métricas de Ejecución"
        A[Archivos Procesados]
        B[Archivos Renombrados]
        C[Errores Encontrados]
        D[Tiempo de Ejecución]
    end
    
    subgraph "Alertas"
        E[Fallos de Conexión]
        F[Permisos Denegados]
        G[Archivos Bloqueados]
        H[Límites de API]
    end
    
    A --> I[Dashboard Power BI]
    B --> I
    C --> I
    D --> I
    
    E --> J[Notificaciones Teams]
    F --> J
    G --> J
    H --> J
    
    classDef metric fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef alert fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    classDef output fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    
    class A,B,C,D metric
    class E,F,G,H alert
    class I,J output
```

---

## 🔄 DIAGRAMA DE ARQUITECTURA DEL FLUJO

```mermaid
graph TB
    subgraph "Power Automate Cloud"
        A[Desencadenador Manual/Programado]
        B[Conector OneDrive]
        C[Bucle Apply to Each]
        D[Lógica de Condiciones]
        E[Acciones de Renombrado]
    end
    
    subgraph "OneDrive para la Empresa"
        F[Carpeta ADMIN/nueva]
        G[Archivos de Entrada]
        H[Archivos Procesados]
    end
    
    subgraph "Monitoreo"
        I[Logs de Ejecución]
        J[Alertas y Notificaciones]
        K[Métricas de Performance]
    end
    
    A --> B
    B --> F
    F --> G
    G --> C
    C --> D
    D --> E
    E --> H
    
    C --> I
    D --> I
    E --> I
    
    I --> J
    I --> K
    
    classDef powerAutomate fill:#0078d4,color:#ffffff,stroke:#005a9e,stroke-width:2px
    classDef oneDrive fill:#0078d4,color:#ffffff,stroke:#005a9e,stroke-width:2px
    classDef monitoring fill:#107c10,color:#ffffff,stroke:#0b6a0b,stroke-width:2px
    
    class A,B,C,D,E powerAutomate
    class F,G,H oneDrive
    class I,J,K monitoring
```

---

## 📊 TABLA DE RESULTADOS ESPERADOS

| Archivo Original | Archivo Renombrado | Condición Aplicada | Estado |
|------------------|-------------------|-------------------|---------|
| LISTADO CDP A 9_06_2025 CIDE.xlsx | CDP.xlsx | Contiene "CDP" | ✅ Renombrado |
| LISTADO RP A 9_06_2025 CIDE.xlsx | RP.xlsx | Contiene "RP" | ✅ Renombrado |
| LISTADO DE PAGO A 9_06_2025 CIDE.xlsx | OP.xlsx | Contiene "PAGO" | ✅ Renombrado |
| EJECUCION PRESUPUESTAL A 9_06_2025.xlsx | [Sin cambios] | No cumple condiciones | ⚪ Mantenido |
| informe CDP mensual.xlsx | CDP.xlsx | Contiene "CDP" | ✅ Renombrado |
| reporte RP trimestral.xlsx | RP.xlsx | Contiene "RP" | ✅ Renombrado |
| orden de PAGO especial.xlsx | OP.xlsx | Contiene "PAGO" | ✅ Renombrado |
| análisis financiero.xlsx | [Sin cambios] | No cumple condiciones | ⚪ Mantenido |

---

## 🎯 FLUJO COMPLETO RESUMIDO

```mermaid
flowchart LR
    A[📁 OneDrive<br/>Carpeta ADMIN] --> B[🔄 Power Automate<br/>Flujo Automatizado]
    B --> C{🔍 Evaluar Nombres}
    
    C -->|CDP| D[📝 CDP.xlsx]
    C -->|RP| E[📝 RP.xlsx]
    C -->|PAGO| F[📝 OP.xlsx]
    C -->|Otros| G[📄 Sin cambios]
    
    D --> H[✅ Completado]
    E --> H
    F --> H
    G --> H
    
    classDef source fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    classDef processor fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
    classDef decision fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef success fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef neutral fill:#fafafa,stroke:#616161,stroke-width:2px
    classDef complete fill:#e1f5fe,stroke:#0277bd,stroke-width:3px
    
    class A source
    class B processor
    class C decision
    class D,E,F success
    class G neutral
    class H complete
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Antes de Implementar:**
- [ ] ✅ Verificar permisos de OneDrive para la Empresa
- [ ] ✅ Confirmar acceso a la carpeta `/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva`
- [ ] ✅ Crear carpeta de prueba para validación
- [ ] ✅ Preparar archivos de muestra con nombres representativos
- [ ] ✅ Configurar autenticación en Power Automate

### **Durante la Implementación:**
- [ ] ⚡ Crear el flujo con el desencadenador manual
- [ ] ⚡ Configurar conector OneDrive para la Empresa
- [ ] ⚡ Agregar acción "Enumerar archivos de la carpeta"
- [ ] ⚡ Configurar bucle "Aplicar a cada uno"
- [ ] ⚡ Implementar condiciones anidadas (CDP → RP → PAGO)
- [ ] ⚡ Configurar acciones de "Mover archivo" para cada condición
- [ ] ⚡ Establecer configuraciones de error y concurrencia

### **Después de Implementar:**
- [ ] 🧪 Ejecutar pruebas en carpeta de test
- [ ] 🧪 Validar que todos los archivos se procesen correctamente
- [ ] 🧪 Verificar manejo de errores y casos límite
- [ ] 🧪 Comprobar logs de ejecución
- [ ] 📊 Configurar monitoreo y alertas
- [ ] 📚 Documentar procedimiento para usuarios finales

---

**📅 Fecha de creación:** 11 de junio de 2025  
**📊 Versión:** 2.0 (Actualizada para OneDrive + Diagramas Mermaid)  
**✅ Estado:** Listo para implementación  
**👨‍💻 Autor:** Documentación técnica Power Automate  
**🔧 Tecnologías:** Power Automate, OneDrive para la Empresa, Mermaid Diagrams
