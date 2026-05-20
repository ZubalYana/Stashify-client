import './App.css'
import { Route, Routes } from 'react-router-dom'
import SideMenu from './components/functionalElements/SideMenu'

function App() {

  return (
    <div className='w-full'>
    <Routes>
      <Route path='/' element={<SideMenu/>}/>
    </Routes>
    </div>
  )
}

export default App
