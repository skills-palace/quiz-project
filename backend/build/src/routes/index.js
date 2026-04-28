"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes = (app) => {
    app.use("/api/quiz", require("./quiz.route"));
    app.use("/api/lesson", require("./lesson.route"));
    // app.use("/api/my_lesson_log", require("./lessonlog.route"));
    app.use("/api/learner", require("./learner.route"));
    app.use("/api/learn-group", require("./learn-group.route"));
    app.use("/api/skills", require("./skills.route"));
    app.use("/api/user", require("./user.route"));
    // // handle auth routung
    app.use("/api/file-manager", require("./file-manager.route"));
    app.use("/api/option", require("./option.route"));
    app.use("/api/app", require("./app.route"));
    app.use("/api/auth", require("./auth.route"));
};
exports.default = routes;
