"use server";

interface FetchUserRequest {
  email: string;
}

export const fetchUser = async (request: FetchUserRequest) => {
  console.log(request, "request to fetch user", `${process.env.NEXT_PUBLIC_API_URL}/user/search/params?email=${request.email}`);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user?email=${request.email}`, {
      method: "GET",
    });
    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error, "error creating user");
    return {
      error: "Error fetching the user",
      status: 500,
    };
  }
};
