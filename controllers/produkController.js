const db = require("../database");
const util = require("util");

const { generateQuery, asyncQuery } = require('../helpers/queryHelp')

module.exports ={
    getProducts: async (req, res) => {
        const getData = "SELECT * FROM produk";
        try {
          const result = await asyncQuery(getData);
          // console.log(result)
          res.status(200).send(result);
        } catch (err) {
          res.status(500).send(err);
        }
    },
    getProductById: async (req, res) => {
        const getDataById = `SELECT * FROM produk WHERE id=${parseInt(
          req.params.id
        )}`;
        try {
          const result = await asyncQuery(getDataById);
          res.status(200).send(result[0]);
        } catch (err) {
          res.status(500).send(err);
        }
      },
      getProductByPagination : async (req, res) => {
        console.log(`params : `, req.params)
        const limit = parseInt(req.params.limit)
        const page = parseInt(req.params.halaman)

        try {
            const getDataPagin = `select * from produk limit ${limit} offset ${(page-1)*limit}`
            const result = await asyncQuery(getDataPagin)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
      },
      addProduct: async (req, res) => {
        console.log("body : ", req.body);
        const { nama_produk, deskripsi, harga, stok } = req.body;
        try {
          const insert = `INSERT INTO produk (nama_produk, deskripsi, harga, stok) 
                          VALUES ('${nama_produk}', '${deskripsi}', '${harga}', '${stok}')`;
          const result = await asyncQuery(insert);
    
          res.status(200).send(result);
        } catch (err) {
          res.status(500).send(err);
        }
      },
      editProduct: async (req, res) => {
        const id = parseInt(req.params.id);
        console.log(req.params.id)
        try {
          // check if product with id exist in our database
          const checkProduct = `SELECT * FROM produk WHERE id=${id}`;
          const check = await asyncQuery(checkProduct);
          if (check.length === 0)
            return res.status(400).send("product doesn't exist.");
    
          // edit product
          const edit = `UPDATE produk SET ${generateQuery(
            req.body
          )} WHERE id=${id}`;
          const result = await asyncQuery(edit);
    
          // send response
          res.status(200).send(result);
        } catch (err) {
          console.log(err)
          res.status(500).send(err);
        }
      },
      deleteProduct: async (req, res) => {
        const id = parseInt(req.params.id);
        console.log(req.params.id)
        try {
          // check if product with id exist in our database
          const checkProduct = `SELECT * FROM produk WHERE id=${id}`;
          const check = await asyncQuery(checkProduct);
          if (check.length === 0)
            return res.status(400).send("product doesn't exist.");
    
          // delete product
          const del = `DELETE FROM produk WHERE id=${id}`;
          const result = await asyncQuery(del);
    
          // send response
          res.status(200).send(result);
        } catch (err) {
          console.log(err)
          res.status(500).send(err);
        }
      }
}