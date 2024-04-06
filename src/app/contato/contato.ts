export class Contato {
    id!: number;
    nome!: string;
    email!: string;
    favorito!: boolean;

    constructor(in_nome: string, in_email: string) {
        this.nome = in_nome;
        this.email = in_email;
        this.favorito = true;
    }
}