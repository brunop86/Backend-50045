import { Router } from "express";

const ViewsRouter = Router();

ViewsRouter.get("/", async (req, res) => {
  res.render("chat");
});

export default ViewsRouter;
