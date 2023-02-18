const express = require("express");
const app = express.Router();
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");
//const Studentdues = require('../models/dues');
const Student = require("../models/student");
//const ManageOrder = require('../models/managerorder');
const Manager = require("../models/manager");
const Messmenu = require("../models/messmenu");
const Booking = require("../models/bookmeal");

const requireLogin = (req, res, next) => {
  if (!req.session.manager_id) {
    req.flash("error", "Please Log in first");
    return res.redirect("/manager/login");
  }
  next();
};

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}

app.get("/login", (req, res) => {
  var success = req.flash("success");
  var error = req.flash("error");
  res.render("manager/login", { success: success, error: error });
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { ManagerName, password } = req.body;
  const manager = await Manager.findOne({ ManagerName });
  console.log(manager);
  if (manager) {
    const validPassword = await bcrypt.compare(password, manager.password);
    if (validPassword) {
      req.session.manager_id = manager._id;
      req.session.role = "manager";
      console.log("here");
      req.flash("success", "Logged in successfully ");
      //req.flash("success","Logged in succesfully")
      res.redirect("/manager/home");
    } else {
      req.flash("error", "password or username is not correct");
      res.redirect("/manager/login");
    }
  } else {
    req.flash("error", "password or username is not correct");
    res.redirect("/manager/login");
  }
});

app.get("/home", requireLogin, (req, res) => {
  // console.log(req.session.manager_id)
  //console.log(req.session.role)
  var success = req.flash("success");
  var error = req.flash("error");
  res.render("manager/home", { success: success, error: error });
});

app.get(
  "/messmenu",
  requireLogin,
  wrapAsync(async (req, res) => {
    if (!req.session.manager_id) {
      req.flash("error", "Please Log in first");
      res.redirect("/manager/login");
    }
    var success = req.flash("success");
    var error = req.flash("error");
    //res.render("manager/login", { success: success, error: error });
    const messmenu = await Messmenu.find({});
    //console.log(messmenu);
    res.render("manager/messmenu", { messmenu, success, error });
    //res.send('messmenu')
  })
);

app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err, doc) => {
      if (err) {
        return next(err);
      } else {
        res.redirect("/manager/login");
      }
    });
  }
});

app.get(
  "/studentdues",
  wrapAsync(async (req, res) => {
    if (!req.session.manager_id) {
      req.flash("error", "Please Log in first");
      res.redirect("/manager/login");
    }
    var success = req.flash("success");
    var error = req.flash("error");
    //res.render("manager/login", { success: success, error: error });
    const students = await Student.find();
    //console.log(students)
    res.render("manager/dues", { students, success, error });
  })
);

app.get(
  "/knoworders",
  wrapAsync(async (req, res) => {
    if (!req.session.manager_id) {
      req.flash("error", "Please Log in first");
      res.redirect("/manager/login");
    }
    var success = req.flash("success");
    var error = req.flash("error");
    //res.render("manager/login", { success: success, error: error });
    const orders = await Booking.find({});
    res.render("manager/knoworders", { orders, success, error });
  })
);

module.exports = app;
