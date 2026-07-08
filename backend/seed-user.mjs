// Quick seed script to create an admin user
const res = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@cybersec.com',
    password: 'Admin@123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'SUPER_ADMIN'
  })
});
const data = await res.json();
console.log('Status:', res.status);
console.log('Response:', JSON.stringify(data, null, 2));

if (res.status === 201) {
  // Now test login
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@cybersec.com', password: 'Admin@123' })
  });
  const loginData = await loginRes.json();
  console.log('\nLogin Status:', loginRes.status);
  console.log('Login Response:', JSON.stringify(loginData, null, 2));
}
