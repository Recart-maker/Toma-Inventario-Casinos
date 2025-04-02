// Ensure XLSX library is available
if (typeof XLSX === 'undefined') {
    throw new Error('XLSX library is not loaded. Please include it in your project.');
}

const fechaInventarioElement = document.getElementById('fecha-inventario');
const totalInventarioElement = document.getElementById('total-inventario');
const inventoryBody = document.getElementById('inventory-body');
const borrarHistorialBtn = document.getElementById('btn-borrar-historial');
const uploadExcelInput = document.getElementById('upload-excel');
const descargarExcelBtn = document.getElementById('btn-descargar-excel');
const addItemForm = document.getElementById('add-item-form');
const codigoInput = document.getElementById('codigo');
const productoInput = document.getElementById('producto');
const unidadInput = document.getElementById('unidad');
const cantidadInputForm = document.getElementById('cantidad');
const valorInput = document.getElementById('valor');
const casinoNameInput = document.getElementById('casino-name');
const agregarItemBtn = document.getElementById('btn-agregar-item');

let inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [];
let casinoName = String(localStorage.getItem('casinoName') || '');

casinoNameInput.value = casinoName;

casinoNameInput.addEventListener('input', () => {
    casinoName = casinoNameInput.value;
    localStorage.setItem('casinoName', casinoName);
});

function mostrarFechaActual() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    fechaInventarioElement.textContent = `Fecha del Inventario: ${now.toLocaleDateString('es-CL', options)}`;
}

function guardarInventario() {
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    renderizarInventario();
}

function calcularTotalInventario() {
    let total = 0;
    inventoryData.forEach(item => {
        total += item.cantidad * item.valor;
    });
    return total;
}

function formatCLP(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

function renderizarInventario() {
    inventoryBody.innerHTML = '';
    let totalInventario = 0;
    inventoryData.forEach((item, index) => {
        const row = inventoryBody.insertRow();
        const codigoCell = row.insertCell();
        const productoCell = row.insertCell();
        const unidadCell = row.insertCell();
        const cantidadCell = row.insertCell();
        const valorCell = row.insertCell();
        const totalCell = row.insertCell();

        codigoCell.textContent = item.codigo;
        productoCell.textContent = item.producto;
        unidadCell.textContent = item.unidad || '';

        const cantidadInputElem = document.createElement('input');
        cantidadInputElem.type = 'text';
        cantidadInputElem.classList.add('editable-cantidad');
        cantidadInputElem.value = item.cantidad.toString().replace('.', ',');
        cantidadInputElem.addEventListener('change', (event) => {
            const newCantidadStr = event.target.value.replace(',', '.');
            const newCantidad = parseFloat(newCantidadStr);
            if (!isNaN(newCantidad)) {
                inventoryData[index].cantidad = newCantidad;
                guardarInventario();
            } else {
                inventoryData[index].cantidad = 0;
                guardarInventario();
            }
        });
        cantidadCell.appendChild(cantidadInputElem);

        valorCell.textContent = formatCLP(item.valor);
        const totalItem = item.cantidad * item.valor;
        totalCell.textContent = formatCLP(totalItem);
        totalInventario += totalItem;
    });
    totalInventarioElement.textContent = `Total Inventario: ${formatCLP(calcularTotalInventario())}`;
}

function agregarItem() {
    const codigo = codigoInput.value.trim();
    const producto = productoInput.value.trim();
    const unidad = unidadInput.value.trim();
    const cantidadStr = cantidadInputForm.value.replace(',', '.');
    const cantidad = parseFloat(cantidadStr);
    const valor = parseFloat(valorInput.value);

    if (codigo && producto && !isNaN(cantidad) && !isNaN(valor)) {
        const newItem = { codigo, producto, unidad, cantidad, valor };
        inventoryData.push(newItem);
        guardarInventario();
        addItemForm.reset();
    } else {
        alert('Por favor, complete el código, producto, cantidad y valor con números válidos (use coma como separador decimal para la cantidad).');
    }
}

borrarHistorialBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres borrar todo el historial del inventario?')) {
        localStorage.removeItem('inventoryData');
        inventoryData = [];
        renderizarInventario();
    }
});

uploadExcelInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            inventoryData = jsonData.map(row => ({
                codigo: row.CODIGO ? row.CODIGO.toString() : '',
                producto: row.PRODUCTO ? row.PRODUCTO.toString() : '',
                unidad: row.UN ? row.UN.toString() : '',
                cantidad: row.CANTIDAD ? parseFloat(row.CANTIDAD.toString().replace(',', '.')) : 0,
                valor: row.VALOR ? parseFloat(row.VALOR) : 0,
            }));
            guardarInventario();
        };
        reader.readAsArrayBuffer(file);
    }
});

descargarExcelBtn.addEventListener('click', () => {
    if (inventoryData.length === 0) {
        alert('No hay datos para descargar.');
        return;
    }
    const wb = XLSX.utils.book_new();
    const wsData = [
        [`Nombre del Casino:`, casinoName],
        [],
        ["CODIGO", "PRODUCTO", "UN", "CANTIDAD", "VALOR", "TOTAL"],
        ...inventoryData.map(item => [
            item.codigo,
            item.producto,
            item.unidad || '',
            parseFloat(item.cantidad.toString().replace(',', '.')), // Ensure quantity is a number
            parseFloat(item.valor), // Ensure valor is a number
            parseFloat((item.cantidad * item.valor).toFixed(2)) // Calculate total and ensure it's a number
        ]),
        [],
        [`Total Inventario:`, calcularTotalInventario()] // Keep as number for now
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Apply number formatting to the 'Valor' and 'Total' columns using a more direct approach
    const numFmt = "#,##0.00";

    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(ws['!ref']);

    // Apply format to 'Valor' column (E)
    for (let row = 3; row <= range.e.r - 2; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 4 });
        if (ws[cellAddress]) {
            ws[cellAddress].t = 'n';
            ws[cellAddress].z = numFmt;
        }
    }

    // Apply format to 'Total' column (F)
    for (let row = 3; row <= range.e.r - 2; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 5 });
        if (ws[cellAddress]) {
            ws[cellAddress].t = 'n';
            ws[cellAddress].z = numFmt;
        }
    }

    // Bold the "Total Inventario" label and value
    const totalRowNumber = range.e.r;
    const totalLabelAddress = XLSX.utils.encode_cell({ r: totalRowNumber, c: 0 });
    const totalValueAddress = XLSX.utils.encode_cell({ r: totalRowNumber, c: 1 });

    if (ws[totalLabelAddress]) ws[totalLabelAddress].s = { font: { bold: true } };
    if (ws[totalValueAddress]) {
        ws[totalValueAddress].s = { font: { bold: true }, numFmt: numFmt }; // Apply format here as well
        ws[totalValueAddress].t = 'n';
        ws[totalValueAddress].v = calcularTotalInventario(); // Use the raw number
    }

    XLSX.utils.book_append_sheet(wb, ws, "Inventario");
    XLSX.writeFile(wb, `inventario_${new Date().toISOString().slice(0, 10)}.xlsx`);
});
mostrarFechaActual();
renderizarInventario();

agregarItemBtn.addEventListener('click', agregarItem);
