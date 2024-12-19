const Token = require('./token'); //importa la clase token 
const Error = require('./Error'); //importa la clase error

class AFD {
    constructor() { //creo mi constructor
        this.tokens = []; //array de tokens 
        this.errors = []; //array de errores
        this.currentLine = 1;  //linea actual
        this.currentColumn = 1; //columna actual
    }

    analyze(input) { //el metodo el cual se encarga de analizar el input de los tokens y errores en el archivo
        let state = 0; // Estado inicial
        let buffer = ''; // Buffer para almacenar los caracteres
        let line = this.currentLine; //
        let column = this.currentColumn; // Columna actual

        for (let i = 0; i < input.length; i++) { //recorre el input
            const char = input[i]; //caracter actual

            // Manejar saltos de línea
            if (char === '\n') { //si el caracter es un salto de linea
                this.currentLine++; //aumenta la linea
                this.currentColumn = 1; //columna actual es 1
                continue; //continua
            }

            // Manejar espacios y tabulaciones
            if (char === ' ' || char === '\t') { //si el caracter es un espacio o tabulacion
                this.currentColumn++; //aumenta la columna
                continue;
            }
                //tipos de casos segun el estado inicial y los caracteres que se encuentren
            
            switch (state) { 
                case 0: // Estado inicial
                    if (/[a-zA-Z]/.test(char)) { //si el caracter es una letra
                        buffer += char; //se agrega al buffer
                        state = 1; // Identificadores o palabras reservadas
                    } else if (/\d/.test(char)) {
                        buffer += char;
                        state = 2; // Números
                    } else if (char === '"' || char === "'") { //si el caracter es comillas dobles o comillas simples
                        buffer += char;
                        state = 3; // Cadenas de texto
                    } else if (char === ':') { //si el caracter es dos puntos
                        this.tokens.push(new Token('Dos puntos', char, line, this.currentColumn)); //se agrega al array de tokens el token de dos puntos
                    } else if (/[{},\[\]]/.test(char)) { //si el caracter es llaves, corchetes o coma
                        this.tokens.push(new Token('Símbolo JSON', char, line, this.currentColumn)); //se agrega al array de tokens el token de simbolo JSON
                    } else if (char.trim() === '') { // Ignorar espacios en blanco
                        // Ignorar espacios en blanco
                    } else {
                        this.errors.push(new Error(char, 'Carácter no reconocido', line, this.currentColumn));
                    }
                break;

                case 1: // Identificadores o palabras reservadas
                    if (/[a-zA-Z0-9]/.test(char)) { //si el caracter es una letra o numero
                        buffer += char; //se agrega al buffer
                    } else {
                        this.addToken(buffer, line, column); //se agrega al token
                        buffer = ''; // Limpiar el buffer
                        state = 0; // Regresar al estado inicial
                        i--; // Reprocesar el carácter actual
                    }
                    break;

                case 2: // Números
                    if (/\d/.test(char) || char === '.') { //si el caracter es un numero o un punto 
                        buffer += char; //se agrega al buffer
                    } else {
                        this.tokens.push(new Token('Número', buffer, line, column)); //se agrega al token de numero al array de tokens 
                        buffer = ''; // Limpiar el buffer 
                        state = 0; // Regresar al estado inicial
                        i--; // Reprocesar el carácter actual
                    }
                    break;

                case 3: // Cadenas de texto
                    buffer += char;
                    if (char === '"' || char === "'") { //si el caracter es comillas dobles o comillas simples
                        this.tokens.push(new Token('Cadena', buffer, line, column));//se agrega al token de cadena al array de tokens
                        buffer = '';
                        state = 0; // Regresar al estado inicial
                    }
                break;

                default:
                    this.errors.push(new Error(char, 'Estado desconocido', line, this.currentColumn)); //si no es ninguno de los anteriores se agrega un error
            }

            this.currentColumn++; // Aumentar la columna actual al final de cada iteración del bucle for 
        }

        // Procesar el buffer al final
        if (buffer.length > 0) { //si el buffer tiene algo
            if (state === 1) this.addToken(buffer, line, column); //si el estado es 1 se agrega al token de identificador o palabra reservada al array de tokens 
            else if (state === 2) this.tokens.push(new Token('Número', buffer, line, column)); //si el estado es 2 se agrega al token de numero al array de tokens 
        }
    }

    addToken(value, line, column) { //metodo para agregar tokens de identificadores o palabras reservadas al array de tokens    
        const reservedWords = ['if', 'else', 'while', 'for', 'function', 'return', 'let', 'const', 'true', 'false']; //palabras reservadas en el lenguaje   
        const type = reservedWords.includes(value) ? 'Palabra reservada' : 'Identificador'; //si el valor esta en las palabras reservadas se le asigna el tipo de palabra reservada, si no se le asigna el tipo de identificador 
        this.tokens.push(new Token(type, value, line, column)); //se agrega al array de tokens    
    }

    getTokens() { //metodo para obtener los tokens del array de tokens 
        return this.tokens; //retorna los tokens 
    }

    getErrors() { //metodo para obtener los errores del array de errores 
        return this.errors; //retorna los errores 
    }
}
module.exports = AFD; //exporta la clase AFD 