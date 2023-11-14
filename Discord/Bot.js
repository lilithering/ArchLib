const { cerr, clog, cinfo } = require("./../LogManagement");
const { REST } = require("./../Common/discord/rest");
const { WebSocketManager } = require("./../Common/discord/ws");
const { GatewayIntentBits, Routes, GatewayDispatchEvents, Client } = require("./../Common/discord/core");

REST_VERSION = 10;

let m_Gateway;
let m_strToken;
let m_strClientID;
let m_Rest;
let m_Client;

class LXDiscordBot {
    constructor(Config, Commands) {
        cinfo("Iniciando Bot");
        if (!(Config.token || Config.client)) return cerr("Configuração inválida");
        this.config = Config;
        if (!this.Setup()) return cerr("Houve um erro ao fazer a instalação");
        m_Rest = new REST({ version: REST_VERSION }).setToken(m_strToken);
        m_Gateway = new WebSocketManager({
            token: m_strToken,
            intents: (GatewayIntentBits.GuildMessages || GatewayIntentBits.MessageContent),
            rest: m_Rest,
        });
        m_Client = new Client({ rest: m_Rest, gateway: m_Gateway });
        m_Client.on(GatewayDispatchEvents.InteractionCreate, ({ data: Interaction, API }) => {
            new LTLXLothusBehavior(Interaction, API)
        });
        m_Client.once(GatewayDispatchEvents.Ready, () => { cinfo("Login bem sucedido"); });

        cinfo("Bot iniciado com sucesso");
    };
    Setup() {
        m_strToken = this.config.token;
        m_strClientID = this.config.client;

        if (!(m_strToken || m_strClientID)) return false;

        cinfo("Instalação concluída");
        return true;
    };
    Login() {
        if (!m_Gateway) return cerr("Houve um problema no Gateway");

        cinfo("Iniciando Login");
        m_Gateway.connect();

        cinfo("Login finalizado");
        return true;
    };
    Update() {
        m_Rest.put(Routes.applicationCommands(m_strClientID), { body: commands })
            .then(x => cinfo("Comandos atualizados com sucesso"))
            .catch(err => cerr("Houve um erro ao tentar enviar os comandos", { err }));

        cinfo("Comandos enviados com sucesso");
        return true;
    };
    Option(strName) {
        return this.Find(strName).value;
    };
    Find(_sName) {
        return this.sub.options.find(v => v.name == _sName);
    };
    Next() {
        this.sub = this.sub.options[0];
    };

    Defer() {
        return this.api.interactions.defer(this.interaction.id, this.interaction.token);
    };
    reply(_Data) {
        return this.api.interactions.editReply(this.self.clientID, this.interaction.token, _Data);
    };
    log(_sMessage, _bEphemeral) {
        this.reply({ content: _sMessage, ephemeral: _bEphemeral ?? false });
    };

    dump(_sMessage, _Dump = "no dump.") {
        console.error(_sMessage);
        devtools.raise("./log.txt", `[${Date()}]\nMessage: ${_sMessage}\nName: ${this.command.name}\nDump: `);
        devtools.raise("./log.txt", JSON.stringify(_Dump));
        devtools.raise("./log.txt", '\n\n');
    };
    raise(_sMessage, _Dump) {
        this.log(_sMessage);
        this.dump(_sMessage, _Dump);
    };
    raiseAdminRoleFail() {
        this.raise("Você não tem permissão para executar esse comando. <:ChibiSieghart:1167521896011673751>");
    };
    raiseLoginFail() {
        this.raise("Você não tem uma conta de usuário, crie uma com ***/cadastro***");
    };
    raiseRunFail() {
        this.raise("Erro interno, tente novamente mais tarde.");
    };
    raiseError(_Error) {
        this.raise("Ocorreu um erro ao tentar processar o seu comando, tente novamente mais tarde.", _Error);
    };

    async query(_sName, ..._Args) {
        let proc = this.procedure[_sName];
        if (!proc) return this.dump("GCError: Invalid Procedure", _sName);
        let data = await proc(this.database, ..._Args);
        return [data, data.rowsAffected[0]];
    };
    async first(_sName, ..._Args) {
        let [data, flag] = await this.query(_sName, ..._Args);
        if (flag) return data.recordset[0];
    };
    async run(_sName, ..._Args) {
        let [data, flag] = await this.query(_sName, ..._Args);
        return flag;
    };
};

module.exports = { LXDiscordBot };