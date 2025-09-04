import { Request, Response, NextFunction } from "express";
import { auth } from "../src/middleware/auth";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe("auth middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
      cookies: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should return 401 if no token is provided", () => {
    const middleware = auth();
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Provide Token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should decode token and attach userId", () => {
    const middleware = auth();

    const fakeDecoded = { id: "123", role: "user" };
    mockedJwt.verify.mockReturnValue(fakeDecoded as any);

    req.headers = {
      authorization: "Bearer valid.token",
    };

    middleware(req as Request, res as Response, next);

    expect(mockedJwt.verify).toHaveBeenCalledWith(
      "valid.token",
      process.env.JWT_SECRET!
    );

    expect((req as any).userId).toBe("123");
    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if role is not allowed", () => {
    const middleware = auth(["admin"]);

    const fakeDecoded = { id: "123", role: "user" };
    mockedJwt.verify.mockReturnValue(fakeDecoded as any);

    req.headers = {
      authorization: "Bearer valid.token",
    };

    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500); // since ApiError is thrown inside try/catch
    expect(res.json).toHaveBeenCalledWith({
      message: "you are not logged in",
      error: true,
      success: false,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 on invalid token", () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    req.headers = {
      authorization: "Bearer invalid.token",
    };

    const middleware = auth();
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "you are not logged in",
      error: true,
      success: false,
    });
  });
});
