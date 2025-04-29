'use client';
import { useState } from 'react';
import { supabase } from '/src/app/lib/supabase' 

import styles from '../styles/RegisterPage.module.css';

const RegisterPage = () => {
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Insert profile info into a separate table like 'users' or 'profiles'
      const { error: dbError } = await supabase.from('registrations').insert([
        {
          FirstName,
          LastName,
          address,
          city,
          email,
          phone,
        },
      ]);

      if (dbError) throw dbError;

      alert('Registration successful! Please check your email to confirm.');
      // Reset form
      setFirstName('');
      setLastName('');
      setAddress('');
      setCity('');
      setEmail('');
      setPhone('');
      setPassword('');
    } catch (error) {
      setError(error.message);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registration Form</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="First Name" value={FirstName} onChange={(e) => setFirstName(e.target.value)} className={styles.input} />
        <input type="text" placeholder="Last Name" value={LastName} onChange={(e) => setLastName(e.target.value)} className={styles.input} />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className={styles.input} />
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className={styles.input} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className={styles.input} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} />
        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
};

export default RegisterPage;
