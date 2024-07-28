import { NextFunction, Request, Response } from "express";
import WorkerUsecase from "../use-cases/workerUsecse";

class WorkerController {
  private _workerUseCase: WorkerUsecase;

  constructor(workerUsecase: WorkerUsecase) { 
    this._workerUseCase = workerUsecase;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, phoneNumber } = req.body;

      const verifyWorker = await this._workerUseCase.checkExist(
        email,
        phoneNumber
      );
    //   console.log("verifyWorker:", verifyWorker);

      if (verifyWorker.status === 200) {
        const worker = await this._workerUseCase.signup(
          name,
          email,
          password,
          phoneNumber
        );
        // console.log("worker:--", worker);

        return res
          .status(worker.status)
          .json({ message: worker.message,email:worker.email });
      }
      res.status(200).json(verifyWorker.message);
    } catch (error) {
      next(error);
    }
  }
}

export default WorkerController;
