// Temporary setup script for development authentication
// Run this in browser console to set up required session storage values

// Set school code (this determines which base URL to use)
sessionStorage.setItem('schoolCode', 'T36');

// Set authorization token (copy from working school-web-app)
sessionStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI1IiwiVXNlckNvZGUiOiJURU8wMDAwNSIsIk1vYmlsZU5vIjoiOTc3MTA0ODY4MCIsIkVtYWlsIjoibXNAZ21haWwuY29tIiwiZXhwIjoxNzQyNzI2NDAwLCJpc3MiOiJURU8tT3JnYW5pemF0aW9uIiwiYXVkIjoiVEVPLU9yZ2FuaXphdGlvbiJ9.s7e3BfxLn8fT9cUJF_lG4KXESkh3LQcLzOGFwxSvZ5M');

console.log('✅ Authentication setup complete!');
console.log('📋 Current session storage:');
console.log('  School Code:', sessionStorage.getItem('schoolCode'));
console.log('  Token:', sessionStorage.getItem('token'));
console.log('🔄 Please refresh the page to apply changes.');
