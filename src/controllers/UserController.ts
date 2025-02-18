import { Request, Response } from "express";

class UserController {
  constructor() {
    console.log("ExampleController created");
  }

  create = (req: Request, res: Response) => {};
}

export default UserController;
