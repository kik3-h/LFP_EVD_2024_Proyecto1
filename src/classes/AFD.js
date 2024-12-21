// src/classes/AFD.js
class AFD {
    constructor() {
        this.tokens = [];
        this.errors = [];
        this.contadorErrores = 0;
    }
    
    analyze(input) { // Método para analizar el código fuente
        let state = 0; // Estado inicial
        let buffer = ''; // Buffer para almacenar los caracteres
        let line = 1; // Contador de líneas
        let column = 1; // Contador de columnas
        

        for (let i = 0; i < input.length; i++) { // Recorrer el código fuente caracter por caracter 
            const char = input[i]; // Obtener el caracter actual

            if (char === '\n') { // Si el caracter es un salto de línea
                line++;
                column = 1;
                continue;
            }

            if (char.trim() === '') { // Si el caracter es un espacio en blanco
                column++;
                continue;
            }

            switch (state) { // Evaluar el estado actual del autómata finito determinista kjaskda
                case 0:
                    if (/[a-zA-Z]/.test(char)) { // Si el caracter es una letra del alfabeto (ojo que la ñ no existe aca)
                        //si el caracter es una ñ se agrega a la lista de errores 
                        if(char === 'ñ' || char === 'Ñ' || char === 'll' || char === 'LL'){
                            this.contadorErrores++;
                            this.errors.push({ value: char, description: 'Error léxico', line, column });
                            }else {
                                buffer += char;
                                state = 1;
                            }
                    } else if (/\d/.test(char)) { // Si el caracter es un número
                        //si el numero es menor a cero detectar como error o si tiene un signo menor antes del numero
                        if(char < 0 || char === '-'){
                            this.contadorErrores++;
                            this.errors.push({ value: char, description: 'Error léxico en dígitos', line, column });
                        }else{
                        buffer += char;
                        state = 2;
                    }
                    } else if (/[{}[\]():,+\-*/]/.test(char)) { // Si el caracter es un símbolo especial
                        this.tokens.push({ type: 'Símbolo', value: char, line, column }); // Agregar el token a la lista de tokens
                    } else if (char === '"' || char === "'") { // Si el caracter es una comilla doble o simple (para cadenas de texto jsjs)
                        buffer += char; // Agregar el caracter al buffer
                        state = 3;
                    } else {
                        this.contadorErrores++;
                        this.errors.push({ value: char, description: 'Carácter no reconocido', line, column }); // Agregar el error a la lista de errores
                    }
                    break;

                case 1: // Identificadores
                    if (/[a-zA-Z0-9]/.test(char)) { // Si el caracter es una letra o número (ojo que la ñ no existe aca)
                        buffer += char;
                    } else {
                        this.tokens.push({ type: 'Identificador', value: buffer, line, column });
                        buffer = '';
                        state = 0;
                        i--;
                    }
                    break;

                case 2: // Números
                    if (/\d/.test(char) || char === '.') { // Si el caracter es un número o un punto 
                        buffer += char;
                    } else {
                        this.tokens.push({ type: 'Número', value: buffer, line, column }); // Agregar el token a la lista de tokens
                        buffer = '';
                        state = 0;
                        i--;
                    }
                    break;

                case 3: // Cadenas
                    buffer += char;
                    if (char === '"' || char === "'") { // Si el caracter es una comilla doble o simple 
                        this.tokens.push({ type: 'Cadena', value: buffer, line, column });
                        buffer = '';
                        state = 0;
                    }
                    break;
            }

            column++;
        }

        if (buffer) { // Si el buffer no está vacío
            if (state === 1) {
                this.tokens.push({ type: 'Identificador', value: buffer, line, column }); // Agregar el token a la lista de tokens
            }else if (state === 2) {
                    this.tokens.push({ type: 'Número', value: buffer, line, column }); // Agregar el token a la lista de tokens
            }else if (state === 3) {
                this.tokens.push({ type: 'Cadena', value: buffer, line, column }); // Agregar el token a la lista de tokens
            }else{
                this.contadorErrores++;
                this.errors.push({ value: buffer, description: 'Carácteres no reconocidos', line, column }); // Agregar el error a la lista de errores
            }
        }
    }

    getTokens() {
        return this.tokens;
    }

    getErrors() {
        return this.errors;
    }

    getContadorErrores(){
        return this.contadorErrores;
    }
}

module.exports = AFD;