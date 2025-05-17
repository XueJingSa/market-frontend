import { ElMessage } from "element-plus";

export function callError(message) {
    return ElMessage({
        message: message,
        type: 'info',
    });
}

export function callSuccess(message) {
    return ElMessage({
        message: message,
        type: 'success',
    });
}

export function callInfo(message) {
    return ElMessage({
        message: message,
        type: 'info',
    });
}

export function callWarning(message) {
    return ElMessage({
        message: message,
        type: 'warning',
    });
}