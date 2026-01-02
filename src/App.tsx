import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ListingPage from './pages/ListingPage';
import CategoryPage from './pages/CategoryPage';
import ProviderPage from './pages/ProviderPage';
import AddListingPage from './pages/AddListingPage';
import SavedPage from './pages/SavedPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Admin
import AdminRoute from './components/admin/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminListings from './pages/admin/AdminListings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Admin Routes - separate layout */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="listings" element={<AdminListings />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>

      {/* Main App Routes */}
      <Route
        path="/*"
        element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/listing/:id" element={<ListingPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/provider/:id" element={<ProviderPage />} />
              <Route path="/add-listing" element={<AddListingPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
