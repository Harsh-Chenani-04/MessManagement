const express = require("express");
const app = express.Router();
const path = require("path");
const Student = require("../models/student");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const Mealprice = require("../models/mealprice");
const Messmenu = require("../models/messmenu");
const Booking = require("../models/bookmeal");
const flash = require("connect-flash");
const Complaint = require("../models/Complaint");

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}

const requireLogin = (req, res, next) => {
  if (!req.session.admin_id) {
    req.flash("error", "Please Log in first");
    return res.redirect("/admin/login");
  }
  next();
};

app.get("/signup", (req, res) => {
  var success = req.flash("success");
  var error = req.flash("error");
  res.render("admin/signup", { success: success, error: error });
});

app.post(
  "/signup",
  wrapAsync(async (req, res) => {
    console.log(req.body);
    const { AdminName, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    console.log(hash);
    const admin = new Admin(req.body);
    admin.password = hash;

    admin.save(function (err, doc) {
      if (err) {
        req.flash("error", "Already Taken Email/Username");
        res.redirect("/admin/signup");
      } else {
        req.flash("success", "Signup was successfull, now you can login");
        req.session.admin_id = admin._id;
        req.session.role = "admin";
        console.log(req.session.role);
        res.redirect("/admin/login");
      }
    });
  })
);

app.get("/login", (req, res) => {
  if (!req.session.admin_id) {
    var success = req.flash("success");
    var error = req.flash("error");
    res.render("admin/login", { success: success, error: error });
  } else {
    req.flash("error", "You need to Login First");
    res.redirect("/admin/login");
  }
});

app.post(
  "/login",
  wrapAsync(async (req, res) => {
    //console.log(req.body)
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin) {
      const validPassword = await bcrypt.compare(password, admin.password);
      if (validPassword) {
        req.session.admin_id = admin._id;
        req.session.role = "admin";
        console.log("here");
        req.flash("success", "Logged in successfully ");
        //req.flash("success","Logged in succesfully")
        res.redirect("/admin/home");
      } else {
        req.flash("error", "Incorrect Email or Password");
        res.redirect("/admin/login");
      }
    } else {
      req.flash("error", "Incorrect Email or Password");
      res.redirect("/admin/login");
    }
  })
);

app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        //req.flash('success', 'Logged out successfully ');
        //req.flash("success", "Logged out successfully ");
        return res.redirect("/admin/login");
      }
    });
  }
});

app.get("/home", requireLogin, (req, res) => {
  var success = req.flash("success");
  var error = req.flash("error");
  res.render("admin/home", { success: success, error: error });
});

