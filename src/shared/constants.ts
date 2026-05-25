// Costo de envío fijo. Debe coincidir con el valor del backend
// (integrador2/app/modules/pedido/service.py -> costo_envio).
// El backend lo agrega al total al crear el pedido; acá lo usamos solo
// para mostrar el desglose ANTES de confirmar (carrito y checkout).
export const COSTO_ENVIO = 50
