/// <reference types="vite/client" />

declare module './hooks/useDarkMode.jsx' {
    const useDarkMode: () => [boolean, () => void];
    export default useDarkMode;
}
