const usermodels = {
    getAll: `
    SELECT 
    * 
    FROM 
    genshin`,
    getByID: `
    SELECT
    *
    FROM
    genshin
    WHERE
    id= ?
    ` ,
    addRow:`
    INSERT INTO
    genshin(
        Nombre,
        Rareza,
        Region,
        Vision,
        Arma,
        CumpleAños,
        Trabajo
    )
    VALUES (
        ?,?,?,?,?,?,?
    )`,
    getByUsername:`
    SELECT
        id
    FROM
        genshin
    WHERE 
        Nombre=?
        `,
    getActuData:`
    UPDATE
        genshin
    SET
        Nombre = ?,
        Rareza = ?,
        Region = ?,
        Vision = ?,
        Arma = ?,
        CumpleAños = ?,
        Trabajo = ?
    WHERE
        id=?`,
    deleteRow:`
    DELETE FROM
        genshin
    WHERE
        id=?`
}

module.exports=usermodels;
