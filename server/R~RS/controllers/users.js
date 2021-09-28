"use strict";

const { Users } = require("../models");

exports.findAll = async (req, res, next) => {
  try {
    // pass in default limit and page if not defined
    const limit = req.query.limit != undefined ? parseInt(req.query.limit) : 10;
    const page = req.query.page != undefined ? parseInt(req.query.page) : 1;

    // remove limit and page key from object req
    delete req.query["limit"];
    delete req.query["page"];

    const data = await Users.findAndCountAll({
      where: req.query,
      limit,
      offset: limit * page - limit,
    });

    res.send({
      msg: "users fetched",
      data: data.rows,
      page: page,
      limit: limit,
      total_page: Math.ceil(data.count / limit),
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const data = await Users.findByPk(req.params.id);
    res.send({ msg: "users fetched", data: data });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await Users.create(req.body);
    res.send({
      msg: "users created",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await Users.update(req.body, {
      where: { id: req.params.id },
    });
    res.send({
      msg: "users updated",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const data = await Users.destroy({
      where: { id: req.params.id },
    });
    res.send({
      msg: "users deleted",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
