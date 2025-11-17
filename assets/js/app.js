
/* Gift-Shop Coquette — app.js
   Funcionalidad: catálogo, producto, carrito con personalización y envío por WhatsApp.
   Notas: Si quieres que las imágenes personalizadas se suban automáticamente, introduce tu clave de ImgBB
   en IMGBB_API_KEY. Si no, el usuario deberá adjuntar la imagen manualmente desde WhatsApp.
*/

const STORE_NUMBER = "34XXXXXXXXXXX"; // <-- Pon aquí tu número en formato internacional (ej: 34612345678)
const IMGBB_API_KEY = ""; // <-- Opcional: clave ImgBB para subir imágenes y obtener URL

const PRODUCTS = [
  { id: "gift1", title: "Caja regalo rosa", price: 18.50, img: "img/gift1.jpg", desc: "Caja personalizada con lazo" },
  { id: "gift2", title: "Taza coquette", price: 11.00, img: "img/gift2.jpg", desc: "Taza con diseño romántico" },
  { id: "gift3", title: "Set postal", price: 9.90, img: "img/gift3.jpg", desc: "Tarjeta + sobre personalizado" }
];

// utilities: cart stored as { key: item }
function getCart(){ return JSON.parse(localStorage.getItem("nouryam_cart") || "{}"); }
function saveCart(c){ localStorage.setItem("nouryam_cart", JSON.stringify(c)); }
function updateCartCount(){ const cart=getCart(); const count=Object.values(cart).reduce((s,i)=>s+i.qty,0); document.getElementById("cart-count") && (document.getElementById("cart-count").textContent = count); }

// Render catalog (used in index and catalog pages)
function renderCatalog(){
  const grid = document.getElementById("catalog-grid") || document.getElementById("featured-grid");
  if(!grid) return;
  grid.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const node = document.createElement("div");
    node.className = "card";
    node.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>€${p.price.toFixed(2)}</p>
      <div style="margin-top:10px">
        <a class="btn btn-outline" href="producto.html?id=${p.id}">Ver</a>
        <button class="btn btn-primary" onclick="addToCartDefault('${p.id}')">Añadir</button>
      </div>
    `;
    grid.appendChild(node);
  });
}

// Default add to cart (no customization)
function addToCartDefault(id){
  const cart = getCart();
  if(!cart[id]) cart[id] = { id, title: PRODUCTS.find(x=>x.id===id).title, price: PRODUCTS.find(x=>x.id===id).price, qty:0, img:PRODUCTS.find(x=>x.id===id).img };
  cart[id].qty++;
  saveCart(cart);
  updateCartCount();
  alert("Añadido al carrito");
}

// Product page render with customization UI
function renderProductPage(){
  const el = document.getElementById("product-page");
  if(!el) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){ el.innerHTML = "<p>Producto no encontrado.</p>"; return; }

  el.innerHTML = `
    <div class="product">
      <img src="${p.img}" class="product-img" alt="${p.title}">
      <div class="meta">
        <h2>${p.title}</h2>
        <p>${p.desc}</p>
        <p style="font-weight:700">€${p.price.toFixed(2)}</p>

        <div class="custom-box">
          <label>Texto para personalizar (opcional)</label>
          <textarea id="productCustomText" placeholder="Nombre, dedicatoria, fecha..."></textarea>
          <label>Imagen personalizada (opcional)</label>
          <input type="file" id="productCustomImage" accept="image/*">
          <div id="preview" style="margin-top:8px"></div>
          <div style="margin-top:12px">
            <button class="btn btn-primary" onclick="addProductFromPage()">Añadir al carrito</button>
            <a class="btn btn-outline" href="catalogo.html">Volver al catálogo</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // preview image when selected
  const fileInput = document.getElementById("productCustomImage");
  fileInput && fileInput.addEventListener("change", function(){
    const preview = document.getElementById("preview");
    preview.innerHTML = "";
    if(!this.files || this.files.length===0) return;
    const fr = new FileReader();
    fr.onload = function(e){
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "220px";
      img.style.borderRadius = "8px";
      preview.appendChild(img);
    };
    fr.readAsDataURL(this.files[0]);
  });
}

// Add custom product to cart (creates unique key if customized)
async function addProductFromPage(){
  const id = new URLSearchParams(location.search).get("id");
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return alert("Producto no encontrado");
  const text = document.getElementById("productCustomText")?.value || "";
  const fileInput = document.getElementById("productCustomImage");
  let imageUrl = "";

  if(fileInput && fileInput.files && fileInput.files.length>0 && IMGBB_API_KEY){
    // upload to ImgBB
    try{
      imageUrl = await uploadToImgBB(IMGBB_API_KEY, fileInput.files[0]);
    }catch(e){
      console.warn("Error subiendo a ImgBB", e);
      imageUrl = "";
    }
  }

  const cart = getCart();
  // generate unique key if customized
  let key = id;
  if((text && text.trim()!=="") || (imageUrl && imageUrl.trim()!=="") || (fileInput && fileInput.files && fileInput.files.length>0 && !IMGBB_API_KEY)){
    key = id + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2,6);
    cart[key] = { key, originalId:id, title:p.title, price:p.price, qty:1, img:p.img, customText:text || "", customImageURL: imageUrl || "" };
  } else {
    if(!cart[id]) cart[id] = { id, title:p.title, price:p.price, qty:0, img:p.img };
    cart[id].qty++;
  }

  saveCart(cart);
  updateCartCount();
  alert("Producto añadido al carrito");
  // redirect to carrito
  location.href = "carrito.html";
}

