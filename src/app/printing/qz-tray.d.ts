// Minimal ambient declaration for the `qz-tray` UMD library, which ships no
// TypeScript types. The QZ API is large and dynamic, so we expose it as `any`
// and keep all real typing inside QzPrinterService.
declare module 'qz-tray';
