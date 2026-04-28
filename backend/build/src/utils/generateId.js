"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueId = void 0;
const generateUniqueId = (prefix = 'que') => {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base-36
    const randomNum = Math.random().toString(36).substring(2, 10); // Generate a random string
    return `${prefix}${prefix ? '-' : ''}${timestamp}-${randomNum}`;
};
exports.generateUniqueId = generateUniqueId;
