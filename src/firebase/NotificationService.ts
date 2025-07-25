
import { getToken, onMessage, MessagePayload } from "firebase/messaging";
import { messaging } from "./firebase-config";
import store from "../store/Store";
import { addMessage } from "../modules/global/slice/messageSlice";


export const requestPermission = async (): Promise<void> => {
    try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: "BO1bAfTf5isJXH1oxmwwNdDbri3ga4m4LaYhCoHLjdvXbwwioLyQlPZL9ekQNs4rfZAyqv6U7Fly9bQiHeZ37MM",
            });

            if (token) {
                localStorage.setItem("fcmToken", token);
            } else {
                console.warn("No registration token available. Request permission to generate one.");
            }
        } else {
            console.log("Notification permission denied");
        }
    } catch (err) {
        console.error("FCM error", err);
    }
};


export const listenForMessages = (): void => {
    onMessage(messaging, (payload: MessagePayload) => {
        store.dispatch(addMessage(payload));
    });
};


