const { generateQuery, asyncQuery } = require("../helpers/queryHelp");

module.exports = {
  getProductCategory: async (req, res) => {
    const get = "SELECT * FROM pro_kat";
    try {
      const result = await asyncQuery(get);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getProcatById: async (req, res) => {
    const getDataById = `SELECT * FROM pro_kat WHERE id=${parseInt(
      req.params.id
    )}`;
    try {
      const result = await asyncQuery(getDataById);
      res.status(200).send(result[0]);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  addProcat: async (req, res) => {
    console.log("body : ", req.body);
    const { produk_id, kategori_id } = req.body;
    try {
      // get parent category_id
      const getCategoryId = `WITH RECURSIVE category_path (id, kategori, parent_id) AS
            (
                SELECT id, kategori, parent_id
                    FROM kategori
                    WHERE id = ${kategori_id} -- child node
                UNION ALL
                SELECT k.id, k.kategori, k.parent_id
                    FROM category_path AS cp JOIN kategori AS k
                    ON cp.parent_id = k.id
            )
            SELECT id FROM category_path;`;
      const categoryId = await asyncQuery(getCategoryId);

      //insert query
      let value = "";
      categoryId.forEach((item) => (value += `(${produk_id}, ${item.id}),`));
      const insertQuery = `INSERT INTO pro_kat (produk_id, kategori_id)
        VALUES ${value.slice(0, -1)}`;
      console.log(insertQuery);
      const result = await asyncQuery(insertQuery);

      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  deleteProkat: async (req, res) => {
    console.log("params : ", req.params);
    const id = parseInt(req.params.id);

    try {
      const del = `DELETE FROM pro_kat WHERE produk_id = ${id}`;
      const result = await asyncQuery(del);

      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  editProkat: async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(req.params.id)
    try {
      // check if product with id exist in our database
      const checkProkat = `SELECT * FROM pro_kat WHERE id=${id}`;
      const check = await asyncQuery(checkProkat);
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
  }
};
