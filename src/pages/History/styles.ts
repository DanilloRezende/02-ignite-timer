/* eslint-disable prettier/prettier */
import styled from "styled-components";

export const HistoryContainer = styled.main`
    flex: 1;
    padding: 3.5rem;

    display: flex;
    flex-direction: column;

    h1{
        font-size: 1.5rem;
        color: ${(props) => props.theme["gray-100"]}
    }
`

export const HistoryList = styled.main`
    flex: 1;
    overflow: auto;
    margin-top: 2rem;

    table{
        width: 100%;
        border-collapse: collapse;//ele uni a borda de elementos que estão lado a lado
        min-width: 600px; //força a gerar o scrool com tamanho mendor

        th{
            background-color: ${(props) => props.theme["gray-600"]};
            padding: 1rem;
            text-align: left;
            color: ${(props) => props.theme["gray-100"]};
            font-size: 0.875rem;
            line-height: 1.6;

            //arredondar as bordas superiores
            &:first-child{ 
                border-top-left-radius: 8px;
                padding-left: 1.5rem;
            }

            &:last-child{
                border-top-right-radius: 8px;
                padding-right: 1.5rem;
            }
        }

        td {
            background-color: ${(props) => props.theme["gray-700"]};
            border-top: 4px solid ${(props) => props.theme["gray-800"]};
            padding: 1rem;
            font-size: 0.875rem;
            line-height: 1.6;

            &:first-child{ 
                width: 50%;
                padding-left: 1.5rem;
            }

            &:last-child{
                padding-right: 1.5rem;
            }
        }       
    }
`

// criamos a seguinte cons para interarmos e definir EXATAMENTE qual os valores atribuidos aos elementos do objeto.
const STATUS_COLOR = {
    yellow: 'yellow-500',
    green: 'green-500',
    red: 'red-500',
} as const 
// ao instanciar o objeto ele é "tipado" de uma forma que 3 elementos podem ser strings quaisqueres kkkk, ao reforçarmos novamente pelo "as const" estamos dizendo que serão strings mas exatamente coms os valores que foram colocados.
 
// Criamos uma interface para por meio do <generic> passar a "tipagem" ao nosso span 
interface StatusProps {
    statusColor: keyof typeof STATUS_COLOR;
}

export const Status = styled.span<StatusProps>`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before{  //Before e after são elementos que ficam dentro da tag no começo ou final de qualquer conteudo
        content:''; //devemos colocar este conteudo em branco mesmo para ser renderizado 
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 9999px;
        background: ${props => props.theme[STATUS_COLOR[props.statusColor]]}
    }
`
