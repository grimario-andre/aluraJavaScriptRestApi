class ICrud {
    insert() {
        throw new Error("Implementação do insert na classe que implementar o metodo");
    }

    select() {
        throw new Error("Implementação do select na classe que implementar o metodo");
    }

    update() {
        throw new Error("Implementação do update na classe que implementar o metodo");
    }

    delete() {
        throw new Error("Implementação do delete na classe que implementar o metodo");
    }
}

module.exports = ICrud;