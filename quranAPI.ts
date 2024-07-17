const express = require('express')
import * as sqlite3 from 'sqlite3';
interface suraTableType{
    id : number,
    sura: string
}
interface suraType{
    id : number,
    surah_number : number,
    aya_number : number,
    text : string
}
const app = express()
const port = 3000
let quranTable :suraType[] = []
let translationTable :object[] = []
let suraTable :suraTableType[] = []
let translatorsTable :object[] = []
let tables:object[][] = [quranTable, translationTable, suraTable, translatorsTable]
const tableNames : string[] = ['quran', 'translation', 'suras', 'translators'];
const databasePath = './database/quran.db';
// const dataBase = new sqlite3.Database(dataBasePath, sqlite3.OPEN_READWRITE, (err) => {
//     if (err) {
//         console.error('Error opening dataBase:', err.message);
//     } else {
//         console.log('Connected to the dataBase.');
//         for (let i : number = 0; i < tableNames.length; i++) {
//         readDataFromDatabase(tableNames[i], tables[i]);
//         }
//     }
// });
//
// // reading data from dataBase
// function readDataFromDatabase(tableName : string, tableArray : object[])  {
//     const sql = `SELECT * FROM ${tableName}`;
//     dataBase.all(sql, [], (err, rows: object[]) => {
//         if (err) {
//             console.error('Error executing query:', err.message);
//         } else {
//             tableArray = rows
//             // console.log('1) readDataFromDatabase function executed ...')
//
//             console.log(`${tableName} table length = ${tableArray.length}`);
//             console.log(`translatorsTable = ${translatorsTable}`);
//         }
//     });
//
// }

let database = new sqlite3.Database(databasePath);

function getQuranTableDataFromDatabase (tableName:string) {
    let sql : string = `SELECT * FROM ${tableName}`;
    database.all(sql, [], (err, rows : suraType[]) => {
        if (err) {
            throw err;
        }
        quranTable = rows
    });
    // close the dataBase connection
    // database.close();
}

function getTranslationTableDataFromDatabase (tableName:string) {
    let sql : string = `SELECT * FROM ${tableName}`;
    database.all(sql, [], (err, rows : object[]) => {
        if (err) {
            throw err;
        }
        translationTable = rows
    });
    // close the dataBase connection
    // database.close();
}

function getSuraTableDataFromDatabase (tableName:string) {
    let sql : string = `SELECT * FROM ${tableName}`;
    database.all(sql, [], (err, rows : suraTableType[]) => {
        if (err) {
            throw err;
        }
        suraTable = rows
    });
    // close the dataBase connection
    // database.close();
}

function getTranslatorsTableDataFromDatabase (tableName:string) {
    let sql : string = `SELECT * FROM ${tableName}`;
    database.all(sql, [], (err, rows : object[]) => {
        if (err) {
            throw err;
        }
        translatorsTable = rows
    });
    // close the dataBase connection
    // database.close();
}

getQuranTableDataFromDatabase(tableNames[0])
getTranslationTableDataFromDatabase(tableNames[1])
getSuraTableDataFromDatabase(tableNames[2])
getTranslatorsTableDataFromDatabase(tableNames[3])

app.get('/', (req : any, res : any) =>{
    res.send('quran phase b');
})
app.get('/quran', (req : any, res : any) =>{
    res.status(200).json({
        data : quranTable,
        success : true
    })
})
app.get('/quran/:surah_number', (req : any, res : (suraType|any) ) =>{
    // let textArray: suraType[] = []
    let textArray: (string | number)[] = []
    quranTable.forEach((suraText) =>{
        if (suraText.surah_number == req.params.surah_number){
            textArray.push(suraText.text);
            textArray.push(suraText.aya_number);
        }
    })
    // let ayaNumber = quranTable.find((suraText) =>{
    //     if (suraText.aya_number == req.params.aya_number){
    //         return suraText.aya_number;
    //     }
    // })
    res.status(200).json({
        data : textArray,

        success : true
    })
})
app.get('/translation', (req : any, res : any) =>{
    res.status(200).json({
        data : translationTable,
        success : true
    })
})
app.get('/translators', (req : any, res : any) =>{
    res.status(200).json({
        data : translatorsTable,
        success : true
    })
})

app.get('/sura/:id', (req : any, res : (suraTableType | any) ) =>{
    let sura = suraTable.find((item) =>{
        if (item.id == req.params.id){
            return item;
        }
    })
    res.status(200).json({
        data : sura,
        success : true
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})