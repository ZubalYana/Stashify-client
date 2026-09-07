export const apiFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      method: options.method,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: options.body
    });

    if(!res.ok){
        if(res.status === 401){
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = '/auth';
            throw new Error('Unauthorized');
        }
        let message = "";
        try {
          const data = await res.json();
          message = data?.message ?? "";
        } catch {
          // ignore
        }
        throw new Error(message);
    }

    return(res);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
