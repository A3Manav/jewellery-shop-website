/**
 * Test file to verify smart API scheduling functionality
 * This file tests the scheduling logic and caching behavior
 */

// Import the functions we want to test
import { shouldMakeAPICall, getAPIUsageToday, incrementAPIUsage, fetchLiveMetalRates } from './metalRatesAPI.js';

console.log('=== Metal Rates API Scheduling Test ===');

// Test 1: Check current scheduling status
console.log('\n1. Current scheduling status:');
const currentStatus = shouldMakeAPICall();
console.log('Can make API call:', currentStatus.canCall);
console.log('Reason:', currentStatus.reason);

// Test 2: Check current usage
console.log('\n2. Current API usage:');
const usage = getAPIUsageToday();
console.log('Today\'s API calls:', usage);

// Test 3: Test fetching rates
console.log('\n3. Testing fetchLiveMetalRates:');
fetchLiveMetalRates().then(result => {
    console.log('Result success:', result.success);
    console.log('Gold rate:', result.data.goldRate);
    console.log('Silver rate:', result.data.silverRate);
    console.log('Source:', result.data.source);
    console.log('Error:', result.error);
    console.log('Timestamp:', result.data.timestamp);
}).catch(error => {
    console.error('Test failed:', error);
});

// Test 4: Simulate different times
console.log('\n4. Time simulation tests:');
const now = new Date();
console.log('Current time:', now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0'));

// Check if current time is within scheduled windows
const currentHour = now.getHours();
const isMorningWindow = currentHour >= 8 && currentHour < 12;
const isEveningWindow = currentHour >= 15 && currentHour < 19;

console.log('Is morning window (8 AM - 12 PM):', isMorningWindow);
console.log('Is evening window (3 PM - 7 PM):', isEveningWindow);
console.log('Is scheduled time:', isMorningWindow || isEveningWindow);