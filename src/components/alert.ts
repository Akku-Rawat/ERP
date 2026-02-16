import Swal from "sweetalert2";

const extractErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;

  if (error?.response?.data?.message) {
    return error.response.data.message;
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
  Swal.fire({
    icon: "error",
    title: "Operation Failed",
    text: extractErrorMessage(error),
    confirmButtonColor: "#ef4444",
  });
};

export const showSuccess = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonColor: "#22c55e",
  });
};


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


export const closeSwal = () => {
  Swal.close();
};