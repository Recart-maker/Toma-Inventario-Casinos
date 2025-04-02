# Toma de Inventario Web

Esta es una aplicación web simple para la toma de inventario. Permite registrar productos con su código, nombre, unidad, cantidad y valor. La información se guarda localmente en el navegador y se puede descargar en formato Excel.

## Funcionalidades

* **Tabla de Inventario:** Muestra los items del inventario con las columnas: CODIGO, PRODUCTO, UN, CANTIDAD, VALOR, TOTAL.
* **Fecha Actual:** Muestra la fecha actual de la toma de inventario.
* **Persistencia de Datos:** La información del inventario se guarda en el navegador y no se borra al recargar la página.
* **Descarga a Excel:** Permite descargar los datos del inventario en un archivo Excel (.xlsx). El archivo incluye el nombre del casino y el total del inventario.
* **Subida de Archivo Excel:** Permite cargar un archivo Excel con la matriz de inventario inicial. El archivo debe tener las columnas: CODIGO, PRODUCTO, UN, CANTIDAD, VALOR.
* **Borrar Historial:** Un botón para eliminar todos los datos del inventario y comenzar una nueva toma.
* **Edición de Cantidad:** La columna "CANTIDAD" es un campo de entrada donde se pueden ingresar números con hasta dos decimales (usando coma como separador).
* **Formato de Moneda:** Las columnas "VALOR" y "TOTAL" se muestran con el formato de Peso Chileno (CLP).
* **Nombre del Casino:** Un campo de texto en la parte superior derecha para ingresar el nombre del casino, el cual se guarda y se incluye en la descarga de Excel.
* **Total del Inventario:** Muestra el valor total del inventario en la parte superior derecha.

## Cómo Usar

1.  Abre el archivo `index.html` en tu navegador web.
2.  Ingresa el nombre del casino en el campo correspondiente.
3.  Para agregar un nuevo item al inventario, completa el formulario y haz clic en "Agregar Item".
4.  Para modificar la cantidad de un item existente, edita el valor en el campo de entrada de la columna "CANTIDAD" directamente en la tabla.
5.  Haz clic en "Descargar Excel" para guardar el inventario en un archivo Excel.
6.  Haz clic en "Subir archivo" para cargar un inventario desde un archivo Excel.
7.  Haz clic en "Borrar Historial" para eliminar todos los datos del inventario.

## Notas

* Esta aplicación utiliza almacenamiento local del navegador para guardar los datos.
* Asegúrate de que el archivo Excel que subas tenga las columnas en el orden correcto: CODIGO, PRODUCTO, UN, CANTIDAD, VALOR.
* La cantidad en el archivo Excel también debe usar coma como separador decimal si es necesario.