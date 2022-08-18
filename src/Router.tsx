/* eslint-disable prettier/prettier */
import { Routes, Route } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { History } from './pages/History'
import { Home } from './pages/Home'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}> {/* Ao ser colocado numa TAG que envolve as outras paginas e utilizar o path"/" este layout é aplicado em todas as rotas */}
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  )
}
