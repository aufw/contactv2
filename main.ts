let contacts:any[] = [];
let newContact = { name: '', family: '', phone: '' };
let editContact = { id: 0, name: '', family: '', phone: '' };

const myApp = document.getElementById('app')!;

document.addEventListener('DOMContentLoaded', () => {
    render();
    loadContacts();
});

async function loadContacts() {
    try {
        const response = await fetch('/api.php?action=list');
        const text = await response.text();
        contacts = JSON.parse(text);
    } catch { }
    render();
}

async function add() {
    try {
        const response = await fetch('/api.php?action=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact)
        });
        const text = await response.text();
        const result = JSON.parse(text);
        if (result.success) {
            newContact = { name: '', family: '', phone: '' };
            await loadContacts();
        }
    } catch { }
}

function edit(id: number) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        editContact = { ...contact };
        render();
    }
}

async function update() {
    try {
        const response = await fetch('/api.php?action=update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editContact)
        });
        const text = await response.text();
        const result = JSON.parse(text);
        if (result.success) {
            editContact = { id: 0, name: '', family: '', phone: '' };
            await loadContacts();
        }
    } catch { }
}

async function remove(id: number) {
    if (!confirm('Are you sure?')) return;
    try {
        const response = await fetch('/api.php?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const text = await response.text();
        const result = JSON.parse(text);
        if (result.success) {
            await loadContacts();
        }
    } catch { }
}

function render() {
    let tableRows = '';
    if (contacts.length === 0) {
        tableRows = `
            <div class="empty-state">
                <h3>Nobody here</h3>
            </div>
        `;
    } else {
        tableRows = '<table><thead><tr><th>ID</th><th>Name</th><th>Family</th><th>Phone</th><th>Actions</th></tr></thead><tbody>';
        for (let contact of contacts) {
            tableRows += `
                <tr>
                    <td>${contact.id}</td>
                    <td>${contact.name}</td>
                    <td>${contact.family}</td>
                    <td>${contact.phone}</td>
                    <td>
                        <div class="actions">
                            <button class="btn btn-warning edit-btn" data-id="${contact.id}">Edit</button>
                            <button class="btn btn-danger delete-btn" data-id="${contact.id}">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }
        tableRows += '</tbody></table>';
    }

    myApp.innerHTML = `
        <div class="container">
            <h1>Interview Contacts v2</h1>
            <div class="form-section">
                <h3>Add Contact</h3>
                <div class="form-row">
                    <input type="text" id="newName" placeholder="First Name" value="${newContact.name}">
                    <input type="text" id="newFamily" placeholder="Last Name" value="${newContact.family}">
                    <input type="text" id="newPhone" placeholder="Phone Number" value="${newContact.phone}">
                </div>
                <button id="addBtn" class="btn btn-success">Add Contact</button>
            </div>
            <div class="form-section">
                <h3>Edit Contact</h3>
                <div class="form-row">
                    <input type="text" id="editName" placeholder="First Name" value="${editContact.name}">
                    <input type="text" id="editFamily" placeholder="Last Name" value="${editContact.family}">
                    <input type="text" id="editPhone" placeholder="Phone Number" value="${editContact.phone}">
                </div>
                <button id="updateBtn" class="btn btn-success">Update Contact</button>
            </div>
            ${tableRows}
        </div>
    `;
    contactEvents();
}

function contactEvents() {
    const newName = document.getElementById('newName') as HTMLInputElement;
    const newFamily = document.getElementById('newFamily') as HTMLInputElement;
    const newPhone = document.getElementById('newPhone') as HTMLInputElement;

    if (newName) {
        newName.addEventListener('input', (e) => {
            newContact.name = (e.target as HTMLInputElement).value;
        });
    }
    if (newFamily) {
        newFamily.addEventListener('input', (e) => {
            newContact.family = (e.target as HTMLInputElement).value;
        });
    }
    if (newPhone) {
        newPhone.addEventListener('input', (e) => {
            newContact.phone = (e.target as HTMLInputElement).value;
        });
    }

    const editName = document.getElementById('editName') as HTMLInputElement;
    const editFamily = document.getElementById('editFamily') as HTMLInputElement;
    const editPhone = document.getElementById('editPhone') as HTMLInputElement;

    if (editName) {
        editName.addEventListener('input', (e) => {
            editContact.name = (e.target as HTMLInputElement).value;
        });
    }
    if (editFamily) {
        editFamily.addEventListener('input', (e) => {
            editContact.family = (e.target as HTMLInputElement).value;
        });
    }
    if (editPhone) {
        editPhone.addEventListener('input', (e) => {
            editContact.phone = (e.target as HTMLInputElement).value;
        });
    }

    const addButton = document.getElementById('addBtn') as HTMLButtonElement;
    if (addButton) {
        addButton.addEventListener('click', add);
    }

    const updateButton = document.getElementById('updateBtn') as HTMLButtonElement;
    if (updateButton) {
        updateButton.addEventListener('click', update);
    }

    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id')!);
            edit(id);
        });
    });

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id')!);
            remove(id);
        });
    });
}