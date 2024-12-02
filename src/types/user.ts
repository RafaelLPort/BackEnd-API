export type Cliente = {
    id_cliente: string,
    nome_cliente: string,
    senha_cliente: string,
    email_cliente: string,
    // endereco_cliente: string
}

export enum userRole{
    ADMIN="ADMIN",
    USER="USER"
}