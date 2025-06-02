(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function o(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function c(e){if(e.ep)return;e.ep=!0;const i=o(e);fetch(e.href,i)}})();let l=[],s={name:"",family:"",phone:""},d={id:0,name:"",family:"",phone:""};const f=document.getElementById("app");document.addEventListener("DOMContentLoaded",()=>{m(),u()});async function u(){try{const t=await(await fetch("/api.php?action=list")).text();l=JSON.parse(t)}catch{}m()}async function y(){try{const t=await(await fetch("/api.php?action=add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).text();JSON.parse(t).success&&(s={name:"",family:"",phone:""},await u())}catch{}}function v(a){const t=l.find(o=>o.id===a);t&&(d={...t},m())}async function b(){try{const t=await(await fetch("/api.php?action=update",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)})).text();JSON.parse(t).success&&(d={id:0,name:"",family:"",phone:""},await u())}catch{}}async function g(a){if(confirm("Are you sure?"))try{const o=await(await fetch("/api.php?action=delete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:a})})).text();JSON.parse(o).success&&await u()}catch{}}function m(){let a="";if(l.length===0)a=`
            <div class="empty-state">
                <h3>Nobody here</h3>
            </div>
        `;else{a="<table><thead><tr><th>ID</th><th>Name</th><th>Family</th><th>Phone</th><th>Actions</th></tr></thead><tbody>";for(let t of l)a+=`
                <tr>
                    <td>${t.id}</td>
                    <td>${t.name}</td>
                    <td>${t.family}</td>
                    <td>${t.phone}</td>
                    <td>
                        <div class="actions">
                            <button class="btn btn-warning edit-btn" data-id="${t.id}">Edit</button>
                            <button class="btn btn-danger delete-btn" data-id="${t.id}">Delete</button>
                        </div>
                    </td>
                </tr>
            `;a+="</tbody></table>"}f.innerHTML=`
        <div class="container">
            <h1>Interview Contacts v2</h1>
            <div class="form-section">
                <h3>Add Contact</h3>
                <div class="form-row">
                    <input type="text" id="newName" placeholder="First Name" value="${s.name}">
                    <input type="text" id="newFamily" placeholder="Last Name" value="${s.family}">
                    <input type="text" id="newPhone" placeholder="Phone Number" value="${s.phone}">
                </div>
                <button id="addBtn" class="btn btn-success">Add Contact</button>
            </div>
            <div class="form-section">
                <h3>Edit Contact</h3>
                <div class="form-row">
                    <input type="text" id="editName" placeholder="First Name" value="${d.name}">
                    <input type="text" id="editFamily" placeholder="Last Name" value="${d.family}">
                    <input type="text" id="editPhone" placeholder="Phone Number" value="${d.phone}">
                </div>
                <button id="updateBtn" class="btn btn-success">Update Contact</button>
            </div>
            ${a}
        </div>
    `,w()}function w(){const a=document.getElementById("newName"),t=document.getElementById("newFamily"),o=document.getElementById("newPhone");a&&a.addEventListener("input",n=>{s.name=n.target.value}),t&&t.addEventListener("input",n=>{s.family=n.target.value}),o&&o.addEventListener("input",n=>{s.phone=n.target.value});const c=document.getElementById("editName"),e=document.getElementById("editFamily"),i=document.getElementById("editPhone");c&&c.addEventListener("input",n=>{d.name=n.target.value}),e&&e.addEventListener("input",n=>{d.family=n.target.value}),i&&i.addEventListener("input",n=>{d.phone=n.target.value});const r=document.getElementById("addBtn");r&&r.addEventListener("click",y);const h=document.getElementById("updateBtn");h&&h.addEventListener("click",b),document.querySelectorAll(".edit-btn").forEach(n=>{n.addEventListener("click",()=>{const p=parseInt(n.getAttribute("data-id"));v(p)})}),document.querySelectorAll(".delete-btn").forEach(n=>{n.addEventListener("click",()=>{const p=parseInt(n.getAttribute("data-id"));g(p)})})}
