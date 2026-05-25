import './App.css'
import { Route, Routes } from 'react-router-dom'
import MenuLayout from './components/functionalElements/MenuLayout'
import AllSnippets from './components/pages/AllSnippets';
import Collections from './components/pages/Collections';
import Projects from './components/pages/Projects';
import Auth from './components/pages/Auth';

function App() {
  return (
    <div className='w-full'>
    <Routes>
      <Route path='/' element={<MenuLayout><AllSnippets/></MenuLayout>}/>
      <Route path='/collections' element={<MenuLayout><Collections/></MenuLayout>}/>
      <Route path='/projects' element={<MenuLayout><Projects/></MenuLayout>}/>
      <Route path='/auth' element={<Auth/>}/>
    </Routes>
    </div>
  )
}

export default App
