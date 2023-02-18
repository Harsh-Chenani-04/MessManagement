const express = require("express");
const app = express.Router();
const path = require("path");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const Student = require("../models/student");
const Mealprice = require("../models/mealprice");
const Messmenu = require("../models/messmenu");
const Booking = require("../models/bookmeal");
const moment = require("moment");
const flash = require("connect-flash");
const session = require("express-session");
const Complaint = require("../models/Complaint");

app.use(flash());
app.use(express.urlencoded({ extended: true }));

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}

const isStudent = (req, res, next) => {
  if (req.session.role !== "student") {
    req.flash("error", "Student is not registered");
    return res.redirect("/student/login");
  }

  next();
};

const requireLogin = (req, res, next) => {
  if (!req.session.student_id) {
    req.flash("error", "Please Log in first");
    return res.redirect("/student/login");
  }
  next();
};

async function calculateMessBill(
  bfmeal,
  lunchmeal,
  dinnermeal,
  duration,
  booking,
  student
) {
  console.log(duration);
  while (duration) {
    if (booking.bf === 0) {
      student.no_of_bf--;
    }
    if (booking.lunch === 0) {
      student.no_of_lunch--;
    }
    if (booking.dinner === 0) {
      student.no_of_dinner--;
    }
    duration = duration - 1;
  }

  //console.log(student)
  const mealprice = await Mealprice.findOne();
  const messBill =
    bfmeal * mealprice.bf +
    lunchmeal * mealprice.lunch +
    dinnermeal * mealprice.dinner;
  return messBill;
}

const to_day = new Date();
const last_DayOfMonth = new Date(to_day.getFullYear(), to_day.getMonth() + 1, 0);

const messWaiverSchema = Joi.object({
  startdate:  Joi.date()
  .min(to_day)
  .required()
  .messages({
    'any.required': 'Start date is required',
    'date.base': 'Start date must be a valid date',
    'date.min': 'Start date must be greater than or equal to today'
  }),
  enddate: Joi.date()
  .min(Joi.ref('startdate'))
  .max(last_DayOfMonth)
  .required()
  .messages({
    'any.required': 'End date is required',
    'date.base': 'End date must be a valid date',
    'date.min': 'End date must be greater than or equal to start date',
    'date.max': 'End date must be within this month'
  }),
  bf: Joi.number(),
  lunch: Joi.number(),
  dinner: Joi.number(),
});

app.get("/signup", (req, res) => {
  var success = req.flash("success");
  var error = req.flash("error");
  res.render("student/signup", { success: success, error: error });
});

app.post("/signup", async (req, res) => {
  const { roll_no, name, email, password, Batch } = req.body;
  const hash = await bcrypt.hash(password, 12);
  //console.log(hash)
  let student = new Student({
    roll_no,
    StudentName: name,
    email,
    password: hash,
    Batch,
  });
  await student.setduesThisMonth();
  //console.log(student)
  student.save(function (err, doc) {
    if (err) {
      req.flash("error", "Already Taken Email/Username");
      res.redirect("/student/signup");
    } else {
      req.flash("success", "Signup was successfull, now you can login");
      req.session.student_id = student._id;
      req.session.role = "student";
      console.log(req.session.role);
      res.redirect("/student/login");
    }
  });
});

app.get("/login", (req, res) => {
  var success = req.flash("success");
  var error = req.flash("error");
  res.render("student/login", { success: success, error: error });
});

app.post(
  "/login",
  wrapAsync(async (req, res) => {
    //console.log(req.body)
    const { roll_no, password } = req.body;
    const student = await Student.findOne({ roll_no });
    console.log(student);
    if (student) {
      const validPassword = await bcrypt.compare(password, student.password);
      if (validPassword) {
        req.session.student_id = student._id;
        req.session.role = "student";
        console.log("here");
        req.flash("success", "Logged in successfully ");
        //req.flash("success","Logged in succesfully")
        res.redirect("/student/home");
      } else {
        req.flash("error", "password or username is not correct");
        res.redirect("/student/login");
      }
    } else {
      req.flash("error", "password or username is not correct");
      res.redirect("/student/login");
    }
  })
);

app.get("/home", requireLogin, (req, res) => {
  //console.log(req.session.student_id)
  //console.log(req.session.role)
  //console.log(student)
  var success = req.flash("success");
  var error = req.flash("error");
  res.render("student/home", { success: success, error: error });
});

app.post("/logout", requireLogin, (req, res) => {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        //req.flash('success', 'Logged out successfully ');
        //req.flash("success", "Logged out successfully ");
        return res.redirect("/student/login");
      }
    });
  }
});

