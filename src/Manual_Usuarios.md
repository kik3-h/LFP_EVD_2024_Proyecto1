Universidad de San Carlos de Guatemala.

Facultad de Ingenieria en Ciencias y Sistemas.

Escuela de Vacaciones de Diciembre 2024

Lenguajes Formales y de Programación

Ingeniera Mariana Sic

Auxiliar Elder Pum

Estudiante: ENRIQUE ALEXANDEER TEBALAN HERNANDEZ    3160499720903

Carnet: 202230026

PROYECTO 1

ESCANER LEXICO Y PROCESADOR NUMERICO CON NODE.js

# Manual de Usuario
---

# Introduccion

El presente documento es el manual de usuario para el programa de análisis léxico desarrollado en JavaScript. Este programa implementa un Automata Finito Determinista (AFD) para analizar un archivo de entrada, identificar tokens válidos, detectar errores léxicos y generar reportes.

    CLONAR EL REPOSITORIO DE GITHUB EN UNA CARPETA LOCAL

# Funcionalidades del programa

    1. Reconocimiento de Tokens

        El programa identifica los siguientes tipos de tokens:

        Identificadores: Secuencias de caracteres alfabéticos seguidas opcionalmente por números (ejemplo: variable1).

        Números: Números enteros y decimales (ejemplo: 123, 45.67).

        Cadenas: Texto encerrado entre comillas simples o dobles (ejemplo: "texto", 'cadena').

        Símbolos Especiales: Caracteres como {}, [], (), :, +, -, *, /.

    2. Palabras Reservadas

        El programa reconoce palabras reservadas definidas para el lenguaje, como:
        if, else, while, for, function, return, true, false, etc.

    3. Detección de Errores Léxicos

        El programa detecta errores como:

        Caracteres no reconocidos.

        Uso incorrecto de caracteres especiales.

        Números negativos en contextos no permitidos.

    4 Generación de Reportes

        El programa genera:

        Reporte de Tokens: Lista de todos los tokens reconocidos.

        Reporte de Errores: Detalles de los errores léxicos detectados.

        Automata Visual: Representación gráfica del AFD en formato DOT y PNG.

### Requisitos Para Uso Del Programa

    1. Requisitos Previos

        Tener instalado Node.js y Graphviz.

        Un archivo de entrada en formato JSON que contenga el texto a analizar.

    2. Ejecución del Programa

        Ejecuta el programa en la terminal: src/node menu.js

        Selecciona una opción del menú principal:

            1. Abrir archivo JSON: Carga el archivo de entrada.

            2. Analizar el archivo: Realiza el análisis léxico.

            3. Mostrar errores: Muestra los errores detectados.

            4. Generar reportes: Genera los reportes y diagramas correspondientes.

            0. Salir: Cierra el programa.

### Generación de Reportes

    Los reportes se almacenan en la carpeta reports:
    tokens.html: Tabla con los tokens reconocidos.
    errors.html: Tabla con los errores léxicos detectados.
    operations.dot y graph.png: Representación del AFD.
    Compilación de Diagramas
    Usa el archivo operations.dot para generar un diagrama en PNG:
    dot -Tpng reports/operations.dot -o reports/graph.png

### Ejemplo de Entrada y Salida
    {
   "operaciones": [
      {
	"operacion": "suma",
	"valor1": 4.5,
	"valor2": 5.32
},
{
	"resta": "ll",
	"operacion": "suma",
	"valor1": -2,
	"valor2": 5.32
},
	  {
	"operacion": "division",
	"valor1": 8,
	"valor2": 2
}

### Solucion de problemas

    Error: Archivo no encontrado
    Verifica que la ruta del archivo JSON es correcta.

    Error: No se generan reportes
    Asegúrate de haber analizado el archivo antes de intentar generar reportes.

    Error: No se encuentra dot
    Instala Graphviz y asegúrate de que está en tu PATH del sistema.

### PASOS A SEGUIR SEGUN LA INTERFAZ DEL PROGRAMA

### Menú
El menú es el apartado principal de programa, el ususario puede interactuar por medio de acciones escogidas como **Cargar un Archivo**, **Analizar un Archivo**, **Generar un Archivo de Errores**, **Reportes** y **Salir**.

![CARPETA INCIAL](/Imagenes/1.png "menu principal")
    click derecho y aperturar esa carpeta en la terminal

![TERMINAL](/Imagenes/2.png "terminal")
    Ingresas el comando Node Menu.js

![MENU PRINCIPAL](/Imagenes/3.png "Menu Principal")
    Te aparecera el menu interactico para que eligas la opcion que gustes

![ABRIR ARCHIVO](/Imagenes/4.png "Opcion 1")
    si ingresaste correctamente la ruta te aparecera el mensaje de confirmacion, sino mueve el archivo json a la carpeta /src

![ANALIZAR ARCHIVO](/Imagenes/5.png "Opcion 2")
    Te mostrara todo el contenido del archivo .json

![MOSTRAR ERRORES](/Imagenes/6.png "Opcion 3")
    Te mostrara todos los errores posibles dentro del archivo,segun las palabras reservadas y el AFD

![GENERAR REPORTES](/Imagenes/7.png "Opcion 4")
    Te mostrara el mensaje de confirmacion de la creacion del reporte asi como las rutas de acceso donde se guardaron

![GENERAR REPORTES](/Imagenes/8.png "Opcion 0")
    Te mostrara el mensaje de confirmacion de salida enviandote al inicio de Terminal

### Cargar un Archivo
    En este apartado se mostraran todos los archivos de extension JSON que tenemos para realizar una lextura, se enlistan y se escogen por medio de un número.

### Analizar un Archivo
    Analiza un archivo previamente cargado, si aún no existe un archivo cargado se mostrar el mensaje que no se realizara el Analisis. Si existe un archivo se mostraran los mensajes de Alizando y cuando el Analisis  termine.

### Generar un Archivo de Errores
    Crea un archivo llamado errors donde se guardan los errores encontrado en un una estructura descriptiva, si no se ha realizado un analisis antes entonces el archivo no se generará.


### Reporte
    dentro de la carpeta /src/reports encontraras los reportes generados por el programa
        Generar los un html donde se muestran las tablas de los lexemas y los errores si hubieran, tambien se encarga de generar un archivo de extension .dot el cual sirve para generar una imágen por graphviz utilizando las configuras del archivo que lee y devolviendo las respuestas a las operaciones dentro de la imágen.
![Tabla Simbolos](/Imagenes/ReportTokens.png "lexemas")
![Tabla Errores](/Imagenes/ReportErrors.png "errores")
![Grafica de Árbol](/Imagenes/ReportResults.png "Resultados y grafos")

### Salir

    Con esta opción el usuario sale cierra el programa.
