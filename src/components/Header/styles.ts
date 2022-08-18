/* eslint-disable prettier/prettier */
import styled from 'styled-components'

export const HeaderContainer = styled.header`
display: flex;
align-items: center;
justify-content: space-between;

nav {
    display: flex;
    gap: 0.5rem;
    
    a{
        width: 3rem;
        height: 3rem;

        display: flex;
        justify-content: center;
        align-items: center;

        color: ${(props) => props.theme['gray-100']};

        border-top: 3px solid transparent;//para que o icone fique centralizado pois foi inserido borda abaixo para
        border-bottom: 3px solid transparent;//utilizado apra que ao aplicar o efeito de hover não haja o deslocamento para cima do icone

        &:hover {
            border-bottom: 3px solid ${(props) => props.theme['green-500']}
        }

        &.active {
            color: ${(props) => props.theme['green-500']}
        }
    }
}
`