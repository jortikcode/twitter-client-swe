import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './screens/Homepage'
import Navbar from './components/Navbar'
import SearchPage from './screens/SearchPage';

function App() {
  return (
    <div id="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/search' element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
