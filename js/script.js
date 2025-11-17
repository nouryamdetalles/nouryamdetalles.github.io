
let productos = [
  {id:1,nombre:'Producto 1',img:['img/producto1.png'],desc:'Descripción completa del producto 1.',precio:10},
  {id:2,nombre:'Producto 2',img:['img/producto2.png'],desc:'Descripción completa del producto 2.',precio:12},
  {id:3,nombre:'Producto 3',img:['img/producto3.png'],desc:'Descripción completa del producto 3.',precio:8},
  {id:4,nombre:'Producto 4',img:['img/producto4.png'],desc:'Descripción completa del producto 4.',precio:15},
  {id:5,nombre:'Producto 5',img:['img/producto5.png'],desc:'Descripción completa.',precio:9},
  {id:6,nombre:'Producto 6',img:['img/producto6.png'],desc:'Descripción completa.',precio:11},
  {id:7,nombre:'Producto 7',img:['img/producto7.png'],desc:'Descripción completa.',precio:14},
  {id:8,nombre:'Producto 8',img:['img/producto8.png'],desc:'Descripción completa.',precio:16},
  {id:9,nombre:'Producto 9',img:['img/producto9.png'],desc:'Descripción completa.',precio:7},
  {id:10,nombre:'Producto 10',img:['img/producto10.png'],desc:'Descripción completa.',precio:13}
];

let carrito=[];

window.onload=()=>{ cargarCatalogo(); };

function cargarCatalogo(){
  let cont=document.getElementById('catalogo');
  productos.forEach(p=>{
    let div=document.createElement('div');
    div.className='producto';
    div.innerHTML=`<img src="${p.img[0]}" style="width:100%;border-radius:12px;"><br><b>${p.nombre}</b><br>${p.precio}€`;
    div.onclick=()=>abrirProducto(p.id);
    cont.appendChild(div);
  });
}

function abrirProducto(id){
  let p=productos.find(x=>x.id===id);
  let slider=document.getElementById('modalSlider');
  slider.innerHTML="";
  p.img.forEach(f=> slider.innerHTML += `<img src="${f}">`);

  document.getElementById('modalTitulo').textContent=p.nombre;
  document.getElementById('modalDesc').textContent=p.desc;
  document.getElementById('modalPrecio').textContent=p.precio+'€';

  document.getElementById('modalBtn').onclick=()=>agregarAlCarrito(id);
  document.getElementById('modalProducto').style.display='flex';
}

function cerrarModal(){ document.getElementById('modalProducto').style.display='none'; }

/* CARRITO */
function abrirCarrito(){ document.getElementById('carritoPanel').style.display='block'; }
function cerrarCarrito(){ document.getElementById('carritoPanel').style.display='none'; }

function agregarAlCarrito(id){
  let p=productos.find(x=>x.id===id);
  let e=carrito.find(x=>x.id===id);
  if(e){ e.cantidad++; }
  else{ carrito.push({...p,cantidad:1}); }
  renderCarrito();
}

function cambiarCantidad(i,v){
  carrito[i].cantidad=Math.max(1,carrito[i].cantidad+v);
  renderCarrito();
}

function eliminarDelCarrito(i){
  carrito.splice(i,1);
  renderCarrito();
}

function renderCarrito(){
  let l=document.getElementById('carritoLista');
  l.innerHTML="";
  let tot=0;

  carrito.forEach((item,i)=>{
    tot += item.precio * item.cantidad;
    l.innerHTML += `
      <li>${item.nombre} - ${item.precio}€<br>
      <button onclick="cambiarCantidad(${i},-1)">-</button>
      ${item.cantidad}
      <button onclick="cambiarCantidad(${i},1)">+</button>
      <button onclick="eliminarDelCarrito(${i})">X</button>
      </li>`;
  });

  document.getElementById('totalCarrito').textContent=tot.toFixed(2)+'€';
}

function enviarWhatsapp(){
  let nombre=document.getElementById('clienteNombre').value;
  let tel=document.getElementById('clienteTelefono').value;
  let notas=document.getElementById('clienteNotas').value;

  let msg=`Pedido:%0A`;
  carrito.forEach(c=> msg+=`• ${c.nombre} x${c.cantidad} = ${c.precio*c.cantidad}€%0A`);

  msg+=`%0ATotal: ${document.getElementById('totalCarrito').textContent}`;
  msg+=`%0ACliente: ${nombre}`;
  msg+=`%0ATeléfono: ${tel}`;
  msg+=`%0ANotas: ${notas}`;

  window.open("https://wa.me/?text="+msg,"_blank");
}
