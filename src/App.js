import React from "react";

/* =========================================================
   Helpers de LocalStorage (mismas claves de siempre)
========================================================= */
const LS_KEYS = {
  SESSION: "licoreria.session",
  PRODUCTS: "licoreria.products",
  CATEGORIES: "licoreria.categories",
  SALES: "licoreria.sales",
  DEBTS: "licoreria.debts",
  PRODUCT_HISTORY: "licoreria.productHistory", // NUEVO
  CLIENTS: "licoreria.clients",   
  CASH_OPENINGS: "licoreria.cashOpenings", // apertura de caja por día
  CASH_CLOSED: "licoreria.cashClosed", // estado de cierre por día (YYYY-MM-DD: true/false)
};

const loadS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};
const saveLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

/* =========================================================
   Componentes UI básicos
========================================================= */
const Card = ({ className = "", children }) => (
  <div className={`bg-white rounded-2xl shadow p-5 ${className}`}>{children}</div>
);

const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
}) => {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold";
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-500"
      : "bg-slate-100 hover:bg-slate-200 text-slate-800";
  const disabledCls = disabled ? "opacity-50 cursor-not-allowed" : "";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${styles} ${disabledCls} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const TextInput = ({
  value,
  onChange,
  placeholder,
  className = "",
  type = "text",
  ...rest
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500 ${className}`}
    {...rest}
  />
);

const NumberInput = (props) => (
  <TextInput {...props} type="number" inputMode="numeric" />
);

const Select = ({ value, onChange, children, className = "" }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500 ${className}`}
  >
    {children}
  </select>
);

/* =========================================================
   Barra lateral (colapsable)
========================================================= */
// Sidebar.jsx (o dentro de App.js si lo tenías ahí)
function Sidebar({ open, setOpen, page, setPage, onLogout }) {
  return (
    <aside
      className={`sticky top-0 h-screen bg-white border-r border-slate-200 ${
        open ? "w-72" : "w-14"
      } overflow-hidden transition-[width] duration-200`}
    >
      {/* === Rail colapsada (como en tu captura) === */}
      {!open && (
        <div className="flex h-full flex-col">
          {/* Hamburguesa arriba */}
          <div className="p-3">
            <button
              onClick={() => setOpen(true)}
              className="w-8 h-8 grid place-items-center rounded-lg border hover:bg-slate-50"
              title="Abrir menú"
            >
              {/* ☰ hamburguesa */}
              <span className="text-[18px] leading-none">≡</span>
            </button>
          </div>

          {/* Puntos verticales (indicadores de secciones) */}
          <div className="flex-1 py-2 flex flex-col items-center gap-5">
            <RailDot id="summary"   page={page} setPage={setPage} />
            <RailDot id="inventory" page={page} setPage={setPage} />
            <RailDot id="debts"     page={page} setPage={setPage} />
            <RailDot id="admin"     page={page} setPage={setPage} />
            <RailDot id="cashbox"   page={page} setPage={setPage} />   {/* NUEVO */}
          </div>

          {/* Botón redondo abajo para expandir */}
          <div className="p-3">
            <button
              onClick={() => setOpen(true)}
              className="w-8 h-8 grid place-items-center rounded-full border hover:bg-slate-50"
              title="Expandir menú"
            >
              {/* «» o ⇱/⤢: usa el que prefieras */}
              <span className="text-[16px]">⤢</span>
            </button>
          </div>
        </div>
      )}

      {/* === Menú expandido (igual que antes) === */}
      {open && (
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-2 p-3">
            <div className="flex-1">
              <div className="text-xl font-semibold leading-5">Licorería</div>
              <div className="text-xs text-slate-500">
                Control de inventario, ventas y cartera.
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 grid place-items-center rounded-xl border hover:bg-slate-50"
              title="Minimizar menú"
            >
              ««
            </button>
          </div>

          <nav className="px-3 mt-2 space-y-1">
            <NavItem id="summary"   page={page} setPage={setPage}>Resumen</NavItem>
            <NavItem id="inventory" page={page} setPage={setPage}>Ventas</NavItem>
            <NavItem id="debts"     page={page} setPage={setPage}>Deuda Clientes</NavItem>
            <NavItem id="admin"     page={page} setPage={setPage}>Administración</NavItem>
            <NavItem id="cashbox"   page={page} setPage={setPage}>Caja</NavItem>   {/* NUEVO */}
            </nav>

          <div className="mt-auto p-3">
            <Button onClick={onLogout} className="w-full">
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}

/* Punto del rail (colapsado) */
function RailDot({ id, page, setPage }) {
  const active = page === id;
  return (
    <button
      onClick={() => setPage(id)}
      aria-label={id}
      className={`w-2.5 h-2.5 rounded-full transition-colors ${
        active ? "bg-blue-600" : "bg-slate-300 hover:bg-slate-400"
      }`}
    />
  );
}

/* Item del menú expandido */
function NavItem({ id, page, setPage, children }) {
  const active = page === id;
  return (
    <button
      onClick={() => setPage(id)}
      className={`w-full text-left rounded-xl px-4 py-3 text-base ${
        active ? "bg-slate-900 text-white" : "hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}



/* =========================================================
   LOGIN (se muestra directamente si no hay sesión)
========================================================= */
function Login({ onLogin }) {
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [show, setShow] = React.useState(false);

  /* ==== OPCIÓN A: imagenes en /public  =========================
     Pon los archivos en: public/fondo_pagina.jpg  y  public/fondo_card.jpg
     y deja las rutas iniciando con "/".
  */
  const PAGE_BG_URL = "/foto_login.png"; // ⬅️ cambia el nombre si usas otro
  const CARD_BG_URL = "/fondo_card.jpg";   // ⬅️ opcional, puedes comentar si no quieres imagen en el card

  /* ==== OPCIÓN B: imágenes dentro de /src (por ejemplo src/assets) =====
     Descomenta estas dos líneas y comenta las dos de arriba:
  */
  // import pageBg from "./assets/fondo_pagina.jpg";
  // import cardBg from "./assets/fondo_card.jpg";

  const submit = (e) => {
    e.preventDefault();
    if (!user || !pass) return;
    saveLS(LS_KEYS.SESSION, true);
    onLogin();
  };

  return (
    // ❌ quitamos bg-slate-50 para que no tape un z-index bajo
    // ✅ y NO usamos z-negativos; usamos z-0, z-10, z-20
    <div className="min-h-screen relative grid place-items-center">
      {/* Fondo de pantalla */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          // OPCIÓN A:
          backgroundImage: `url('${PAGE_BG_URL}')`,
          // OPCIÓN B:
          // backgroundImage: `url(${pageBg})`,
        }}
      />
      {/* Velo para legibilidad */}
      <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px]" />

      {/* Cuadro de login */}
      <div className="w-full max-w-xl relative overflow-hidden rounded-2xl shadow-xl z-20">
        {/* Fondo del cuadro (opcional) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            // OPCIÓN A:
            backgroundImage: `url('${CARD_BG_URL}')`,
            // OPCIÓN B:
            // backgroundImage: `url(${cardBg})`,
          }}
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

        {/* Contenido */}
        <div className="relative p-10">
          <h1 className="text-3xl font-semibold text-center">Licorería</h1>
          <p className="text-slate-600 mt-2 text-center">Inicia sesión para continuar</p>

          <form className="mt-8 space-y-6" onSubmit={submit}>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">Usuario</label>
              <TextInput value={user} onChange={(e) => setUser(e.target.value)} placeholder="usuario" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">Contraseña</label>
              <div className="relative">
                <TextInput
                  type={show ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="contraseña"
                  className="pr-24"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border px-3 py-1 text-sm text-slate-700 bg-white/70"
                  onClick={() => setShow((v) => !v)}
                >
                  {show ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <Button className="w-full text-lg" type="submit">Entrar</Button>
          </form>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   PÁGINAS
========================================================= */

/* --------- Resumen --------- */
function Summary({ products, sales, debts }) {
  // KPIs simples
  const invCost = products.reduce(
    (acc, p) => acc + (p.cost || 0) * (p.stock || 0),
    0
  );
  const invPrice = products.reduce(
    (acc, p) => acc + (p.price || 0) * (p.stock || 0),
    0
  );
  const totalSales = sales.reduce((acc, s) => acc + (s.qty || 0) * (s.unitPrice || 0), 0);
  const totalDebts = debts.reduce((acc, d) => acc + (Number(d.total) || 0), 0);
  const countDebtors = new Set(
    debts.filter((d) => (d.status || "pendiente") === "pendiente").map((d) => d.client)
  ).size;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-sm text-slate-500">Valor inventario (costo)</div>
          <div className="text-3xl font-bold">${invCost.toLocaleString()}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Valor inventario (precio)</div>
          <div className="text-3xl font-bold">${invPrice.toLocaleString()}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Ventas acumuladas</div>
          <div className="text-3xl font-bold">${totalSales.toLocaleString()}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Clientes con deuda</div>
          <div className="text-3xl font-bold">{countDebtors}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <div className="text-sm text-slate-500">Total adeudado</div>
          <div className="text-2xl font-semibold">${totalDebts.toLocaleString()}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Productos distintos</div>
          <div className="text-2xl font-semibold">{products.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Ventas registradas</div>
          <div className="text-2xl font-semibold">{sales.length}</div>
        </Card>
      </div>
    </div>
  );
}

/* --------- Inventario y Ventas --------- */
function InventoryPage({
  products,
  setProducts,
  sales,
  setSales,
  categories,
  clients,
  setDebts,
  cashClosed 
}) {
  const [term, setTerm] = React.useState("");
  const [filterCat, setFilterCat] = React.useState("Todos");
  const [sellOf, setSellOf] = React.useState(null); // modal

  const [cashPayFor, setCashPayFor] = React.useState(null); // {product, qty}
  
  const todayStr = new Date().toISOString().slice(0,10);
  const isClosedToday = !!(cashClosed && cashClosed[todayStr]);

  // flujo de pago
  const [paymentFor, setPaymentFor] = React.useState(null); // {product, qty}
  const [askClientFor, setAskClientFor] = React.useState(null); // {product, qty}

  const filtered = React.useMemo(() => {
    const lower = term.trim().toLowerCase();
    return products.filter((p) => {
      const okTerm =
        !lower ||
        p.name.toLowerCase().includes(lower) ||
        (p.category || "").toLowerCase().includes(lower);
      const okCat = filterCat === "Todos" || p.category === filterCat;
      return okTerm && okCat;
    });
  }, [products, term, filterCat]);

  // Arriba del archivo o dentro de InventoryPage, antes del return:
const METHOD_LABEL = { Efectivo: "Efectivo", Transferencia: "Transferencia", Fiado: "Fiado" };


  const totalInvCost = React.useMemo(
    () => products.reduce((a, p) => a + (p.cost || 0) * (p.stock || 0), 0),
    [products]
  );
  const totalInvPrice = React.useMemo(
    () => products.reduce((a, p) => a + (p.price || 0) * (p.stock || 0), 0),
    [products]
  );
  const totalSales = React.useMemo(
    () => sales.reduce((a, s) => a + (s.qty || 0) * (s.unitPrice || 0), 0),
    [sales]
  );
  const grossProfit = React.useMemo(() => {
    const costSold = sales.reduce((a, s) => {
      const prod = products.find((p) => p.id === s.productId);
      const c = prod ? prod.cost || 0 : 0;
      return a + c * (s.qty || 0);
    }, 0);
    return totalSales - costSold;
  }, [sales, products, totalSales]);

  // opts puede traer: { debtInfo, tendered, change }
const recordSale = (productId, qty, method, opts = {}) => {
  if (isClosedToday) {
      alert("La caja de HOY está cerrada. Re ábrela desde la pestaña Caja para poder registrar ventas.");
      return;
    }
  if (!qty || qty <= 0) return;

  // 1) descontar stock
  setProducts((prev) =>
    prev.map((p) =>
      p.id === productId ? { ...p, stock: Math.max(0, (p.stock || 0) - qty) } : p
    )
  );

  // 2) registrar venta
  const prod = products.find((p) => p.id === productId);
  const unitPrice = prod?.price || 0;

  const rec = {
    id: `${Date.now()}_${productId}`,
    date: new Date().toISOString(),
    productId,
    qty: Number(qty),
    unitPrice,
    method,                    // "Efectivo" | "Transferencia" | "Fiado"
    tendered: method === "Efectivo" ? Number(opts.tendered || 0) : 0, // recibido
    change:   method === "Efectivo" ? Number(opts.change   || 0) : 0, // devuelto
  };
  setSales((prev) => [rec, ...prev]);

  // 3) si es fiado: acumular deuda
  const debtInfo = opts.debtInfo;
  if (method === "Fiado" && debtInfo?.client) {
    const addAmount = Number(qty) * Number(unitPrice);
    const newItem = {
      ts: new Date().toISOString(),
      productId,
      name: prod?.name || "",
      qty: Number(qty),
      unitPrice: Number(unitPrice),
    };

    setDebts((prev) => {
      const idx = prev.findIndex((d) =>
        d.status !== "pagado" &&
        (
          (d.clientId && d.clientId === debtInfo.client.id) ||
          (!d.clientId && d.client === debtInfo.client.name)
        )
      );
      if (idx !== -1) {
        const cur = prev[idx];
        const updated = {
          ...cur,
          total: (Number(cur.total) || 0) + addAmount,
          items: Array.isArray(cur.items) ? [...cur.items, newItem] : [newItem],
          updatedAt: new Date().toISOString(),
        };
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      const d = {
        id: `debt_${Date.now()}`,
        clientId: debtInfo.client.id,
        client: debtInfo.client.name,
        phone: debtInfo.client.phone || "",
        note: debtInfo.note || `Venta a crédito de ${prod?.name || ""}`,
        status: "pendiente",
        total: addAmount,
        createdAt: new Date().toISOString(),
        items: [newItem],
      };
      return [d, ...prev];
    });
  }
};

  React.useEffect(() => {
    saveLS(LS_KEYS.PRODUCTS, products);
  }, [products]);
  React.useEffect(() => {
    saveLS(LS_KEYS.SALES, sales);
  }, [sales]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-sm text-slate-500">Valor de inventario (costo)</div>
          <div className="text-3xl font-bold">
            ${totalInvCost.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Valor de inventario (precio)</div>
          <div className="text-3xl font-bold">
            ${totalInvPrice.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Ventas acumuladas</div>
          <div className="text-3xl font-bold">${totalSales.toLocaleString()}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Utilidad bruta acumulada</div>
          <div className="text-3xl font-bold">
            ${grossProfit.toLocaleString()}
          </div>
        </Card>
      </div>

      {/* Buscador + filtro */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-3">
        <TextInput
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar producto o categoría..."
        />
        <Select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option>Todos</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </div>

      {/* Tabla productos */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="p-3">Producto</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Costo</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">${(p.cost || 0).toLocaleString()}</td>
                  <td className="p-3">${(p.price || 0).toLocaleString()}</td>
                  <td className="p-3">{p.stock || 0}</td>
                  <td className="p-3">
                    <Button
    onClick={() => setSellOf(p)}
    className="px-4"
    disabled={isClosedToday}
    title={isClosedToday ? "Caja cerrada para hoy desde la pestaña Caja" : ""}
  >
    Vender
  </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-slate-500" colSpan={6}>
                    Sin resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Ventas recientes */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Ventas recientes</h3>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Producto</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">P. Unidad</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">Método</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 && (
                  <tr>
                    <td className="p-4 text-center text-slate-500" colSpan={6}>
                      Sin ventas registradas.
                    </td>
                  </tr>
                )}
                {sales.map((s) => {
                  const prod = products.find((p) => p.id === s.productId);
                  return (
                    <tr key={s.id} className="border-t">
                      <td className="p-3">
                        {new Date(s.date).toLocaleString()}
                      </td>
                      <td className="p-3">{prod?.name || "-"}</td>
                      <td className="p-3">{s.qty}</td>
                      <td className="p-3">${(s.unitPrice || 0).toLocaleString()}</td>
                      <td className="p-3">
                        ${(s.qty * (s.unitPrice || 0)).toLocaleString()}
                      </td>
                      <td className="p-3">{METHOD_LABEL[s.method] ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal vender (diseño clásico) */}
      {sellOf && (
  <SellModal
    product={sellOf}
    onClose={() => setSellOf(null)}
    onSave={(qty) => {
      setSellOf(null);
      // después de escoger cantidad, pedimos método de pago
      setPaymentFor({ product: sellOf, qty });
    }}
  />
)}
{paymentFor && (
  <PaymentMethodModal
    product={paymentFor.product}
    qty={paymentFor.qty}
    onClose={() => setPaymentFor(null)}
    onConfirm={(method) => {
  if (method === "Fiado") {
    setAskClientFor(paymentFor);
    setPaymentFor(null);
  } else if (method === "Efectivo") {
    // abrir modal de efectivo (monto recibido / cambio)
    setCashPayFor(paymentFor);
    setPaymentFor(null);
  } else {
    // Transferencia
    recordSale(paymentFor.product.id, paymentFor.qty, "Transferencia");
    setPaymentFor(null);
  }
}}
   onBack={() => setPaymentFor(null)}  // opcional: evita que onBack sea undefined
  />
)}
{askClientFor && (
  <SelectClientModal
    clients={clients}
    onClose={() => setAskClientFor(null)}
    onConfirm={({ client, note }) => {
      recordSale(askClientFor.product.id, askClientFor.qty, "Fiado", { debtInfo: { client, note } });
      setAskClientFor(null);
    }}
  />
)}

{cashPayFor && (
  <CashPaymentModal
    product={cashPayFor.product}
    qty={cashPayFor.qty}
    onClose={() => setCashPayFor(null)}
    onBack={() => {
      setPaymentFor(cashPayFor);
      setCashPayFor(null);
    }}
    onConfirm={({ received, change }) => {
      recordSale(
        cashPayFor.product.id,
        cashPayFor.qty,
        "Efectivo",
        { tendered: received, change }
      );
      setCashPayFor(null);
    }}
  />
)}
    </div>
  );
}

function SellModal({ product, onClose, onSave }) {
  const [qty, setQty] = React.useState(1);
  const valid = qty > 0 && qty <= (product.stock || 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-[100]">
      <Card className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Registrar venta</div>
          <button
            className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-slate-600">Producto</div>
          <div className="text-base font-medium">{product.name}</div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Cantidad
          </label>
          <NumberInput
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            min={1}
            max={product.stock || 0}
          />
          <div className="text-xs text-slate-500 mt-1">
            Stock disponible: {product.stock || 0}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(qty)} disabled={!valid}>
            Guardar
          </Button>
        </div>
      </Card>
    </div>
  );
}

function DebtPaymentsHistoryModal({ debt, onClose }) {
  const money = (n) =>
    (Number(n) || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const fmtDate = (iso) =>
    new Date(iso).toLocaleString("es-CO", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const items = Array.isArray(debt?.payments) ? [...debt.payments] : [];
  items.sort((a, b) => new Date(a.ts) - new Date(b.ts));
  const totalPaid = items.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-[130]">
      <Card className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-lg font-semibold">Historial de pagos</div>
            <div className="text-sm text-slate-500">Cliente: {debt?.client ?? "—"}</div>
          </div>
          <button
            className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="flex items-center justify-between text-slate-600 mb-3">
          <div>Deuda actual: <b>{money(debt?.total || 0)}</b></div>
          <div>Total pagos: <b>{money(totalPaid)}</b></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="p-3">Fecha</th>
                <th className="p-3">Monto</th>
                <th className="p-3">Nota</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-slate-500">
                    Sin pagos registrados.
                  </td>
                </tr>
              ) : (
                items.map((p, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{fmtDate(p.ts)}</td>
                    <td className="p-3">{money(p.amount)}</td>
                    <td className="p-3">{p.note || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="default" onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}

function DebtPaymentMethodModal({ debt, amount, onBack, onClose, onConfirm }) {
  const [method, setMethod] = React.useState("Efectivo");
  const money = (n) =>
    (Number(n) || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-[125]">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">Método de abono</div>
          <button className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50" onClick={onClose} title="Cerrar">×</button>
        </div>

        <div className="text-sm text-slate-600 mb-4">
          Cliente: <b>{debt?.client ?? "—"}</b> · Monto: <b>{money(amount)}</b>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input type="radio" name="pmDebt" value="Efectivo" checked={method === "Efectivo"} onChange={(e)=>setMethod(e.target.value)} />
            <span>Efectivo</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="radio" name="pmDebt" value="Transferencia" checked={method === "Transferencia"} onChange={(e)=>setMethod(e.target.value)} />
            <span>Transferencia</span>
          </label>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="default" onClick={() => onBack?.()}>Atrás</Button>
          <div className="flex gap-2">
            <Button variant="default" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => onConfirm(method)}>Guardar</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function DebtCashPaymentModal({ debt, amount, onBack, onClose, onConfirm }) {
  const money = (n) =>
    (Number(n) || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

  const total = Number(amount || 0);
  const [received, setReceived] = React.useState("");
  const rec = Number(received || 0);
  const change = rec - total;
  const canConfirm = rec >= total && total > 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-[126]">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">Abono en efectivo</div>
          <button className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50" onClick={onClose} title="Cerrar">×</button>
        </div>

        <div className="text-sm text-slate-600 mb-4">
          Cliente: <b>{debt?.client ?? "—"}</b> · Monto a abonar: <b>{money(total)}</b>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Total a cobrar</span>
            <b>{money(total)}</b>
          </div>

          <div className="mt-2">
            <label className="block text-sm text-slate-600 mb-1">Monto recibido</label>
            <NumberInput value={received} onChange={(e)=>setReceived(e.target.value)} placeholder="0" min={0} />
          </div>

          {received !== "" && (
            <div className={`mt-2 flex items-center justify-between rounded-xl px-3 py-2 ${change >= 0 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
              <span>{change >= 0 ? "Cambio a entregar" : "Falta por cobrar"}</span>
              <b>{money(Math.abs(change))}</b>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="default" onClick={() => onBack?.()}>Atrás</Button>
          <div className="flex gap-2">
            <Button variant="default" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => onConfirm({ received: rec, change })} disabled={!canConfirm}>Confirmar</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PaymentMethodModal({ product, qty, onBack, onClose, onConfirm }) {
  const [method, setMethod] = React.useState("Efectivo");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-[110]">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">Método de pago</div>
          <button
            className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="text-sm text-slate-600 mb-4">
          {product?.name} • Cantidad: <b>{qty}</b>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="pm"
              value="Efectivo"
              checked={method === "Efectivo"}
              onChange={(e) => setMethod(e.target.value)}
            />
            <span>Efectivo</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="pm"
              value="Transferencia"
              checked={method === "Transferencia"}
              onChange={(e) => setMethod(e.target.value)}
            />
            <span>Transferencia</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="pm"
              value="Fiado"
              checked={method === "Fiado"}
              onChange={(e) => setMethod(e.target.value)}
            />
            <span>Fiado</span>
          </label>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="default" onClick={() => onBack?.()}>Atrás</Button>
          <div className="flex gap-2">
            <Button variant="default" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => onConfirm(method)}>Guardar</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CashPaymentModal({ product, qty, onClose, onBack, onConfirm }) {
  const money = (n) =>
    (Number(n) || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const unit = Number(product?.price || 0);
  const total = unit * Number(qty || 0);

  const [received, setReceived] = React.useState("");
  const rec = Number(received || 0);
  const change = rec - total;

  const canConfirm = rec >= total && total > 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-[115]">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">Pago en efectivo</div>
          <button
            className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="text-sm text-slate-600 mb-4">
          {product?.name} • Cantidad: <b>{qty}</b> • P. Unidad: <b>{money(unit)}</b>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Total a cobrar</span>
            <b>{money(total)}</b>
          </div>

          <div className="mt-2">
            <label className="block text-sm text-slate-600 mb-1">Monto recibido</label>
            <NumberInput
              value={received}
              onChange={(e) => setReceived(e.target.value)}
              placeholder="0"
              min={0}
            />
          </div>

          {received !== "" && (
            <div
              className={
                "mt-2 flex items-center justify-between rounded-xl px-3 py-2 " +
                (change >= 0
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700")
              }
            >
              <span>{change >= 0 ? "Cambio a entregar" : "Falta por cobrar"}</span>
              <b>{money(Math.abs(change))}</b>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="default" onClick={() => onBack?.()}>Atrás</Button>
          <div className="flex gap-2">
            <Button variant="default" onClick={onClose}>Cancelar</Button>
            <Button
              onClick={() => onConfirm?.({ received: rec, change })}
              disabled={!canConfirm}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}


function SelectClientModal({ clients = [], onClose, onConfirm }) {
  const [q, setQ] = React.useState("");
  const [selectedId, setSelectedId] = React.useState(null);
  const [note, setNote] = React.useState("");

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;
    return clients.filter(
      c =>
        (c.name || "").toLowerCase().includes(s) ||
        (c.doc || "").toLowerCase().includes(s) ||
        (c.phone || "").toLowerCase().includes(s)
    );
  }, [q, clients]);

  const selected = clients.find(c => c.id === selectedId) || null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-[120]">
      <Card className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Seleccionar cliente</div>
          <button
            className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50"
            onClick={onClose}
            title="Cerrar"
          >×</button>
        </div>

        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none"
          placeholder="Buscar por nombre, identificación o teléfono…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="mt-3 max-h-72 overflow-auto pr-1 space-y-2">
          {filtered.length === 0 && (
            <div className="text-slate-500 text-sm">No hay clientes que coincidan.</div>
          )}
          {filtered.map(c => (
            <label
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3 cursor-pointer hover:bg-slate-50"
            >
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-slate-500 text-sm">
                  ID: {c.doc || "—"} · Tel: {c.phone || "—"}
                </div>
              </div>
              <input
                type="radio"
                name="client"
                checked={selectedId === c.id}
                onChange={() => setSelectedId(c.id)}
              />
            </label>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm text-slate-600 mb-1">Nota (opcional)</label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none"
            placeholder="Ej. Entrega el viernes…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="default" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => selected && onConfirm({ client: selected, note })}
            disabled={!selected}
          >
            Guardar
          </Button>
        </div>
      </Card>
    </div>
  );
}

function PayDebtModal({ debt, onClose, onApply }) {
  const money = (n) =>
    (Number(n) || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const [amount, setAmount] = React.useState("");
  const [note, setNote] = React.useState("");

  const total = Number(debt?.total || 0);
  const val = Number(amount);
  const valid = val > 0 && val <= total;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-[120]">
      <Card className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">
            Pago a {debt?.client ?? "cliente"}
          </div>
          <button
            className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="text-slate-600 mb-4">
          Deuda actual: <b>{money(total)}</b>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-3 items-center">
          <NumberInput
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min={0}
          />
          <TextInput
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nota (opcional)"
          />
          <Button onClick={() => valid && onApply({ amount: Number(val), note })} disabled={!valid}>
            Aplicar
          </Button>
        </div>

        <div className="text-sm text-slate-500 mt-3">
          Quedará: <b>{money(Math.max(total - (isNaN(val) ? 0 : val), 0))}</b>
        </div>
      </Card>
    </div>
  );
}

function SalesHistoryModal({ debt, onClose }) {
  const money = (n) =>
    (Number(n) || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const fmt = (iso) =>
    iso
      ? new Date(iso).toLocaleString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const items = Array.isArray(debt?.items) ? debt.items : [];
  const total = items.reduce(
    (a, it) => a + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0),
    0
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-[120]">
      <Card className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">
            Historial de ventas — {debt?.client ?? "cliente"}
          </div>
          <button
            className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="text-right text-slate-600 mb-2">
          Total ventas: <b>{money(total)}</b>
        </div>

        {items.length === 0 ? (
          <div className="text-slate-500">Sin ventas a crédito registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Producto</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">Valor</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3">{fmt(it.ts || debt.updatedAt || debt.createdAt)}</td>
                    <td className="p-3">{it.name || "—"}</td>
                    <td className="p-3">{it.qty ?? 0}</td>
                    <td className="p-3">{money(it.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="default" onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}

function UpdateProductModal({ product, onClose, onSave }) {
  const [stock, setStock] = React.useState(product.stock ?? 0);
  const [cost, setCost]   = React.useState(product.cost ?? 0);
  const [price, setPrice] = React.useState(product.price ?? 0);
  const isoToday = new Date().toISOString().slice(0, 10);
  const [addedAt, setAddedAt] = React.useState(product.addedAt || isoToday);

  const valid =
    Number(stock) >= 0 &&
    Number(cost)  >= 0 &&
    Number(price) >= 0 &&
    !!addedAt;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm grid place-items-center">
      <Card className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">Actualizar producto</div>
          <button
            className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="text-slate-600 mb-4">
          {product.name} — <span className="text-slate-500">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Stock</label>
            <NumberInput value={stock} min={0} onChange={(e)=>setStock(Number(e.target.value))}/>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Costo</label>
            <NumberInput value={cost} min={0} onChange={(e)=>setCost(Number(e.target.value))}/>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Precio</label>
            <NumberInput value={price} min={0} onChange={(e)=>setPrice(Number(e.target.value))}/>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Fecha de ingreso</label>
            <TextInput type="date" value={addedAt} onChange={(e)=>setAddedAt(e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="default" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() =>
              valid &&
              onSave({
                stock: Number(stock) || 0,
                cost: Number(cost) || 0,
                price: Number(price) || 0,
                addedAt,
              })
            }
            disabled={!valid}
          >
            Guardar cambios
          </Button>
        </div>
      </Card>
    </div>
  );
}

function ProductHistoryModal({ product, entries, onClose }) {
  const fmt = (iso) =>
    new Date(iso).toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Campos que nos interesan mostrar cuando no hay diff explícito
  const DISPLAY_FIELDS = ["stock", "cost", "price", "addedAt"];

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm grid place-items-center">
      <Card className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">
            Historial — {product.name}
            <span className="text-slate-500 font-normal"> ({product.category})</span>
          </div>
          <button
            className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>

        {(!entries || entries.length === 0) ? (
          <div className="text-slate-500">Sin historial para este producto.</div>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Campo</th>
                  <th className="p-3">Antes</th>
                  <th className="p-3">Después</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, idx) => {
                  const before = e.before || {};
                  const after  = { ...before, ...(e.changes || {}) };
                  const keys = Object.keys(e.changes || {});
                  const fields = keys.length > 0 ? keys : DISPLAY_FIELDS;

                  return fields.map((k, i) => (
                    <tr key={`${idx}-${k}`} className="border-t">
                      {/* Fecha solo en la primera fila del grupo */}
                      <td className="p-3 align-top">
                        {i === 0 ? <span className="whitespace-nowrap">{fmt(e.ts)}</span> : ""}
                      </td>
                      <td className="p-3 align-top">{k}</td>
                      <td className="p-3 align-top">
                        {before[k] ?? (before[k] === 0 ? 0 : "—")}
                      </td>
                      <td className="p-3 align-top">
                        {after[k] ?? (after[k] === 0 ? 0 : "—")}
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="default" onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}

function EditClientModal({ client, onClose, onSave }) {
  const [name, setName]   = React.useState(client?.name  ?? "");
  const [doc, setDoc]     = React.useState(client?.doc   ?? "");
  const [phone, setPhone] = React.useState(client?.phone ?? "");

  const valid = name.trim() && doc.trim() && phone.trim();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center z-[140]">
      <Card className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">Actualizar cliente</div>
          <button
            className="w-9 h-9 grid place-items-center rounded-xl border hover:bg-slate-50"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-2">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Nombre</label>
            <TextInput value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Identificación</label>
            <TextInput value={doc} onChange={(e)=>setDoc(e.target.value)} />
          </div>
           <div>
            <label className="block text-sm text-slate-600 mb-1">Teléfono</label>
            <TextInput value={phone} onChange={(e)=>setPhone(e.target.value)} />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="default" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => valid && onSave({
              name: name.trim(),
              doc: doc.trim(),
              phone: phone.trim(),
            })}
            disabled={!valid}
          >
            Guardar
          </Button>
        </div>
      </Card>
    </div>
  );
}


/* --------- Deuda Clientes --------- */

// --------- Deuda Clientes ---------
/* --------- Deuda Clientes (gestión de clientes + tabla de deudas) --------- */
function DebtsPage({ debts, setDebts, clients, setClients, sales, setSales }) {
  // --- Utils ---
  const money = (n) =>
    (Number(n) || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  // --- Form "Agregar cliente" ---
  const [cName, setCName] = React.useState("");
  const [cDoc, setCDoc] = React.useState("");
  const [cPhone, setCPhone] = React.useState("");

  const validClient = cName.trim() && cDoc.trim() && cPhone.trim();

  const [salesHist, setSalesHist] = React.useState(null); // 👈 modal ventas

  const [paying, setPaying] = React.useState(null);   // deuda seleccionada para pagar

  const [editClient, setEditClient] = React.useState(null);

  const addClient = () => {
    if (!validClient) return;
    const newClient = {
      id: crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      name: cName.trim(),
      doc: cDoc.trim(),
      phone: cPhone.trim(),
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);
    setCName("");
    setCDoc("");
    setCPhone("");
  };

  const deleteClient = (id) =>
  setClients((prev) => prev.filter((c) => c.id !== id));

  // --- Tarjeta "Buscar cliente" ---
  const [q, setQ] = React.useState("");
  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;
    return clients.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(s) ||
        (c.doc || "").toLowerCase().includes(s) ||
        (c.phone || "").toLowerCase().includes(s)
    );
  }, [q, clients]);

  // Flujo de abono con método de pago
const [payMethodFor, setPayMethodFor] = React.useState(null); // {debt, amount, note}
const [cashPayForDebt, setCashPayForDebt] = React.useState(null); // {debt, amount, note}

// Aplica el abono, actualiza deuda y registra movimiento en Caja
const applyDebtPayment = ({ debt, amount, note, method, received = 0, change = 0 }) => {
  const val = Number(amount || 0);

  // 1) Actualizar deuda
  setDebts(prev =>
    prev.map(d => {
      if (d.id !== debt.id) return d;
      const newTotal = Math.max(0, Number(d.total || 0) - val);
      const payments = Array.isArray(d.payments) ? d.payments.slice() : [];
      payments.push({
        ts: new Date().toISOString(),
        amount: val,
        note: note || "",
        method,                    // "Efectivo" | "Transferencia"
        tendered: method === "Efectivo" ? Number(received || 0) : 0,
        change:   method === "Efectivo" ? Number(change   || 0) : 0,
      });
      return {
        ...d,
        total: newTotal,
        status: newTotal <= 0 ? "pagado" : (d.status || "pendiente"),
        payments,
        lastPaymentAt: new Date().toISOString(),
      };
    })
  );

  // 2) Registrar movimiento en Caja como "abono"
  setSales(prev => [
    {
      id: `abono_${Date.now()}`,
      date: new Date().toISOString(),
      productId: null,
      qty: 1,
      unitPrice: val,             // subtotal = amount
      method,
      tendered: method === "Efectivo" ? Number(received || 0) : 0,
      change:   method === "Efectivo" ? Number(change   || 0) : 0,
      type: "abono",              // ⬅️ importante para Caja
      note: `Abono deuda — ${debt.client}`,
    },
    ...prev,
  ]);
};

  // --- Acciones sobre deudas (tabla inferior) ---
const [historyOf, setHistoryOf] = React.useState(null);   // 👈 NUEVO

  // --- Acciones sobre deudas (tabla inferior que ya tenías) ---
  //const markPaid = (id) => setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, status: "pagado" } : d)));
  const viewHistory = (id) => {// 👈 CAMBIADO 
  const d = debts.find((x) => x.id === id);
  if (d) setHistoryOf(d);
};
  //const markSettled = (id) => markPaid(id);

  // --- UI ---
  return (
  <>
    <section className="space-y-8">
      {/* ...tus tarjetas de agregar/buscar cliente... */}

      {/* Tarjetas: Agregar / Buscar cliente */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Agregar cliente */}
  <Card>
    <div className="text-lg font-semibold mb-4">Agregar cliente</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <TextInput
        value={cName}
        onChange={(e) => setCName(e.target.value)}
        placeholder="Nombre"
        className="sm:col-span-2"
      />
      <TextInput
        value={cDoc}
        onChange={(e) => setCDoc(e.target.value)}
        placeholder="Identificación"
      />
      <TextInput
        value={cPhone}
        onChange={(e) => setCPhone(e.target.value)}
        placeholder="Teléfono"
        type="tel"
      />
      <Button onClick={addClient} className="sm:col-span-2" disabled={!validClient}>
        Agregar
      </Button>
    </div>
  </Card>

  {/* Buscar cliente */}
  <Card>
    <div className="text-lg font-semibold mb-4">Buscar cliente</div>
    <TextInput
      value={q}
      onChange={(e) => setQ(e.target.value)}   // <-- usa setQ
      placeholder="Buscar por nombre, identificación o teléfono…"
    />
    <div className="mt-4 max-h-80 overflow-auto pr-1 space-y-2">
      {filtered.length === 0 && (
        <div className="text-slate-500 text-sm">No hay clientes.</div>
      )}
      {filtered.map((c) => (                     // <-- usa filtered
        <div
          key={c.id}
          className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
        >
          <div className="min-w-0">
            <div className="font-medium text-slate-800 truncate">{c.name}</div>
            <div className="text-sm text-slate-500">
              ID: {c.doc || "—"} · Tel: {c.phone || "—"}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="danger" onClick={() => deleteClient(c.id)}> {/* <-- usa deleteClient */}
              Eliminar
            </Button>
            <Button variant="default" onClick={() => setEditClient(c)}>
    Actualizar
  </Button>
          </div>
        </div>
      ))}
    </div>
  </Card>
</div>

      {/* Tabla de deudas */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="min-w-full table-fixed">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Teléfono</th>
              <th className="p-3 text-left">Nota</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Deuda</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {debts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  No hay deudas registradas.
                </td>
              </tr>
            )}

            {debts.map((d) => (
              <tr key={d.id}>
                <td className="p-3">{d.client}</td>
                <td className="p-3">{d.phone}</td>
                <td className="p-3">{d.note}</td>
                <td className="p-3">
                  <span
                    className={
                      "rounded-full px-3 py-1 text-sm " +
                      (d.status === "pagado"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700")
                    }
                  >
                    {d.status ?? "pendiente"}
                  </span>
                </td>
                <td className="p-3">{money(d.total)}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
                    <button
                      onClick={() => setPaying(d)}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Registrar pago
                    </button>
                    <button
                      onClick={() => viewHistory(d.id)}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      Ver historial de Pagos
                    </button>
                     <button
     onClick={() => setSalesHist(d)}
     className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 whitespace-nowrap"
   >
     Ver historial de Ventas
   </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {/* Modal de pago */}
{paying && (
  <PayDebtModal
    debt={paying}
    onClose={() => setPaying(null)}
    onApply={({ amount, note }) => {
      // ⬇️ Reemplaza todo el contenido por esto:
      setPayMethodFor({ debt: paying, amount: Number(amount || 0), note: note || "" });
      setPaying(null);
    }}
  />
)}
{editClient && (
  <EditClientModal
    client={editClient}
    onClose={() => setEditClient(null)}
    onSave={({ name, doc, phone }) => {
      const id = editClient.id;

      // 1) Actualiza el contacto en la lista de clientes
      setClients(prev =>
        prev.map(x => x.id === id ? { ...x, name, doc, phone } : x)
      );

      // 2) (Opcional pero recomendado) sincroniza nombre/teléfono en deudas existentes
      setDebts(prev =>
        prev.map(d => {
          const matchesById   = d.clientId && d.clientId === id;
          const matchesByName = !d.clientId && d.client === editClient.name; // compatibilidad de deudas viejas
          if (matchesById || matchesByName) {
            return { ...d, client: name, phone };
          }
          return d;
        })
      );

      setEditClient(null);
    }}
  />
)}
{/* Método de abono (Efectivo / Transferencia) */}
{payMethodFor && (
  <DebtPaymentMethodModal
    debt={payMethodFor.debt}
    amount={payMethodFor.amount}
    onClose={() => setPayMethodFor(null)}
    onBack={() => {
      // volver al modal de monto
      setPaying(payMethodFor.debt);
      setPayMethodFor(null);
    }}
    onConfirm={(method) => {
      if (method === "Efectivo") {
        setCashPayForDebt(payMethodFor);    // pedir recibido/cambio
        setPayMethodFor(null);
      } else {
        // Transferencia
        applyDebtPayment({ ...payMethodFor, method: "Transferencia" });
        setPayMethodFor(null);
      }
    }}
  />
)}

{/* Pago en efectivo del abono (recibido / cambio) */}
{cashPayForDebt && (
  <DebtCashPaymentModal
    debt={cashPayForDebt.debt}
    amount={cashPayForDebt.amount}
    onClose={() => setCashPayForDebt(null)}
    onBack={() => {
      setPayMethodFor(cashPayForDebt);
      setCashPayForDebt(null);
    }}
    onConfirm={({ received, change }) => {
      applyDebtPayment({
        ...cashPayForDebt,
        method: "Efectivo",
        received,
        change,
      });
      setCashPayForDebt(null);
    }}
  />
)}

{/* 👇 NUEVO: Modal Historial de Ventas */}
    {salesHist && (
      <SalesHistoryModal
        debt={salesHist}
        onClose={() => setSalesHist(null)}   // 👈 cierre del modal
      />
    )}

{/* 👇 NUEVO: modal de historial de pagos */}
{historyOf && (
  <DebtPaymentsHistoryModal
    debt={historyOf}
    onClose={() => setHistoryOf(null)}
  />
)}

  </>
);
}

/* --------- Administración (categorías / productos: sin tocar precios/stocks desde inventario) --------- */
function AdminPage({
  products,
  setProducts,
  categories,
  setCategories,
  setProdHistory, // 👈 NUEVO
  prodHistory,      // 👈 NUEVO
}) {
  // util simple para hoy en YYYY-MM-DD (para input[type=date])
  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  const [histProd, setHistProd] = React.useState(null); // 👈 NUEVO

  const [newCat, setNewCat] = React.useState("");
  const [newProd, setNewProd] = React.useState({
    name: "",
    category: categories[0] || "",
    cost: "",
    price: "",
    stock: "",
    addedAt: todayStr(), // fecha de ingreso (por defecto hoy)
  });

  // NUEVO: modal de edición
  const [editProd, setEditProd] = React.useState(null);

  const addCategory = () => {
    const name = newCat.trim();
    if (!name) return;
    if (categories.includes(name)) return;
    setCategories((prev) => [...prev, name]);
    setNewCat("");
  };

  const renameCategory = (oldName) => {
    const name = prompt("Nuevo nombre de categoría:", oldName);
    if (!name) return;
    if (categories.includes(name)) return;
    setCategories((prev) => prev.map((c) => (c === oldName ? name : c)));
    setProducts((prev) =>
      prev.map((p) => (p.category === oldName ? { ...p, category: name } : p))
    );
  };

  const deleteCategorySafe = (name) => {
    const inUse = products.some((p) => p.category === name);
    if (inUse) return; // bloqueado si está en uso
    setCategories((prev) => prev.filter((c) => c !== name));
  };

  const addProduct = () => {
    const { name, category, cost, price, stock, addedAt } = newProd;
    if (!name || !category) return;
    const p = {
      id: `${Date.now()}`,
      name: name.trim(),
      category,
      cost: Number(cost) || 0,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      addedAt: addedAt || todayStr(),
    };
    setProducts((prev) => [p, ...prev]);
    setNewProd({
      name: "",
      category: categories[0] || "",
      cost: "",
      price: "",
      stock: "",
      addedAt: todayStr(),
    });
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  React.useEffect(() => saveLS(LS_KEYS.CATEGORIES, categories), [categories]);
  React.useEffect(() => saveLS(LS_KEYS.PRODUCTS, products), [products]);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categorías */}
        <Card>
          <div className="text-lg font-semibold mb-4">Categorías</div>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <TextInput
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Nueva categoría"
            />
            <Button onClick={addCategory}>Agregar</Button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">En uso</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => {
                  const inUse = products.some((p) => p.category === c);
                  return (
                    <tr key={c} className="border-t">
                      <td className="p-3">{c}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            inUse
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {inUse ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <Button variant="default" onClick={() => renameCategory(c)}>
                          Renombrar
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteCategorySafe(c)}
                          disabled={inUse}
                          title={inUse ? "No se puede eliminar: categoría en uso" : ""}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Agregar producto */}
        <Card>
          <div className="text-lg font-semibold mb-4">Agregar producto</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              value={newProd.name}
              onChange={(e) => setNewProd((p) => ({ ...p, name: e.target.value }))}
              placeholder="Producto"
            />
            <Select
              value={newProd.category}
              onChange={(e) =>
                setNewProd((p) => ({ ...p, category: e.target.value }))
              }
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
            <NumberInput
  value={newProd.cost}
  onChange={(e) => {
    const v = e.target.value;
    setNewProd((p) => ({ ...p, cost: v === "" ? "" : Number(v) }));
  }}
  placeholder="Costo"
  min={0}
/>

<NumberInput
  value={newProd.price}
  onChange={(e) => {
    const v = e.target.value;
    setNewProd((p) => ({ ...p, price: v === "" ? "" : Number(v) }));
  }}
  placeholder="Precio"
  min={0}
/>

<NumberInput
  value={newProd.stock}
  onChange={(e) => {
    const v = e.target.value;
    setNewProd((p) => ({ ...p, stock: v === "" ? "" : Number(v) }));
  }}
  placeholder="Stock"
  min={0}
/>

            <TextInput
              type="date"
              value={newProd.addedAt}
              onChange={(e) =>
                setNewProd((p) => ({ ...p, addedAt: e.target.value }))
              }
            />
            <Button onClick={addProduct} className="sm:col-span-2">
              Agregar
            </Button>
          </div>
        </Card>
      </div>

      {/* Productos */}
      <Card>
        <div className="text-lg font-semibold mb-4">
          Productos (editar / stock / eliminar)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="p-3">Producto</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Costo</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Ingreso</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <TextInput
                      value={p.name}
                      onChange={(e) =>
                        setProducts((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, name: e.target.value } : x
                          )
                        )
                      }
                    />
                  </td>
                  <td className="p-3">
                    <Select
                      value={p.category}
                      onChange={(e) =>
                        setProducts((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, category: e.target.value } : x
                          )
                        )
                      }
                    >
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </Select>
                  </td>
                  <td className="p-3">
                    <NumberInput
                      value={p.cost}
                      onChange={(e) =>
                        setProducts((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, cost: Number(e.target.value) } : x
                          )
                        )
                      }
                      min={0}
                    />
                  </td>
                  <td className="p-3">
                    <NumberInput
                      value={p.price}
                      onChange={(e) =>
                        setProducts((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, price: Number(e.target.value) } : x
                          )
                        )
                      }
                      min={0}
                    />
                  </td>
                  <td className="p-3">
                    <TextInput
                      type="date"
                      value={p.addedAt || ""}
                      onChange={(e) =>
                        setProducts((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, addedAt: e.target.value } : x
                          )
                        )
                      }
                    />
                  </td>

                  {/* NUEVO: Stock sin botones -1/+1 */}
                  <td className="p-3">
                    <div className="min-w-[3rem] text-center">{p.stock ?? 0}</div>
                  </td>

                  <td className="p-3">
                    {/* ÚNICO CAMBIO: misma línea, sin wrap */}
                    <div className="flex gap-2 items-center flex-nowrap whitespace-nowrap">
                      <Button variant="default" onClick={() => setEditProd(p)}>
                        Actualizar
                      </Button>
                      <Button variant="danger" onClick={() => deleteProduct(p.id)}>
                        Eliminar
                      </Button>
                      <Button variant="default" onClick={() => setHistProd(p)}>
                        Historial
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de Actualización */}
      {editProd && (
  <UpdateProductModal
    product={editProd}
    onClose={() => setEditProd(null)}
    onSave={(changes) => {
      // 1) Guardar snapshot ANTES del cambio
      setProducts((prev) => {
        const before = prev.find((x) => x.id === editProd.id);
        if (before && setProdHistory) {
          setProdHistory((h = {}) => {
            const next = { ...h };
            const arr = Array.isArray(next[before.id]) ? [...next[before.id]] : [];
            arr.unshift({
              ts: new Date().toISOString(),
              before: {
                id: before.id,
                name: before.name,
                category: before.category,
                cost: before.cost,
                price: before.price,
                stock: before.stock,
                addedAt: before.addedAt,
              },
              changes: { ...changes }, // opcional: qué se cambió
            });
            next[before.id] = arr;
            return next;
          });
        }

        // 2) Aplicar los cambios al producto
        return prev.map((x) =>
          x.id === editProd.id ? { ...x, ...changes } : x
        );
      });

      setEditProd(null);
    }}
  />
  )}
 
  {/* 👇 NUEVO: Modal de Historial */}
  {histProd && (
  <ProductHistoryModal
    product={histProd}
    entries={(prodHistory && prodHistory[histProd.id]) || []}
    onClose={() => setHistProd(null)}
  />
    )}
    </div>
  );
}

function CashboxPage({ sales, products, cashOpenings, setCashOpenings, cashClosed, setCashClosed }) {
  const money = (n) =>
    (Number(n) || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const today = new Date().toISOString().slice(0, 10);
  const [day, setDay] = React.useState(today);
  const opening = Number(cashOpenings?.[day] || 0);

   const isClosed = !!(cashClosed && cashClosed[day]);
  const closeDay   = () => setCashClosed(prev => ({ ...prev, [day]: true  }));
  const reopenDay  = () => setCashClosed(prev => ({ ...prev, [day]: false }));

  const setOpening = (val) => {
    const n = Number(val || 0);
    setCashOpenings((prev) => ({ ...prev, [day]: n }));
  };

  const daySales = React.useMemo(
    () => sales.filter((s) => (s.date || "").slice(0, 10) === day),
    [sales, day]
  );

  const findProd = (id) => products.find((p) => p.id === id) || null;

  // Totales del día (SOLO ventas, excluye abonos)
const totalVentas = daySales
  .filter(s => s.type !== "abono")
  .reduce((a, s) => a + (s.qty || 0) * (s.unitPrice || 0), 0);

  // Efectivo (entradas/salidas)
  const efectivoRecibido = daySales
    .filter((s) => s.method === "Efectivo")
    .reduce((a, s) => a + Number(s.tendered || 0), 0);

  const efectivoDevuelto = daySales
    .filter((s) => s.method === "Efectivo")
    .reduce((a, s) => a + Number(s.change || 0), 0);

  const efectivoNeto = opening + efectivoRecibido - efectivoDevuelto;

  // Desglose por método (SOLO ventas, excluye abonos)
const ventasPorMetodo = daySales
  .filter(s => s.type !== "abono")
  .reduce((acc, s) => {
    const sub = (s.qty || 0) * (s.unitPrice || 0);
    acc[s.method] = (acc[s.method] || 0) + sub;
    return acc;
  }, {});

  return (
  <div className="space-y-6">
    {/* FILA SUPERIOR: (1) Día + Apertura + Guardar  |  (2) Estado de caja */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* (1) Día + Apertura + Guardar */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-[160px_160px_auto] gap-3 items-end">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Día</label>
            <input
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Apertura de caja</label>
            <input
              type="number"
              min={0}
              value={opening}
              onChange={(e) => setOpening(e.target.value)}
              className="w-full max-w-[160px] rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
            />
          </div>

          <Button
            onClick={() => setOpening(opening)}
            className="justify-self-start sm:justify-self-end"
          >
            Guardar
          </Button>
        </div>
      </Card>

      {/* (2) Estado de caja */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-slate-500">Estado de caja — {day}</div>
            <div className={`text-2xl font-bold ${isClosed ? "text-red-600" : "text-emerald-600"}`}>
              {isClosed ? "CERRADA" : "ABIERTA"}
            </div>
            <div className="text-sm text-slate-500 mt-2">
              Si está cerrada, no se pueden registrar ventas para ese día.
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs ${isClosed ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}
          >
            {isClosed ? "Cerrada" : "Abierta"}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="danger" onClick={closeDay} disabled={isClosed}>
            Cerrar caja
          </Button>
          <Button onClick={reopenDay} disabled={!isClosed}>
            Re abrir caja
          </Button>
        </div>
      </Card>
    </div>

    {/* FILA SIGUIENTE: métricas del día (dos mitades) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Card>
        <div className="text-sm text-slate-500">Apertura de caja (día seleccionado)</div>
        <div className="text-3xl font-bold">{money(opening)}</div>
        <div className="mt-3 text-sm text-slate-500">
          Efectivo recibido: <b>{money(efectivoRecibido)}</b> ·
          {" "}Cambio devuelto: <b>{money(efectivoDevuelto)}</b>
          <div className="mt-1">
            Caja final estimada: <b>{money(efectivoNeto)}</b>
          </div>
        </div>
      </Card>

      <Card>
        <div className="text-sm text-slate-500">Ventas del día (todas las formas de pago)</div>
        <div className="text-3xl font-bold">{money(totalVentas)}</div>
        <div className="mt-3 text-sm text-slate-500 space-y-1">
          <div>Efectivo: <b>{money(ventasPorMetodo["Efectivo"] || 0)}</b></div>
          <div>Transferencia: <b>{money(ventasPorMetodo["Transferencia"] || 0)}</b></div>
          <div>Fiado: <b>{money(ventasPorMetodo["Fiado"] || 0)}</b></div>
        </div>
      </Card>
    </div>
      {/* Tabla de movimientos */}
      <Card>
        <div className="text-lg font-semibold mb-3">Movimientos del día</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="p-3">Hora</th>
                <th className="p-3">Producto</th>
                <th className="p-3">Cant.</th>
                <th className="p-3">Subtotal</th>
                <th className="p-3">Método</th>
                <th className="p-3">Recibido</th>
                <th className="p-3">Devolución</th>
                <th className="p-3">Neto caja</th>
              </tr>
            </thead>
            <tbody>
              {daySales.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-slate-500" colSpan={8}>
                    No hay movimientos para este día.
                  </td>
                </tr>
              ) : (
                daySales.map((s) => {
                  const prod = findProd(s.productId);
                  const sub = (s.qty || 0) * (s.unitPrice || 0);
                  const rec = Number(s.tendered || 0);
                  const chg = Number(s.change || 0);
                  const net = s.method === "Efectivo" ? rec - chg : 0;
                  const time = new Date(s.date).toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                  // ⬇️ NUEVO
const label = s.type === "abono" ? (s.note || "Abono de deuda") : (prod?.name || "-");
const qtyShown = s.type === "abono" ? "—" : s.qty;
                  return (
                    <tr key={s.id} className="border-t">
                      <td className="p-3 whitespace-nowrap">{time}</td>
                      <td className="p-3">{label}</td>      
                      <td className="p-3">{qtyShown}</td>   
                      <td className="p-3">{money(sub)}</td>
                      <td className="p-3">{s.method}</td>
                      <td className="p-3">{s.method === "Efectivo" ? money(rec) : "—"}</td>
                      <td className="p-3">{s.method === "Efectivo" ? money(chg) : "—"}</td>
                      <td className="p-3">{s.method === "Efectivo" ? money(net) : "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* =========================================================
   MAIN APP (orquestador)
========================================================= */
function MainApp({ onLogout }) {
  // Estado raíz de datos (persistente)
  const [products, setProducts] = React.useState(() =>
    loadS(LS_KEYS.PRODUCTS, [
      { id: "1", name: "Cerveza Aguila Negra", category: "Cervezas", cost: 2500, price: 4000, stock: 30 },
      { id: "2", name: "Agua Mineral", category: "Aguas", cost: 2000, price: 3000, stock: 30 },
      { id: "3", name: "Gatorade Rojo", category: "Gatorade", cost: 3000, price: 5000, stock: 30 },
    ])
  );
  const [categories, setCategories] = React.useState(() =>
    loadS(LS_KEYS.CATEGORIES, ["Cervezas", "Aguas", "Gatorade"])
  );

  const [clients, setClients] = React.useState(() =>
    loadS(LS_KEYS.CLIENTS, [])         // 👈 NUEVO
  );
  React.useEffect(() => {
    saveLS(LS_KEYS.CLIENTS, clients);   // 👈 NUEVO
  }, [clients]);

  const [cashOpenings, setCashOpenings] = React.useState(() =>
  loadS(LS_KEYS.CASH_OPENINGS, {}) // { "YYYY-MM-DD": number }
);
React.useEffect(() => {
  saveLS(LS_KEYS.CASH_OPENINGS, cashOpenings);
}, [cashOpenings]);

const [cashClosed, setCashClosed] = React.useState(() =>
  loadS(LS_KEYS.CASH_CLOSED, {})           // { "2025-09-27": true }
);
React.useEffect(() => {
  saveLS(LS_KEYS.CASH_CLOSED, cashClosed);
}, [cashClosed]);

  // justo junto a los otros useState de MainApp
const [prodHistory, setProdHistory] = React.useState(() =>
  loadS(LS_KEYS.PRODUCT_HISTORY, {})
);
React.useEffect(() => {
  saveLS(LS_KEYS.PRODUCT_HISTORY, prodHistory);
}, [prodHistory]);

  const [sales, setSales] = React.useState(() => loadS(LS_KEYS.SALES, []));
  const [debts, setDebts] = React.useState(() => loadS(LS_KEYS.DEBTS, []));

  const [page, setPage] = React.useState("summary");    //Se cambia la pestaña por Default al loguearse
  const [navOpen, setNavOpen] = React.useState(true);

  // >>> Añadido: persistir cambios de DEBTS y PRODUCTS globalmente <<<
  React.useEffect(() => {
    saveLS(LS_KEYS.DEBTS, debts);
  }, [debts]);

  React.useEffect(() => {
    saveLS(LS_KEYS.PRODUCTS, products);
  }, [products]);

  const renderPage = () => {
    switch (page) {
      case "summary":
        return <Summary products={products} sales={sales} debts={debts} />;
      case "inventory":
        return (
          <InventoryPage
            products={products}
            setProducts={setProducts}
            sales={sales}
            setSales={setSales}
            categories={categories}
            clients={clients}
            setDebts={setDebts}
            cashClosed={cashClosed} 
          />
        );
      case "debts":
        return (
          <DebtsPage
            products={products}
            setProducts={setProducts}   // <- añadido para descontar stock desde Deudas
            debts={debts}
            setDebts={setDebts}
            clients={clients}           // 👈 NUEVO
            setClients={setClients}     // 👈 NUEVO
            sales={sales}            // ⬅️ NUEVO
            setSales={setSales}      // ⬅️ NUEVO
          />
        );
        case "cashbox":
  return (
    <CashboxPage
      sales={sales}
      products={products}
      cashOpenings={cashOpenings}
      setCashOpenings={setCashOpenings}
      cashClosed={cashClosed}
      setCashClosed={setCashClosed}
    />
  );      
      case "admin":
        return (
          <AdminPage
            products={products}
            setProducts={setProducts}
            categories={categories}
            setCategories={setCategories}
            setProdHistory={setProdHistory}   // 👈 NUEVO
            prodHistory={prodHistory}        // 👈 NUEVO
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid grid-cols-[auto_1fr]">
        <Sidebar
          open={navOpen}
          setOpen={setNavOpen}
          page={page}
          setPage={setPage}
          onLogout={onLogout}
        />
        {/* min-w-0 evita franja blanca al colapsar */}
        <main className="flex-1 min-w-0 p-6">{renderPage()}</main>
      </div>
    </div>
  );
}

/* =========================================================
   APP (compuerta de login directa)
========================================================= */
export default function App() {
  const [authed, setAuthed] = React.useState(() =>
    loadS(LS_KEYS.SESSION, false)
  );
  React.useEffect(() => {
    saveLS(LS_KEYS.SESSION, authed);
  }, [authed]);

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  return <MainApp onLogout={() => setAuthed(false)} />;
}
