const { cerr, cinfo } = require("./../ArchLib/LogManagement");
const express = require("./../ArchLib/Common/express");

class MXGateway {
    constructor() {
        cinfo("Iniciando Gateway");
        if (!this.Create()) return cerr("Falha ao tentar criar a rota");
        if (!this.Defaults()) return cerr("Falha ao tentar definir os padrões da rota");

        cinfo("Gateway iniciado com sucesso", { name: this.constructor.name });
    }
    Create() {
        this.router = express.Router();

        cinfo("Rota criada com sucesso");
        return true;
    }
    Defaults() {
        this.router.get("/", (req, res) => { res.send("Hello World! Message from Gateway Router.") });

        cinfo("Padrões definidos com sucesso");
        return true;
    };
    Static(strURL, strPath) {
        this.router.use(strURL, express.static(strPath));
    };
};

module.exports = { MXGateway };