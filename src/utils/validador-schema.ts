import Ajv from 'ajv';

const validadorAjv = Ajv({
  allErrors: true
});

function validarSchema(schema: any, dados: any): any {
  const eValido = validadorAjv.validate(schema, dados);
  return {
    eValido,
    erros: !eValido ? validadorAjv.errors : []
  };
}

// function converterErrosValidacao(
//   erros: ErrorObject[] | null | undefined
// ): Array<string> {
//   if (!erros) {
//     return [];
//   }

//   return erros.map((erro) => {
//     switch (erro.keyword) {
//       case 'required':
//         return `Propriedade: ${erro.dataPath}.${erro.params.missingProperty} obrigatória não foi informada. `;
//         break;
//       case 'maxLength':
//         return `Propriedade: ${erro.dataPath} com tamanho inválido. Tamanho máximo: ${erro.params.limit}.`;
//         break;
//       case 'format':
//         return `Propriedade: ${erro.dataPath} com formato inválido. Formato permitido: ${erro.params.format}.`;
//         break;
//       case 'enum':
//         return `Propriedade: ${
//           erro.dataPath
//         } não possui uma opção válida. Valores válidos: [${erro.params.allowedValues.join(
//           ','
//         )}].`;
//         break;
//       case 'pattern':
//         return `Propriedade: ${erro.dataPath} não possui uma opção válida. Valores válidos: [${erro.params.pattern}].`;
//         break;
//       default:
//         return `Tipo de erro [${erro.keyword}] não mapeado.`;
//         break;
//     }
//   });
// }

export default {
  validarSchema
};
