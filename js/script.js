
let productos = [
  {id:1,nombre:'Cojín Personalizado',precio:22,img:'img/p1.jpg'},
  {id:2,nombre:'Taza con Nombre',precio:12,img:'img/p2.jpg'},
  {id:3,nombre:'Lámpara con Foto',precio:29,img:'img/p3.jpg'},
  {id:4,nombre:'Pulsera Iniciales',precio:18,img:'img/p4.jpg'},
  {id:5,nombre:'Marco Personalizado',precio:15,img:'img/p5.jpg'},
  {id:6,nombre:'Botella Grabada',precio:20,img:'img/p6.jpg'}
];

let CART = {};

function renderProducts(){
  const grid=document.getElementById("products-grid");
  grid.innerHTML='';
  productos.forEach(p=>{
    grid.innerHTML+=`
      <div class="card">
        <img src="${p.img}" style="width:100%;height:200px;object-fit:cover;border-radius:10px;">
        <h3>${p.nombre}</h3>
        <p><strong>${p.precio} €</strong></p>
        <button onclick="addToCart(${p.id})">Añadir</button>
      </div>`;
  });
}
renderProducts();

function addToCart(id){
  if(!CART[id]){
    let p=productos.find(x=>x.id===id);
    CART[id]={...p,qty:1};
  } else CART[id].qty++;
  updateCart();
}

function updateCart(){
  document.getElementById("cart-count").textContent=
    Object.values(CART).reduce((s,p)=>s+p.qty,0);
  renderCartDropdown();
}

function toggleCart(){
  document.getElementById("cart-dropdown").classList.toggle("open");
}

function renderCartDropdown(){
  const dd=document.getElementById("cart-dropdown");
  dd.innerHTML='';
  const items=Object.values(CART);
  if(items.length===0){ dd.innerHTML='<p>Carrito vacío</p>'; return; }
  items.forEach(it=>{
    dd.innerHTML+=`
      <div>
        <img src="${it.img}" width="40">
        ${it.nombre} x ${it.qty}
        <button onclick="removeItem(${it.id})">-</button>
      </div>`;
  });
}

function removeItem(id){
  if(CART[id].qty>1) CART[id].qty--;
  else delete CART[id];
  updateCart();
}
