const express = require('express')
const cors = require('cors')
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
interface translationType{
    id : number,
    surah_number : number,
    aya_number : number,
    translator_id : number,
    text : string
}
const app = express()
const port = 3000
app.use(cors({
    origin: "http://localhost:5173"
}))
let quranTable :suraType[] = []
let translationTable :translationType[] = []
let suraTable :suraTableType[] = []
let translatorsTable :object[] = []
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
    database.all(sql, [], (err, rows : translationType[]) => {
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

// getting all quran ayas's info
app.get('/quran', (req : any, res : any) =>{
    res.status(200).json({
        data : quranTable,
        success : true
    })
})

// getting nth sura ayas
app.get('/quran/:surah_number', (req : any, res : (suraType|any) ) =>{
    let textArray: string [] = []
    let ayaNumberArray: number [] = []
    quranTable.forEach((suraText) =>{
        if (suraText.surah_number == req.params.surah_number){
            textArray.push(suraText.text);
            ayaNumberArray.push(suraText.aya_number);
        }
    })
    res.status(200).json({
        data : textArray,
               ayaNumberArray,
        success : true
    })
})

// getting all translations
app.get('/translation', (req : any, res : any) =>{
    res.status(200).json({
        data : translationTable,
        success : true
    })
})

// getting nth sura's translation with one of translators
app.get('/translation/:translator_id&:surah_number', (req : any, res : (translationType|any) ) =>{
    let textArray: string[] = []
    translationTable.forEach((translationText) =>{
        if (translationText.surah_number == req.params.surah_number && translationText.translator_id == req.params.translator_id){
            textArray.push(translationText.text);
            // textArray.push(suraText.aya_number);
        }
    })
    res.status(200).json({
        data : textArray,
        success : true
    })
})

// getting one translation
// app.get('/translation/:translator_id&:surah_number&:aya_number', (req : any, res : (translationType|any) ) =>{
app.get('/translation/:translator_id&:aya_text', (req : any, res : (translationType|any) ) =>{
    let Array: any[] = []
    translationTable.forEach((translationText) =>{
        if (
            translationText.text == req.params.aya_text &&
            translationText.translator_id == req.params.translator_id
        ){
            // if (translationText.surah_number === req.params.surah_number &&
            //     translationText.translator_id === req.params.translator_id &&
            //     translationText.aya_number === req.params.aya_number
            // ){
            Array.push(translationText);
        }
    })
    res.status(200).json({
        data : Array,
        success : true
    })
})

// getting all translators info
app.get('/translators', (req : any, res : any) =>{
    res.status(200).json({
        data : translatorsTable,
        success : true
    })
})

// getting all suras info
app.get('/sura', (req : any, res : (suraTableType | any) ) =>{
    res.status(200).json({
        data : suraTable,
        success : true
    })
})

// getting nth sura info
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

// searching search result = aya text and id
app.get('/search/:word', (req : any, res : any) =>{
    let searchAyaNumberArray :(number)[] = []
    let searchSuraNumberArray :(number)[] = []
    let searchSuraNameArray :(number | suraTableType | string)[] = []
    let searchTextArray :(string)[] = []
    quranTable.forEach((aya ) =>{
        let simpleAya : string = aya.text.replace(/(َ|ُ|ِ|ً|ٌ|ٍ|ّ)/g, "");
        if (aya.text.includes(req.params.word) || simpleAya.includes(req.params.word)){
            searchTextArray.push(aya.text);
            // searchIdArray.push(aya.id);
            searchAyaNumberArray.push(aya.aya_number);
            searchSuraNumberArray.push(aya.surah_number);
            searchSuraNameArray.push(suraTable[aya.surah_number-1].sura);
        //     اسم سوره را همین جا بفرست
        }
    })
    res.status(200).json({
        data : searchAyaNumberArray,
               searchTextArray,
               searchSuraNameArray,
               searchSuraNumberArray,
        success : true
    })
})

// getting one aya info
app.get('/aya/:id', (req : any, res : (suraType | any) ) =>{
    let aya = quranTable.find((item) =>{
        if (item.id == req.params.id){
            return item;
        }
    })
    res.status(200).json({
        data : aya,
        success : true
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})