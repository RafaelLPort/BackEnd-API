export type User = {
    id_user: string,
    name_user: string,
    password_user: string,
    email_user: string,
    // endereco_cliente: string
}

export enum userRole{
    ADMIN="ADMIN",
    USER="USER"
}