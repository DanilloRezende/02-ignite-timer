// A nomeclatura desta pasta onde utilizamos o "d" para indentificar que dentro desta pasta teremos apenas arquivos de definição de TS 
// tendo assim apenas códigos com TS PURO, totalmente typescript.

import 'styled-components';
import { defaultTheme } from '../styles/themes/default';

//Desta forma eu armazeno dentro de uma variável os valores inferidos dentro do defaultTheme.css
//que são as propriedades que existem neste caso no tema importado dentro de uma nova variável.
type ThemeType = typeof defaultTheme

//criar uma tipagem para o modulo styled components do npm, desta forma 
//toda vez que importar o styled components a tipagem que ele vai 'puxar'
//será a definição declarada aqui para que seja sobrescrito e não feito do zero é importante 
// importar a lib como feito na linha 04
declare module 'styled-components' {
    //simplismente pegamos uma interface que já existe dentro do styled component
    // e extendemos a ela ou seja adicionamos a ela o ThemeType que foi instanciado aqui
    export interface DefaultTheme extends ThemeType{}
}

//Objetivo é basicamente criar "tipagem" para os casos em que não há um já pre definido
//reforçando assim os beneficios que o TS trazem a aplicação
//isto é algo que geralmente só se utiliza com o styled-components e usualmente 1 vez por aplicação