/* eslint-disable prettier/prettier */

import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function DefaultLayout() {
    return (
        <div>
            <Header />            
            <Outlet /> {/* Componente para auxiliar na inserção de um conteudo, uma espécie de espaço definido para se posicionar o conteudo */}
        </div>
    )
}