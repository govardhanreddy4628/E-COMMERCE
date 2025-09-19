// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import { CalendarProvider } from './components/admin/calendar2/calendarContext.tsx'
import { SidebarContextProvider } from './context/sidebarContext.tsx'

createRoot(document.getElementById('root')!).render(

  // <StrictMode>
  <Provider store={store}>
    <SidebarContextProvider>
      <CalendarProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CalendarProvider>
    </SidebarContextProvider>
  </Provider>

  // </StrictMode>,
)
