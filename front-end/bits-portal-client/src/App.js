// src/App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreatePaperWithUser from './components/CreatePaperWithUser';
import ViewUsers from './components/ViewUsers';
import ViewPapers from './components/ViewPapers';
import SignIn from './components/SignInPage';
import UserPapersPage from './components/UserPapersPage';
import Home from './components/Home';
import Tag from './components/Tag'
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminProvider } from './context/AdminContext';
import { PaperProvider } from './context/PaperContext';
import UserTaggedPapers from './components/UserTaggedPapers';
import AdminHome from './components/AdminHome';
import AddAdmin from './components/AddAdmin';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <UserProvider>
          <AdminProvider>
            <PaperProvider>
              <Router>
                <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/signin" element={<SignIn />} />

                    {/* User Protected Routes */}
                    <Route
                      path="/"
                      element={
                        <UserProtectedRoute>
                          <Home />
                        </UserProtectedRoute>
                      }
                    />
                    <Route
                      path="/create/paper"
                      element={
                        <UserProtectedRoute>
                          <CreatePaperWithUser />
                        </UserProtectedRoute>
                      }
                    />
                    <Route
                      path="/user/papers"
                      element={
                        <UserProtectedRoute>
                          <UserPapersPage />
                        </UserProtectedRoute>
                      }
                    />
                    <Route
                      path="/user/taggedpapers"
                      element={
                        <UserProtectedRoute>
                          <UserTaggedPapers />
                        </UserProtectedRoute>
                      }
                    />
                    <Route
                      path="/tag/users"
                      element={
                        <UserProtectedRoute>
                          <Tag />
                        </UserProtectedRoute>
                      }
                    />

                    {/* Admin Protected Routes */}
                    <Route
                      path="/home"
                      element={
                        <AdminProtectedRoute>
                          <AdminHome />
                        </AdminProtectedRoute>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <AdminProtectedRoute>
                          <ViewUsers />
                        </AdminProtectedRoute>
                      }
                    />
                    <Route
                      path="/admins"
                      element={
                        <AdminProtectedRoute>
                          <AddAdmin />
                        </AdminProtectedRoute>
                      }
                    />
                    <Route
                      path="/papers"
                      element={
                        <AdminProtectedRoute>
                          <ViewPapers />
                        </AdminProtectedRoute>
                      }
                    />

                    {/* Catch-all Route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </Router>
            </PaperProvider>
          </AdminProvider>
        </UserProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

// Custom User Protected Route Component
function UserProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signin" />;
}

// Custom Admin Protected Route Component
function AdminProtectedRoute({ children }) {
  const { isAuthenticatedAdmin } = useAdminAuth();
  return isAuthenticatedAdmin ? children : <Navigate to="/signin" />;
}

export default App;
