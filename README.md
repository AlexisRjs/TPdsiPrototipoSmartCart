# SmartCart

Prototipo mobile de retail + split de billeteras, basado en el wireframe de Stitch.

Flujo: **carrito en vivo → promos → reparto óptimo → QR de salida**.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí la URL de Vite y usá el viewport de celular (390×844).

## Qué incluye

- Totales reales del carrito (cantidad, baja de ítems, presupuesto)
- Promos de góndola (2do al 50%, % cliente, 2x1)
- Escaneo simulado que suma productos del catálogo
- Reparto entre Modo, Cuenta DNI y Mercado Pago, con tope y reintegro
- Botón de **reparto óptimo** y validación de que la suma cubra el ticket
- QR de fast-track con countdown y pago simulado
