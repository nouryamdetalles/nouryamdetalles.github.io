
let productos = [
  {id:1,nombre:'Producto 1',img:'img/producto1.png',desc:'Descripción breve del producto 1.',precio:10,cantidad:1},
  {id:2,nombre:'Producto 2',img:'img/producto2.png',desc:'Descripción breve del producto 2.',precio:12,cantidad:1},
  {id:3,nombre:'Producto 3',img:'img/producto3.png',desc:'Descripción breve del producto 3.',precio:8,cantidad:1},
  {id:4,nombre:'Producto 4',img:'img/producto4.png',desc:'Descripción breve del producto 4.',precio:15,cantidad:1},
  {id:5,nombre:'Producto 5',img:'img/producto5.png',desc:'Descripción breve del producto 5.',precio:9,cantidad:1},
  {id:6,nombre:'Producto 6',img:'img/producto6.png',desc:'Descripción breve del producto 6.',precio:11,cantidad:1},
  {id:7,nombre:'Producto 7',img:'img/producto7.png',desc:'Descripción breve del producto 7.',precio:14,cantidad:1},
  {id:8,nombre:'Producto 8',img:'img/producto8.png',desc:'Descripción breve del producto 8.',precio:16,cantidad:1},
  {id:9,nombre:'Producto 9',img:'img/producto9.png',desc:'Descripción breve del producto 9.',precio:7,cantidad:1},
  {id:10,nombre:'Producto 10',img:'img/producto10.png',desc:'Descripción breve del producto 10.',precio:13,cantidad:1}
];

let carrito = [];

window.onload = ()=>{
  let guardado = localStorage.getItem('carrito');
  if(guardado){ carrito = JSON.parse(guardado); renderCarrito(); }
  cargarCatalogo();
};

function cargarCatalogo(){
  let cont = document.getElementById('catalogo');
  productos.forEach(p=>{
    let div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `<img src="${p.img}" style="width:100%;border-radius:10px;"><br>${p.nombre}<br>${p.precio}€`;
    div.onclick = ()=>abrirProducto(p.id);
    cont.appendChild(div);
  });
}

/* MODAL PRODUCTO */
function abrirProducto(id){
  let p = productos.find(x=>x.id===id);
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalTitulo').textContent = p.nombre;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalPrecio').textContent = p.precio + '€';
  document.getElementById('modalBtn').onclick = ()=>agregarAlCarrito(p.id);
  document.getElementById('modalProducto').style.display='flex';
}
function cerrarModal(){ document.getElementById('modalProducto').style.display='none'; }

/* CARRITO */
function agregarAlCarrito(id){
  let prod = productos.find(p=>p.id===id);
  let existe = carrito.find(i=>i.id===id);

  if(existe){ existe.cantidad++; }
  else { carrito.push({...prod}); }

  renderCarrito();
}

function renderCarrito(){
  let lista = document.getElementById('carritoLista');
  lista.innerHTML = '';
  let total = 0;

  carrito.forEach((item,index)=>{
    total += item.precio * item.cantidad;

    let li = document.createElement('li');
    li.innerHTML = `
      ${item.nombre} - ${item.precio}€<br>
      <button onclick="cambiarCantidad(${index},-1)">-</button>
      ${item.cantidad}
      <button onclick="cambiarCantidad(${index},1)">+</button>
      <button onclick="eliminarDelCarrito(${index})">X</button>
    `;
    lista.appendChild(li);
  });

  document.getElementById('totalCarrito').textContent = total.toFixed(2) + '€';
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cambiarCantidad(index,val){
  carrito[index].cantidad = Math.max(1, carrito[index].cantidad + val);
  renderCarrito();
}

function eliminarDelCarrito(index){
  carrito.splice(index,1);
  renderCarrito();
}

function abrirCarrito(){ document.getElementById('carritoPanel').style.display='block'; }
function cerrarCarrito(){ document.getElementById('carritoPanel').style.display='none'; }

/* WHATSAPP */
function enviarWhatsapp(){
  let texto = 'Hola! Aquí está mi pedido:%0A';
  carrito.forEach(item=>{
    texto += `• ${item.nombre} x${item.cantidad} = ${item.precio*item.cantidad}€%0A`;
  });
  texto += `%0ATotal: ${document.getElementById('totalCarrito').textContent}`;
  window.open('https://wa.me/?text='+texto,'_blank');
}
