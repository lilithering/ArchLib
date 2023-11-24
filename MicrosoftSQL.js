/*****************************
MicrosoftSQL
MSSQL CUSTOM API
Author: Lilithering (lilithering@gmail.com)
Update: 23-11-23
[Output] LX::MicrosoftSQL
******************************/

const mssql = require("./../ArchLib/Common/mssql");
const { cerr, clog, cinfo, debug } = require("./../ArchLib/LogManagement");

class LXMicrosoftSQL {
    constructor(Options) {
        this.core = mssql;
        if (!Options) return cerr("Nenhum parâmetro para conexão informado");
        return (async () => {
            this.connection = await mssql.connect(Options);
            return this;
        })();
    };
    async Query(Parameters) {
        return new Promise((resolve, reject) => {
            let Statement = new mssql.PreparedStatement();
            Object.keys(Parameters.args).forEach(key => Statement.input(key, Parameters.args[key].type));
            Statement.prepare(Parameters.query, (err) => {
                if (err) return reject(err);
                let Data = {};
                Object.keys(Parameters.args).forEach(key => Data[key] = Parameters.args[key].value);
                Statement.execute(Data, (err, res) => {
                    if (err) return reject(err);
                    Statement.unprepare((err) => {
                        if (err) return console.error(err);
                        resolve(res);
                    });
                });
            });
        });
    };
};

module.exports = { LXMicrosoftSQL };