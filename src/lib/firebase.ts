import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4_J6ZhxB18di0gTu6uddmwuCexKb8Jog",
  authDomain: "baraa-restaurant.firebaseapp.com",
  projectId: "baraa-restaurant",
  storageBucket: "baraa-restaurant.firebasestorage.app",
  messagingSenderId: "697511761273",
  appId: "1:697511761273:web:aa5c39357082193947cba8"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface OrderData {
  items?: Array<{ name: string; quantity: number; price: string }>;
  name?: string;
  phone?: string;
  location?: string;
  deliveryMethod?: string;
  paymentMethod?: string;
  totalAmount?: string | number;
}

// Helper to recursive remove or convert undefined values to prevent Firestore errors
function sanitizeValue(val: any): any {
  if (val === undefined) return "";
  if (val === null) return null;
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  if (typeof val === 'object') {
    // Keep Firestore FieldValue (like serverTimestamp()) untouched
    if (val._methodName || val.constructor?.name === 'FieldValue' || typeof val.toMillis === 'function') {
      return val;
    }
    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(val)) {
      sanitized[key] = sanitizeValue(val[key]);
    }
    return sanitized;
  }
  return val;
}

/**
 * Function-kan markii la riixo badhanka "Order Now" ama "Submit" ayuu xogta u dirayaa Firebase (Collection "orders")
 */
export const handleOrderSubmit = async (formData: any, cartItems: any) => {
  try {
    // 1. Habaynta liiska cuntada si ay u noqoto text maamulka u fudud
    const formattedItems = (cartItems || []).map((item: any) => ({
      name: item.name || item.title || "Cunto",
      quantity: item.quantity || 1,
      price: typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : (item.price || "$0.00")
    }));

    // 2. Qodobbada xogta oo la simay (Flat & Clean Structure)
    const rawOrderData = {
      // Macluumaadka Macmiilka
      customerName: formData?.name || formData?.customerName || "Aan la sheegin",
      customerPhone: formData?.phone || formData?.customerPhone || "Aan la sheegin",
      customerLocation: formData?.location || formData?.customerLocation || "Aan la sheegin",
      
      // Faahfaahinta Dalabka
      deliveryMethod: formData?.deliveryMethod || "Delivery",
      paymentMethod: formData?.paymentMethod || "EVC Plus",
      totalAmount: typeof formData?.totalAmount === 'number' ? `$${formData.totalAmount.toFixed(2)}` : (formData?.totalAmount || "$0.00"),
      
      // Liiska Cuntada & Taariikhda
      items: formattedItems,
      orderStatus: "Cusub", // New / Pending
      createdAt: serverTimestamp()
    };

    const orderData = sanitizeValue(rawOrderData);

    // U dir collection-ka "orders"
    const docRef = await addDoc(collection(db, "orders"), orderData);
    
    console.log("Order ID in Firebase orders:", docRef.id);
    return true;

  } catch (error) {
    console.error("Cilad Firebase:", error);
    return false;
  }
};

/**
 * Function-kan wuxuu xogta dalabka cusub u dirayaa Firebase Firestore
 * @param {OrderData} orderData - Xogta dalabka ee ka soo muuqata foomka
 */
export const sendOrderToFirebase = async (orderData: OrderData) => {
  try {
    const rawNewOrder = {
      items: Array.isArray(orderData.items) && orderData.items.length > 0
        ? orderData.items.map((item: any) => ({
            name: item.name || item.title || "Cunto",
            quantity: item.quantity || 1,
            price: typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : (item.price || "$0.00")
          }))
        : [
            { name: "Coffee Latte Art", quantity: 2, price: "$3.00" },
            { name: "Casiirka Cambaha (Mango)", quantity: 2, price: "$5.00" }
          ],
      customer: {
        name: orderData.name || "Maanka",
        phone: orderData.phone || "610446604",
        location: orderData.location || "Hodan",
        deliveryMethod: orderData.deliveryMethod || "Waa lay keenayaa (Home Delivery)",
        paymentMethod: orderData.paymentMethod || "EVC Plus"
      },
      totalAmount: typeof orderData.totalAmount === 'number' ? `$${orderData.totalAmount.toFixed(2)}` : (orderData.totalAmount || "$8.00"),
      createdAt: serverTimestamp()
    };

    const newOrder = sanitizeValue(rawNewOrder);

    const docRef = await addDoc(collection(db, "orders"), newOrder);

    console.log("Dalabka waa la kaydiyay Firebase! ID-kiisu waa:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Cilad ayaa ka dhacday u dirida Firebase:", error);
    return { success: false, error: error?.message || String(error) };
  }
};
