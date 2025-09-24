import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "tailwindcss/tailwind.css";

/* ------------------ Config Login (hardcode) ------------------ */
const AUTH = { USER: "admin", PASS: "1234" }; // 👈 cámbialos aquí

/* ------------------ Persistencia ------------------ */
const LS_KEYS = {
  PRODUCTS: "liq_products_v1",
  SALES: "liq_sales_v1",
  DEBTS: "liq_debts_v1",
  AUTH: "liq_auth_v1", // guarda si el usuario quedó logueado
};

const loadLS = (k, fb) => {
  try {
    const r = localStorage.getItem(k);
    return r ? JSON.parse(r) : fb;
  } catch {
    return fb;
  }
};
const saveLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* ------------------ UI pequeños ------------------ */
function Card({ title, children }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-md hover:shadow-lg transition">
      {title && (
        <h3 className="mb-2 text-sm font-medium text-gray-500">{title}</h3>
      )}
      <div>{children}</div>
    </div>
  );
}
function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      {...props}
    />
  );
}
function Select({ className = "", ...props }) {
  return (
    <select
      className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      {...props}
    />
  );
}
function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-2xl bg-blue-600 text-white px-4 py-2 font-medium shadow hover:bg-blue-700 transition disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
function Badge({ children, tone = "gray" }) {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        tones[tone] || tones.gray
      }`}
    >
      {children}
    </span>
  );
}

/* ------------------ Datos iniciales ------------------ */
const DEFAULT_PRODUCTS = [
  {
    id: uuidv4(),
    name: "Cerveza Club Colombia Lata 330ml",
    category: "Cervezas",
    price: 4500,
    cost: 3000,
    stock: 48,
  },
  {
    id: uuidv4(),
    name: "Agua Cristal 600ml",
    category: "Aguas",
    price: 2500,
    cost: 1200,
    stock: 36,
  },
  {
    id: uuidv4(),
    name: "Gatorade Naranja 500ml",
    category: "Gatorade",
    price: 6500,
    cost: 3500,
    stock: 24,
  },
];

/* ------------------ Helpers de deuda ------------------ */
function normalizeDebt(d) {
  // { id, name, phone, note, balance, status, payments: [{id, amount, createdAt, note}] }
  return {
    id: d.id || uuidv4(),
    name: d.name || "",
    phone: d.phone || "",
    note: d.note || "",
    balance: Number(d.balance || 0),
    status: d.status || (Number(d.balance || 0) <= 0 ? "saldada" : "pendiente"),
    payments: Array.isArray(d.payments) ? d.payments : [],
  };
}

/* ------------------ Login Screen (sin texto demo) ------------------ */
function Login({ onSuccess }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [tries, setTries] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setErr("");
    setLoading(true);

    setTimeout(() => {
      const ok = user === AUTH.USER && pass === AUTH.PASS;
      if (ok) {
        onSuccess();
      } else {
        setTries((t) => t + 1);
        setErr("Usuario o contraseña incorrectos");
        setPass("");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-lg">
        <h1 className="text-xl font-bold mb-1">Licorería</h1>
        <p className="text-sm text-gray-600 mb-6">Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Usuario</label>
            <Input
              placeholder="usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Contraseña</label>
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder="contraseña"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="pr-20"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-lg border bg-white hover:bg-gray-50"
                disabled={loading}
              >
                {show ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {err && (
            <div className="text-xs text-red-600">
              {err} {tries > 0 && <span className="text-gray-500">({tries} intento{tries > 1 ? "s" : ""})</span>}
            </div>
          )}

          <Button type="submit" className="w-full bg-gray-900" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center">
                <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Entrando…
              </span>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

/* =======================================================
   APP (solo maneja autenticación)
======================================================= */
export default function App() {
  const [authed, setAuthed] = useState(() => loadLS(LS_KEYS.AUTH, false));
  useEffect(() => saveLS(LS_KEYS.AUTH, authed), [authed]);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

/* =======================================================
   Dashboard (toda la app después del login)
======================================================= */
function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("inventory"); // 'inventory' | 'debts'

  // Inventario/Ventas
  const [products, setProducts] = useState(() =>
    loadLS(LS_KEYS.PRODUCTS, DEFAULT_PRODUCTS)
  );
  const [sales, setSales] = useState(() => loadLS(LS_KEYS.SALES, []));
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");

  // Deudas
  const [debts, setDebts] = useState(() =>
    loadLS(LS_KEYS.DEBTS, []).map(normalizeDebt)
  );

  useEffect(() => saveLS(LS_KEYS.PRODUCTS, products), [products]);
  useEffect(() => saveLS(LS_KEYS.SALES, sales), [sales]);
  useEffect(() => saveLS(LS_KEYS.DEBTS, debts), [debts]);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = q.toLowerCase();
    return products.filter(
      (p) =>
        (categoryFilter === "Todos" || p.category === categoryFilter) &&
        (p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term))
    );
  }, [products, q, categoryFilter]);

  const totals = useMemo(() => {
    const inventoryValue = products.reduce((a, p) => a + p.cost * p.stock, 0);
    const retailValue = products.reduce((a, p) => a + p.price * p.stock, 0);
    const totalSales = sales.reduce((a, s) => a + s.unitPrice * s.qty, 0);
    const cogs = sales.reduce((a, s) => {
      const prod = products.find((p) => p.id === s.productId);
      return a + (prod ? prod.cost * s.qty : 0);
    }, 0);
    const profit = totalSales - cogs;
    return { inventoryValue, retailValue, totalSales, profit };
  }, [products, sales]);

  function addProduct(p) {
    setProducts((prev) => [
      ...prev,
      {
        ...p,
        id: uuidv4(),
        stock: Number(p.stock || 0),
        price: Number(p.price || 0),
        cost: Number(p.cost || 0),
      },
    ]);
  }
  const updateProduct = (id, patch) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSales((prev) => prev.filter((s) => s.productId !== id));
  };
  const adjustStock = (id, delta) =>
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p
      )
    );
  const recordSale = (productId, qty, unitPrice) => {
    const product = products.find((p) => p.id === productId);
    qty = Number(qty);
    unitPrice = Number(unitPrice);
    if (!product || qty <= 0) return;
    if (qty > product.stock) return alert("No hay stock suficiente");
    setSales((prev) => [
      {
        id: uuidv4(),
        productId,
        qty,
        unitPrice,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    adjustStock(productId, -qty);
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header + Tabs + Logout */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Licorería</h1>
          <p className="text-gray-600">Control de inventario, ventas y cartera.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-2xl border p-1 bg-white shadow-sm">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "inventory"
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Inventario y Ventas
            </button>
            <button
              onClick={() => setActiveTab("debts")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "debts"
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Deuda Clientes
            </button>
          </div>

          <Button className="bg-gray-900" onClick={onLogout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      {activeTab === "inventory" ? (
        <>
          {/* KPIs */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="Valor de inventario (costo)">
              <div className="text-2xl font-semibold">
                ${totals.inventoryValue.toLocaleString()}
              </div>
            </Card>
            <Card title="Valor de inventario (precio)">
              <div className="text-2xl font-semibold">
                ${totals.retailValue.toLocaleString()}
              </div>
            </Card>
            <Card title="Ventas acumuladas">
              <div className="text-2xl font-semibold">
                ${totals.totalSales.toLocaleString()}
              </div>
            </Card>
            <Card title="Utilidad bruta acumulada">
              <div
                className={`text-2xl font-semibold ${
                  totals.profit < 0 ? "text-red-600" : ""
                }`}
              >
                ${totals.profit.toLocaleString()}
              </div>
            </Card>
          </section>

          {/* Filtros */}
          <section className="mb-4 grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 md:col-span-8">
              <Input
                placeholder="Buscar producto o categoría…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </section>

          {/* Alta rápida */}
          <section className="mb-6">
            <AddProductForm onAdd={addProduct} />
          </section>

          {/* Tabla de productos */}
          <section className="mb-10">
            <div className="rounded-2xl border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Producto</th>
                    <th className="p-3 text-left">Categoría</th>
                    <th className="p-3 text-right">Costo</th>
                    <th className="p-3 text-right">Precio</th>
                    <th className="p-3 text-right">Stock</th>
                    <th className="p-3 text-right">Valor (costo)</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="p-3">
                        <Input
                          value={p.name}
                          onChange={(e) =>
                            updateProduct(p.id, { name: e.target.value })
                          }
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={p.category}
                          onChange={(e) =>
                            updateProduct(p.id, { category: e.target.value })
                          }
                        />
                      </td>
                      <td className="p-3 text-right">
                        <Input
                          type="number"
                          min="0"
                          value={p.cost}
                          onChange={(e) =>
                            updateProduct(p.id, {
                              cost: Number(e.target.value),
                            })
                          }
                          className="text-right"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <Input
                          type="number"
                          min="0"
                          value={p.price}
                          onChange={(e) =>
                            updateProduct(p.id, {
                              price: Number(e.target.value),
                            })
                          }
                          className="text-right"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            className="border"
                            type="button"
                            onClick={() => adjustStock(p.id, -1)}
                          >
                            -1
                          </Button>
                          <Input
                            type="number"
                            min="0"
                            value={p.stock}
                            onChange={(e) =>
                              updateProduct(p.id, {
                                stock: Math.max(0, Number(e.target.value)),
                              })
                            }
                            className="w-24 text-right"
                          />
                          <Button
                            className="border"
                            type="button"
                            onClick={() => adjustStock(p.id, +1)}
                          >
                            +1
                          </Button>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        ${(p.cost * p.stock).toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <RecordSaleButton
                            product={p}
                            onSale={recordSale}
                          />
                          <Button
                            className="border text-red-600"
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td
                        className="p-4 text-center text-gray-500"
                        colSpan={7}
                      >
                        Sin resultados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Ventas recientes */}
          <section className="mb-20">
            <h2 className="mb-3 text-lg font-semibold">Ventas recientes</h2>
            <div className="rounded-2xl border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Producto</th>
                    <th className="p-3 text-right">Cantidad</th>
                    <th className="p-3 text-right">P. Unidad</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 && (
                    <tr>
                      <td
                        className="p-4 text-center text-gray-500"
                        colSpan={5}
                      >
                        Aún no hay ventas
                      </td>
                    </tr>
                  )}
                  {sales.map((s) => {
                    const prod = products.find((p) => p.id === s.productId);
                    return (
                      <tr key={s.id} className="border-t">
                        <td className="p-3">
                          {new Date(s.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3">
                          {prod ? prod.name : "(eliminado)"}
                        </td>
                        <td className="p-3 text-right">{s.qty}</td>
                        <td className="p-3 text-right">
                          ${s.unitPrice.toLocaleString()}
                        </td>
                        <td className="p-3 text-right">
                          ${(s.unitPrice * s.qty).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <DebtsTab debts={debts} setDebts={setDebts} products={products} />
      )}

      <footer className="text-center text-xs text-gray-500">
        <p>Software Developer JHB</p>
      </footer>
    </div>
  );
}

/* ------------------ Inventario: Alta rápida ------------------ */
function AddProductForm({ onAdd }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [stock, setStock] = useState(0);

  function submit(e) {
    e.preventDefault();
    if (!name) return;
    onAdd({
      name,
      category,
      price: Number(price),
      cost: Number(cost),
      stock: Number(stock),
    });
    setName("");
    setCategory("");
    setPrice(0);
    setCost(0);
    setStock(0);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border bg-white p-4 shadow-sm grid grid-cols-12 gap-3"
    >
      <Input
        placeholder="Producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="col-span-12 md:col-span-2"
      />
      <Input
        placeholder="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="col-span-12 md:col-span-2"
      />
      <Input
        type="number"
        min="0"
        placeholder="Costo"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        className="col-span-12 md:col-span-2"
      />
      <Input
        type="number"
        min="0"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="col-span-12 md:col-span-2"
      />
      <Input
        type="number"
        min="0"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="col-span-12 md:col-span-2"
      />
      <div className="col-span-12 md:col-span-2 flex md:justify-end">
        <Button type="submit" className="bg-gray-900 w-full md:w-auto">
          Agregar
        </Button>
      </div>
    </form>
  );
}

/* ------------------ Inventario: Registrar venta ------------------ */
function RecordSaleButton({ product, onSale }) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [unitPrice, setUnitPrice] = useState(product.price);
  useEffect(() => setUnitPrice(product.price), [product.price]);

  return (
    <div className="relative">
      <Button className="border" type="button" onClick={() => setOpen((o) => !o)}>
        Vender
      </Button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-2xl border bg-white p-4 shadow-xl">
          <h4 className="mb-2 text-sm font-semibold">Registrar venta</h4>
          <div className="mb-2 text-xs text-gray-500">{product.name}</div>
          <div className="mb-3 grid grid-cols-3 gap-2">
            <Input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
            <Input
              type="number"
              min="0"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="col-span-2"
            />
          </div>
          <div className="mb-3 text-right text-sm">
            Subtotal: <b>${(qty * unitPrice).toLocaleString()}</b>
          </div>
          <div className="flex justify-end gap-2">
            <Button className="border" type="button" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-gray-900 text-white"
              type="button"
              onClick={() => {
                onSale(product.id, qty, unitPrice);
                setOpen(false);
              }}
            >
              Guardar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================================================
   Pestaña: Deuda Clientes (con picker de productos)
======================================================= */
function DebtsTab({ debts, setDebts, products }) {
  const totalDebt = useMemo(
    () => debts.reduce((a, d) => a + Number(d.balance || 0), 0),
    [debts]
  );

  const addDebt = (d) =>
    setDebts((prev) => [normalizeDebt({ ...d, id: uuidv4() }), ...prev]);
  const deleteDebt = (id) =>
    setDebts((prev) => prev.filter((d) => d.id !== id));
  const updateDebt = (id, patch) =>
    setDebts((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const next = normalizeDebt({ ...d, ...patch });
        if (next.balance <= 0) {
          next.balance = 0;
          next.status = "saldada";
        }
        return next;
      })
    );
  const addPayment = (id, amount, pnote = "") =>
    setDebts((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const a = Math.max(0, Number(amount || 0));
        if (a <= 0) return d;
        const newBalance = Math.max(0, Number(d.balance || 0) - a);
        const payment = {
          id: uuidv4(),
          amount: a,
          createdAt: new Date().toISOString(),
          note: pnote,
        };
        const next = {
          ...d,
          balance: newBalance,
          payments: [payment, ...(d.payments || [])],
          status: newBalance <= 0 ? "saldada" : d.status,
        };
        if (next.status === "saldada") next.balance = 0;
        return next;
      })
    );
  const markSettled = (id) =>
    setDebts((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, balance: 0, status: "saldada" } : d
      )
    );

  return (
    <>
      {/* KPIs de cartera */}
      <section className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Clientes con deuda">
          <div className="text-2xl font-semibold">{debts.length}</div>
        </Card>
        <Card title="Total adeudado">
          <div className="text-2xl font-semibold">
            ${totalDebt.toLocaleString()}
          </div>
        </Card>
        <Card title="Fecha">
          <div className="text-2xl font-semibold">
            {new Date().toLocaleDateString()}
          </div>
        </Card>
      </section>

      {/* Alta rápida de deuda */}
      <section className="mb-6">
        <AddDebtForm onAdd={addDebt} products={products} />
      </section>

      {/* Tabla de deudas */}
      <section className="mb-20">
        <div className="rounded-2xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Teléfono</th>
                <th className="p-3 text-left">Nota</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-right">Deuda</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {debts.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={6}>
                    No hay deudas registradas
                  </td>
                </tr>
              )}
              {debts.map((d) => (
                <DebtRow
                  key={d.id}
                  debt={d}
                  onUpdate={updateDebt}
                  onDelete={deleteDebt}
                  onAddPayment={addPayment}
                  onMarkSettled={markSettled}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function AddDebtForm({ onAdd, products = [] }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Interno: se calculan desde el carrito
  const [note, setNote] = useState("");
  const [balance, setBalance] = useState(0);

  // Picker de productos
  const [prodQuery, setProdQuery] = useState("");
  const [cart, setCart] = useState([]); // [{productId, name, price, qty}]

  const filtered = useMemo(() => {
    const q = prodQuery.trim().toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [products, prodQuery]);

  const cartTotal = useMemo(
    () => cart.reduce((a, it) => a + it.price * it.qty, 0),
    [cart]
  );
  const cartNote = useMemo(
    () => cart.map((it) => `${it.name} x${it.qty}`).join(", "),
    [cart]
  );

  useEffect(() => {
    setNote(cartNote);
    setBalance(cartTotal);
  }, [cartNote, cartTotal]);

  const addToCart = (p) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.productId === p.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [
        ...prev,
        { productId: p.id, name: p.name, price: Number(p.price || 0), qty: 1 },
      ];
    });
  };
  const inc = (id) =>
    setCart((prev) =>
      prev.map((it) => (it.productId === id ? { ...it, qty: it.qty + 1 } : it))
    );
  const dec = (id) =>
    setCart((prev) =>
      prev.map((it) =>
        it.productId === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
      )
    );
  const removeItem = (id) =>
    setCart((prev) => prev.filter((it) => it.productId !== id));
  const clearCart = () => setCart([]);

  const submit = (e) => {
    e.preventDefault();
    if (!name) return;
    onAdd({ name, phone, note, balance });
    // limpiar
    setName("");
    setPhone("");
    setProdQuery("");
    setCart([]);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border bg-white p-4 shadow-sm grid grid-cols-12 gap-3 items-start"
    >
      <Input
        placeholder="Cliente"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="col-span-12 md:col-span-3 self-start h-11"
      />
      <Input
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="col-span-12 md:col-span-3 self-start h-11"
      />

      {/* Panel de productos */}
      <div className="col-span-12 md:col-span-6">
        <div className="rounded-xl border p-3 bg-gray-50">
          <div className="mb-2 text-xs text-gray-600">
            Agregar productos a la deuda
          </div>
          <Input
            placeholder="Buscar producto…"
            value={prodQuery}
            onChange={(e) => setProdQuery(e.target.value)}
            className="mb-2"
          />
          <div className="max-h-40 overflow-auto rounded-lg border bg-white">
            {filtered.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">Sin resultados</div>
            ) : (
              filtered.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between px-3 py-2 border-b last:border-b-0"
                >
                  <div className="text-sm">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      ${Number(p.price || 0).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="border"
                    onClick={() => addToCart(p)}
                  >
                    + Añadir
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Mini carrito + total */}
          {cart.length > 0 && (
            <div className="mt-3 rounded-lg border bg-white">
              {cart.map((it) => (
                <div
                  key={it.productId}
                  className="flex items-center justify-between px-3 py-2 border-b last:border-b-0"
                >
                  <div className="text-sm">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-gray-500">
                      ${it.price.toLocaleString()} × {it.qty} ={" "}
                      <b>${(it.price * it.qty).toLocaleString()}</b>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      className="border"
                      onClick={() => dec(it.productId)}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center text-sm">{it.qty}</span>
                    <Button
                      type="button"
                      className="border"
                      onClick={() => inc(it.productId)}
                    >
                      +
                    </Button>
                    <Button
                      type="button"
                      className="border text-red-600"
                      onClick={() => removeItem(it.productId)}
                    >
                      Quitar
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-sm font-medium">Total carrito</div>
                <div className="text-sm font-semibold">
                  ${cartTotal.toLocaleString()}
                </div>
              </div>
              <div className="px-3 pb-3">
                <Button type="button" className="border" onClick={clearCart}>
                  Vaciar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-12 flex md:justify-end">
        <Button type="submit" className="bg-gray-900">
          Agregar deuda
        </Button>
      </div>
    </form>
  );
}

function DebtRow({ debt, onUpdate, onDelete, onAddPayment, onMarkSettled }) {
  const [showPay, setShowPay] = useState(false);
  const [pay, setPay] = useState(0);
  const [pnote, setPnote] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const applyPayment = () => {
    const amount = Math.max(0, Number(pay || 0));
    if (amount <= 0) return;
    onAddPayment(debt.id, amount, pnote);
    setPay(0);
    setPnote("");
    setShowPay(false);
  };

  const tone =
    debt.status === "saldada" ? "green" : debt.balance > 0 ? "yellow" : "gray";

  return (
    <>
      <tr className="border-t align-top">
        <td className="p-3">
          <Input
            value={debt.name}
            onChange={(e) => onUpdate(debt.id, { name: e.target.value })}
          />
        </td>
        <td className="p-3">
          <Input
            value={debt.phone}
            onChange={(e) => onUpdate(debt.id, { phone: e.target.value })}
          />
        </td>
        <td className="p-3">
          <Input
            value={debt.note}
            onChange={(e) => onUpdate(debt.id, { note: e.target.value })}
          />
        </td>
        <td className="p-3">
          <Badge tone={tone}>
            {debt.status === "saldada" ? "Saldada" : "Pendiente"}
          </Badge>
        </td>
        <td className="p-3 text-right">
          <Input
            type="number"
            min="0"
            value={debt.balance}
            onChange={(e) =>
              onUpdate(debt.id, { balance: Math.max(0, Number(e.target.value)) })
            }
            className="w-32 text-right inline-block"
            disabled={debt.status === "saldada"}
          />
        </td>
        <td className="p-3">
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              className="border"
              type="button"
              onClick={() => setShowPay((s) => !s)}
              disabled={debt.status === "saldada"}
            >
              Registrar pago
            </Button>
            <Button
              className="border"
              type="button"
              onClick={() => setShowHistory((h) => !h)}
            >
              {showHistory ? "Ocultar historial" : "Ver historial"}
            </Button>
            {debt.status !== "saldada" && (
              <Button
                className="border bg-green-600 hover:bg-green-700"
                type="button"
                onClick={() => onMarkSettled(debt.id)}
              >
                Marcar como saldada
              </Button>
            )}
            <Button
              className="border text-red-600"
              type="button"
              onClick={() => onDelete(debt.id)}
            >
              Eliminar
            </Button>
          </div>

          {showPay && (
            <div className="mt-2 rounded-2xl border p-3">
              <div className="mb-2 text-xs text-gray-500">
                Pago a {debt.name}
              </div>
              <div className="grid grid-cols-12 gap-2">
                <Input
                  type="number"
                  min="0"
                  value={pay}
                  onChange={(e) => setPay(e.target.value)}
                  className="col-span-12 md:col-span-4"
                  placeholder="Monto"
                />
                <Input
                  value={pnote}
                  onChange={(e) => setPnote(e.target.value)}
                  className="col-span-12 md:col-span-6"
                  placeholder="Nota (opcional)"
                />
                <div className="col-span-12 md:col-span-2 flex md:justify-end">
                  <Button
                    type="button"
                    className="bg-gray-900"
                    onClick={applyPayment}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </td>
      </tr>

      {showHistory && (
        <tr className="border-t bg-gray-50/60">
          <td colSpan={6} className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-medium">Historial de pagos</div>
              <div className="text-sm text-gray-600">
                Total pagos:{" "}
                <b>
                  $
                  {(debt.payments || [])
                    .reduce((a, p) => a + Number(p.amount || 0), 0)
                    .toLocaleString()}
                </b>
              </div>
            </div>
            {(debt.payments || []).length === 0 ? (
              <div className="text-sm text-gray-500">Sin pagos registrados.</div>
            ) : (
              <div className="rounded-xl border bg-white overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Fecha</th>
                      <th className="p-2 text-right">Monto</th>
                      <th className="p-2 text-left">Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debt.payments.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="p-2">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                        <td className="p-2 text-right">
                          ${Number(p.amount).toLocaleString()}
                        </td>
                        <td className="p-2">{p.note || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
