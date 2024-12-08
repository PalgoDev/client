"use server";

interface CreateUserRequest {
  wallet_address: string;
  email: string;
  chainId: number;
}

export const createUser = async (request: CreateUserRequest) => {
  console.log(request, "request to create user");

  const chainId = request.chainId;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet_address: request.wallet_address,
        email: request.email,
        name: "chill guy",
        description: "chill guy",
        chainId,
      }),
    });
    console.log(response, "response from create user");
    const res = await response.json();
    console.log(res, "res from create user");
    return res;
  } catch (error) {
    console.error(error, "error creating user");
    return {
      error: "Error creating the user",
      status: 500,
    };
  }
};
