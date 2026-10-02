- Todas las imagenes de la app iran dentro de src/assets/ y se importaran asi:

```tsx
import appLogo from './assets/logo.svg'

// uso
export default function App() {
  return <img src={appLogo} alt="App name" />
}
```
