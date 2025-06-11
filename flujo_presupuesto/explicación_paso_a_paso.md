# Flujo de Power Automate: Renombrado Automático de Archivos

## Objetivo
Automatizar el cambio de nombres de archivos en una carpeta específica basándose en palabras clave contenidas en el nombre original.

## Reglas de Renombrado
- Si el archivo contiene "CDP" → cambiar nombre a "CDP.xlsx"
- Si el archivo contiene "RP" → cambiar nombre a "RP.xlsx"  
- Si el archivo contiene "PAGO" → cambiar nombre a "OP.xlsx"
- Si no cumple ninguna condición → mantener nombre original

## Estructura del Flujo

### 1. Obtener Archivos de la Carpeta
```
Acción: "Listar archivos de carpeta"
Carpeta: /SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva
```

### 2. Iterar Sobre Cada Archivo
```
Acción: "Aplicar a cada uno"
Entrada: value (lista de archivos del paso anterior)
```

### 3. Lógica de Evaluación de Nombres
Dentro del bucle "Aplicar a cada uno", agregar una acción **Condición** con la siguiente estructura:

#### Condición Principal: Verificar si contiene "CDP"
```
Condición: contains(items('Aplicar_a_cada_uno')?['Name'], 'CDP')
```

**SI es VERDADERO (contiene CDP):**
- Acción: "Mover un archivo o cambiar su nombre mediante una ruta de acceso"
- Ruta del archivo: `items('Aplicar_a_cada_uno')?['{FullPath}']`
- Ruta de destino: `concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'CDP.xlsx')`

**SI es FALSO (no contiene CDP):**
Agregar otra condición anidada:

#### Condición Secundaria: Verificar si contiene "RP"
```
Condición: contains(items('Aplicar_a_cada_uno')?['Name'], 'RP')
```

**SI es VERDADERO (contiene RP):**
- Acción: "Mover un archivo o cambiar su nombre mediante una ruta de acceso"
- Ruta del archivo: `items('Aplicar_a_cada_uno')?['{FullPath}']`
- Ruta de destino: `concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'RP.xlsx')`

**SI es FALSO (no contiene RP):**
Agregar tercera condición anidada:

#### Condición Terciaria: Verificar si contiene "PAGO"
```
Condición: contains(items('Aplicar_a_cada_uno')?['Name'], 'PAGO')
```

**SI es VERDADERO (contiene PAGO):**
- Acción: "Mover un archivo o cambiar su nombre mediante una ruta de acceso"
- Ruta del archivo: `items('Aplicar_a_cada_uno')?['{FullPath}']`
- Ruta de destino: `concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'OP.xlsx')`

**SI es FALSO (no contiene PAGO):**
- No hacer nada (mantener nombre original)

## Alternativa Mejorada: Usando Switch

Una forma más elegante es usar la acción **Switch** en lugar de condiciones anidadas:

### 1. Crear Variable para Determinar Tipo
```
Acción: "Inicializar variable"
Nombre: tipoArchivo
Tipo: Cadena
Valor: if(contains(items('Aplicar_a_cada_uno')?['Name'], 'CDP'), 'CDP', 
        if(contains(items('Aplicar_a_cada_uno')?['Name'], 'RP'), 'RP',
        if(contains(items('Aplicar_a_cada_uno')?['Name'], 'PAGO'), 'PAGO', 'OTRO')))
```

### 2. Usar Switch para Manejar Casos
```
Acción: "Switch"
En: variables('tipoArchivo')

Caso CDP:
  - Mover archivo a: CDP.xlsx
  
Caso RP:
  - Mover archivo a: RP.xlsx
  
Caso PAGO:
  - Mover archivo a: OP.xlsx
  
Caso predeterminado:
  - No hacer nada
```

## Expresiones Útiles

### Para obtener solo el nombre del archivo:
```
items('Aplicar_a_cada_uno')?['Name']
```

### Para obtener la ruta completa:
```
items('Aplicar_a_cada_uno')?['{FullPath}']
```

### Para construir nueva ruta:
```
concat('/SENA/CDFPI/PRESUPUESTO/nuve/ADMIN/nueva/', 'NUEVO_NOMBRE.xlsx')
```

### Para verificar múltiples condiciones:
```
if(contains(variables('nombreArchivo'), 'CDP'), 'CDP',
   if(contains(variables('nombreArchivo'), 'RP'), 'RP',
      if(contains(variables('nombreArchivo'), 'PAGO'), 'PAGO', 'OTRO')))
```

## Ejemplos de Transformación

| Nombre Original | Nuevo Nombre |
|----------------|--------------|
| EJECUCION PRESUPUESTAL A 9_06_2025 CIDE.xlsx | EJECUCION PRESUPUESTAL A 9_06_2025 CIDE.xlsx |
| EJECUCION PRESUPUESTAL AGREGADA A 9_06_2025 CIDE.xlsx | EJECUCION PRESUPUESTAL AGREGADA A 9_06_2025 CIDE.xlsx |
| LISTADO CDP A 9_06_2025 CIDE.xlsx | CDP.xlsx |
| LISTADO DE PAGO A 9_06_2025 CIDE.xlsx | OP.xlsx |
| LISTADO RP A 9_06_2025 CIDE.xlsx | RP.xlsx |

## Consideraciones Importantes

1. **Orden de Evaluación**: El flujo evalúa en este orden: CDP → RP → PAGO
2. **Sobreescritura**: Si ya existe un archivo con el nuevo nombre, Power Automate preguntará o fallará
3. **Permisos**: Asegúrate de tener permisos de escritura en la carpeta
4. **Backup**: Considera hacer respaldo antes de ejecutar el flujo masivamente

## Flujo Recomendado Final

1. **Listar archivos de carpeta**
2. **Aplicar a cada uno** (sobre la lista de archivos)
3. **Condición**: `contains(items('Aplicar_a_cada_uno')?['Name'], 'CDP')`
   - **Sí**: Renombrar a "CDP.xlsx"
   - **No**: 
     4. **Condición**: `contains(items('Aplicar_a_cada_uno')?['Name'], 'RP')`
        - **Sí**: Renombrar a "RP.xlsx"  
        - **No**:
          5. **Condición**: `contains(items('Aplicar_a_cada_uno')?['Name'], 'PAGO')`
             - **Sí**: Renombrar a "OP.xlsx"
             - **No**: No hacer nada

Este enfoque es más fácil de entender y mantener que usar expresiones complejas anidadas.