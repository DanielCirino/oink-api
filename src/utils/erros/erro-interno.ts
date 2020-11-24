export class ErroInterno extends Error {
  constructor(
    public mensagem: string,
    protected codigo: number,
    protected descricao?: string
  ) {
    super(mensagem);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface InterfaceErro {
  codigo: number;
  mensagem: string;
  descricao?: string;
}
