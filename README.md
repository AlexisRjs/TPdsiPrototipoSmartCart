# SmartCart — Prototipo Mobile de Retail & Smart Checkout

**SmartCart** es una aplicación móvil diseñada para transformar la experiencia de compra presencial en el supermercado. Permite a los clientes escanear productos mientras recorren las góndolas, controlar su presupuesto en tiempo real, descubrir promociones personalizadas antes de llegar a la caja y realizar un **reparto inteligente de billeteras virtuales** para maximizar reintegros y salir por tótems de auto-cobro (*Fast-Track*) sin hacer filas.

---

## 🗺️ Mapa de Flujo y Navegaciones

> 🎨 **Diagrama Gráfico Editorial (Diagram Design):** Podés abrir el diagrama visual de alta resolución en [diagrama-navegacion.html](diagrama-navegacion.html) o visualizarlo en el navegador local en [http://localhost:5173/diagrama-navegacion.html](http://localhost:5173/diagrama-navegacion.html).

El siguiente diagrama detalla la arquitectura de información, las opciones de navegación directa mediante la barra inferior (*BottomNav*) y el recorrido guiado de compra (*Happy Path*):

```mermaid
flowchart TD
    %% Estilos de Nodos
    classDef mainScreen fill:#003527,stroke:#6cf8bb,stroke-width:2px,color:#ffffff;
    classDef modalScreen fill:#064e3b,stroke:#acf847,stroke-width:2px,color:#ffffff;
    classDef actionNode fill:#f2f3ff,stroke:#006c49,stroke-width:1px,color:#131b2e;
    classDef finalScreen fill:#131b2e,stroke:#6cf8bb,stroke-width:2px,color:#ffffff;

    subgraph GLOBAL_NAV [" Barra de Navegación Inferior (Acceso Directo Permanente) "]
        NAV_CART["🛒 Carrito\n(/)"]:::mainScreen
        NAV_PROMOS["🏷️ Promos\n(/promos)"]:::mainScreen
        NAV_WALLETS["👛 Billeteras\n(/billeteras)"]:::mainScreen
        NAV_ACCOUNT["👤 Cuenta\n(/cuenta)"]:::mainScreen
    end

    %% Pantalla Carrito
    subgraph S_CART [" 🛒 Vista 1: Carrito "]
        C_ITEMS["Listado de Artículos\n• Cantidades (+ / -)\n• Quitar productos"]:::actionNode
        C_BUDGET["Control de Presupuesto\n• Barra de consumo\n• Saldo disponible"]:::actionNode
        C_MODAL_BUDGET["Modal: Ajustar Presupuesto\n(Input ARS + Guardar)"]:::modalScreen
        C_MODAL_SCAN["Sheet: Escáner de Productos\n(Láser + Suma automática)"]:::modalScreen
        C_INSIGHT["Banner Optimización Smart\n(Anticipo de ahorro)"]:::actionNode
        C_CTA["CTA Fijo: Ver promos y pagar"]:::actionNode
    end

    %% Pantalla Promos
    subgraph S_PROMOS [" 🏷️ Vista 2: Promociones "]
        P_HERO["Hero de Ahorro\n• Total ahorrado\n• Subtotal vs Total promos"]:::actionNode
        P_TEASER["Oportunidad de Góndola\n• Teaser inicial intrigante"]:::actionNode
        P_REVEAL["Revelación 2x1 Góndola 4\n• Botón: '+ Sumar ChocoChips'"]:::modalScreen
        P_APPLIED["Promociones Aplicadas\n• 2do al 50%, Plus 15%, etc."]:::actionNode
        P_CAPS["Revisor de Topes Mensuales\n• Modo, Cuenta DNI, etc."]:::actionNode
        P_CTA["CTA Fijo: Continuar a reparto"]:::actionNode
    end

    %% Pantalla Billeteras
    subgraph S_WALLETS [" 👛 Vista 3: Reparto de Billeteras "]
        W_SPLITBAR["Distribución del Pago\n• Barra segmentada por color"]:::actionNode
        W_OPTIMAL["Botón: Reparto Óptimo\n(Calcula topes y reintegros)"]:::modalScreen
        W_SLIDERS["Deslizadores Interactivos\n• Modo (30%)\n• Cuenta DNI (20%)\n• Mercado Pago (Libre)"]:::actionNode
        W_BALANCE["Validación de Saldo\n• Botón: 'Equilibrar'"]:::actionNode
        W_CTA["CTA Fijo: Confirmar reparto y avanzar"]:::actionNode
    end

    %% Pantalla Checkout
    subgraph S_CHECKOUT [" ⚡ Vista 4: Pagar y Salir (Fast-Track) "]
        CK_QR["Código QR Dinámico\n• Cuenta regresiva (15 min)\n• Tótem Puerta Norte"]:::finalScreen
        CK_BREAKDOWN["Resumen Desglosado\n• Bruto - Descuentos - Reintegros\n• Total Neto Final"]:::actionNode
        CK_DETAIL["Acordeón: Detalle de Ítems"]:::actionNode
        CK_PAY["Botón: Pagar Ahora\n(Simula split bancario)"]:::finalScreen
        CK_DONE["Compra Completada\n• Ticket digital disponible\n• Salida sin fila de caja"]:::finalScreen
    end

    %% Pantalla Cuenta
    subgraph S_ACCOUNT [" 👤 Vista 5: Mi Cuenta "]
        A_USER["Perfil: Andrés Ricagno\n• Cliente Plus (@andres.ricagno)"]:::actionNode
        A_STORE["Sucursal Coto Belgrano\n• Salida Puerta Norte"]:::actionNode
        A_WALLETS["Billeteras Vinculadas\n• Porcentajes y topes"]:::actionNode
        A_RESET["Botón: Reiniciar Compra Demo"]:::actionNode
    end

    %% Interacciones Carrito
    NAV_CART --> C_ITEMS
    C_BUDGET -->|Click 'Ajustar'| C_MODAL_BUDGET
    C_MODAL_BUDGET -.->|Guardar / Cerrar| C_BUDGET
    NAV_CART -->|Click Botón FAB 'Escanear'| C_MODAL_SCAN
    C_MODAL_SCAN -.->|Producto sumado| C_ITEMS
    C_INSIGHT -->|Click banner| NAV_PROMOS
    C_CTA -->|Click avanzar| NAV_PROMOS

    %% Interacciones Promos
    NAV_PROMOS --> P_HERO
    P_TEASER -->|Click 'Ver lo que te estás perdiendo'| P_REVEAL
    P_REVEAL -->|Click '+ Sumar'| C_ITEMS
    P_CTA -->|Click avanzar| NAV_WALLETS

    %% Interacciones Billeteras
    NAV_WALLETS --> W_SPLITBAR
    W_OPTIMAL -->|1 Click| W_SLIDERS
    W_BALANCE -->|Auto-ajuste| W_SLIDERS
    W_CTA -->|Solo si 100% cubierto| S_CHECKOUT

    %% Interacciones Checkout
    CK_PAY -->|Procesando...| CK_DONE
    CK_DONE -->|Volver| NAV_CART

    %% Interacciones Cuenta y Validación de Tarjetas del Usuario
    NAV_ACCOUNT -->|1-Tap Pestaña Usuario| A_USER
    A_USER -.->|Valida topes de tarjetas (Modo / Cuenta DNI)| NAV_PROMOS
    A_USER -.->|Aporta billeteras vinculadas para split| NAV_WALLETS
    A_RESET -.->|Reset estado inicial| NAV_CART
```

---

## 📱 Descripción de Vistas y Funcionalidades

### 1. Vista de Carrito (`/`)
Es la pantalla de inicio y centro de control durante la visita a la sucursal.
* **Cabecera de Sucursal:** Identifica la tienda física activa (`Coto · Sucursal Belgrano`).
* **Tarjeta de Presupuesto:** Permite fijar un monto máximo de gasto diario en pesos, visualizando el porcentaje consumido, la barra de progreso y el dinero restante. Incluye un botón para ajustar dicho presupuesto en una ventana emergente.
* **Lista de Productos Escaneados:**
  * Nombre, presentación y precio unitario de cada producto.
  * Pastillas indicadoras de la ubicación física en el supermercado (`Góndola 4 · Galletitas`) o de promociones vigentes.
  * Controles táctiles de incremento y decremento de unidades con actualización de totales al instante.
  * Opción de quitar productos con el botón de papelera.
* **Banner de Optimización Smart:** Comunica al comprador cuánto dinero está ahorrando en conjunto (descuentos comerciales + reintegros bancarios) con acceso directo a la vista de Promociones.
* **Botón Flotante «Escanear producto»:** Permite simular el escaneo con cámara y código de barras, desplegando un visor interactivo y sumando automáticamente nuevos productos al changuito.
* **Barra de Subtotal Inferior:** Fija en la pantalla, muestra el subtotal acumulado y el botón directo para avanzar a **Ver promos y pagar**.

---

### 2. Vista de Promociones (`/promos`)
Reúne todas las ventajas comerciales aplicadas y disponibles para el carrito actual.
* **Hero de Ahorro:**
  * Indicador con pastilla verde lima con la cantidad de promociones activadas.
  * Monto total que el cliente está economizando.
  * Comparativa entre el *Subtotal original* tachado y el *Total con promos*.
* **Oportunidad de Góndola (Revelación Progresiva):**
  * Presenta un aviso inicial de intriga (*«Hay una promoción especial disponible para tu carrito»*).
  * Mediante el botón interactivo **«Ver lo que te estás perdiendo»**, se revela la oportunidad concreta: *«Agregá un paquete más de galletitas y activás 2x1 en Góndola 4 (Ahorrás $1.600 extra)»*.
  * Botón **`+ Sumar`** para incorporar el producto recomendado al carrito en un solo toque sin desplazarse por el menú.
* **Desglose de Promociones Aplicadas:** Detalle producto por producto de las ofertas computadas (`2do al 50%`, `15% Clientes Plus`, etc.) con su respectivo descuento en verde.
* **Revisor de Topes de Billeteras:** Muestra el consumo del ciclo mensual para cada billetera virtual (por ejemplo, Modo y Cuenta DNI), indicando el tope restante disponible y el gasto máximo sugerido para no perder beneficios.
* **Barra de Navegación:** Botón directo **Continuar a reparto**.

---

### 3. Vista de Billeteras y Reparto Óptimo (`/billeteras`)
Herramienta de optimización financiera para dividir el pago entre múltiples plataformas y aprovechar todos los reintegros.
* **Resumen de Distribución:** Informa el monto del carrito, el ahorro por reintegro y el total neto que efectivamente saldrá del bolsillo del cliente.
* **Barra de Distribución Visual:** Gráfico segmentado que ilustra en colores la participación de cada billetera sobre el total del ticket.
* **Reparto Óptimo Automático:** Botón inteligente de 1 solo clic que calcula la combinación matemáticamente ideal: satura los topes de las billeteras con mayor descuento y transfiere cualquier saldo remanente a medios de pago libres.
* **Deslizadores Manuales por Billetera:**
  * Controles interactivos para calibrar importes asignados a **Modo**, **Cuenta DNI** y **Mercado Pago**.
  * Cálculo en tiempo real del reintegro activo generado por cada billetera.
* **Semáforo de Validación y Equilibrio:**
  * Estado verde si la suma coincide exactamente con el ticket (*100% cubierto*).
  * Estado de alerta si hay dinero sin asignar o si se supera el total del ticket, acompañado de un botón **Equilibrar** que ajusta la diferencia de inmediato.
* **Botón de Confirmación:** Se habilita al estar balanceado el pago para pasar a la pantalla final.

---

### 4. Vista de Pago y Salida Fast-Track (`/pagar`)
Pantalla de salida ágil sin pasar por la línea de cajas convencional.
* **Código QR de Salida:**
  * Generación de código QR con animación de escaneo.
  * Contador de seguridad en cuenta regresiva (15 minutos de validez).
  * Designación del punto de salida física (`Tótem Puerta Norte`) y número de ticket digital.
* **Resumen Contable:**
  * Subtotal bruto del changuito.
  * Descuentos y promociones de la tienda.
  * Reintegros aplicados por las billeteras.
  * Pastilla de porcentaje total de ahorro conseguido.
  * **Total Neto Final a pagar**.
* **Cobro por Billetera:** Cuadro que certifica cuánto se cobra a cada cuenta vinculada.
* **Acordeón de Detalle:** Desplegable para revisar la lista completa de artículos y unidades compradas.
* **Simulación de Pago:** Botón para procesar el pago multiprocesador de forma simulada y retornar al inicio con el ticket verificado.

---

### 5. Vista de Cuenta (`/cuenta`)
Panel del usuario y opciones de demostración.
* **Perfil:** Visualización del usuario comprador activo (**Andrés Ricagno**, `@andres.ricagno`) con membresía *Cliente Plus*.
* **Sucursal Predilecta:** Consulta de la tienda en curso y su acceso de auto-salida.
* **Configuración de Presupuesto:** Monitor del consumo del día con opción de reajuste.
* **Listado de Billeteras Vinculadas:** Consulta de plataformas registradas y sus condiciones de reintegro.
* **Reinicio de Demo:** Botón para restablecer el changuito y los datos al estado de fábrica para repetir la experiencia.

---

## 💡 Guía Rápida de Uso del Prototipo

1. **Explorar el carrito:** Observá los productos cargados, modificá cantidades y revisá cómo impacta en el medidor de presupuesto diario.
2. **Escanear un producto:** Tocá el botón verde esmeralda flotante **Escanear producto** en la esquina inferior para ver la animación del lector láser y sumar un nuevo ítem.
3. **Descubrir promociones:** Pulsá **Ver promos y pagar**. En la tarjeta dorada tocá **«Ver lo que te estás perdiendo»** para desplegar la oferta 2x1 y sumarla con el botón `+ Sumar`.
4. **Optimizar el pago:** Avanzá a **Reparto de Billeteras** y hacé clic en **Reparto óptimo automático** para que el sistema distribuya los montos exactos maximizando reintegros bancarios.
5. **Emitir el QR:** Tocá **Confirmar reparto y avanzar** para obtener el código QR de salida rápida y completar la simulación de compra.
