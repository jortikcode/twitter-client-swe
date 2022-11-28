import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './screens/Homepage'
import Navbar from './components/Navbar'
import SearchPage from './screens/SearchPage';
import AllViews from './screens/AllViews';
import MapView from './screens/MapView';
import ChartsView from './screens/ChartsView';
import TweetsView from './screens/TweetsView';
import Ghigliottina from './screens/Ghigliottina';


function App() {
  return (
    <div id="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/search' element={<SearchPage />}>
            <Route path='/search/map' element={<MapView />} />
            <Route index path='/search/all' element={<AllViews />} />
            <Route path='/search/charts' element={<ChartsView />} />
            <Route path='/search/tweets' element={<TweetsView />} />
          </Route>
          <Route path='/ghigliottina' element={<Ghigliottina />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
