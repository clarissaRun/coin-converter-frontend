export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type CreateUser = {
  password: string;
} & User;

export type UserLogin = {
  access_token: string;
};
