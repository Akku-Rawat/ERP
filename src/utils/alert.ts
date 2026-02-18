import Swal from "sweetalert2";


const extractErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?._server_messages) {
    try {
      const serverMsgs = JSON.parse(
        error.response.data._server_messages
      );

      const parsed = JSON.parse(serverMsgs[0]);
      return parsed.message;
    } catch {
      return error.response.data._server_messages;
    }
  }

  if (error?.status === "error" && error?.message) {
    return error.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};


export const showApiError = (error: any) => {
  const rawMessage = extractErrorMessage(error);

  // Strip HTML tags (clean version)
  const cleanMessage = rawMessage.replace(/<[^>]+>/g, "");

  Swal.fire({
    icon: "error",
    title: "Operation Failed",
    text: cleanMessage,
    confirmButtonColor: "#ef4444",
  });
};

/*  Success  */
export const showSuccess = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonColor: "#22c55e",
  });
};

/*  Loading  */
export const showLoading = (title = "Processing...") => {
  Swal.fire({
    title,
    text: "Please wait while we complete your request.",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

/*  Close  */
export const closeSwal = () => {
  Swal.close();
};
