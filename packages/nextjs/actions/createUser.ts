"use server";

interface CreateUserRequest {
  wallet_address: string;
  email: string;
}

export const createUser = async (request: CreateUserRequest) => {
  console.log(request, "request to create user");
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "POST",
    });
    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error, "error creating user");
    return {
      error: "Error creating the user",
      status: 500,
    };
  }
};