// upload helper to imgbb
async function uploadToImgBB(apiKey, file){
  const form = new FormData();
  form.append("image", file);
  const resp = await fetch("https://api.imgbb.com/1/upload?key="+apiKey, { method:"POST", body: form });
  if(!resp.ok) throw new Error("ImgBB upload failed");
  const json = await resp.json();
  return json.data.url;
}

// Render cart page
function renderCartList(){
  const el = document.getElementById("cart-list");
  if(!el) return;
  const cart = getCart();
  el.innerHTML = "";
  if(Object.keys(cart).length===0) { el.innerHTML = "<p>Tu carrito está vacío.</p>"; return; }

  let total = 0;
  for(const k in cart){
    const it = cart[k];
    total += it.price * it.qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${it.img}" alt="${it.title}">
      <div style="flex:1">
        <div class="title">${it.title}</div>
        <div>€${it.price.toFixed(2)} x ${it.qty}</div>
        ${it.customText ? `<div><small>Personalización: ${escapeHtml(it.customText)}</small></div>` : ""}
        ${it.customImageURL ? `<div><small>Imagen: <a href="${it.customImageURL}" target="_blank">ver</a></small></div>` : ""}
        <div style="margin-top:8px">
          <button class="btn btn-outline" onclick="changeQty('${k}', -1)">−</button>
          <button class="btn btn-outline" onclick="changeQty('${k}', 1)">+</button>
          <button class="btn btn-outline" onclick="removeFromCart('${k}')">Eliminar</button>
        </div>
      </div>
    `;
    el.appendChild(div);
  }
  const summary = document.createElement("div");
  summary.style.marginTop = "12px";
  summary.innerHTML = `<strong>Total: €${total.toFixed(2)}</strong>`;
  el.appendChild(summary);
}

// cart operations
function changeQty(key, delta){
  const cart = getCart();
  if(!cart[key]) return;
  cart[key].qty += delta;
  if(cart[key].qty < 1) delete cart[key];
  saveCart(cart);
  renderCartList();
  updateCartCount();
}
function removeFromCart(key){
  const cart = getCart();
  if(cart[key]) delete cart[key];
  saveCart(cart);
  renderCartList();
  updateCartCount();
}
function vaciarCarrito(){ if(confirm("¿Vaciar el carrito?")){ localStorage.removeItem("nouryam_cart"); renderCartList(); updateCartCount(); } }

// escape helper
function escapeHtml(s){ return s.replace(/[&<>"']/g, function(m){ return ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[m]; }); }

// send order via WhatsApp — uploads general image if possible, and includes per-item image URLs
async function enviarPedidoWhatsApp(){
  const nombre = document.getElementById("nombre")?.value || "";
  const telefono = document.getElementById("telefono")?.value || "";
  const dedicatoria = document.getElementById("dedicatoria")?.value || "";
  const cart = getCart();
  if(Object.keys(cart).length===0){ alert("Tu carrito está vacío"); return; }

  let msg = "Nuevo pedido — Nouryam Detalles\n\n";
  let total = 0;
  for(const k in cart){
    const it = cart[k];
    total += it.price * it.qty;
    msg += `• ${it.title} (x${it.qty}) = €${(it.price*it.qty).toFixed(2)}\n`;
    if(it.customText) msg += `  - Personalización: ${it.customText}\n`;
    if(it.customImageURL) msg += `  - Imagen: ${it.customImageURL}\n`;
    else if(it.customText && !it.customImageURL && IMGBB_API_KEY==="") msg += `  - Imagen: (el cliente deberá adjuntarla manualmente en WhatsApp)\n`;
  }
  msg += `\nTotal: €${total.toFixed(2)}\n\n`;
  if(nombre) msg += `Nombre: ${nombre}\n`;
  if(telefono) msg += `Teléfono: ${telefono}\n`;
  if(dedicatoria) msg += `Mensaje: ${dedicatoria}\n`;

  // upload general image if present
  const fileInput = document.getElementById("imagenPedido");
  if(fileInput && fileInput.files && fileInput.files.length>0 && IMGBB_API_KEY){
    try{
      const url = await uploadToImgBB(IMGBB_API_KEY, fileInput.files[0]);
      if(url) msg += `\nImagen general: ${url}\n`;
    }catch(e){ console.warn("Error subiendo imagen general", e); }
  } else if(fileInput && fileInput.files && fileInput.files.length>0 && !IMGBB_API_KEY){
    msg += `\nImagen general: (por favor adjuntar manualmente en WhatsApp)\n`;
  }

  const final = encodeURIComponent(msg);
  const wa = `https://wa.me/${STORE_NUMBER}?text=${final}`;
  window.open(wa, "_blank");
}

// initialization
(function(){
  updateCartCount();
  renderCatalog();
  renderProductPage();
  renderCartList();
})();
