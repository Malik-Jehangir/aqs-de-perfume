import Header from './components/Header';
import Footer from './components/Footer';
import { Route, Routes } from 'react-router-dom';
import Products from './pages/Products';
import PerfumeDetails from './pages/PerfumeDetails';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import Cart from './pages/Cart';
import SignUp from './pages/SignUp';
import About from './pages/About';
import FounderMessage from './pages/FounderMessage';
import OurStory from './pages/OurStory';
import News from './pages/News';
import Checkout from './pages/Checkout';

function App() {
   return (
    <div className="app">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/founder-message" element={<FounderMessage />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/news" element={<News />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<PerfumeDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
