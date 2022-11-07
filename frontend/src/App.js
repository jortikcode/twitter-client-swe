
import { Route, Routes } from 'react-router-dom';
import Homepage from './screens/Homepage'
import Navbar from './components/Navbar'
import SearchForm from './screens/SearchForm';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/search' element={<SearchForm />} />
      </Routes>
    </>
  );
}

export default App;
