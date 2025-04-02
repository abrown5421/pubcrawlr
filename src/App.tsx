
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

function App() {
  return (
    <Provider store={store}>
      initial
    </Provider>
  )
}

export default App
