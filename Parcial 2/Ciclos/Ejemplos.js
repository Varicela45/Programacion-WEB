for (let a=0; a<=10;a++){
    console.log(a)
}

let b=1
do {
    console.log(b);
    b++
} while (b<=20)


let objeto = {
    nombre: "Juan",
    Apellido: "Perez",
    Edad: 23
}

for (let propiedad in objeto){
    console.log(objeto[propiedad])
}


let array = [1,2,3,4,5]

array.forEach(
    function(elemento){
        console.log(elemento)
    }
)


let string = "Curso de grafos"

for (let letra in string){
    console.log(string[letra])
}









/*Funcion flecha */
const area = (x,y) => (x*y)/2;
console.log(area(10,5))

/*Declaracion de funcion */
function Triangulo(Base, Altura){
    let Area = (Base * Altura)/2;
    console.log(Area)
}
console.log(Triangulo(19,3))


/*Expresion de funcion */
var Juan = function Triangulo(Base, Altura){
    let Area = (Base * Altura)/2;
    console.log(Area)
}
Juan(20,56)