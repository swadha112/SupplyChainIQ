import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Home from './pages/Home/Home1';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        {/* Home page without DefaultLayout */}
        <Route
          path="/"
          element={
            <>
              <PageTitle title="Home | SupplyChainIQ" />
              <Home />
            </>
          }
        />

        {/* All other routes wrapped in DefaultLayout */}
        <Route
          path="*"
          element={
            <DefaultLayout>
              <Routes>
                <Route
                  path="/ecommerce"
                  element={
                    <>
                      <PageTitle title="SupplyChainIQ" />
                      <ECommerce />
                    </>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <>
                      <PageTitle title="Calendar | SupplyChainIQ" />
                      <Calendar />
                    </>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <>
                      <PageTitle title="Profile |SuppyChainIQ" />
                      <Profile />
                    </>
                  }
                />
                <Route
                  path="/forms/form-elements"
                  element={
                    <>
                      <PageTitle title="Form Elements |SuppyChainIQ" />
                      <FormElements />
                    </>
                  }
                />
                <Route
                  path="/forms/form-layout"
                  element={
                    <>
                      <PageTitle title="Form Layout | SuppyChainIQ" />
                      <FormLayout />
                    </>
                  }
                />
                <Route
                  path="/tables"
                  element={
                    <>
                      <PageTitle title="Tables | SuppyChainIQ" />
                      <Tables />
                    </>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <>
                      <PageTitle title="Settings | SuppyChainIQ" />
                      <Settings />
                    </>
                  }
                />
                <Route
                  path="/chart"
                  element={
                    <>
                      <PageTitle title="Basic Chart | SuppyChainIQ" />
                      <Chart />
                    </>
                  }
                />
                <Route
                  path="/ui/alerts"
                  element={
                    <>
                      <PageTitle title="Alerts | SuppyChainIQ" />
                      <Alerts />
                    </>
                  }
                />
                <Route
                  path="/ui/buttons"
                  element={
                    <>
                      <PageTitle title="Buttons | SuppyChainIQ" />
                      <Buttons />
                    </>
                  }
                />
                <Route
                  path="/auth/signin"
                  element={
                    <>
                      <PageTitle title="Signin | SuppyChainIQ" />
                      <SignIn />
                    </>
                  }
                />
                <Route
                  path="/auth/signup"
                  element={
                    <>
                      <PageTitle title="Signup |SuppyChainIQ" />
                      <SignUp />
                    </>
                  }
                />
              </Routes>
            </DefaultLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
