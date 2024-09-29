<h1 style="text-align: center;">Valores y Unidades en CSS</h1>

![Unit](https://kinsta.com/es/wp-content/uploads/sites/8/2024/01/wp-advanced-css-techniques.jpg)

-----------------------

## A qué se refiere con valores en CSS?


<p style="text-align: justify">
Todas las propiedades que se utilizan en CSS tienen un valor o un conjunto de valores que esa propiedad admite, y echar un vistazo a cualquier página de propiedades en MDN te ayudará a comprender qué valores admite una propiedad en particular. En este artículo veremos algunos de los valores y unidades más comunes en uso. A continuacion se mostrara una tabla con sus caracteristicas.
</p>

|Unidad|Nombre|Descripcion|Caracteristicas|
|:----:|:----:|----|----|
|px |Píxeles | Unidades relativas a los píxeles en la pantalla.| Unidad fija que no escala con el tamaño de la pantalla ni con el tamaño del texto, útil para elementos con tamaño definido.|
|%|Porcentaje|Un valor relativo al contenedor o elemento padre.|Se usa para definir tamaños, márgenes, rellenos, etc. que se ajusten dinámicamente según el tamaño del elemento contenedor.|
|vw|Viewport Width	|Relativo al ancho de la ventana gráfica (viewport).	|1vw es igual al 1% del ancho de la ventana gráfica del navegador. Muy útil para crear diseños fluidos y adaptativos en diferentes resoluciones.|
vh|Viewport Height	|Relativo a la altura de la ventana gráfica.	|1vh es igual al 1% de la altura de la ventana gráfica. Al igual que vw, útil para diseños fluidos y adaptativos.|
|cm|Centimetros|Unidad física en centímetros.|Al igual que in, principalmente útil para medios de impresión. 1cm equivale a 37.8 píxeles en pantalla a una resolución estándar.|
|in|Pulgadas (Inches)	|Unidades físicas de pulgada.|Principalmente útil para imprimir. 1in equivale a 96 píxeles en pantalla a una resolución estándar.|
|mm|Milimetros|Unidad física en milímetros.	|1mm es igual a 1/10 de un centímetro.|
|	pt|	Puntos (Points)|Unidad de medida usada tradicionalmente en la tipografía. 1pt = 1/72 pulgadas.|Se usa en tipografía para tamaños de fuente en medios impresos.|
|pc|Picas|Unidad de tipografía. 1pc = 12pt.	|Más común en diseño de impresión, raramente usada en web.|
|em|Em|Relativo al tamaño de la fuente del elemento padre.	|Escala con el tamaño del texto; 1em equivale al tamaño de la fuente del elemento padre, y valores mayores o menores se calculan proporcionalmente.|
|rm|Root Em	|Relativo al tamaño de la fuente raíz del documento.	|Similar a em, pero siempre relativo a la fuente raíz del documento, lo que lo hace más predecible cuando hay varios elementos anidados con diferentes tamaños de fuente.|

## Fuentes:

- https://keepcoding.io/blog/unidades-de-medida-en-css/
- https://developer.mozilla.org/es/docs/Learn/CSS/Building_blocks/Values_and_units