import { notification } from "antd";

type ToastType = "success" | "error" | "info" | "warning";

export const toast = {
    success(message: string, description?: string) {
        notification.success({
            message,
            description,
            placement: "topRight",
        });
    },

    error(err: any, fallbackMessage = "Đã xảy ra lỗi") {
        let message = fallbackMessage;
        let description = "";


        if (err?.response?.data?.error?.message) {
            message = "Lỗi";
            description = err.response.data.error.message;
        }



        else if (err instanceof Error) {
            description = err.message;
        }

        else if (typeof err === "string") {
            description = err;
        }

        else {
            description = fallbackMessage;
        }
        console.log("err toast", description)

        notification.error({
            message,
            description,
            placement: "topRight",
        });
    }
};
