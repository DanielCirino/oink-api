function obterValorAleatorioDeEnum(valores: any): string {
  const max = Object.keys(valores).length - 1;
  const index = Math.round(Math.random() * max);
  const valor = Object.values(valores)[index];

  if (!valor) {
    console.log(valores, max, index);
  }
  return String(valor);
}

function obterItemAleatorioDeUmaLista(lista: Array<any>): any {
  const max = Object.keys(lista).length - 1;
  const index = Math.round(Math.random() * max);
  const item = Object.values(lista)[index];
  return item;
}

export default { obterValorAleatorioDeEnum, obterItemAleatorioDeUmaLista };
