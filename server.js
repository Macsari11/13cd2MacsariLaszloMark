const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    user: "root",
    host: "127.0.0.1",
    port: 3306,
    password: "",
    database: "felveteli",
});

db.connect((err) => {
    if (err) {
        console.error("Adatbázis kapcsolat hiba:", err);
    } else {
        console.log("Sikeres adatbázis kapcsolat.");
    }
});

app.get("/", (req, res) => {
    res.send("A backend fut");
});

app.get("/osszpontszam", (req, res) => {
    const sql = `SELECT d.nev, t.agazat, (d.hozott + d.kpmagy + d.kpmat) AS osszpont FROM felveteli.jelentkezesek j JOIN felveteli.diakok d ON j.diak = d.oktazon JOIN felveteli.tagozatok t ON j.tag = t.akod ORDER BY d.nev ASC;`;
 
    db.query(sql, (err, result) => {
        if (err) {
            console.error("SQL Hiba:", err);
            return res.status(500).json({ error: "Adatbázis lekérdezési hiba!" });
        }
        return res.json(result);
    });
});
 
app.get("/agazatjelent", (req, res) => {
    const sql = `SELECT t.agazat, COUNT(j.diak) AS jelentkezok_szama, SUM(d.hozott + d.kpmagy + d.kpmat) AS osszpontszam FROM felveteli.jelentkezesek j JOIN felveteli.diakok d ON j.diak = d.oktazon JOIN felveteli.tagozatok t ON j.tag = t.akod WHERE t.nyek = 1 GROUP BY t.agazat ORDER BY jelentkezok_szama DESC;`;
 
    db.query(sql, (err, result) => {
        if (err) {
            console.error("SQL Hiba:", err);
            return res.status(500).json({ error: "Adatbázis lekérdezési hiba!" });
        }
        return res.json(result);
    });
});

app.listen(3001, () => {
    console.log("A szerver fut a 3001-es porton");
});