app.get(
  "/profile",
  requireLogin,
  async (req, res) => {
    if (req.session.student_id) {
      const student = await Student.findById(req.session.student_id);
      console.log(student)
      if (student) {
        res.render("student/profile", { student });
      } else {
        res.send("no");
      }
    } else {
      req.flash("error", "please login first");
      res.redirect("/student/login");
    }
  }

  //res.render('student/profile',{student})
);

app.get("/dues", async (req, res) => {
  try {
    if (!req.session.student_id) {
      req.flash("error", "please login first");
      res.redirect("/student/login");
    }

    const student = await Student.findById(req.session.student_id);
    if (student) {
      var success = req.flash("success");
      var error = req.flash("error");
      console.log(student);
      res.render("student/dues", { student, success, error });
    } else {
      res.send("sorry");
    }
  } catch (err) {
    console.log(err);
  }

  // console.log(req.session.student_id)
});

app.get("/complaint", (req, res) => {
  if (!req.session.student_id) {
    req.flash("error", "Please Login First");
    res.redirect("/student/login");
  } else {
    var success = req.flash("success");
    var error = req.flash("error");
    res.render("student/complaint", { success, error });
  }
});

app.post("/complaint", async (req, res) => {
  //console.log(req.body)
  if (!req.session.student_id) {
    req.flash("error", "Please Login First");
    res.redirect("/student/login");
  }
  const newComplaint = new Complaint({
    name: req.body.name,
    email: req.body.email,
    complaint: req.body.complaint,
    Batch: req.body.Batch,
  });

  // Save the complaint to the database
  newComplaint.save((err) => {
    if (err) {
      console.error(err);

      //eturn res.send('Error submitting complaint');
    }
    req.flash("success", "Complaint Sent");
    res.redirect("/student/home");
  });
});

app.get("/messwaiver", requireLogin, (req, res) => {
  //console.log(req.session.student_id)
  if (req.session.student_id) {
    res.render("student/bookmeal");
  } else {
    req.flash("error", "please login first");
    res.redirect("/student/login");
  }
});

app.get(
  "/messmenu",
  requireLogin,
  wrapAsync(async (req, res) => {
    if (!req.session.student_id) {
      req.flash("error", "Please Login First");
    }

    const messmenu = await Messmenu.find({});
    console.log(messmenu);
    var success = req.flash("success");
    var error = req.flash("error");
    //res.render("student/signup", { success: success, error: error });
    res.render("student/messmenu", {
      messmenu,
      success: success,
      error: error,
    });
    //res.send('messmenu')
  })
);

app.post(
  "/messwaiver",
  requireLogin,
  wrapAsync(async (req, res) => {
    const id = req.session.student_id;
    if (!id) {
      req.flash("error", "Please login first");
      res.redirect("/student/login");
    }
    const { error, value } = messWaiverSchema.validate(req.body);
    if (error) {
      return res.status(400).send({
        error: error.message,
      });
    }
    const student = await Student.findById(id);
    if (student) {
      const { StudentName, roll_no, Batch } = student;
      const { startdate, enddate, bf, lunch, dinner } = req.body;
      const booking = new Booking({
        s_id: id,
        name: StudentName,
        roll_no,
        Batch,
        startdate,
        enddate,
        bf,
        lunch,
        dinner,
      });
      console.log(booking);
      await booking.save();
      const startDate = moment(startdate);
      const endDate = moment(enddate);
      let duration = endDate.diff(startDate, "days") + 1;
      const messBill = await calculateMessBill(
        student.no_of_bf,
        student.no_of_lunch,
        student.no_of_dinner,
        duration,
        booking,
        student
      );
      console.log(messBill);
      student.dues_this_month = messBill;
      console.log(student);
      student.save((err, doc) => {
        if (err) {
          console.log(err);
        } else {
          console.log("done");
        }
      });
      req.flash("success", "updated your booking");
      res.redirect("/student/home");
    }
  })
);

app.get("/message", async (req, res) => {
  if (!req.session.student_id) {
    req.flash("error", "You need to Login First");
    res.redirect("/student/login");
  }
  const student = await Student.findById(req.session.student_id);
  if (student) {
    const studentEmail = student.email;
    Complaint.find(
      { email: studentEmail, status: { $in: ["open", "closed"] } },
      (err, complaints) => {
        if (err) {
          //console.error(err);
          return res.send("Error retrieving complaints");
        }
        var success = req.flash("success");
        var error = req.flash("error");
        //console.log(complaints);
        res.render("student/complaintsstatus", { complaints, success, error });
        //res.render('student/home', { complaints,success,error });
      }
    );
  }
});

module.exports = app;
