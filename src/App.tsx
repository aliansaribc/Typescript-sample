import Records from './components/records';
import login from './components/login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import User from './components/user';
import notFound from './components/notFound';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' Component={login} />
          <Route path='/user/:id' Component={User} />
          <Route path='/user' Component={User} />
          <Route path='/' Component={Records} />
          <Route path='/*' Component={notFound} />
        </Routes>
      </BrowserRouter>      
    </>    
  );
}

export default App;