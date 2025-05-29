import { lazy, Suspense } from 'react';
import "./App.css"
import {Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material';
import { theme } from './themes/theme';
import About3 from './components/About3';
import DrawCircle from './components/drawCircle';
import MultipageAuth from './components/multipageAuth';
import Layout from './components/layout';
import Hero from './components/hero';
// import Tablewithpagination from './pages/muigrid/tablewithpagination';
// import MultiStepForm from './pages/muigrid/form';
import FaqComp from './components/FaqComp';
import FormikComponent from './components/formik';
import RegisterForm from './components/registrationForm';
import StarRating from './components/starRating';
import Caalendar from './components/calender/calendar';
import Sticky from './components/sticky/sticky';
import Calendar2 from './components/calendar2/calendar2';
import Calendar3 from './components/calendar3/Calendar3';
import FormikFieldArray from './components/formArray';
import GridMui from './components/Grid';
const Signup = lazy(()=>import('./components/signup'));
//const Home = lazy(()=>import("./components/layout"))
const About = lazy(()=>import("./components/about"))
const User = lazy(()=>import("./components/user"))
const Login = lazy(()=>import("./components/login"))
const Counter = lazy(()=>import("./components/counter"))
// const Home2 = lazy(()=> import("./components/home2"))
const About2 = lazy(()=> import("./components/about2"))




const App = () => {
  
  return(
    <>
    {/* <Tablewithpagination></Tablewithpagination> */}
    {/* <MultiStepForm></MultiStepForm> */}
    {/* <FormikComponent/> */}
    {/* <FaqComp></FaqComp> */}
    <ThemeProvider theme={theme}>
    {/* <RegisterForm/> */}
    
    <Suspense fallback={<h1>Loading....</h1>}>
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Hero/>} />
      </Route>
      <Route path='about' element={<About/>}>
      <Route index element={<About3><About2/></About3>} />
      </Route>
      
      <Route path='user' element={<User/>}></Route>
      <Route path='login' element={<Login/>}></Route>
      <Route path='signup' element={<Signup/>}></Route>
      <Route path='formikfieldarray' element={<FormikFieldArray/>}></Route>
      <Route path='gridmui' element={<GridMui/>}></Route>
      <Route path='sticky' element={<Sticky/>}></Route>
      <Route path='calendar' element={<Caalendar/>}></Route>
      <Route path='calendar2' element={<Calendar2/>}></Route>
      <Route path='calendar3' element={<Calendar3/>}></Route>
      <Route path='counter' element={<Counter/>}></Route>
      <Route path='drawCircle' element={<DrawCircle/>}></Route>
      <Route path='multipageauth' element={<MultipageAuth/>}></Route>
      <Route path='*' element={<h1>page not found</h1>}></Route>
    </Routes>
    </Suspense>
    </ThemeProvider>
    
    
    </>
  )
};

export default App;