app.get('/reset', async (req, res) => {
  try {
    if (!req.session.admin_id) {
      req.flash('error', 'You need to login first');
      return res.redirect('/admin/login');
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const mealprice = await Mealprice.findOne();
    const { bf, lunch, dinner } = mealprice;
    const dues_this_month = daysInMonth * (bf + lunch + dinner)
    const students = await Student.find();
    for (const student of students) {
      student.no_of_bf = daysInMonth;
      student.no_of_lunch = daysInMonth;
      student.no_of_dinner = daysInMonth;
      student.currentdues += student.dues_this_month;
      student.dues_this_month = dues_this_month;

      await student.save();
    }

    req.flash('success', 'Reset for this month is successful.');
    res.redirect('/admin/home');
  } catch (err) {
    console.error(err);
    req.flash('error', 'An error occurred while resetting for this month.');
    res.status(500).redirect('/admin/home');
  }
});



app.get("/complaints", async (req, res) => {
  if (!req.session.admin_id) {
    req.flash("error", "Please Login!!");
    res.redirect("/admin/login");
  } else {
    Complaint.find({ status: "open" }, (err, complaints) => {
      if (err) {
        console.error(err);
        return res.send("Error retrieving complaints");
      }
      var success = req.flash("success");
      var error = req.flash("error");
      res.render("admin/complaints", {
        complaints: complaints,
        success,
        error,
      });
    });
  }
});

// Update the status of a complaint to "closed"
app.post("/complaints/consider", (req, res) => {
  if (!req.session.admin_id) {
    req.flash("error", "Please Login!!");
    res.redirect("/admin/login");
  }
  // Find the complaint by its ID and update its status to "closed"
  Complaint.findByIdAndUpdate(
    req.body.id,
    { status: "closed", resolved: "true" },
    (err, complaint) => {
      if (err) {
        console.error(err);
        req.flash("error", "Something went Wrong");
        return res.send("Error updating complaint status");
      }
      req.flash("success", "Complaint Resolved");
      res.redirect("/admin/complaints");
    }
  );
});

app.get(
  "/mealprice",
  wrapAsync(async (req, res) => {
    if (!req.session.admin_id) {
      req.flash("error", "Please Login!!");
      res.redirect("/admin/login");
    }
    const [mealprice] = await Mealprice.find();
    console.log(mealprice);
    var success = req.flash("success");
    var error = req.flash("error");
    res.render("admin/mealprices", {
      success: success,
      error: error,
      mealprice,
    });
    //res.render("admin/mealprices", { mealprice });
  })
);

app.get(
  "/messmenu",
  wrapAsync(async (req, res) => {
    if (!req.session.admin_id) {
      req.flash("error", "Please Login!!");
      res.redirect("/admin/login");
    }
    const messmenu = await Messmenu.find({});
    //console.log(messmenu);
    var success = req.flash("success");
    var error = req.flash("error");
    res.render("admin/messmenu", { messmenu, error, success });
    //res.send('messmenu')
  })
);

app.post("/messmenu", async (req, res) => {
  const messmenu = await Messmenu.find();

  //console.log(req.body);
  const { b1, b2, b3, l1, l2, l3, d1, d2, d3 } = req.body;

  for (let i = 0; i < 7; i++) {
    messmenu[i].b1 = b1[i];
    messmenu[i].l1 = l1[i];
    messmenu[i].d1 = d1[i];
    messmenu[i].b2 = b2[i];
    messmenu[i].l2 = l2[i];
    messmenu[i].d2 = d2[i];
    messmenu[i].b3 = b3[i];
    messmenu[i].l3 = l3[i];
    messmenu[i].d3 = d3[i];
    await messmenu[i].save();
  }

  req.flash("success", "Mess Menu updated");
  res.redirect("/admin/messmenu");
});

app.get("/messmenu/edit", async (req, res) => {
  if (!req.session.admin_id) {
    req.flash("error", "Please Login!!");
    res.redirect("/admin/login");
  }
  const messmenu = await Messmenu.find({});
  console.log(messmenu);
  res.render("admin/changemessmenu", { messmenu });
});

app.get(
  "/studentdues",
  wrapAsync(async (req, res) => {
    if (!req.session.admin_id) {
      req.flash("error", "Please Login!!");
      res.redirect("/admin/login");
    }
    const students = await Student.find();
    //console.log(students)
    res.render("admin/dues", { students });
  })
);

app.get(
  "/mealprice/edit",
  wrapAsync(async (req, res) => {
    if (!req.session.admin_id) {
      req.flash("error", "Please Login!!");
      res.redirect("/admin/login");
    }
    const admin = await Admin.findOne({});
    //console.log(admin._id);
    const id = admin._id;

    const [mealprice] = await Mealprice.find({ id: id });
    var success = req.flash("success");
    var error = req.flash("error");
    //res.render("admin/home", { success: success, error: error })
    res.render("admin/changeprice", {
      mealprice,
      success: success,
      error: error,
    });
  })
);

app.post(
  "/mealprice",
  wrapAsync(async (req, res) => {
    if (!req.session.admin_id) {
      req.flash("error", "Please Login!!");
      res.redirect("/admin/login");
    }
    console.log(req.body);
    const { bf, lunch, dinner } = req.body;
    const admin = await Admin.findOne();
    //console.log(admin._id);
    const id = admin._id;

    const [mealprice] = await Mealprice.find({ id: id });
    mealprice.bf = bf;
    mealprice.lunch = lunch;
    mealprice.dinner = dinner;
    await mealprice.save();
    req.flash("success", "Price Updated");
    res.redirect("/admin/mealprice");
  })
);

app.get(
  "/knoworders",
  wrapAsync(async (req, res) => {
    if (!req.session.admin_id) {
      req.flash("error", "Please Login!!");
      res.redirect("/admin/login");
    }
    const orders = await Booking.find({});

    res.render("admin/knoworders", { orders });
  })
);

module.exports = app;
