const sections = document.querySelectorAll('main section');
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle');
const salesChartCtx = document.getElementById('salesChart');
let products = JSON.parse(localStorage.getItem('products')||'[]');
let categories = JSON.parse(localStorage.getItem('categories')||'[]');
let members = JSON.parse(localStorage.getItem('members')||'[]');
let orders = JSON.parse(localStorage.getItem('orders')||'[]');
function showSection(id){
    sections.forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
sidebar.addEventListener('click',e=>{
    if(e.target.dataset.target){
        showSection(e.target.dataset.target);
    }
});
toggleBtn.addEventListener('click',()=>{
    sidebar.classList.toggle('compact');
});
// product management
const productForm=document.getElementById('productForm');
const productTable=document.getElementById('productTable').querySelector('tbody');
function renderProducts(){
    productTable.innerHTML='';
    products.forEach((p,i)=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${p.name}</td><td>${p.price}</td><td>${p.category}</td><td>${p.stock}</td><td><button data-del="${i}">删除</button></td>`;
        productTable.appendChild(tr);
    });
    renderProductGrid();
    localStorage.setItem('products',JSON.stringify(products));
}
productForm.addEventListener('submit',e=>{
    e.preventDefault();
    products.push({name:pname.value,price:pprice.value,category:pcategory.value,stock:+pstock.value});
    productForm.reset();
    renderProducts();
});
productTable.addEventListener('click',e=>{
    if(e.target.dataset.del){
        products.splice(e.target.dataset.del,1);
        renderProducts();
    }
});
// order management (simple display)
const orderTable=document.getElementById('orderTable').querySelector('tbody');
function renderOrders(){
    orderTable.innerHTML='';
    orders.forEach(o=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${o.id}</td><td>${o.time}</td><td>${o.total}</td><td>${o.status}</td>`;
        orderTable.appendChild(tr);
    });
    localStorage.setItem('orders',JSON.stringify(orders));
}
// categories
const categoryList=document.getElementById('categoryList');
const categoryForm=document.getElementById('categoryForm');
function renderCategories(){
    categoryList.innerHTML='';
    categories.forEach((c,i)=>{
        const li=document.createElement('li');
        li.textContent=c;
        li.innerHTML+=` <button data-del="${i}">删除</button>`;
        categoryList.appendChild(li);
    });
    localStorage.setItem('categories',JSON.stringify(categories));
}
categoryForm.addEventListener('submit',e=>{
    e.preventDefault();
    categories.push(cname.value);
    categoryForm.reset();
    renderCategories();
});
categoryList.addEventListener('click',e=>{
    if(e.target.dataset.del){
        categories.splice(e.target.dataset.del,1);
        renderCategories();
    }
});
// members
const memberTable=document.getElementById('memberTable').querySelector('tbody');
const memberForm=document.getElementById('memberForm');
function renderMembers(){
    memberTable.innerHTML='';
    members.forEach((m,i)=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${m.name}</td><td>${m.phone}</td>`;
        memberTable.appendChild(tr);
    });
    localStorage.setItem('members',JSON.stringify(members));
}
memberForm.addEventListener('submit',e=>{
    e.preventDefault();
    members.push({name:mname.value,phone:mphone.value});
    memberForm.reset();
    renderMembers();
});
// cashier
const productGrid=document.getElementById('productGrid');
const cartDiv=document.getElementById('cart');
let cart=[];
function renderProductGrid(){
    productGrid.innerHTML='';
    products.forEach((p,i)=>{
        const div=document.createElement('div');
        div.className='product-item';
        div.textContent=p.name;
        div.addEventListener('click',()=>addToCart(i));
        productGrid.appendChild(div);
    });
}
function addToCart(i){
    const item=cart.find(c=>c.index===i);
    if(item){item.qty++;} else {cart.push({index:i,qty:1});}
    renderCart();
}
function renderCart(){
    cartDiv.innerHTML='';
    cart.forEach((c,idx)=>{
        const p=products[c.index];
        const div=document.createElement('div');
        div.textContent=`${p.name} x${c.qty}`;
        const btn=document.createElement('button');
        btn.textContent='移除';
        btn.onclick=()=>{cart.splice(idx,1);renderCart();};
        div.appendChild(btn);
        cartDiv.appendChild(div);
    });
}
// inventory
const inventoryTable=document.getElementById('inventoryTable').querySelector('tbody');
function renderInventory(){
    inventoryTable.innerHTML='';
    products.forEach((p,i)=>{
        let statusClass='inventory-ok';
        if(p.stock<=20){statusClass='inventory-low';}
        else if(p.stock<=40){statusClass='inventory-mid';}
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${i}</td><td>${p.name}</td><td>${p.stock}</td><td class="${statusClass}">${p.stock}</td>`;
        inventoryTable.appendChild(tr);
    });
}
// data board
let salesChart=new Chart(salesChartCtx,{type:'bar',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'销售额',data:[12,19,3,5,2,3,7],backgroundColor:'#ffd400'}]},options:{}});
// ai
const askBtn=document.getElementById('askAi');
const aiInput=document.getElementById('aiInput');
const aiResp=document.getElementById('aiResponse');
const API_KEY='sk-JQqwqFeMGUGOtJM6PGy2N3KxuPGEtvbLEyBNoZOurLSKh3Fz';
async function askAI(){
    const res=await fetch('https://xinyiyuan1688.top/v1',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+API_KEY},body:JSON.stringify({model:'o3',messages:[{role:'user',content:aiInput.value}]})});
    const data=await res.json();
    aiResp.textContent=JSON.stringify(data);
}
askBtn.addEventListener('click',askAI);
// init
renderProducts();
renderCategories();
renderMembers();
renderOrders();
renderInventory();
renderProductGrid();
